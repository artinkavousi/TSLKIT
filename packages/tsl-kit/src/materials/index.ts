import type { MeshPhysicalMaterialParameters } from 'three';
import { CustomNodeMaterial } from '../ported/portfolio/materials/customNodeMaterial.js';

export interface MaterialDescriptor {
  readonly name: string;
  readonly provenance: string;
  readonly create: (params: MeshPhysicalMaterialParameters) => CustomNodeMaterial;
}

const materialRegistry = new Map<string, MaterialDescriptor>();

function registerMaterial(descriptor: MaterialDescriptor): void {
  if (materialRegistry.has(descriptor.name)) {
    throw new Error(`Material "${descriptor.name}" already registered`);
  }

  materialRegistry.set(descriptor.name, descriptor);
}

registerMaterial({
  name: 'customNodeMaterial',
  provenance:
    'RESOURCES/REPOSITORIES/portfolio examples/portfolio-main/src/app/lab/tsl-custom-node-material/custom-node-material.ts',
  create: (params) => new CustomNodeMaterial(params),
});

export function createMaterial(name: string, params: MeshPhysicalMaterialParameters): CustomNodeMaterial {
  const descriptor = materialRegistry.get(name);
  if (!descriptor) {
    throw new Error(`Unknown material: ${name}`);
  }

  return descriptor.create(params);
}

export function listMaterials(): readonly MaterialDescriptor[] {
  return Array.from(materialRegistry.values());
}

export { CustomNodeMaterial };
