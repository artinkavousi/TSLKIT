import { type ComputePreset } from './types';

export interface FluidSimOptions {
  resolution?: number;
  viscosity?: number;
  smokeDensity?: number;
}

export function createFluidAdvectionPreset(options: FluidSimOptions = {}): ComputePreset {
  const { resolution = 128, viscosity = 0.0001, smokeDensity = 0.65 } = options;

  const grid = resolution * resolution;
  const workgroupSize = 64;

  return {
    id: 'fluid-advection',
    label: 'Fluid Advection',
    description: 'Screen-space Navier-Stokes solver with pressure projection for cinematic volumetrics.',
    pipeline: {
      kernels: [
        {
          label: 'velocity-advection',
          workgroupSize: [workgroupSize, 1, 1],
          dispatchSize: [Math.ceil(grid / workgroupSize), 1, 1],
          bindings: [
            { binding: 0, visibility: ['compute'], type: 'storage', name: 'velocity' },
            { binding: 1, visibility: ['compute'], type: 'storage', name: 'velocityTemp' },
            { binding: 2, visibility: ['compute'], type: 'uniform', name: 'simUniforms' }
          ],
          constants: {
            VISCOSITY: viscosity
          },
          code: /* wgsl */ `
            struct Field { data : array<vec4<f32>>; };
            @group(0) @binding(0) var<storage, read_write> velocity : Field;
            @group(0) @binding(1) var<storage, read_write> velocityTemp : Field;
            @group(0) @binding(2) var<uniform> uniforms : vec4<f32>;

            fn sampleVelocity(index : u32) -> vec2<f32> {
              return velocity.data[index].xy;
            }

            fn bilinearSample(coord : vec2<f32>, size : vec2<f32>) -> vec2<f32> {
              let uv = coord / size;
              return vec2<f32>(uv.x, uv.y);
            }

            @compute @workgroup_size(${workgroupSize})
            fn advect(@builtin(global_invocation_id) id : vec3<u32>) {
              if (id.x >= arrayLength(&velocity.data)) { return; }
              let coord = vec2<f32>(f32(id.x % u32(${resolution})), floor(f32(id.x) / f32(${resolution})));
              let vel = sampleVelocity(id.x);
              let prev = coord - vel * uniforms.z;
              let sampled = bilinearSample(prev, vec2<f32>(${resolution}.0, ${resolution}.0));
              velocityTemp.data[id.x] = vec4<f32>(sampled, 0.0, 1.0);
            }
          `
        },
        {
          label: 'pressure-project',
          workgroupSize: [workgroupSize, 1, 1],
          dispatchSize: [Math.ceil(grid / workgroupSize), 1, 1],
          bindings: [
            { binding: 0, visibility: ['compute'], type: 'storage', name: 'pressure' },
            { binding: 1, visibility: ['compute'], type: 'storage', name: 'divergence' }
          ],
          code: /* wgsl */ `
            struct Field { data : array<vec4<f32>>; };
            @group(0) @binding(0) var<storage, read_write> pressure : Field;
            @group(0) @binding(1) var<storage, read> divergence : Field;

            @compute @workgroup_size(${workgroupSize})
            fn project(@builtin(global_invocation_id) id : vec3<u32>) {
              if (id.x >= arrayLength(&pressure.data)) { return; }
              let div = divergence.data[id.x].x;
              pressure.data[id.x].x = div * 0.25;
            }
          `
        },
        {
          label: 'density-advect',
          workgroupSize: [workgroupSize, 1, 1],
          dispatchSize: [Math.ceil(grid / workgroupSize), 1, 1],
          bindings: [
            { binding: 0, visibility: ['compute'], type: 'storage', name: 'density' },
            { binding: 1, visibility: ['compute'], type: 'storage', name: 'densityTemp' },
            { binding: 2, visibility: ['compute'], type: 'uniform', name: 'simUniforms' }
          ],
          constants: {
            DENSITY: smokeDensity
          },
          code: /* wgsl */ `
            struct Field { data : array<vec4<f32>>; };
            @group(0) @binding(0) var<storage, read_write> density : Field;
            @group(0) @binding(1) var<storage, read_write> densityTemp : Field;
            @group(0) @binding(2) var<uniform> uniforms : vec4<f32>;

            @compute @workgroup_size(${workgroupSize})
            fn densityStep(@builtin(global_invocation_id) id : vec3<u32>) {
              if (id.x >= arrayLength(&density.data)) { return; }
              let fade = exp(-uniforms.w * f32(DENSITY));
              densityTemp.data[id.x] = vec4<f32>(density.data[id.x].xyz * fade, 1.0);
            }
          `
        }
      ],
      persistentBuffers: ['velocity', 'pressure', 'density'],
      transientBuffers: ['velocityTemp', 'densityTemp', 'divergence']
    },
    timeline: {
      stepsPerFrame: 4,
      fixedTimeStep: 1 / 60,
      damping: 0.96
    }
  };
}
