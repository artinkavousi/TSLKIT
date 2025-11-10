import { z } from 'zod';

import { encodeComputePass, ComputeShader } from '../helpers/dispatch.js';
import { DoubleStorageBuffer } from '../helpers/storage.js';
import type { ComputeModuleMetadata, ComputeTask, ComputeTaskContext } from '../types.js';

const PARTICLE_INIT_SHADER = /* wgsl */ `
struct ParticleInitUniforms {
  spacing: f32;
  halfGrid: f32;
  initialSpeed: f32;
  padding: f32;
  gridWidth: u32;
  gridHeight: u32;
  gridDepth: u32;
  capacity: u32;
};

@group(0) @binding(0) var<storage, read_write> positionsRead : array<vec4<f32>>;
@group(0) @binding(1) var<storage, read_write> positionsWrite : array<vec4<f32>>;
@group(0) @binding(2) var<storage, read_write> velocitiesRead : array<vec4<f32>>;
@group(0) @binding(3) var<storage, read_write> velocitiesWrite : array<vec4<f32>>;
@group(0) @binding(4) var<uniform> uniforms : ParticleInitUniforms;

fn hash(value: u32) -> f32 {
  let x = f32(value) * 0.00000011920928955078125;
  return fract(sin(x * 43758.5453));
}

fn randomSphereDirection(index: u32) -> vec3<f32> {
  let u = hash(index * 3u + 0u) * 2.0 - 1.0;
  let theta = hash(index * 3u + 1u) * 6.28318530718;
  let s = sqrt(max(0.0, 1.0 - u * u));
  return vec3<f32>(s * cos(theta), u, s * sin(theta));
}

@compute @workgroup_size(64)
fn main(@builtin(global_invocation_id) global_id: vec3<u32>) {
  let index = global_id.x;
  if (index >= uniforms.capacity) {
    return;
  }

  let width = uniforms.gridWidth;
  let height = uniforms.gridHeight;
  let depth = uniforms.gridDepth;
  let plane = width * height;

  let z = index / plane;
  let remainder = index - z * plane;
  let y = remainder / width;
  let x = remainder - y * width;

  let offset = vec3<f32>(f32(width) - 1.0, f32(height) - 1.0, f32(depth) - 1.0) * 0.5;
  let gridPos = vec3<f32>(f32(x), f32(y), f32(z)) - offset;
  let position = vec4<f32>(gridPos * uniforms.spacing, 1.0);
  let velocity = vec4<f32>(randomSphereDirection(index) * uniforms.initialSpeed, 0.0);

  positionsRead[index] = position;
  positionsWrite[index] = position;
  velocitiesRead[index] = velocity;
  velocitiesWrite[index] = velocity;
}
`;

const PARTICLE_UPDATE_SHADER = /* wgsl */ `
struct ParticleSimUniforms {
  deltaTime: f32;
  gravity: f32;
  bounce: f32;
  damping: f32;
  floorHeight: f32;
  time: f32;
  emitterRadius: f32;
  initialSpeed: f32;
  capacity: u32;
  active: u32;
  padding0: u32;
  padding1: u32;
};

@group(0) @binding(0) var<storage, read> positionsRead : array<vec4<f32>>;
@group(0) @binding(1) var<storage, read_write> positionsWrite : array<vec4<f32>>;
@group(0) @binding(2) var<storage, read> velocitiesRead : array<vec4<f32>>;
@group(0) @binding(3) var<storage, read_write> velocitiesWrite : array<vec4<f32>>;
@group(0) @binding(4) var<uniform> uniforms : ParticleSimUniforms;

@compute @workgroup_size(64)
fn main(@builtin(global_invocation_id) global_id: vec3<u32>) {
  let index = global_id.x;
  if (index >= uniforms.capacity) {
    return;
  }

  var position = positionsRead[index];
  var velocity = velocitiesRead[index];

  velocity.y = velocity.y + uniforms.gravity * uniforms.deltaTime;
  position.xyz = position.xyz + velocity.xyz * uniforms.deltaTime;

  if (position.y < uniforms.floorHeight) {
    position.y = uniforms.floorHeight;
    velocity.y = -velocity.y * uniforms.bounce;
    velocity.x = velocity.x * uniforms.damping;
    velocity.z = velocity.z * uniforms.damping;
  }

  positionsWrite[index] = vec4<f32>(position.xyz, 1.0);
  velocitiesWrite[index] = vec4<f32>(velocity.xyz, 0.0);
}
`;

