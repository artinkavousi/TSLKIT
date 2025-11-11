/**
 * Smooth Minimum Demo
 * Smooth blending between values
 */

import * as THREE from 'three/webgpu';
import { uv, vec2, vec3, vec4, Fn, uniform, float } from 'three/tsl';
import { smoothmin } from '@tsl-kit/utils';
import { DemoBase } from './_demoBase.js';

export async function init(canvas, controlsContainer) {
  const demo = new DemoBase(canvas, controlsContainer);
  await demo.init();

  const params = { blend: 0.3, offset: 0.5 };
  const geometry = new THREE.PlaneGeometry(2, 2);
  const material = new THREE.MeshBasicNodeMaterial();

  function updateMaterial() {
    material.colorNode = Fn(() => {
      const uvCoord = uv();
      const val1 = uvCoord.x;
      const val2 = float(1.0).sub(uvCoord.x).add(uniform(params.offset));
      const blended = smoothmin(val1, val2, uniform(params.blend));
      
      return vec4(vec3(blended), 1.0);
    })();
    material.needsUpdate = true;
  }

  updateMaterial();
  const mesh = new THREE.Mesh(geometry, material);
  demo.scene.add(mesh);
  
  const gui = demo.gui.addFolder('Smooth Min');
  gui.add(params, 'blend', 0.0, 1.0).onChange(updateMaterial);
  gui.add(params, 'offset', -1.0, 1.0).onChange(updateMaterial);
  gui.open();
  
  demo.animate(() => {});
  return () => demo.cleanup();
}

