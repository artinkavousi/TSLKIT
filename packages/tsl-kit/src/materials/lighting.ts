import { ambientLightNode } from '../ported/portfolio/lighting/ambient.js';
import { diffuseNode } from '../ported/portfolio/lighting/diffuse.js';
import { directionalLightNode } from '../ported/portfolio/lighting/directional.js';
import { createFresnelNode } from '../ported/portfolio/lighting/fresnel.js';
import { createHemisphereLight } from '../ported/portfolio/lighting/hemisphere.js';

export interface LightingNodeDescriptor {
  readonly name: string;
  readonly provenance: string;
  readonly node: unknown;
}

const lightingRegistry = new Map<string, LightingNodeDescriptor>();

function registerLighting(descriptor: LightingNodeDescriptor): void {
  if (lightingRegistry.has(descriptor.name)) {
    throw new Error(`Lighting node "${descriptor.name}" already registered`);
  }

  lightingRegistry.set(descriptor.name, descriptor);
}

registerLighting({
  name: 'ambientLightNode',
  provenance:
    'RESOURCES/REPOSITORIES/portfolio examples/portfolio-main/src/utils/webgpu/nodes/lighting/ambient.ts',
  node: ambientLightNode,
});

registerLighting({
  name: 'diffuseNode',
  provenance:
    'RESOURCES/REPOSITORIES/portfolio examples/portfolio-main/src/utils/webgpu/nodes/lighting/diffuse.ts',
  node: diffuseNode,
});

registerLighting({
  name: 'directionalLightNode',
  provenance:
    'RESOURCES/REPOSITORIES/portfolio examples/portfolio-main/src/utils/webgpu/nodes/lighting/directional.ts',
  node: directionalLightNode,
});

registerLighting({
  name: 'createFresnelNode',
  provenance:
    'RESOURCES/REPOSITORIES/portfolio examples/portfolio-main/src/utils/webgpu/nodes/lighting/fresnel.ts',
  node: createFresnelNode,
});

registerLighting({
  name: 'createHemisphereLight',
  provenance:
    'RESOURCES/REPOSITORIES/portfolio examples/portfolio-main/src/utils/webgpu/nodes/lighting/hemisphere.ts',
  node: createHemisphereLight,
});

export function getLightingNode(name: string): LightingNodeDescriptor | undefined {
  return lightingRegistry.get(name);
}

export function listLightingNodes(): readonly LightingNodeDescriptor[] {
  return Array.from(lightingRegistry.values());
}

export {
  ambientLightNode,
  diffuseNode,
  directionalLightNode,
  createFresnelNode,
  createHemisphereLight,
};
