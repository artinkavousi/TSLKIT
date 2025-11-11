/**
 * Classic Noise 3D Demo
 * Original Perlin noise implementation
 */

import * as THREE from 'three/webgpu';
import { vec3, positionLocal, uniform, Fn, sin, cos } from 'three/tsl';
import { classicNoise3d } from '@tsl-kit/noise';
import { DemoBase } from './_demoBase.js';

export async function init(canvas, controlsContainer) {
  const demo = new DemoBase(canvas, controlsContainer);
  await demo.init();

  const params = {
    frequency: 2.0,
    amplitude: 1.0,
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
    const noise = classicNoise3d(noisePos).mul(params.amplitude);

    material.colorNode = Fn(() => {
      if (params.colorize) {
        return vec3(
          noise.add(1).div(2),
          sin(noise.mul(3.14159)).add(1).div(2),
          cos(noise.mul(3.14159)).add(1).div(2)
        );
      }
      return vec3(noise.add(1).div(2));
    })();
    material.needsUpdate = true;
  }

  function updateGeometry() {
    demo.scene.remove(mesh);
    if (geometry) geometry.dispose();
    geometry = params.geometry === 'sphere' ? new THREE.SphereGeometry(1, 128, 128) :
               params.geometry === 'torus' ? new THREE.TorusGeometry(0.8, 0.4, 64, 128) :
               new THREE.TorusKnotGeometry(0.8, 0.3, 128, 32);
    mesh.geometry = geometry;
    demo.scene.add(mesh);
  }

  updateMaterial();
  const mesh = new THREE.Mesh(geometry, material);
  demo.scene.add(mesh);

  const noiseFolder = demo.gui.addFolder('Classic Noise');
  noiseFolder.add(params, 'frequency', 0.5, 5.0).onChange(updateMaterial);
  noiseFolder.add(params, 'amplitude', 0.1, 2.0).onChange(updateMaterial);
  noiseFolder.add(params, 'speed', 0.0, 2.0);
  noiseFolder.add(params, 'colorize').onChange(updateMaterial);
  noiseFolder.open();

  demo.gui.add(params, 'geometry', ['sphere', 'torus', 'torusKnot']).onChange(updateGeometry);

  demo.animate(() => {
    timeUniform.value += 0.016 * params.speed;
    mesh.rotation.y += 0.005;
  });

  return () => demo.cleanup();
}

