/**
 * Simplex Noise 3D Demo
 * Professional demonstration of 3D simplex noise on animated geometry
 */

import * as THREE from 'three/webgpu';
import { vec3, positionLocal, uniform, Fn, sin, cos } from 'three/tsl';
import { simplexNoise3d } from '@tsl-kit/noise';
import { DemoBase } from './_demoBase.js';

export async function init(canvas, controlsContainer) {
  const demo = new DemoBase(canvas, controlsContainer);
  await demo.init();

  // Parameters
  const params = {
    frequency: 2.0,
    amplitude: 1.0,
    speed: 0.5,
    colorize: true,
    wireframe: false,
    geometry: 'sphere'
  };

  const timeUniform = uniform(0);

  // Create geometry
  let geometry = new THREE.SphereGeometry(1, 128, 128);
  const material = new THREE.MeshBasicNodeMaterial();

  function updateMaterial() {
    const pos = positionLocal.mul(params.frequency);
    const noisePos = vec3(pos.x, pos.y, pos.z.add(timeUniform));
    const noise = simplexNoise3d(noisePos).mul(params.amplitude);

    material.colorNode = Fn(() => {
      if (params.colorize) {
        const r = noise.add(1).div(2);
        const g = sin(noise.mul(3.14159)).add(1).div(2);
        const b = cos(noise.mul(3.14159)).add(1).div(2);
        return vec3(r, g, b);
      } else {
        return vec3(noise.add(1).div(2));
      }
    })();

    material.wireframe = params.wireframe;
    material.needsUpdate = true;
  }

  function updateGeometry() {
    demo.scene.remove(mesh);
    if (geometry) geometry.dispose();

    switch (params.geometry) {
      case 'sphere':
        geometry = new THREE.SphereGeometry(1, 128, 128);
        break;
      case 'box':
        geometry = new THREE.BoxGeometry(1.5, 1.5, 1.5, 64, 64, 64);
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
  const noiseFolder = demo.gui.addFolder('Noise Settings');
  noiseFolder.add(params, 'frequency', 0.1, 5.0).name('Frequency').onChange(updateMaterial);
  noiseFolder.add(params, 'amplitude', 0.1, 2.0).name('Amplitude').onChange(updateMaterial);
  noiseFolder.add(params, 'speed', 0.0, 2.0).name('Animation Speed');
  noiseFolder.add(params, 'colorize').name('Colorize').onChange(updateMaterial);
  noiseFolder.open();

  const displayFolder = demo.gui.addFolder('Display');
  displayFolder.add(params, 'wireframe').name('Wireframe').onChange(updateMaterial);
  displayFolder.add(params, 'geometry', ['sphere', 'box', 'torus', 'plane']).name('Geometry').onChange(updateGeometry);
  displayFolder.open();

  // Animation
  demo.animate(() => {
    timeUniform.value += 0.016 * params.speed;
    mesh.rotation.y += 0.005;
  });

  // Cleanup
  return () => demo.cleanup();
}

