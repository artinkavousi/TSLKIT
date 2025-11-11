/**
 * SDF Union Demo
 * Combine shapes (OR operation)
 */

import * as THREE from 'three/webgpu';
import { uv, vec2, vec3, vec4, Fn, uniform, select } from 'three/tsl';
import { sdSphere, opUnion } from '@tsl-kit/sdf';
import { DemoBase } from './_demoBase.js';

export async function init(canvas, controlsContainer) {
  const demo = new DemoBase(canvas, controlsContainer);
  await demo.init();

  const params = { offset: 0.5 };
  const geometry = new THREE.PlaneGeometry(2, 2);
  const material = new THREE.MeshBasicNodeMaterial();

  function updateMaterial() {
    material.colorNode = Fn(() => {
      const uvCoord = uv().sub(0.5).mul(2.0);
      const p = vec3(uvCoord.x, uvCoord.y, 0.0);
      
      const sphere1 = sdSphere(p, uniform(0.4));
      const sphere2 = sdSphere(p.sub(vec3(uniform(params.offset), 0, 0)), uniform(0.4));
      const combined = opUnion(sphere1, sphere2);
      
      return vec4(select(combined.lessThan(0.0), vec3(1.0, 0.5, 0.0), vec3(combined.mul(2.0), 0.0, 0.5)), 1.0);
    })();
    material.needsUpdate = true;
  }

  updateMaterial();
  const mesh = new THREE.Mesh(geometry, material);
  demo.scene.add(mesh);
  demo.gui.add(params, 'offset', 0.0, 1.0).onChange(updateMaterial);
  demo.animate(() => {});
  return () => demo.cleanup();
}

