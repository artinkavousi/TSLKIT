/**
 * Screen Aspect UV Demo
 * Aspect ratio corrected UV coordinates
 */

import * as THREE from 'three/webgpu';
import { uv, vec2, vec3, vec4, Fn, uniform, length } from 'three/tsl';
import { screenAspectUV } from '@tsl-kit/utils';
import { DemoBase } from './_demoBase.js';

export async function init(canvas, controlsContainer) {
  const demo = new DemoBase(canvas, controlsContainer);
  await demo.init();

  const params = { circleRadius: 0.3 };
  const geometry = new THREE.PlaneGeometry(2, 2);
  const material = new THREE.MeshBasicNodeMaterial();

  function updateMaterial() {
    material.colorNode = Fn(() => {
      const correctedUV = screenAspectUV(uv());
      const dist = length(correctedUV.sub(0.5));
      const circle = dist.lessThan(uniform(params.circleRadius));
      return vec4(vec3(circle), 1.0);
    })();
    material.needsUpdate = true;
  }

  updateMaterial();
  const mesh = new THREE.Mesh(geometry, material);
  demo.scene.add(mesh);
  
  demo.gui.add(params, 'circleRadius', 0.1, 0.8).onChange(updateMaterial);
  demo.animate(() => {});
  return () => demo.cleanup();
}

