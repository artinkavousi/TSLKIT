/**
 * Simplex Noise 2D Demo
 * Fast 2D noise perfect for textures and patterns
 */

import * as THREE from 'three/webgpu';
import { vec2, vec3, uv, uniform, Fn, sin, cos, mul } from 'three/tsl';
import { simplexNoise2d } from '@tsl-kit/noise';
import { DemoBase } from './_demoBase.js';

export async function init(canvas, controlsContainer) {
  const demo = new DemoBase(canvas, controlsContainer);
  await demo.init();

  const params = {
    frequency: 5.0,
    amplitude: 1.0,
    speed: 0.5,
    colorize: true,
    animate: true,
    mode: 'standard'
  };

  const timeUniform = uniform(0);

  // Create plane geometry
  const geometry = new THREE.PlaneGeometry(2, 2);
  const material = new THREE.MeshBasicNodeMaterial();

  function updateMaterial() {
    material.colorNode = Fn(() => {
      const uvCoord = uv().mul(params.frequency);
      const noiseInput = params.mode === 'animated' 
        ? uvCoord.add(vec2(timeUniform, timeUniform.mul(0.5)))
        : uvCoord;
      
      const noise = simplexNoise2d(noiseInput).mul(params.amplitude);

      if (params.colorize) {
        const r = noise.add(1).div(2);
        const g = sin(noise.mul(3.14159).mul(2)).add(1).div(2);
        const b = cos(noise.mul(3.14159).mul(2)).add(1).div(2);
        return vec3(r, g, b);
      } else {
        return vec3(noise.add(1).div(2));
      }
    })();
    material.needsUpdate = true;
  }

  updateMaterial();

  const mesh = new THREE.Mesh(geometry, material);
  demo.scene.add(mesh);

  // GUI
  const noiseFolder = demo.gui.addFolder('Noise Settings');
  noiseFolder.add(params, 'frequency', 1.0, 20.0).name('Frequency').onChange(updateMaterial);
  noiseFolder.add(params, 'amplitude', 0.1, 2.0).name('Amplitude').onChange(updateMaterial);
  noiseFolder.add(params, 'mode', ['standard', 'animated']).name('Mode').onChange(updateMaterial);
  noiseFolder.add(params, 'speed', 0.0, 2.0).name('Animation Speed');
  noiseFolder.add(params, 'animate').name('Animate');
  noiseFolder.add(params, 'colorize').name('Colorize').onChange(updateMaterial);
  noiseFolder.open();

  // Animation
  demo.animate(() => {
    if (params.animate && params.mode === 'animated') {
      timeUniform.value += 0.016 * params.speed;
    }
  });

  return () => demo.cleanup();
}

