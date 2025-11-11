/**
 * Bloom Edge Demo
 * Edge detection with bloom
 */

import * as THREE from 'three/webgpu';
import { uv, vec2, vec3, vec4, Fn, uniform, length } from 'three/tsl';
import { bloomEdgePattern } from '@tsl-kit/utils';
import { DemoBase } from './_demoBase.js';

export async function init(canvas, controlsContainer) {
  const demo = new DemoBase(canvas, controlsContainer);
  await demo.init();

  const params = { threshold: 0.5, intensity: 2.0 };
  const geometry = new THREE.PlaneGeometry(2, 2);
  const material = new THREE.MeshBasicNodeMaterial();

  function updateMaterial() {
    material.colorNode = Fn(() => {
      const uvCoord = uv();
      const dist = length(uvCoord.sub(0.5));
      const circle = dist.lessThan(0.3).toFloat();
      const edgeBloom = bloomEdgePattern(circle, uniform(4.0), uniform(params.threshold), uniform(params.intensity));
      return vec4(vec3(edgeBloom), 1.0);
    })();
    material.needsUpdate = true;
  }

  updateMaterial();
  const mesh = new THREE.Mesh(geometry, material);
  demo.scene.add(mesh);
  
  const gui = demo.gui.addFolder('Bloom Edge');
  gui.add(params, 'threshold', 0.0, 1.0).onChange(updateMaterial);
  gui.add(params, 'intensity', 0.5, 5.0).onChange(updateMaterial);
  gui.open();
  
  demo.animate(() => {});
  return () => demo.cleanup();
}

