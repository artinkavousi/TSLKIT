/**
 * SDF Ring Demo
 * 2D ring/annulus distance field
 */

import * as THREE from 'three/webgpu';
import { uv, vec2, vec3, vec4, Fn, uniform, select } from 'three/tsl';
import { sdRing } from '@tsl-kit/sdf';
import { DemoBase } from './_demoBase.js';

export async function init(canvas, controlsContainer) {
  const demo = new DemoBase(canvas, controlsContainer);
  await demo.init();

  const params = { innerRadius: 0.3, outerRadius: 0.5 };
  const geometry = new THREE.PlaneGeometry(2, 2);
  const material = new THREE.MeshBasicNodeMaterial();

  function updateMaterial() {
    material.colorNode = Fn(() => {
      const uvCoord = uv().sub(0.5).mul(2.0);
      const dist = sdRing(uvCoord, vec2(uniform(params.innerRadius), uniform(params.outerRadius)));
      return vec4(select(dist.lessThan(0.0), vec3(1.0, 1.0, 0.0), vec3(dist.mul(3.0), dist, 0.0)), 1.0);
    })();
    material.needsUpdate = true;
  }

  updateMaterial();
  const mesh = new THREE.Mesh(geometry, material);
  demo.scene.add(mesh);
  
  const gui = demo.gui.addFolder('Ring');
  gui.add(params, 'innerRadius', 0.1, 0.8).onChange(updateMaterial);
  gui.add(params, 'outerRadius', 0.2, 1.0).onChange(updateMaterial);
  gui.open();
  
  demo.animate(() => {});
  return () => demo.cleanup();
}

