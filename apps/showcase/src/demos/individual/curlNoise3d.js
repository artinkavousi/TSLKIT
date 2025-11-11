/**
 * Curl Noise 3D Demo
 * Divergence-free noise for fluid simulations
 */

import * as THREE from 'three/webgpu';
import { vec3, positionLocal, uniform, Fn } from 'three/tsl';
import { curlNoise3d } from '@tsl-kit/noise';
import { DemoBase } from './_demoBase.js';

export async function init(canvas, controlsContainer) {
  const demo = new DemoBase(canvas, controlsContainer);
  await demo.init();

  const params = {
    frequency: 2.0,
    amplitude: 1.0,
    speed: 0.5,
    colorize: true
  };

  const timeUniform = uniform(0);
  const geometry = new THREE.SphereGeometry(1, 128, 128);
  const material = new THREE.MeshBasicNodeMaterial();

  function updateMaterial() {
    const pos = positionLocal.mul(params.frequency);
    const noisePos = vec3(pos.x, pos.y, pos.z.add(timeUniform));
    const curl = curlNoise3d(noisePos).mul(params.amplitude);

    material.colorNode = Fn(() => {
      if (params.colorize) {
        return curl.mul(0.5).add(0.5);
      }
      return vec3(curl.length().mul(0.5).add(0.5));
    })();
    material.needsUpdate = true;
  }

  updateMaterial();
  const mesh = new THREE.Mesh(geometry, material);
  demo.scene.add(mesh);

  const curlFolder = demo.gui.addFolder('Curl Noise 3D');
  curlFolder.add(params, 'frequency', 0.5, 5.0).onChange(updateMaterial);
  curlFolder.add(params, 'amplitude', 0.1, 2.0).onChange(updateMaterial);
  curlFolder.add(params, 'speed', 0.0, 2.0);
  curlFolder.add(params, 'colorize').onChange(updateMaterial);
  curlFolder.open();

  demo.animate(() => {
    timeUniform.value += 0.016 * params.speed;
    mesh.rotation.y += 0.005;
  });

  return () => demo.cleanup();
}

