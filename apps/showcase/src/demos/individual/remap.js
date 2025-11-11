/**
 * Remap Value Demo
 * Map values from one range to another
 */

import * as THREE from 'three/webgpu';
import { uv, vec3, uniform, Fn, float } from 'three/tsl';
import { remapNode } from '@tsl-kit/utils';
import { DemoBase } from './_demoBase.js';

export async function init(canvas, controlsContainer) {
  const demo = new DemoBase(canvas, controlsContainer);
  await demo.init();

  const params = {
    inMin: -1.0,
    inMax: 1.0,
    outMin: 0.0,
    outMax: 1.0,
    animate: true,
    speed: 0.5
  };

  const timeUniform = uniform(0);

  // Create plane geometry
  const geometry = new THREE.PlaneGeometry(2, 2);
  const material = new THREE.MeshBasicNodeMaterial();

  function updateMaterial() {
    material.colorNode = Fn(() => {
      const uvCoord = uv().sub(0.5).mul(2.0); // -1 to 1
      const value = uvCoord.x.add(timeUniform.mul(0.1));
      
      const remapped = remapNode(
        value,
        float(params.inMin),
        float(params.inMax),
        float(params.outMin),
        float(params.outMax)
      );
      
      // Create gradient visualization
      const r = remapped;
      const g = remapped.mul(0.7);
      const b = remapped.mul(0.5).add(0.3);
      
      return vec3(r, g, b);
    })();
    material.needsUpdate = true;
  }

  updateMaterial();

  const mesh = new THREE.Mesh(geometry, material);
  demo.scene.add(mesh);

  // GUI
  const inputFolder = demo.gui.addFolder('Input Range');
  inputFolder.add(params, 'inMin', -5.0, 0.0).name('Min').onChange(updateMaterial);
  inputFolder.add(params, 'inMax', 0.0, 5.0).name('Max').onChange(updateMaterial);
  inputFolder.open();

  const outputFolder = demo.gui.addFolder('Output Range');
  outputFolder.add(params, 'outMin', -2.0, 1.0).name('Min').onChange(updateMaterial);
  outputFolder.add(params, 'outMax', 0.0, 2.0).name('Max').onChange(updateMaterial);
  outputFolder.open();

  const animFolder = demo.gui.addFolder('Animation');
  animFolder.add(params, 'animate').name('Animate');
  animFolder.add(params, 'speed', 0.0, 2.0).name('Speed');
  animFolder.open();

  // Animation
  demo.animate(() => {
    if (params.animate) {
      timeUniform.value += 0.016 * params.speed;
    }
  });

  return () => demo.cleanup();
}

