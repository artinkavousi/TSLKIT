import { z } from 'zod';

import { encodeComputePass, ComputeShader } from '../helpers/dispatch.js';
import { DoubleStorageBuffer } from '../helpers/storage.js';
import type { ComputeModuleMetadata, ComputeTask, ComputeTaskContext } from '../types.js';

const FLUID_INIT_SHADER = /* wgsl */ `
struct FluidInitUniforms {
  totalCells: u32;
  padding0: u32;
  padding1: u32;
  padding2: u32;
};

@group(0) @binding(0) var<storage, read_write> velocityRead : array<vec4<f32>>;
@group(0) @binding(1) var<storage, read_write> velocityWrite : array<vec4<f32>>;
@group(0) @binding(2) var<storage, read_write> densityRead : array<vec4<f32>>;
@group(0) @binding(3) var<storage, read_write> densityWrite : array<vec4<f32>>;
@group(0) @binding(4) var<uniform> uniforms : FluidInitUniforms;

@compute @workgroup_size(128)
fn main(@builtin(global_invocation_id) global_id: vec3<u32>) {
  let index = global_id.x;
  if (index >= uniforms.totalCells) {
    return;
  }

  velocityRead[index] = vec4<f32>(0.0, 0.0, 0.0, 0.0);
  velocityWrite[index] = vec4<f32>(0.0, 0.0, 0.0, 0.0);
  densityRead[index] = vec4<f32>(0.0, 0.0, 0.0, 1.0);
  densityWrite[index] = vec4<f32>(0.0, 0.0, 0.0, 1.0);
}
`;

const FLUID_UPDATE_SHADER = /* wgsl */ `
struct FluidUniforms {
  deltaTime: f32;
  dissipation: f32;
  viscosity: f32;
  time: f32;
  gridWidth: u32;
  gridHeight: u32;
  padding0: u32;
  padding1: u32;
};

@group(0) @binding(0) var<storage, read> velocityRead : array<vec4<f32>>;
@group(0) @binding(1) var<storage, read_write> velocityWrite : array<vec4<f32>>;
@group(0) @binding(2) var<storage, read> densityRead : array<vec4<f32>>;
@group(0) @binding(3) var<storage, read_write> densityWrite : array<vec4<f32>>;
@group(0) @binding(4) var<uniform> uniforms : FluidUniforms;

fn clamp01(value: f32) -> f32 {
  return clamp(value, 0.0, 1.0);
}

@compute @workgroup_size(8, 8)
fn main(@builtin(global_invocation_id) global_id: vec3<u32>) {
  let width = uniforms.gridWidth;
  let height = uniforms.gridHeight;
  let x = global_id.x;
  let y = global_id.y;

  if (x >= width || y >= height) {
    return;
  }

  let index = y * width + x;
  let currentVelocity = velocityRead[index].xyz;
  var velocitySum = currentVelocity;
  var densitySum = densityRead[index].x;
  var weight = 1.0;
  var densityWeight = 1.0;

  if (x > 0u) {
    velocitySum += velocityRead[index - 1u].xyz;
    densitySum += densityRead[index - 1u].x;
    weight += 1.0;
    densityWeight += 1.0;
  }
  if (x + 1u < width) {
    velocitySum += velocityRead[index + 1u].xyz;
    densitySum += densityRead[index + 1u].x;
    weight += 1.0;
    densityWeight += 1.0;
  }
  if (y > 0u) {
    let offset = width;
    velocitySum += velocityRead[index - offset].xyz;
    densitySum += densityRead[index - offset].x;
    weight += 1.0;
    densityWeight += 1.0;
  }
  if (y + 1u < height) {
    let offset = width;
    velocitySum += velocityRead[index + offset].xyz;
    densitySum += densityRead[index + offset].x;
    weight += 1.0;
    densityWeight += 1.0;
  }

  let viscosityFactor = clamp01(uniforms.viscosity * uniforms.deltaTime);
  let dissipationFactor = clamp01(uniforms.dissipation * uniforms.deltaTime);

  let averagedVelocity = velocitySum / weight;
  let smoothedVelocity = currentVelocity * (1.0 - viscosityFactor) + averagedVelocity * viscosityFactor;

  let averagedDensity = densitySum / densityWeight;
  let baseDensity = densityRead[index].x;
  let smoothedDensity = baseDensity * (1.0 - dissipationFactor) + averagedDensity * dissipationFactor;

  velocityWrite[index] = vec4<f32>(smoothedVelocity, 0.0);
  densityWrite[index] = vec4<f32>(smoothedDensity, 0.0, 0.0, 1.0);
}
`;