export const particleSystemSchema = z.object({
  capacity: z
    .number()
    .int()
    .min(1)
    .max(1_000_000)
    .default(65_536)
    .describe('Total number of particles simulated in the system.'),
  emitterRadius: z
    .number()
    .min(0.01)
    .max(64)
    .default(6)
    .describe('Radius of the spherical emitter used for initialization.'),
  initialSpeed: z
    .number()
    .min(0)
    .max(50)
    .default(8)
    .describe('Magnitude of the initial velocity vector for each particle.'),
  gravity: z
    .number()
    .min(-50)
    .max(50)
    .default(-9.81)
    .describe('Gravity acceleration applied every frame.'),
  bounce: z
    .number()
    .min(0)
    .max(1)
    .default(0.75)
    .describe('Elasticity when colliding with the ground plane.'),
  damping: z
    .number()
    .min(0)
    .max(1)
    .default(0.98)
    .describe('Tangential damping applied on floor collision.'),
  floorHeight: z
    .number()
    .min(-100)
    .max(100)
    .default(0)
    .describe('Vertical position of the ground plane for particle collisions.'),
  timeScale: z
    .number()
    .min(0.01)
    .max(4)
    .default(1)
    .describe('Multiplier applied to the simulation delta time.'),
});

export type ParticleSystemSpec = z.input<typeof particleSystemSchema>;
export type NormalizedParticleSystemSpec = z.output<typeof particleSystemSchema>;

export interface ParticleSystemInstance {
  readonly metadata: ComputeModuleMetadata;
  readonly spec: NormalizedParticleSystemSpec;
  readonly positions: DoubleStorageBuffer;
  readonly velocities: DoubleStorageBuffer;
  readonly initTask: ComputeTask;
  readonly updateTask: ComputeTask;
  dispose(): void;
}

const PARTICLE_METADATA: ComputeModuleMetadata = {
  id: 'tsl.compute.particles',
  label: 'Particle System',
  description:
    'General-purpose particle simulation featuring spherical emission, gravity, damping and ground-plane collisions.',
  tags: ['simulation', 'particles', 'gpu'],
  parameters: [
    {
      name: 'capacity',
      label: 'Particle Capacity',
      description: 'Number of particles updated per frame.',
      type: 'integer',
      min: 1,
      max: 1_000_000,
      step: 1,
      defaultValue: 65_536,
    },
    {
      name: 'emitterRadius',
      label: 'Emitter Radius',
      description: 'Radius of the spawn volume used during initialization.',
      type: 'number',
      min: 0.01,
      max: 64,
      step: 0.01,
      defaultValue: 6,
      unit: 'm',
    },
    {
      name: 'initialSpeed',
      label: 'Initial Speed',
      description: 'Magnitude of the initial particle velocity.',
      type: 'number',
      min: 0,
      max: 50,
      step: 0.01,
      defaultValue: 8,
      unit: 'm/s',
    },
    {
      name: 'gravity',
      label: 'Gravity',
      description: 'Downward acceleration applied to particles.',
      type: 'number',
      min: -50,
      max: 50,
      step: 0.01,
      defaultValue: -9.81,
      unit: 'm/s²',
    },
    {
      name: 'bounce',
      label: 'Bounce',
      description: 'Elasticity of floor collisions.',
      type: 'number',
      min: 0,
      max: 1,
      step: 0.01,
      defaultValue: 0.75,
    },
    {
      name: 'damping',
      label: 'Damping',
      description: 'Tangential damping applied on collision.',
      type: 'number',
      min: 0,
      max: 1,
      step: 0.01,
      defaultValue: 0.98,
    },
    {
      name: 'floorHeight',
      label: 'Floor Height',
      description: 'Y coordinate of the collision plane.',
      type: 'number',
      min: -100,
      max: 100,
      step: 0.01,
      defaultValue: 0,
      unit: 'm',
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
      name: 'positions',
      label: 'Particle Positions',
      description: 'XYZW buffer describing world-space particle positions.',
    },
    {
      name: 'velocities',
      label: 'Particle Velocities',
      description: 'XYZW buffer storing particle velocities for integration.',
    },
  ],
};

class ParticleSystem implements ParticleSystemInstance {
  readonly metadata = PARTICLE_METADATA;
  readonly positions: DoubleStorageBuffer;
  readonly velocities: DoubleStorageBuffer;
  readonly initTask: ComputeTask;
  readonly updateTask: ComputeTask;

  private readonly specInternal: NormalizedParticleSystemSpec;
  private readonly initShader: ComputeShader;
  private readonly updateShader: ComputeShader;
  private readonly initUniformBuffer: GPUBuffer;
  private readonly simUniformBuffer: GPUBuffer;
  private readonly initUniformArray: ArrayBuffer;
  private readonly initUniformView: DataView;
  private readonly simUniformArray: ArrayBuffer;
  private readonly simUniformView: DataView;
  private readonly workgroups: { x: number };
  private time = 0;

