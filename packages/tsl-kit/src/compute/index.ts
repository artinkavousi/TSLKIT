import { createRadialParticleInitializer } from '../ported/fragments/compute/radialParticleInitializer.js';
import type { RadialParticleInitializer } from '../ported/fragments/compute/radialParticleInitializer.js';

export interface ComputeBlueprintDescriptor {
  readonly name: string;
  readonly provenance: string;
  readonly create: (count: number) => RadialParticleInitializer;
}

const computeRegistry = new Map<string, ComputeBlueprintDescriptor>();

function registerBlueprint(descriptor: ComputeBlueprintDescriptor): void {
  if (computeRegistry.has(descriptor.name)) {
    throw new Error(`Compute blueprint "${descriptor.name}" already registered`);
  }

  computeRegistry.set(descriptor.name, descriptor);
}

registerBlueprint({
  name: 'radialParticleInitializer',
  provenance:
    'RESOURCES/REPOSITORIES/portfolio examples/blog.maximeheckel.com-main/core/components/MDX/Widgets/TSLWebGPU/particleInit.ts',
  create: (count: number) => createRadialParticleInitializer(count),
});

export interface ComputeSimulationHandle {
  readonly id: string;
  readonly computeNode: RadialParticleInitializer['computeNode'];
  readonly dispose: () => void;
}

export interface InstantiateComputeOptions {
  readonly blueprint: string;
  readonly count: number;
}

export function instantiateCompute(options: InstantiateComputeOptions): ComputeSimulationHandle {
  const descriptor = computeRegistry.get(options.blueprint);
  if (!descriptor) {
    throw new Error(`Unknown compute blueprint: ${options.blueprint}`);
  }

  const resources = descriptor.create(options.count);

  return {
    id: `compute:${descriptor.name}:${options.count}`,
    computeNode: resources.computeNode,
    dispose: () => {
      // buffers auto garbage collected with node graph; hook for manual cleanup later
    },
  };
}

export function listComputeBlueprints(): readonly ComputeBlueprintDescriptor[] {
  return Array.from(computeRegistry.values());
}

export { createRadialParticleInitializer };
