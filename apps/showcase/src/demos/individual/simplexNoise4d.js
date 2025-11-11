/**
 * Simplex Noise 4D Demo
 * 4D noise with time dimension for smooth animation
 */

import * as THREE from 'three/webgpu';
import { vec3, vec4, positionLocal, uniform, Fn } from 'three/tsl';
import { simplexNoise4d } from '@tsl-kit/noise';
import { DemoBase } from './_demoBase.js';

export async function init(canvas, controlsContainer) {
  const demo = new DemoBase(canvas, controlsContainer);
  await demo.init();

  const params = {
    frequency: 2.0,
    amplitude: 1.0,
    speed: 0.5,
    wDimension: 0.0,
    colorize: true
  };

  const timeUniform = uniform(0);
  const geometry = new THREE.SphereGeometry(1, 128, 128);
  const material = new THREE.MeshBasicNodeMaterial();

  function updateMaterial() {
    const pos = positionLocal.mul(params.frequency);
    const noise4d = vec4(pos.x, pos.y, pos.z, timeUniform.add(uniform(params.wDimension)));
    const noise = simplexNoise4d(noise4d).mul(params.amplitude);

    material.colorNode = Fn(() => {
      if (params.colorize) {
        return vec3(
          noise.add(1).div(2),
          noise.mul(noise).add(1).div(2),
          noise.mul(0.7).add(0.5)
        );
      }
      return vec3(noise.add(1).div(2));
    })();
    material.needsUpdate = true;
  }

  updateMaterial();
  const mesh = new THREE.Mesh(geometry, material);
  demo.scene.add(mesh);

  const noiseFolder = demo.gui.addFolder('4D Simplex Noise');
  noiseFolder.add(params, 'frequency', 0.5, 5.0).onChange(updateMaterial);
  noiseFolder.add(params, 'amplitude', 0.1, 2.0).onChange(updateMaterial);
  noiseFolder.add(params, 'speed', 0.0, 2.0);
  noiseFolder.add(params, 'wDimension', -5.0, 5.0).onChange(updateMaterial);
  noiseFolder.add(params, 'colorize').onChange(updateMaterial);
  noiseFolder.open();

  demo.animate(() => {
    timeUniform.value += 0.016 * params.speed;
    mesh.rotation.y += 0.005;
  });

  return () => demo.cleanup();
}

