export type ShaderStage = 'vertex' | 'fragment' | 'compute';

export type BindingType = 'storage' | 'uniform' | 'sampler' | 'texture';

export interface BindingLayout {
  binding: number;
  visibility: ShaderStage[];
  type: BindingType;
  name: string;
}

export interface ComputeKernelConfig {
  label: string;
  workgroupSize: [number, number, number];
  dispatchSize: [number, number, number];
  code: string;
  bindings: BindingLayout[];
  constants?: Record<string, number>;
}

export interface ComputePipelineSpec {
  kernels: ComputeKernelConfig[];
  persistentBuffers: string[];
  transientBuffers?: string[];
}

export interface SimulationTimeline {
  stepsPerFrame: number;
  fixedTimeStep: number;
  damping?: number;
}

export interface ComputePreset {
  id: string;
  label: string;
  description: string;
  pipeline: ComputePipelineSpec;
  timeline: SimulationTimeline;
}
