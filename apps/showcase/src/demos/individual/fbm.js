/**
 * Fractal Brownian Motion Demo
 * Layered noise with octaves for detailed textures
 */

import * as THREE from 'three/webgpu';
import { vec3, positionLocal, uniform, Fn, sin, cos } from 'three/tsl';
import { fbm } from '@tsl-kit/noise';
import { DemoBase } from './_demoBase.js';

export async function init(canvas, controlsContainer) {
  const demo = new DemoBase(canvas, controlsContainer);
  await demo.init();

  const params = {
    octaves: 4,
    frequency: 2.0,
    amplitude: 1.0,
    lacunarity: 2.0,
    gain: 0.5,
    speed: 0.5,
    colorize: true,
    geometry: 'sphere'
  };

  const timeUniform = uniform(0);

  let geometry = new THREE.SphereGeometry(1, 128, 128);
  const material = new THREE.MeshBasicNodeMaterial();

  function updateMaterial() {
    const pos = positionLocal.mul(params.frequency);
    const noisePos = vec3(pos.x, pos.y, pos.z.add(timeUniform));
    
    // FBM expects (position, octaves, lacunarity, gain)
    const noise = fbm(noisePos, uniform(params.octaves), uniform(params.lacunarity), uniform(params.gain)).mul(params.amplitude);

    material.colorNode = Fn(() => {
      if (params.colorize) {
        const r = noise.add(1).div(2);
        const g = sin(noise.mul(3.14159).mul(3)).add(1).div(2);
        const b = cos(noise.mul(3.14159).mul(3)).add(1).div(2);
        return vec3(r, g, b);
      } else {
        return vec3(noise.add(1).div(2));
      }
    })();

    material.needsUpdate = true;
  }

  function updateGeometry() {
    demo.scene.remove(mesh);
    if (geometry) geometry.dispose();

    switch (params.geometry) {
      case 'sphere':
        geometry = new THREE.SphereGeometry(1, 128, 128);
        break;
      case 'plane':
        geometry = new THREE.PlaneGeometry(2, 2, 128, 128);
        break;
      case 'torus':
        geometry = new THREE.TorusGeometry(0.8, 0.4, 64, 128);
        break;
    }

    mesh.geometry = geometry;
    demo.scene.add(mesh);
  }

  updateMaterial();

  const mesh = new THREE.Mesh(geometry, material);
  demo.scene.add(mesh);

  // GUI
  const fbmFolder = demo.gui.addFolder('FBM Settings');
  fbmFolder.add(params, 'octaves', 1, 8, 1).name('Octaves').onChange(updateMaterial);
  fbmFolder.add(params, 'frequency', 0.5, 5.0).name('Frequency').onChange(updateMaterial);
  fbmFolder.add(params, 'amplitude', 0.1, 2.0).name('Amplitude').onChange(updateMaterial);
  fbmFolder.add(params, 'lacunarity', 1.5, 3.0).name('Lacunarity').onChange(updateMaterial);
  fbmFolder.add(params, 'gain', 0.1, 0.9).name('Gain').onChange(updateMaterial);
  fbmFolder.add(params, 'speed', 0.0, 2.0).name('Speed');
  fbmFolder.add(params, 'colorize').name('Colorize').onChange(updateMaterial);
  fbmFolder.open();

  const displayFolder = demo.gui.addFolder('Display');
  displayFolder.add(params, 'geometry', ['sphere', 'plane', 'torus']).name('Geometry').onChange(updateGeometry);
  displayFolder.open();

  // Animation
  demo.animate(() => {
    timeUniform.value += 0.016 * params.speed;
    mesh.rotation.y += 0.003;
  });

  return () => demo.cleanup();
}

