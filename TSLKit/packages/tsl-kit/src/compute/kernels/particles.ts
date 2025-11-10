import {
  ComputeBufferSchema,
  GPU_SHADER_STAGE_COMPUTE,
  KernelDefinition,
  KernelDispatch,
  RequiredSpec,
  Vec3,
} from '../types.js';

function hash1d(value: number): number {
  const s = Math.sin(value * 12.9898) * 43758.5453123;
  return s - Math.floor(s);
}

function normalizeSpec(spec: Partial<ParticleKernelSpec>): RequiredSpec<ParticleKernelSpec> {
  const merged: RequiredSpec<ParticleKernelSpec> = {
    particleCount: Math.max(1, Math.floor(spec.particleCount ?? 262_144)),
    separation: spec.separation ?? 0.2,
    gravity: spec.gravity ?? -0.00098,
    bounce: spec.bounce ?? 0.8,
    friction: spec.friction ?? 0.99,
    floorY: spec.floorY ?? 0,
    floorDrag: spec.floorDrag ?? 0.9,
    size: spec.size ?? 0.12,
    workgroupSize: spec.workgroupSize ?? 256,
    hitRadius: spec.hitRadius ?? 3,
    hitStrength: spec.hitStrength ?? 0.01,
    hitJitter: spec.hitJitter ?? 1.5,
    seed: spec.seed ?? 1337,
  };

  merged.workgroupSize = Math.max(1, Math.floor(merged.workgroupSize));
  merged.particleCount = Math.max(1, Math.floor(merged.particleCount));

  return merged;
}

export interface ParticleKernelSpec {
  particleCount?: number;
  separation?: number;
  gravity?: number;
  bounce?: number;
  friction?: number;
  floorY?: number;
  floorDrag?: number;
  size?: number;
  workgroupSize?: number;
  hitRadius?: number;
  hitStrength?: number;
  hitJitter?: number;
  seed?: number;
}

export interface ParticleKernelState {
  positions: Float32Array;
  velocities: Float32Array;
  colors: Float32Array;
  randomFactors: Float32Array;
}

export interface ParticleUpdateContext {
  deltaSeconds?: number;
  acceleration?: Vec3;
}

export interface ParticleHitContext {
  origin: Vec3;
  radius?: number;
  strength?: number;
  jitter?: number;
}

export const particleBufferSchema: readonly ComputeBufferSchema[] = [
  {
    name: 'particlePositions',
    group: 0,
    binding: 0,
    visibility: GPU_SHADER_STAGE_COMPUTE,
    type: 'storage',
    format: 'array<vec3<f32>>',
    description: 'Read/write storage buffer containing particle positions in world space.',
  },
  {
    name: 'particleVelocities',
    group: 0,
    binding: 1,
    visibility: GPU_SHADER_STAGE_COMPUTE,
    type: 'storage',
    format: 'array<vec3<f32>>',
    description: 'Read/write storage buffer that stores per-particle velocity vectors.',
  },
  {
    name: 'particleColors',
    group: 0,
    binding: 2,
    visibility: GPU_SHADER_STAGE_COMPUTE,
    type: 'storage',
    format: 'array<vec3<f32>>',
    description: 'Optional color buffer consumed by render shaders for tinting sprites.',
  },
] as const;

export interface ParticleKernelDispatches {
  init: KernelDispatch<ParticleKernelState>;
  update: KernelDispatch<ParticleKernelState, ParticleUpdateContext | undefined>;
  hit: KernelDispatch<ParticleKernelState, ParticleHitContext>;
}

export type ParticleKernel = KernelDefinition<ParticleKernelState, Readonly<RequiredSpec<ParticleKernelSpec>>, ParticleKernelDispatches>;

function createParticleKernelState(spec: RequiredSpec<ParticleKernelSpec>): ParticleKernelState {
  const { particleCount, seed } = spec;
  const positions = new Float32Array(particleCount * 3);
  const velocities = new Float32Array(particleCount * 3);
  const colors = new Float32Array(particleCount * 3);
  const randomFactors = new Float32Array(particleCount);

  for (let i = 0; i < particleCount; i++) {
    randomFactors[i] = hash1d(i + seed * 0.61803398875);
  }

  return { positions, velocities, colors, randomFactors };
}

function createParticleInitDispatch(spec: RequiredSpec<ParticleKernelSpec>): KernelDispatch<ParticleKernelState> {
  const workgroupSize = spec.workgroupSize;
  const workgroupCount = Math.ceil(spec.particleCount / workgroupSize);
  const grid = Math.ceil(Math.sqrt(spec.particleCount));
  const halfGrid = grid / 2;

  return {
    label: 'particle-init',
    workgroupSize: [workgroupSize, 1, 1],
    workgroupCount: [workgroupCount, 1, 1],
    cpu: state => {
      const { positions, velocities, colors, randomFactors } = state;
      const { separation, particleCount, floorY, seed } = spec;

      for (let i = 0; i < particleCount; i++) {
        const xIndex = i % grid;
        const zIndex = Math.floor(i / grid);
        const base = i * 3;

        positions[base + 0] = (halfGrid - xIndex) * separation;
        positions[base + 1] = floorY;
        positions[base + 2] = (halfGrid - zIndex) * separation;

        velocities[base + 0] = 0;
        velocities[base + 1] = 0;
        velocities[base + 2] = 0;

        const colorSeed = randomFactors[i] + seed;
        colors[base + 0] = hash1d(colorSeed + 1.0);
        colors[base + 1] = hash1d(colorSeed + 2.0) * 0.5 + 0.5;
        colors[base + 2] = hash1d(colorSeed + 3.0);
      }
    },
  };
}

