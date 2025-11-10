import type { ComputeTask, ComputeTaskContext } from '@tslstudio/tsl-kit/compute';

export interface PostChainLike {
  evaluate: (timestamp: number, context: ComputeTaskContext) => void;
}

export interface ComputeRunnerOptions {
  postChain?: PostChainLike;
  onDispatch?: (tasks: ComputeTask[], context: ComputeTaskContext) => void;
}

function createContext(
  timestampMs: number,
  lastTimestampMs: number | null,
  frameIndex: number,
): ComputeTaskContext {
  const deltaSeconds =
    lastTimestampMs === null ? 0 : Math.max(0, (timestampMs - lastTimestampMs) / 1000);

  return {
    timestamp: timestampMs,
    deltaTime: deltaSeconds,
    frameIndex,
  };
}

export class ComputeRunner {
  private tasks: ComputeTask[] = [];
  private lastTimestamp: number | null = null;
  private frameIndex = 0;

  constructor(
    private readonly device: GPUDevice,
    private readonly renderCallback: () => void,
    private readonly options: ComputeRunnerOptions = {},
  ) {}

  register(task: ComputeTask): void {
    this.tasks.push(task);
  }

  unregister(taskId: string): void {
    this.tasks = this.tasks.filter((task) => task.id !== taskId);
  }

  clear(): void {
    this.tasks = [];
  }

  async initialize(tasks: Iterable<ComputeTask>, timestampMs = 0): Promise<void> {
    const context = createContext(timestampMs, null, this.frameIndex);
    this.runTasks(Array.from(tasks), context);
  }

  async frame(timestampMs: number, transientTasks: Iterable<ComputeTask> = []): Promise<void> {
    const context = createContext(timestampMs, this.lastTimestamp, this.frameIndex);
    this.lastTimestamp = timestampMs;
    this.frameIndex += 1;

    const combined: ComputeTask[] = [...transientTasks, ...this.tasks];
    this.runTasks(combined, context);

    this.renderCallback();
    this.options.postChain?.evaluate(timestampMs, context);
  }

  private runTasks(tasks: Iterable<ComputeTask>, context: ComputeTaskContext): boolean {
    let encoder: GPUCommandEncoder | null = null;
    const executed: ComputeTask[] = [];

    for (const task of tasks) {
      if (task.when && !task.when(context)) {
        continue;
      }

      if (!encoder) {
        encoder = this.device.createCommandEncoder({
          label: `ComputeRunner::frame${context.frameIndex}`,
        });
      }

      task.encode(this.device, encoder, context);
      executed.push(task);
    }

    if (!encoder || executed.length === 0) {
      return false;
    }

    const commandBuffer = encoder.finish();
    this.device.queue.submit([commandBuffer]);

    for (const task of executed) {
      task.afterSubmit?.(context);
    }

    this.options.onDispatch?.(executed, context);
    return true;
  }
}
