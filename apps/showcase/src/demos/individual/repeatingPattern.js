/**
 * Repeating Pattern Demo
 * Tiling pattern generator
 */

import * as THREE from 'three/webgpu';
import { uv, vec2, vec3, vec4, Fn, uniform, length } from 'three/tsl';
import { repeatingPattern } from '@tsl-kit/utils';
import { DemoBase } from './_demoBase.js';

export async function init(canvas, controlsContainer) {
  const demo = new DemoBase(canvas, controlsContainer);
  await demo.init();

  const params = { tilesX: 5.0, tilesY: 5.0 };
  const geometry = new THREE.PlaneGeometry(2, 2);
  const material = new THREE.MeshBasicNodeMaterial();

  function updateMaterial() {
    material.colorNode = Fn(() => {
      const uvCoord = uv();
      const tiled = repeatingPattern(uvCoord, vec2(uniform(params.tilesX), uniform(params.tilesY)));
      const dist = length(tiled.sub(0.5));
      const circle = dist.lessThan(0.3);
      return vec4(vec3(circle), 1.0);
    })();
    material.needsUpdate = true;
  }

  updateMaterial();
  const mesh = new THREE.Mesh(geometry, material);
  demo.scene.add(mesh);
  
  const gui = demo.gui.addFolder('Repeating Pattern');
  gui.add(params, 'tilesX', 1.0, 20.0, 1.0).onChange(updateMaterial);
  gui.add(params, 'tilesY', 1.0, 20.0, 1.0).onChange(updateMaterial);
  gui.open();
  
  demo.animate(() => {});
  return () => demo.cleanup();
}

