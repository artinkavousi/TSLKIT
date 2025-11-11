/**
 * SDF Triangle Demo
 * Equilateral triangle distance field
 */

import * as THREE from 'three/webgpu';
import { uv, vec2, vec3, vec4, Fn, uniform, select } from 'three/tsl';
import { sdTriangle } from '@tsl-kit/sdf';
import { DemoBase } from './_demoBase.js';

export async function init(canvas, controlsContainer) {
  const demo = new DemoBase(canvas, controlsContainer);
  await demo.init();

  const params = { size: 0.5 };
  const geometry = new THREE.PlaneGeometry(2, 2);
  const material = new THREE.MeshBasicNodeMaterial();

  function updateMaterial() {
    material.colorNode = Fn(() => {
      const uvCoord = uv().sub(0.5).mul(2.0);
      const dist = sdTriangle(uvCoord, uniform(params.size));
      return vec4(select(dist.lessThan(0.0), vec3(0.0, 1.0, 1.0), vec3(dist.mul(3.0), 0.0, 1.0)), 1.0);
    })();
    material.needsUpdate = true;
  }

  updateMaterial();
  const mesh = new THREE.Mesh(geometry, material);
  demo.scene.add(mesh);
  demo.gui.add(params, 'size', 0.1, 1.0).onChange(updateMaterial);
  demo.animate(() => {});
  return () => demo.cleanup();
}

