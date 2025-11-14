import { type ComputePreset, type ComputePipelineSpec } from './types';

export interface ParticleFieldOptions {
  particleCount?: number;
  attractionStrength?: number;
  curlStrength?: number;
}

const DEFAULT_PARTICLES = 150_000;

function buildParticlePipeline(options: ParticleFieldOptions = {}): ComputePipelineSpec {
  const {
    particleCount = DEFAULT_PARTICLES,
    attractionStrength = 0.45,
    curlStrength = 0.35
  } = options;

  const spawnKernel = {
    label: 'particle-spawn',
    workgroupSize: [64, 1, 1] as const,
    dispatchSize: [Math.ceil(particleCount / 64), 1, 1] as const,
    bindings: [
      { binding: 0, visibility: ['compute'], type: 'storage', name: 'positions' },
      { binding: 1, visibility: ['compute'], type: 'storage', name: 'velocities' },
      { binding: 2, visibility: ['compute'], type: 'storage', name: 'seeds' }
    ],
    code: /* wgsl */ `
      struct Particle {
        position : vec4<f32>;
        velocity : vec4<f32>;
      };

      @group(0) @binding(0) var<storage, read_write> positions : array<Particle>;
      @group(0) @binding(1) var<storage, read_write> velocities : array<Particle>;
      @group(0) @binding(2) var<storage, read> seeds : array<vec4<f32>>;

      @compute @workgroup_size(64)
      fn spawn(@builtin(global_invocation_id) id : vec3<u32>) {
        if (id.x >= arrayLength(&positions)) {
          return;
        }
        let seed = seeds[id.x];
        positions[id.x].position = vec4<f32>(seed.xyz * 2.0 - 1.0, 1.0);
        velocities[id.x].velocity = vec4<f32>(0.0, 0.0, 0.0, 0.0);
      }
    `
  };

  const stepKernel = {
    label: 'particle-step',
    workgroupSize: [128, 1, 1] as const,
    dispatchSize: [Math.ceil(particleCount / 128), 1, 1] as const,
    bindings: [
      { binding: 0, visibility: ['compute'], type: 'storage', name: 'positions' },
      { binding: 1, visibility: ['compute'], type: 'storage', name: 'velocities' },
      { binding: 2, visibility: ['compute'], type: 'uniform', name: 'simulationUniforms' }
    ],
    constants: {
      ATTRACTION: attractionStrength,
      CURL: curlStrength
    },
    code: /* wgsl */ `
      struct Particle {
        position : vec4<f32>;
        velocity : vec4<f32>;
      };

      struct SimulationUniforms {
        center : vec3<f32>;
        deltaTime : f32;
        elapsed : f32;
      };

      @group(0) @binding(0) var<storage, read_write> positions : array<Particle>;
      @group(0) @binding(1) var<storage, read_write> velocities : array<Particle>;
      @group(0) @binding(2) var<uniform> uniforms : SimulationUniforms;

      fn curlNoise(p : vec3<f32>) -> vec3<f32> {
        return vec3<f32>(
          sin(p.y + uniforms.elapsed) - cos(p.z - uniforms.elapsed),
          sin(p.z + uniforms.elapsed) - cos(p.x - uniforms.elapsed),
          sin(p.x + uniforms.elapsed) - cos(p.y - uniforms.elapsed)
        );
      }

      @compute @workgroup_size(128)
      fn simulate(@builtin(global_invocation_id) id : vec3<u32>) {
        if (id.x >= arrayLength(&positions)) {
          return;
        }
        var particle = positions[id.x];
        let velocity = velocities[id.x].velocity.xyz;
        let toCenter = uniforms.center - particle.position.xyz;
        velocity += toCenter * f32(ATTRACTION) * uniforms.deltaTime;
        velocity += curlNoise(particle.position.xyz) * f32(CURL) * uniforms.deltaTime;
        velocity *= 0.985;
        particle.position.xyz += velocity * uniforms.deltaTime;
        positions[id.x] = particle;
        velocities[id.x].velocity = vec4<f32>(velocity, 0.0);
      }
    `
  };

  return {
    kernels: [spawnKernel, stepKernel],
    persistentBuffers: ['positions', 'velocities'],
    transientBuffers: ['seeds']
  };
}

export function createParticleSwarmPreset(options: ParticleFieldOptions = {}): ComputePreset {
  return {
    id: 'particle-swarm',
    label: 'Particle Swarm',
    description:
      'Attractive particle field with curl-noise turbulence used for hero hero scenes and motion blur demos.',
    pipeline: buildParticlePipeline(options),
    timeline: {
      stepsPerFrame: 2,
      fixedTimeStep: 1 / 120,
      damping: 0.985
    }
  };
}
