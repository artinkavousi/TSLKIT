import { BoxGeometry, Color, Mesh, Scene } from 'three';
import { MeshStandardNodeMaterial, uniform, vec3 } from 'three/examples/jsm/nodes/Nodes.js';

import { fbm3dNode } from '../materials/noise/fbm';

export function createSampleScene(): Scene {
  const scene = new Scene();
  scene.background = new Color('#0f172a');

  const geometry = new BoxGeometry(1, 1, 1, 64, 64, 64);
  const material = new MeshStandardNodeMaterial();
  material.colorNode = vec3(0.4, 0.7, 1.0);
  material.roughnessNode = uniform(0.35);
  material.metalnessNode = uniform(0.2);
  material.userData.deformation = fbm3dNode;

  const mesh = new Mesh(geometry, material);
  mesh.position.set(0, 0, 0);
  scene.add(mesh);

  return scene;
}
