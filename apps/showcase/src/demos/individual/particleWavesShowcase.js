/**
 * Particle Waves Showcase (Individual Module Format)
 * 
 * GPU-accelerated 200K particle wave simulation
 */

import * as THREE from 'three/webgpu';
import { ParticleWaves } from '@tsl-kit/compute';
import { DemoBase } from './_demoBase.js';

export async function init(canvas, controlsContainer) {
  const demo = new DemoBase(canvas, controlsContainer);
  await demo.init();

  // Setup camera
  demo.camera.position.set(0, 80, 80);
  demo.camera.lookAt(0, 0, 0);
  demo.controls.target.set(0, 0, 0);

  // Create particle waves system
  const particleWaves = new ParticleWaves({
    particleCount: 200000,
    gridSize: [500, 500],
    waveAmplitude: 50,
    waveFrequency: 0.7,
    particleSize: 1.0
  });

  await particleWaves.init();
  demo.scene.add(particleWaves.mesh);

  // Add lighting
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.3);
  demo.scene.add(ambientLight);

  const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
  directionalLight.position.set(10, 20, 10);
  demo.scene.add(directionalLight);

  // GUI
  const params = {
    amplitude: 50,
    frequency: 0.7,
    speed: 2.0,
    particleSize: 1.0
  };

  const waveFolder = demo.gui.addFolder('Wave Settings');
  waveFolder.add(params, 'amplitude', 10, 100).name('Amplitude')
    .onChange((value) => {
      if (particleWaves.updateAmplitude) particleWaves.updateAmplitude(value);
    });
  waveFolder.add(params, 'frequency', 0.1, 2.0).name('Frequency')
    .onChange((value) => {
      if (particleWaves.updateFrequency) particleWaves.updateFrequency(value);
    });
  waveFolder.add(params, 'speed', 0.5, 5.0).name('Speed');
  waveFolder.add(params, 'particleSize', 0.5, 3.0).name('Particle Size')
    .onChange((value) => {
      particleWaves.setParticleSize(value);
    });
  waveFolder.open();

  // Animation
  demo.animate(() => {
    particleWaves.update(0.016);
  });

  console.log('✅ Particle Waves Showcase loaded (200K particles)');
  
  return () => {
    particleWaves.dispose();
    demo.cleanup();
  };
}

