import { Mesh, MeshStandardNodeMaterial, NodeMaterial, texture, uniform, vec3 } from 'three/examples/jsm/nodes/Nodes.js';
import { Color, Euler, TextureLoader } from 'three';

import { standardSurface } from '../core/surface';
import type { MaterialSchema } from './schemas';

export interface MaterialContext {
  mesh: Mesh;
  material: NodeMaterial;
}

export async function makeMaterial(schema: MaterialSchema): Promise<MaterialContext> {
  const material = new MeshStandardNodeMaterial();

  material.colorNode = vec3(schema.baseColor);
  material.metalnessNode = uniform(schema.metalness ?? 0.1);
  material.roughnessNode = uniform(schema.roughness ?? 0.5);

  if (schema.normalTexture) {
    const textureLoader = new TextureLoader();
    const tex = await textureLoader.loadAsync(schema.normalTexture.src);
    tex.anisotropy = schema.normalTexture.anisotropy ?? 1;
    material.normalNode = texture(tex).xyz.mul(schema.normalTexture.strength ?? 1);
  }

  material.userData.surfaceModel = standardSurface(
    schema.surface?.normal ?? vec3(0, 1, 0),
    schema.surface?.view ?? vec3(0, 0, 1),
    schema.surface?.lightDirection ?? vec3(0, 1, 1),
    schema.surface?.lightColor ?? vec3(new Color(0xffffff)),
    material.colorNode,
    schema.surface?.specularColor ?? vec3(new Color(0xffffff)),
    uniform(schema.roughness ?? 0.5)
  );

  const mesh = new Mesh(schema.geometry, material);
  if (schema.position) {
    mesh.position.fromArray(schema.position);
  }
  if (schema.rotation) {
    mesh.rotation.set(new Euler(schema.rotation[0], schema.rotation[1], schema.rotation[2]));
  }
  if (schema.scale) {
    mesh.scale.fromArray(schema.scale);
  }

  return { mesh, material };
}
