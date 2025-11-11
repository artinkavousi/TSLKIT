/**
 * Smooth Modulo Demo
 * Continuous repeating pattern with smooth transitions
 */

import * as THREE from 'three/webgpu';
import { uv, vec2, vec3, vec4, Fn, uniform } from 'three/tsl';
import { smoothMod } from '@tsl-kit/utils';
import { DemoBase } from './_demoBase.js';

export async function init(canvas, controlsContainer) {
  const demo = new DemoBase(canvas, controlsContainer);
  await demo.init();

  const params = { period: 0.2, smoothness: 0.05 };
  const geometry = new THREE.PlaneGeometry(2, 2);
  const material = new THREE.MeshBasicNodeMaterial();

  function updateMaterial() {
    material.colorNode = Fn(() => {
      const uvCoord = uv();
      const modded = smoothMod(uvCoord.x, uniform(params.period), uniform(params.smoothness));
      return vec4(vec3(modded.mul(5.0)), 1.0);
    })();
    material.needsUpdate = true;
  }

  updateMaterial();
  const mesh = new THREE.Mesh(geometry, material);
  demo.scene.add(mesh);
  
  const gui = demo.gui.addFolder('Smooth Mod');
  gui.add(params, 'period', 0.05, 0.5).onChange(updateMaterial);
  gui.add(params, 'smoothness', 0.0, 0.1).onChange(updateMaterial);
  gui.open();
  
  demo.animate(() => {});
  return () => demo.cleanup();
}

