/**
 * Smooth Union Demo
 * Smooth blend operation for SDFs
 */

import * as THREE from 'three/webgpu';
import { uv, vec2, vec3, vec4, Fn, uniform, select } from 'three/tsl';
import { sdSphere, smin } from '@tsl-kit/sdf';
import { DemoBase } from './_demoBase.js';

export async function init(canvas, controlsContainer) {
  const demo = new DemoBase(canvas, controlsContainer);
  await demo.init();

  const params = { offset: 0.5, smoothness: 0.3 };
  const geometry = new THREE.PlaneGeometry(2, 2);
  const material = new THREE.MeshBasicNodeMaterial();

  function updateMaterial() {
    material.colorNode = Fn(() => {
      const uvCoord = uv().sub(0.5).mul(2.0);
      const p = vec3(uvCoord.x, uvCoord.y, 0.0);
      
      const sphere1 = sdSphere(p, uniform(0.4));
      const sphere2 = sdSphere(p.sub(vec3(uniform(params.offset), 0, 0)), uniform(0.4));
      const combined = smin(sphere1, sphere2, uniform(params.smoothness));
      
      return vec4(select(combined.lessThan(0.0), vec3(0.0, 1.0, 1.0), vec3(combined.mul(2.0), 0.0, 1.0)), 1.0);
    })();
    material.needsUpdate = true;
  }

  updateMaterial();
  const mesh = new THREE.Mesh(geometry, material);
  demo.scene.add(mesh);
  
  const gui = demo.gui.addFolder('Smooth Union');
  gui.add(params, 'offset', 0.0, 1.0).onChange(updateMaterial);
  gui.add(params, 'smoothness', 0.0, 1.0).onChange(updateMaterial);
  gui.open();
  
  demo.animate(() => {});
  return () => demo.cleanup();
}

