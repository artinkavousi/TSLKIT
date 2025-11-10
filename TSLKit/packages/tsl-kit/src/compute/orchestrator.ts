import {
  GPUBindGroupLike,
  GPUCommandBufferLike,
  GPUComputePipelineLike,
  GPUComputePassDescriptorLike,
  GPUCommandEncoderDescriptorLike,
  GPUDeviceLike,
} from './types.js';

export interface ComputeDispatchBindGroup {
  index: number;
  group: GPUBindGroupLike;
}

export interface ComputeDispatchStep {
  label: string;
  pipeline: GPUComputePipelineLike;
  workgroupCount: [number, number, number];
  bindGroups?: ComputeDispatchBindGroup[];
  beforeDispatch?: () => void;
  afterDispatch?: () => void;
  pass?: GPUComputePassDescriptorLike;
}

export interface ComputeOrchestratorOptions {
  encoderDescriptor?: GPUCommandEncoderDescriptorLike;
}

export class ComputeOrchestrator {
  constructor(private readonly device: GPUDeviceLike, private readonly options: ComputeOrchestratorOptions = {}) {}

  encode(steps: ComputeDispatchStep[]): GPUCommandBufferLike {
    const encoder = this.device.createCommandEncoder(this.options.encoderDescriptor);

    for (const step of steps) {
      const pass = encoder.beginComputePass(step.pass ?? { label: step.label });

      step.beforeDispatch?.();

      pass.setPipeline(step.pipeline);

      for (const bind of step.bindGroups ?? []) {
        pass.setBindGroup(bind.index, bind.group);
      }

      const [x, y, z] = step.workgroupCount;
      pass.dispatchWorkgroups(x, y, z);

      step.afterDispatch?.();

      pass.end();
    }

    return encoder.finish();
  }

  submit(steps: ComputeDispatchStep[]): GPUCommandBufferLike {
    const commandBuffer = this.encode(steps);
    this.device.queue.submit([commandBuffer]);
    return commandBuffer;
  }
}

