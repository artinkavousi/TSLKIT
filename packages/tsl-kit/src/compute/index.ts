export interface ComputePass {
  readonly name: string;
  readonly workgroupCount: [number, number, number];
}

export interface ComputeSimulationHandle {
  readonly id: string;
  readonly passes: readonly ComputePass[];
  readonly update: (deltaTime: number) => void;
  readonly dispose: () => void;
}

export interface ComputeSimulationOptions {
  readonly name: string;
  readonly passes: readonly ComputePass[];
}

export function createComputeSimulation(options: ComputeSimulationOptions): ComputeSimulationHandle {
  const { name, passes } = options;
  return {
    id: `compute:${name}`,
    passes,
    update: () => {
      /* simulation tick placeholder */
    },
    dispose: () => {
      /* release GPU resources placeholder */
    }
  };
}
