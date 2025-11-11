/**
 * Compose Demo
 * Function composition utility
 */

import * as THREE from 'three/webgpu';
import { uv, vec2, vec3, vec4, Fn, uniform, sin, cos } from 'three/tsl';
import { compose } from '@tsl-kit/utils';
import { DemoBase } from './_demoBase.js';

export async function init(canvas, controlsContainer) {
  const demo = new DemoBase(canvas, controlsContainer);
  await demo.init();

  const params = { freq: 5.0, amp: 0.5 };
  const geometry = new THREE.PlaneGeometry(2, 2);
  const material = new THREE.MeshBasicNodeMaterial();

  function updateMaterial() {
    material.colorNode = Fn(() => {
      const uvCoord = uv();
      // Compose multiple transformations
      const val = compose(
        uvCoord.x,
        x => x.mul(uniform(params.freq)),
        x => sin(x).mul(uniform(params.amp)).add(0.5)
      );
      return vec4(val, val.mul(0.5), val.mul(0.3), 1.0);
    })();
    material.needsUpdate = true;
  }

  updateMaterial();
  const mesh = new THREE.Mesh(geometry, material);
  demo.scene.add(mesh);
  
  const gui = demo.gui.addFolder('Compose');
  gui.add(params, 'freq', 1.0, 20.0).onChange(updateMaterial);
  gui.add(params, 'amp', 0.1, 1.0).onChange(updateMaterial);
  gui.open();
  
  demo.animate(() => {});
  return () => demo.cleanup();
}

