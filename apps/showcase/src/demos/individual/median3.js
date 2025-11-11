/**
 * Median 3 Demo
 * Median filter for 3 values
 */

import * as THREE from 'three/webgpu';
import { uv, vec2, vec3, vec4, Fn, uniform, sin, cos } from 'three/tsl';
import { median3 } from '@tsl-kit/utils';
import { DemoBase } from './_demoBase.js';

export async function init(canvas, controlsContainer) {
  const demo = new DemoBase(canvas, controlsContainer);
  await demo.init();

  const params = { freq1: 5.0, freq2: 8.0, freq3: 12.0 };
  const geometry = new THREE.PlaneGeometry(2, 2);
  const material = new THREE.MeshBasicNodeMaterial();

  function updateMaterial() {
    material.colorNode = Fn(() => {
      const uvCoord = uv();
      const val1 = sin(uvCoord.x.mul(uniform(params.freq1))).mul(0.5).add(0.5);
      const val2 = cos(uvCoord.y.mul(uniform(params.freq2))).mul(0.5).add(0.5);
      const val3 = sin(uvCoord.x.add(uvCoord.y).mul(uniform(params.freq3))).mul(0.5).add(0.5);
      const result = median3(val1, val2, val3);
      return vec4(vec3(result), 1.0);
    })();
    material.needsUpdate = true;
  }

  updateMaterial();
  const mesh = new THREE.Mesh(geometry, material);
  demo.scene.add(mesh);
  
  const gui = demo.gui.addFolder('Median 3');
  gui.add(params, 'freq1', 1.0, 20.0).onChange(updateMaterial);
  gui.add(params, 'freq2', 1.0, 20.0).onChange(updateMaterial);
  gui.add(params, 'freq3', 1.0, 20.0).onChange(updateMaterial);
  gui.open();
  
  demo.animate(() => {});
  return () => demo.cleanup();
}