  constructor(private readonly device: GPUDevice, spec: NormalizedParticleSystemSpec) {
    this.specInternal = spec;

    this.positions = new DoubleStorageBuffer(device, {
      label: `${PARTICLE_METADATA.id}:positions`,
      channels: 4,
      width: spec.capacity,
    });

    this.velocities = new DoubleStorageBuffer(device, {
      label: `${PARTICLE_METADATA.id}:velocities`,
      channels: 4,
      width: spec.capacity,
    });

    this.initShader = new ComputeShader(device, {
      label: `${PARTICLE_METADATA.id}:init`,
      code: PARTICLE_INIT_SHADER,
    });

    this.updateShader = new ComputeShader(device, {
      label: `${PARTICLE_METADATA.id}:update`,
      code: PARTICLE_UPDATE_SHADER,
    });

    this.initUniformBuffer = device.createBuffer({
      label: `${PARTICLE_METADATA.id}:initUniforms`,
      size: 32,
      usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST,
    });

    this.simUniformBuffer = device.createBuffer({
      label: `${PARTICLE_METADATA.id}:simUniforms`,
      size: 64,
      usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST,
    });

    this.initUniformArray = new ArrayBuffer(32);
    this.initUniformView = new DataView(this.initUniformArray);
    this.simUniformArray = new ArrayBuffer(64);
    this.simUniformView = new DataView(this.simUniformArray);

    this.configureInitializationUniforms();

    this.workgroups = {
      x: Math.max(1, Math.ceil(spec.capacity / 64)),
    };

    this.initTask = this.createInitTask();
    this.updateTask = this.createUpdateTask();
  }

  get spec(): NormalizedParticleSystemSpec {
    return this.specInternal;
  }

  dispose(): void {
    this.positions.dispose();
    this.velocities.dispose();
    this.initUniformBuffer.destroy();
    this.simUniformBuffer.destroy();
  }

  private configureInitializationUniforms(): void {
    const { capacity, emitterRadius, initialSpeed } = this.specInternal;
    const gridWidth = Math.ceil(Math.cbrt(capacity));
    const gridHeight = gridWidth;
    const gridDepth = Math.ceil(capacity / (gridWidth * gridHeight));
    const spacing = emitterRadius / Math.max(1, gridWidth * 0.5);
    const halfGrid = gridWidth * 0.5;

    this.initUniformView.setFloat32(0, spacing, true);
    this.initUniformView.setFloat32(4, halfGrid, true);
    this.initUniformView.setFloat32(8, initialSpeed, true);
    this.initUniformView.setFloat32(12, 0, true);
    this.initUniformView.setUint32(16, gridWidth, true);
    this.initUniformView.setUint32(20, gridHeight, true);
    this.initUniformView.setUint32(24, gridDepth, true);
    this.initUniformView.setUint32(28, capacity, true);
  }

  private writeSimulationUniforms(context: ComputeTaskContext): void {
    const scaledDelta = context.deltaTime * this.specInternal.timeScale;
    this.time += scaledDelta;

    this.simUniformView.setFloat32(0, scaledDelta, true);
    this.simUniformView.setFloat32(4, this.specInternal.gravity, true);
    this.simUniformView.setFloat32(8, this.specInternal.bounce, true);
    this.simUniformView.setFloat32(12, this.specInternal.damping, true);
    this.simUniformView.setFloat32(16, this.specInternal.floorHeight, true);
    this.simUniformView.setFloat32(20, this.time, true);
    this.simUniformView.setFloat32(24, this.specInternal.emitterRadius, true);
    this.simUniformView.setFloat32(28, this.specInternal.initialSpeed, true);
    this.simUniformView.setUint32(32, this.specInternal.capacity, true);
    this.simUniformView.setUint32(36, this.specInternal.capacity, true);
    this.simUniformView.setUint32(40, 0, true);
    this.simUniformView.setUint32(44, 0, true);
  }

  private createInitTask(): ComputeTask {
    return {
      id: `${PARTICLE_METADATA.id}:init`,
      label: 'Initialize particle buffers',
      encode: (device, encoder) => {
        device.queue.writeBuffer(this.initUniformBuffer, 0, this.initUniformArray);
        encodeComputePass(
          encoder,
          this.initShader,
          [
            { buffer: this.positions.read },
            { buffer: this.positions.write },
            { buffer: this.velocities.read },
            { buffer: this.velocities.write },
            { buffer: this.initUniformBuffer },
          ],
          this.workgroups,
          `${PARTICLE_METADATA.id}:init`,
        );
      },
      afterSubmit: () => {
        this.time = 0;
      },
    };
  }

  private createUpdateTask(): ComputeTask {
    return {
      id: `${PARTICLE_METADATA.id}:update`,
      label: 'Integrate particle velocities and positions',
      encode: (device, encoder, context) => {
        this.writeSimulationUniforms(context);
        device.queue.writeBuffer(this.simUniformBuffer, 0, this.simUniformArray);
        encodeComputePass(
          encoder,
          this.updateShader,
          [
            { buffer: this.positions.read },
            { buffer: this.positions.write },
            { buffer: this.velocities.read },
            { buffer: this.velocities.write },
            { buffer: this.simUniformBuffer },
          ],
          this.workgroups,
          `${PARTICLE_METADATA.id}:update`,
        );
      },
      afterSubmit: () => {
        this.positions.swap();
        this.velocities.swap();
      },
    };
  }
}

export function createParticleSystemFactory() {
  return {
    metadata: PARTICLE_METADATA,
    schema: particleSystemSchema,
    create(device: GPUDevice, spec: ParticleSystemSpec = {}): ParticleSystemInstance {
      const normalized = particleSystemSchema.parse(spec);
      return new ParticleSystem(device, normalized);
    },
  };
}
