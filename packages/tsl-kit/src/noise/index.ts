import { perlinNoise3d } from '../ported/fragments/noise/perlinNoise3d.js';
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
  name: 'simplexNoise4d',
  dimensions: 4,
  provenance:
    'RESOURCES/REPOSITORIES/portfolio examples/portfolio-main/src/utils/webgpu/nodes/noise/simplexNoise4d.ts',
  node: simplexNoise4d,
});

export function getNoiseNode(name: string): NoiseNodeDescriptor | undefined {
  return registry.get(name);
}

export function listNoiseNodes(): readonly NoiseNodeDescriptor[] {
  return Array.from(registry.values());
}

export { perlinNoise3d, simplexNoise4d };
export * from '../ported/fragments/noise/common.js';