function createParticleUpdateDispatch(spec: RequiredSpec<ParticleKernelSpec>): KernelDispatch<ParticleKernelState, ParticleUpdateContext | undefined> {
  const workgroupSize = spec.workgroupSize;
  const workgroupCount = Math.ceil(spec.particleCount / workgroupSize);

  return {
    label: 'particle-update',
    workgroupSize: [workgroupSize, 1, 1],
    workgroupCount: [workgroupCount, 1, 1],
    cpu: (state, context) => {
      const { positions, velocities } = state;
      const { particleCount, gravity, friction, floorY, bounce, floorDrag } = spec;
      const deltaSeconds = context?.deltaSeconds ?? 1;
      const acceleration = context?.acceleration ?? [0, gravity, 0];

      for (let i = 0; i < particleCount; i++) {
        const base = i * 3;
        const vx = velocities[base + 0] + acceleration[0] * deltaSeconds;
        const vy = velocities[base + 1] + acceleration[1] * deltaSeconds;
        const vz = velocities[base + 2] + acceleration[2] * deltaSeconds;

        let px = positions[base + 0] + vx * deltaSeconds;
        let py = positions[base + 1] + vy * deltaSeconds;
        let pz = positions[base + 2] + vz * deltaSeconds;

        let nx = vx * friction;
        let ny = vy * friction;
        let nz = vz * friction;

        if (py < floorY) {
          py = floorY;
          ny = -ny * bounce;
          nx *= floorDrag;
          nz *= floorDrag;
        }

        positions[base + 0] = px;
        positions[base + 1] = py;
        positions[base + 2] = pz;

        velocities[base + 0] = nx;
        velocities[base + 1] = ny;
        velocities[base + 2] = nz;
      }
    },
  };
}

function createParticleHitDispatch(spec: RequiredSpec<ParticleKernelSpec>): KernelDispatch<ParticleKernelState, ParticleHitContext> {
  const workgroupSize = spec.workgroupSize;
  const workgroupCount = Math.ceil(spec.particleCount / workgroupSize);

  return {
    label: 'particle-hit',
    workgroupSize: [workgroupSize, 1, 1],
    workgroupCount: [workgroupCount, 1, 1],
    cpu: (state, context) => {
      const { origin, radius = spec.hitRadius, strength = spec.hitStrength, jitter = spec.hitJitter } = context;
      const radiusSquared = radius * radius;
      const { positions, velocities, randomFactors } = state;
      const { particleCount } = spec;

      for (let i = 0; i < particleCount; i++) {
        const base = i * 3;
        const dx = positions[base + 0] - origin[0];
        const dy = positions[base + 1] - origin[1];
        const dz = positions[base + 2] - origin[2];
        const distanceSquared = dx * dx + dy * dy + dz * dz;

        if (distanceSquared > radiusSquared || distanceSquared === 0) {
          continue;
        }

        const distance = Math.sqrt(distanceSquared);
        const falloff = (radius - distance) * strength;
        const jitterScale = 0.5 + randomFactors[i] * jitter;
        const magnitude = falloff * jitterScale / distance;

        velocities[base + 0] += dx * magnitude;
        velocities[base + 1] += dy * magnitude;
        velocities[base + 2] += dz * magnitude;
      }
    },
  };
}

function freezeSpec(spec: RequiredSpec<ParticleKernelSpec>): Readonly<RequiredSpec<ParticleKernelSpec>> {
  return Object.freeze({ ...spec });
}

export const particleKernelPresets: Record<string, Readonly<RequiredSpec<ParticleKernelSpec>>> = {
  default: freezeSpec(normalizeSpec({})),
  highBounce: freezeSpec(normalizeSpec({ bounce: 0.95, friction: 0.985 })),
  gentleGravity: freezeSpec(normalizeSpec({ gravity: -0.00035, friction: 0.997, hitStrength: 0.006 })),
};

export function createParticleKernel(spec: Partial<ParticleKernelSpec> = {}): ParticleKernel {
  const normalized = normalizeSpec(spec);
  const state = createParticleKernelState(normalized);

  const dispatches: ParticleKernelDispatches = {
    init: createParticleInitDispatch(normalized),
    update: createParticleUpdateDispatch(normalized),
    hit: createParticleHitDispatch(normalized),
  };

  return {
    label: 'particle-kernel',
    schema: particleBufferSchema,
    state,
    spec: Object.freeze({ ...normalized }),
    dispatches,
  };
}