export const fluidSimulationSchema = z.object({
  resolution: z
    .tuple([
      z.number().int().min(4).max(512),
      z.number().int().min(4).max(512),
    ])
    .default([128, 128])
    .describe('Simulation grid resolution (width, height).'),
  dissipation: z
    .number()
    .min(0)
    .max(4)
    .default(0.05)
    .describe('Rate at which density diffuses across the grid.'),
  viscosity: z
    .number()
    .min(0)
    .max(4)
    .default(0.15)
    .describe('Velocity smoothing factor that damps turbulent flow.'),
  timeScale: z
    .number()
    .min(0.01)
    .max(4)
    .default(1)
    .describe('Multiplier applied to the simulation delta time.'),
});

export type FluidSimulationSpec = z.input<typeof fluidSimulationSchema>;
export type NormalizedFluidSimulationSpec = z.output<typeof fluidSimulationSchema>;

export interface FluidSimulationInstance {
  readonly metadata: ComputeModuleMetadata;
  readonly spec: NormalizedFluidSimulationSpec;
  readonly velocity: DoubleStorageBuffer;
  readonly density: DoubleStorageBuffer;
  readonly initTask: ComputeTask;
  readonly updateTask: ComputeTask;
  dispose(): void;
}

const FLUID_METADATA: ComputeModuleMetadata = {
  id: 'tsl.compute.fluid',
  label: 'Fluid Simulation',
  description:
    'Lightweight 2D fluid grid performing viscosity and density diffusion suitable for post-processing or velocity fields.',
  tags: ['simulation', 'fluid', 'gpu'],
  parameters: [
    {
      name: 'resolution',
      label: 'Grid Resolution',
      description: 'Dimensions of the underlying simulation grid.',
      type: 'vector3',
      min: 4,
      max: 512,
      step: 1,
      defaultValue: [128, 128, 0],
    },
    {
      name: 'dissipation',
      label: 'Dissipation',
      description: 'Controls how quickly density dissipates.',
      type: 'number',
      min: 0,
      max: 4,
      step: 0.01,
      defaultValue: 0.05,
    },
    {
      name: 'viscosity',
      label: 'Viscosity',
      description: 'Controls how quickly velocity smooths over time.',
      type: 'number',
      min: 0,
      max: 4,
      step: 0.01,
      defaultValue: 0.15,
    },
    {
      name: 'timeScale',
      label: 'Time Scale',
      description: 'Multiplier applied to the simulation delta time.',
      type: 'number',
      min: 0.01,
      max: 4,
      step: 0.01,
      defaultValue: 1,
    },
  ],
  buffers: [
    {
      name: 'velocity',
      label: 'Velocity Field',
      description: 'XY velocity stored in a double-buffered texture.',
    },
    {
      name: 'density',
      label: 'Density Field',
      description: 'Scalar density buffer useful for smoke rendering.',
    },
  ],
};

class FluidSimulation implements FluidSimulationInstance {
  readonly metadata = FLUID_METADATA;
  readonly velocity: DoubleStorageBuffer;
  readonly density: DoubleStorageBuffer;
  readonly initTask: ComputeTask;
  readonly updateTask: ComputeTask;

  private readonly specInternal: NormalizedFluidSimulationSpec;
  private readonly initShader: ComputeShader;
  private readonly updateShader: ComputeShader;
  private readonly initUniformBuffer: GPUBuffer;
  private readonly simUniformBuffer: GPUBuffer;
  private readonly initUniformArray: ArrayBuffer;
  private readonly initUniformView: DataView;
  private readonly simUniformArray: ArrayBuffer;
  private readonly simUniformView: DataView;
  private readonly workgroups2d: { x: number; y: number };
  private readonly initWorkgroups: { x: number };
  private time = 0;

