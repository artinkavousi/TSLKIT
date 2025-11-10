export interface WorkgroupSizes {
  x: number;
  y?: number;
  z?: number;
}

export type BindGroupResource = GPUBindingResource | GPUBufferBinding;

export interface ComputeShaderDescriptor {
  label: string;
  code: string;
  entryPoint?: string;
}

export class ComputeShader {
  readonly pipeline: GPUComputePipeline;
  private readonly label: string;
  private readonly device: GPUDevice;
  private readonly entryPoint: string;

  constructor(device: GPUDevice, descriptor: ComputeShaderDescriptor) {
    this.device = device;
    this.label = descriptor.label;
    this.entryPoint = descriptor.entryPoint ?? 'main';
    this.pipeline = device.createComputePipeline({
      label: this.label,
      layout: 'auto',
      compute: {
        module: device.createShaderModule({
          label: this.label,
          code: descriptor.code,
        }),
        entryPoint: this.entryPoint,
      },
    });
  }

  dispatch(pass: GPUComputePassEncoder, resources: BindGroupResource[], workgroups: WorkgroupSizes): void {
    pass.setPipeline(this.pipeline);
    const layout = this.pipeline.getBindGroupLayout(0);
    const bindGroup = this.device.createBindGroup({
      label: `${this.label}:bindGroup`,
      layout,
      entries: resources.map((resource, index) => ({
        binding: index,
        resource,
      })),
    });
    pass.setBindGroup(0, bindGroup);
    pass.dispatchWorkgroups(workgroups.x, workgroups.y ?? 1, workgroups.z ?? 1);
  }
}

export function encodeComputePass(
  encoder: GPUCommandEncoder,
  shader: ComputeShader,
  resources: BindGroupResource[],
  workgroups: WorkgroupSizes,
  label?: string,
): void {
  const pass = encoder.beginComputePass({ label });
  shader.dispatch(pass, resources, workgroups);
  pass.end();
}
