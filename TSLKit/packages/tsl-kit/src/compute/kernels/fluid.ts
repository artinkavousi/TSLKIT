import {
  ComputeBufferSchema,
  GPU_SHADER_STAGE_COMPUTE,
  KernelDefinition,
  KernelDispatch,
  RequiredSpec,
} from '../types.js';

export interface FluidKernelSpec {
  particleCount?: number;
  separation?: number;
  gridScale?: number;
  heightAmplitude?: number;
  sizeAmplitude?: number;
  frequencyX?: number;
  frequencyZ?: number;
  timeScale?: number;
  workgroupSize?: number;
}

export interface FluidKernelState {
  positions: Float32Array;
  sizes: Float32Array;
}

export interface FluidUpdateContext {
  time: number;
  amplitudeMultiplier?: number;
}

export const fluidBufferSchema: readonly ComputeBufferSchema[] = [
  {
    name: 'fluidPositions',
    group: 0,
    binding: 0,
    visibility: GPU_SHADER_STAGE_COMPUTE,
    type: 'storage',
    format: 'array<vec3<f32>>',
    description: 'Particle positions arranged on a grid to represent the wave surface.',
  },
  {
    name: 'fluidSizes',
    group: 0,
    binding: 1,
    visibility: GPU_SHADER_STAGE_COMPUTE,
    type: 'storage',
    format: 'array<vec3<f32>>',
    description: 'Per-particle sprite scale derived from the wave height field.',
  },
] as const;

export interface FluidKernelDispatches {
  init: KernelDispatch<FluidKernelState>;
  update: KernelDispatch<FluidKernelState, FluidUpdateContext>;
}

export type FluidKernel = KernelDefinition<FluidKernelState, Readonly<RequiredSpec<FluidKernelSpec>>, FluidKernelDispatches>;

function normalizeSpec(spec: Partial<FluidKernelSpec>): RequiredSpec<FluidKernelSpec> {
  const merged: RequiredSpec<FluidKernelSpec> = {
    particleCount: Math.max(1, Math.floor(spec.particleCount ?? 200_000)),
    separation: spec.separation ?? 100,
    gridScale: spec.gridScale ?? 0.5,
    heightAmplitude: spec.heightAmplitude ?? 50,
    sizeAmplitude: spec.sizeAmplitude ?? 5,
    frequencyX: spec.frequencyX ?? 0.7,
    frequencyZ: spec.frequencyZ ?? 0.5,
    timeScale: spec.timeScale ?? 5,
    workgroupSize: spec.workgroupSize ?? 256,
  };

  merged.workgroupSize = Math.max(1, Math.floor(merged.workgroupSize));
  merged.particleCount = Math.max(1, Math.floor(merged.particleCount));

  return merged;
}

function createFluidKernelState(spec: RequiredSpec<FluidKernelSpec>): FluidKernelState {
  const { particleCount } = spec;
  return {
    positions: new Float32Array(particleCount * 3),
    sizes: new Float32Array(particleCount * 3),
  };
}

function createFluidInitDispatch(spec: RequiredSpec<FluidKernelSpec>): KernelDispatch<FluidKernelState> {
  const workgroupSize = spec.workgroupSize;
  const workgroupCount = Math.ceil(spec.particleCount / workgroupSize);
  const grid = Math.ceil(Math.sqrt(spec.particleCount));
  const halfGrid = grid / 2;

  return {
    label: 'fluid-init',
    workgroupSize: [workgroupSize, 1, 1],
    workgroupCount: [workgroupCount, 1, 1],
    cpu: state => {
      const { positions, sizes } = state;
      const { particleCount, separation } = spec;

      for (let i = 0; i < particleCount; i++) {
        const xIndex = i % grid;
        const zIndex = Math.floor(i / grid);
        const base = i * 3;

        positions[base + 0] = (halfGrid - xIndex) * separation;
        positions[base + 1] = 0;
        positions[base + 2] = (halfGrid - zIndex) * separation;

        sizes[base + 0] = 1;
        sizes[base + 1] = 1;
        sizes[base + 2] = 1;
      }
    },
  };
}

function createFluidUpdateDispatch(spec: RequiredSpec<FluidKernelSpec>): KernelDispatch<FluidKernelState, FluidUpdateContext> {
  const workgroupSize = spec.workgroupSize;
  const workgroupCount = Math.ceil(spec.particleCount / workgroupSize);
  const grid = Math.ceil(Math.sqrt(spec.particleCount));

  return {
    label: 'fluid-update',
    workgroupSize: [workgroupSize, 1, 1],
    workgroupCount: [workgroupCount, 1, 1],
    cpu: (state, context) => {
      const { positions, sizes } = state;
      const {
        particleCount,
        gridScale,
        heightAmplitude,
        sizeAmplitude,
        frequencyX,
        frequencyZ,
        timeScale,
      } = spec;
      const timePhase = (1 - context.time) * timeScale;
      const amplitudeMultiplier = context.amplitudeMultiplier ?? 1;

      for (let i = 0; i < particleCount; i++) {
        const base = i * 3;
        const xIndex = i % grid;
        const zIndex = Math.floor(i / grid);

        const scaledX = (xIndex * gridScale + timePhase) * frequencyX;
        const scaledZ = (zIndex * gridScale + timePhase) * frequencyZ;

        const sinX = Math.sin(scaledX) * heightAmplitude * amplitudeMultiplier;
        const sinZ = Math.sin(scaledZ) * heightAmplitude * amplitudeMultiplier;

        positions[base + 1] = sinX + sinZ;

        const sizeX = (Math.sin(scaledX) + 1) * sizeAmplitude;
        const sizeZ = (Math.sin(scaledZ) + 1) * sizeAmplitude;
        const scale = sizeX + sizeZ;

        sizes[base + 0] = scale;
        sizes[base + 1] = scale;
        sizes[base + 2] = scale;
      }
    },
  };
}

function freezeSpec(spec: RequiredSpec<FluidKernelSpec>): Readonly<RequiredSpec<FluidKernelSpec>> {
  return Object.freeze({ ...spec });
}

export const fluidKernelPresets: Record<string, Readonly<RequiredSpec<FluidKernelSpec>>> = {
  default: freezeSpec(normalizeSpec({})),
  choppy: freezeSpec(normalizeSpec({ heightAmplitude: 80, sizeAmplitude: 7, frequencyX: 1.2, frequencyZ: 1.1 })),
  calm: freezeSpec(normalizeSpec({ heightAmplitude: 20, sizeAmplitude: 3, frequencyX: 0.35, frequencyZ: 0.32 })),
};

export function createFluidKernel(spec: Partial<FluidKernelSpec> = {}): FluidKernel {
  const normalized = normalizeSpec(spec);
  const state = createFluidKernelState(normalized);

  const dispatches: FluidKernelDispatches = {
    init: createFluidInitDispatch(normalized),
    update: createFluidUpdateDispatch(normalized),
  };

  return {
    label: 'fluid-kernel',
    schema: fluidBufferSchema,
    state,
    spec: Object.freeze({ ...normalized }),
    dispatches,
  };
}