  constructor(private readonly device: GPUDevice, spec: NormalizedFluidSimulationSpec) {
    this.specInternal = spec;

    const [width, height] = spec.resolution;
    const totalCells = width * height;

    this.velocity = new DoubleStorageBuffer(device, {
      label: `${FLUID_METADATA.id}:velocity`,
      channels: 4,
      width: totalCells,
    });

    this.density = new DoubleStorageBuffer(device, {
      label: `${FLUID_METADATA.id}:density`,
      channels: 4,
      width: totalCells,
    });

    this.initShader = new ComputeShader(device, {
      label: `${FLUID_METADATA.id}:init`,
      code: FLUID_INIT_SHADER,
    });

    this.updateShader = new ComputeShader(device, {
      label: `${FLUID_METADATA.id}:update`,
      code: FLUID_UPDATE_SHADER,
    });

    this.initUniformBuffer = device.createBuffer({
      label: `${FLUID_METADATA.id}:initUniforms`,
      size: 16,
      usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST,
    });

    this.simUniformBuffer = device.createBuffer({
      label: `${FLUID_METADATA.id}:simUniforms`,
      size: 32,
      usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST,
    });

    this.initUniformArray = new ArrayBuffer(16);
    this.initUniformView = new DataView(this.initUniformArray);
    this.simUniformArray = new ArrayBuffer(32);
    this.simUniformView = new DataView(this.simUniformArray);

    this.initUniformView.setUint32(0, totalCells, true);
    this.initUniformView.setUint32(4, 0, true);
    this.initUniformView.setUint32(8, 0, true);
    this.initUniformView.setUint32(12, 0, true);

    this.workgroups2d = {
      x: Math.max(1, Math.ceil(width / 8)),
      y: Math.max(1, Math.ceil(height / 8)),
    };

    this.initWorkgroups = {
      x: Math.max(1, Math.ceil(totalCells / 128)),
    };

    this.initTask = this.createInitTask();
    this.updateTask = this.createUpdateTask();
  }

  get spec(): NormalizedFluidSimulationSpec {
    return this.specInternal;
  }

  dispose(): void {
    this.velocity.dispose();
    this.density.dispose();
    this.initUniformBuffer.destroy();
    this.simUniformBuffer.destroy();
  }

  private writeSimulationUniforms(context: ComputeTaskContext): void {
    const scaledDelta = context.deltaTime * this.specInternal.timeScale;
    this.time += scaledDelta;

    const [width, height] = this.specInternal.resolution;

    this.simUniformView.setFloat32(0, scaledDelta, true);
    this.simUniformView.setFloat32(4, this.specInternal.dissipation, true);
    this.simUniformView.setFloat32(8, this.specInternal.viscosity, true);
    this.simUniformView.setFloat32(12, this.time, true);
    this.simUniformView.setUint32(16, width, true);
    this.simUniformView.setUint32(20, height, true);
    this.simUniformView.setUint32(24, 0, true);
    this.simUniformView.setUint32(28, 0, true);
  }

  private createInitTask(): ComputeTask {
    return {
      id: `${FLUID_METADATA.id}:init`,
      label: 'Initialize fluid buffers',
      encode: (device, encoder) => {
        device.queue.writeBuffer(this.initUniformBuffer, 0, this.initUniformArray);
        encodeComputePass(
          encoder,
          this.initShader,
          [
            { buffer: this.velocity.read },
            { buffer: this.velocity.write },
            { buffer: this.density.read },
            { buffer: this.density.write },
            { buffer: this.initUniformBuffer },
          ],
          this.initWorkgroups,
          `${FLUID_METADATA.id}:init`,
        );
      },
      afterSubmit: () => {
        this.time = 0;
      },
    };
  }

  private createUpdateTask(): ComputeTask {
    return {
      id: `${FLUID_METADATA.id}:update`,
      label: 'Diffuse velocity and density fields',
      encode: (device, encoder, context) => {
        this.writeSimulationUniforms(context);
        device.queue.writeBuffer(this.simUniformBuffer, 0, this.simUniformArray);
        encodeComputePass(
          encoder,
          this.updateShader,
          [
            { buffer: this.velocity.read },
            { buffer: this.velocity.write },
            { buffer: this.density.read },
            { buffer: this.density.write },
            { buffer: this.simUniformBuffer },
          ],
          this.workgroups2d,
          `${FLUID_METADATA.id}:update`,
        );
      },
      afterSubmit: () => {
        this.velocity.swap();
        this.density.swap();
      },
    };
  }
}

export function createFluidSimulationFactory() {
  return {
    metadata: FLUID_METADATA,
    schema: fluidSimulationSchema,
    create(device: GPUDevice, spec: FluidSimulationSpec = {}): FluidSimulationInstance {
      const normalized = fluidSimulationSchema.parse(spec);
      return new FluidSimulation(device, normalized);
    },
  };
}
