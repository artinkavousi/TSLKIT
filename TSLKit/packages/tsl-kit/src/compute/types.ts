export type ComputeParameterType = 'number' | 'vector3' | 'boolean' | 'integer';

export interface ComputeParameterMetadata {
  name: string;
  label: string;
  description: string;
  type: ComputeParameterType;
  min?: number;
  max?: number;
  step?: number;
  defaultValue: number | boolean | [number, number, number];
  unit?: string;
}

export interface ComputeBufferMetadata {
  name: string;
  label: string;
  description: string;
}

export interface ComputeModuleMetadata {
  id: string;
  label: string;
  description: string;
  tags: string[];
  parameters: ComputeParameterMetadata[];
  buffers: ComputeBufferMetadata[];
}

export interface ComputeTaskContext {
  readonly timestamp: number;
  readonly deltaTime: number;
  readonly frameIndex: number;
}

export interface ComputeTask {
  id: string;
  label: string;
  when?: (context: ComputeTaskContext) => boolean;
  encode: (device: GPUDevice, encoder: GPUCommandEncoder, context: ComputeTaskContext) => void;
  afterSubmit?: (context: ComputeTaskContext) => void;
}
