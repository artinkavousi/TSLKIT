import { perlinNoise3d } from '../ported/fragments/noise/perlinNoise3d.js';
import { simplexNoise3d } from '../ported/fragments/noise/simplexNoise3d.js';
import { curlNoise4d } from '../ported/fragments/noise/curlNoise4d.js';
import {
  fbm,
  ridgedFbm,
  domainWarpedFbm,
} from '../ported/fragments/noise/fbm.js';
import { turbulence } from '../ported/fragments/noise/turbulence.js';
import { simplexNoise4d } from '../ported/portfolio/noise/simplexNoise4d.js';

export interface NoiseNodeDescriptor {
  readonly name: string;
  readonly dimensions: 2 | 3 | 4;
  readonly provenance: string;
  readonly node: unknown;
}

const registry = new Map<string, NoiseNodeDescriptor>();

function addNoiseDescriptor(descriptor: NoiseNodeDescriptor): void {
  if (registry.has(descriptor.name)) {
    throw new Error(`Noise node "${descriptor.name}" already registered`);
  }

  registry.set(descriptor.name, descriptor);
}

addNoiseDescriptor({
  name: 'perlinNoise3d',
  dimensions: 3,
  provenance:
    'RESOURCES/REPOSITORIES/portfolio examples/fragments-boilerplate-main/src/tsl/noise/perlin_noise_3d.ts',
  node: perlinNoise3d,
});

addNoiseDescriptor({
  name: 'simplexNoise3d',
  dimensions: 3,
  provenance:
    'RESOURCES/REPOSITORIES/portfolio examples/fragments-boilerplate-main/src/tsl/noise/simplex_noise_3d.ts',
  node: simplexNoise3d,
});

addNoiseDescriptor({
  name: 'simplexNoise4d',
  dimensions: 4,
  provenance:
    'RESOURCES/REPOSITORIES/portfolio examples/portfolio-main/src/utils/webgpu/nodes/noise/simplexNoise4d.ts',
  node: simplexNoise4d,
});

addNoiseDescriptor({
  name: 'curlNoise4d',
  dimensions: 4,
  provenance:
    'RESOURCES/REPOSITORIES/portfolio examples/fragments-boilerplate-main/src/tsl/noise/curl_noise_4d.ts',
  node: curlNoise4d,
});

addNoiseDescriptor({
  name: 'fbm',
  dimensions: 3,
  provenance:
    'RESOURCES/REPOSITORIES/portfolio examples/fragments-boilerplate-main/src/tsl/noise/fbm.ts',
  node: fbm,
});

addNoiseDescriptor({
  name: 'ridgedFbm',
  dimensions: 3,
  provenance:
    'RESOURCES/REPOSITORIES/portfolio examples/fragments-boilerplate-main/src/tsl/noise/fbm.ts',
  node: ridgedFbm,
});

addNoiseDescriptor({
  name: 'domainWarpedFbm',
  dimensions: 3,
  provenance:
    'RESOURCES/REPOSITORIES/portfolio examples/fragments-boilerplate-main/src/tsl/noise/fbm.ts',
  node: domainWarpedFbm,
});

addNoiseDescriptor({
  name: 'turbulence',
  dimensions: 2,
  provenance:
    'RESOURCES/REPOSITORIES/portfolio examples/fragments-boilerplate-main/src/tsl/noise/turbulence.ts',
  node: turbulence,
});

export function getNoiseNode(name: string): NoiseNodeDescriptor | undefined {
  return registry.get(name);
}

export function listNoiseNodes(): readonly NoiseNodeDescriptor[] {
  return Array.from(registry.values());
}

export {
  perlinNoise3d,
  simplexNoise3d,
  simplexNoise4d,
  curlNoise4d,
  fbm,
  ridgedFbm,
  domainWarpedFbm,
  turbulence,
};
export * from '../ported/fragments/noise/common.js';
