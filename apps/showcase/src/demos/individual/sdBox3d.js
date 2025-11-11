/**
 * SDF Box 3D Demo
 * 3D box/cube distance field
 */

import * as THREE from 'three/webgpu';
import { vec3, positionLocal, Fn, uniform, select, length } from 'three/tsl';
import { sdBox3d } from '@tsl-kit/sdf';
import { DemoBase } from './_demoBase.js';

export async function init(canvas, controlsContainer) {
  const demo = new DemoBase(canvas, controlsContainer);
  await demo.init();

  const params = {
    sizeX: 0.5,
    sizeY: 0.5,
    sizeZ: 0.5,
    visualize: 'distance'
  };

  const geometry = new THREE.SphereGeometry(1, 128, 128);
  const material = new THREE.MeshBasicNodeMaterial();

  function updateMaterial() {
    material.colorNode = Fn(() => {
      const p = positionLocal;
      const size = vec3(uniform(params.sizeX), uniform(params.sizeY), uniform(params.sizeZ));
      const dist = sdBox3d(p, size);
      
      return select(
        dist.lessThan(0.0),
        vec3(0.0, 1.0, 0.0),
        vec3(1.0, dist.mul(3.0), 0.0)
      );
    })();
    material.needsUpdate = true;
  }

  updateMaterial();
  const mesh = new THREE.Mesh(geometry, material);
  demo.scene.add(mesh);

  const sdfFolder = demo.gui.addFolder('SDF Box 3D');
  sdfFolder.add(params, 'sizeX', 0.1, 1.0).onChange(updateMaterial);
  sdfFolder.add(params, 'sizeY', 0.1, 1.0).onChange(updateMaterial);
  sdfFolder.add(params, 'sizeZ', 0.1, 1.0).onChange(updateMaterial);
  sdfFolder.open();

  demo.animate(() => {
    mesh.rotation.x += 0.003;
    mesh.rotation.y += 0.002;
  });

  return () => demo.cleanup();
}

