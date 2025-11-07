import { createRadialParticleInitializer } from '../ported/fragments/compute/radialParticleInitializer.js';
import { createInstancedParticleField } from '../ported/examples/compute/instancedParticleField.js';

export interface ComputeBlueprintDescriptor<TResources = unknown> {
  readonly name: string;
  readonly provenance: string;
  readonly create: (count: number) => TResources;
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

registerBlueprint({
  name: 'instancedParticleField',
  provenance:
    'RESOURCES/REPOSITORIES/TSLwebgpuExamples/tsl-compute-particles/src/script.js',
  create: (count: number) => createInstancedParticleField(count),
});

export interface ComputeSimulationHandle<TResources = unknown> {
  readonly id: string;
  readonly resources: TResources;
  readonly dispose: () => void;
}

export interface InstantiateComputeOptions {
  readonly blueprint: string;
  readonly count: number;
}

export function instantiateCompute<TResources = unknown>(
  options: InstantiateComputeOptions,
): ComputeSimulationHandle<TResources> {
  const descriptor = computeRegistry.get(options.blueprint) as
    | ComputeBlueprintDescriptor<TResources>
    | undefined;
  if (!descriptor) {
    throw new Error(`Unknown compute blueprint: ${options.blueprint}`);
  }

  const resources = descriptor.create(options.count);

  return {
    id: `compute:${descriptor.name}:${options.count}`,
    resources,
    dispose: () => {
      // buffers auto garbage collected with node graph; hook for manual cleanup later
    },
  };
}

export function listComputeBlueprints(): readonly ComputeBlueprintDescriptor[] {
  return Array.from(computeRegistry.values());
}

export { createRadialParticleInitializer };
export { createInstancedParticleField };
