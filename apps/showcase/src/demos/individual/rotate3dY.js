/**
 * Rotate 3D Y Demo
 * 3D Y-axis rotation transformation
 */

import * as THREE from 'three/webgpu';
import { positionLocal, vec3, vec4, Fn, uniform, time, length } from 'three/tsl';
import { rotate3dY } from '@tsl-kit/utils';
import { DemoBase } from './_demoBase.js';

export async function init(canvas, controlsContainer) {
  const demo = new DemoBase(canvas, controlsContainer);
  await demo.init();

  const params = { angle: 0.0, animate: true };
  const geometry = new THREE.SphereGeometry(1, 64, 64);
  const material = new THREE.MeshBasicNodeMaterial();

  function updateMaterial() {
    material.colorNode = Fn(() => {
      const p = positionLocal;
      const angle = params.animate ? time : uniform(params.angle);
      const rotated = rotate3dY(p, angle);
      const colorVal = length(rotated).mul(0.5);
      return vec4(rotated.mul(0.5).add(0.5), 1.0);
    })();
    material.needsUpdate = true;
  }

  updateMaterial();
  const mesh = new THREE.Mesh(geometry, material);
  demo.scene.add(mesh);
  
  const gui = demo.gui.addFolder('Rotate Y');
  gui.add(params, 'angle', 0.0, Math.PI * 2).onChange(updateMaterial);
  gui.add(params, 'animate').onChange(updateMaterial);
  gui.open();
  
  demo.animate(() => {});
  return () => demo.cleanup();
}

