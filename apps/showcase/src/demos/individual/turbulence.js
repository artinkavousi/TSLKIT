/**
 * Turbulence Demo
 * Domain-warped flowing patterns for fluids and clouds
 */

import * as THREE from 'three/webgpu';
import { vec3, positionLocal, uniform, Fn } from 'three/tsl';
import { turbulence } from '@tsl-kit/noise';
import { DemoBase } from './_demoBase.js';

export async function init(canvas, controlsContainer) {
  const demo = new DemoBase(canvas, controlsContainer);
  await demo.init();

  const params = {
    frequency: 2.0,
    amplitude: 1.0,
    octaves: 4,
    speed: 0.3,
    colorize: true,
    geometry: 'sphere'
  };

  const timeUniform = uniform(0);

  let geometry = new THREE.SphereGeometry(1, 128, 128);
  const material = new THREE.MeshBasicNodeMaterial();

  function updateMaterial() {
    const pos = positionLocal.mul(params.frequency);
    const noisePos = vec3(pos.x, pos.y, pos.z.add(timeUniform));
    const noise = turbulence(noisePos, uniform(params.octaves)).mul(params.amplitude);

    material.colorNode = Fn(() => {
      if (params.colorize) {
        const r = noise.add(1).div(2);
        const g = noise.mul(noise).add(1).div(2);
        const b = noise.mul(0.7).add(0.3);
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
      case 'torus':
        geometry = new THREE.TorusGeometry(0.8, 0.4, 64, 128);
        break;
      case 'plane':
        geometry = new THREE.PlaneGeometry(2, 2, 128, 128);
        break;
    }

    mesh.geometry = geometry;
    demo.scene.add(mesh);
  }

  updateMaterial();

  const mesh = new THREE.Mesh(geometry, material);
  demo.scene.add(mesh);

  // GUI
  const turbFolder = demo.gui.addFolder('Turbulence Settings');
  turbFolder.add(params, 'frequency', 0.5, 5.0).name('Frequency').onChange(updateMaterial);
  turbFolder.add(params, 'amplitude', 0.1, 2.0).name('Amplitude').onChange(updateMaterial);
  turbFolder.add(params, 'octaves', 1, 8, 1).name('Octaves').onChange(updateMaterial);
  turbFolder.add(params, 'speed', 0.0, 1.0).name('Speed');
  turbFolder.add(params, 'colorize').name('Colorize').onChange(updateMaterial);
  turbFolder.open();

  const displayFolder = demo.gui.addFolder('Display');
  displayFolder.add(params, 'geometry', ['sphere', 'torus', 'plane']).name('Geometry').onChange(updateGeometry);
  displayFolder.open();

  // Animation
  demo.animate(() => {
    timeUniform.value += 0.016 * params.speed;
    mesh.rotation.y += 0.003;
  });

  return () => demo.cleanup();
}

