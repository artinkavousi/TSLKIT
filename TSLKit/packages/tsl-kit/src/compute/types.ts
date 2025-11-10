export type Vec3 = readonly [number, number, number];

export interface PingPongTarget<T> {
  readonly read: T;
  readonly write: T;
  swap(): void;
  map<U>(callback: (target: T, role: 'read' | 'write') => U): [U, U];
}

export type Extent3D = readonly [number, number, number?];

export interface GPUTextureViewLike {
  label?: string;
}

export interface GPUTextureDescriptorLike {
  label?: string;
  size: Extent3D;
  format: string;
  usage: number;
  mipLevelCount?: number;
  sampleCount?: number;
  dimension?: '1d' | '2d' | '3d';
  viewFormats?: readonly string[];
}

export interface GPUTextureViewDescriptorLike {
  label?: string;
  format?: string;
  dimension?: '1d' | '2d' | '2d-array' | 'cube' | 'cube-array' | '3d';
  aspect?: 'all' | 'stencil-only' | 'depth-only';
  baseMipLevel?: number;
  mipLevelCount?: number;
  baseArrayLayer?: number;
  arrayLayerCount?: number;
}

export interface GPUTextureLike {
  label?: string;
  createView(descriptor?: GPUTextureViewDescriptorLike): GPUTextureViewLike;
  destroy?: () => void;
}

export interface GPUBufferDescriptorLike {
  label?: string;
  size: number;
  usage?: number;
  mappedAtCreation?: boolean;
}

export interface GPUBufferLike {
  label?: string;
  size: number;
  destroy?: () => void;
}

export interface GPUQueueLike {
  writeBuffer(buffer: GPUBufferLike, bufferOffset: number, data: BufferSource, dataOffset?: number, size?: number): void;
  submit(commandBuffers: Iterable<GPUCommandBufferLike>): void;
}

export interface GPUCommandBufferLike {
  label?: string;
}

export interface GPUCommandEncoderDescriptorLike {
  label?: string;
}

export interface GPUComputePassDescriptorLike {
  label?: string;
}

export interface GPUCommandEncoderLike {
  beginComputePass(descriptor?: GPUComputePassDescriptorLike): GPUComputePassEncoderLike;
  finish(descriptor?: GPUCommandEncoderDescriptorLike): GPUCommandBufferLike;
}

export interface GPUComputePassEncoderLike {
  setPipeline(pipeline: GPUComputePipelineLike): void;
  setBindGroup(index: number, bindGroup: GPUBindGroupLike): void;
  dispatchWorkgroups(x: number, y?: number, z?: number): void;
  end(): void;
}

export interface GPUBindGroupLike {
  label?: string;
}

export interface GPUComputePipelineLike {
  label?: string;
}

export interface GPUDeviceLike {
  createTexture(descriptor: GPUTextureDescriptorLike): GPUTextureLike;
  createBuffer(descriptor: GPUBufferDescriptorLike): GPUBufferLike;
  createCommandEncoder(descriptor?: GPUCommandEncoderDescriptorLike): GPUCommandEncoderLike;
  queue: GPUQueueLike;
}

export interface ComputeBufferSchema {
  /** Human readable label for the buffer binding. */
  name: string;
  /** Bind group index the buffer is expected to be bound to. */
  group: number;
  /** Binding slot within the bind group. */
  binding: number;
  /** GPU shader visibility flags. */
  visibility: number;
  /** Buffer usage category expected by the shader. */
  type: 'storage' | 'read-only-storage' | 'uniform';
  /** Component description, e.g. `vec3<f32>`. */
  format: string;
  /** Narrative description of how the buffer is consumed. */
  description: string;
}

export interface KernelDispatch<State, Context = void> {
  label: string;
  workgroupSize: [number, number, number];
  workgroupCount: [number, number, number];
  cpu: (state: State, context: Context) => void;
}

export interface KernelDefinition<State, Spec, Dispatches> {
  label: string;
  schema: readonly ComputeBufferSchema[];
  state: State;
  spec: Spec;
  dispatches: Dispatches;
}

export type RequiredSpec<T> = {
  [K in keyof T]-?: T[K];
};

export const GPU_SHADER_STAGE_COMPUTE = globalThis.GPUShaderStage?.COMPUTE ?? 0x4;

