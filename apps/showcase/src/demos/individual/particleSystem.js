/**
 * Particle System Demo
 * GPU-accelerated particles using compute shaders
 */

import * as THREE from 'three/webgpu';
import { uniform, instanceIndex, storage, If, Fn, vec3, float, hash, time } from 'three/tsl';
import { createParticleArrays, createGridInitCompute, createWaveUpdateCompute } from '@tsl-kit/compute';
import { DemoBase } from './_demoBase.js';

export async function init(canvas, controlsContainer) {
  const demo = new DemoBase(canvas, controlsContainer);
  await demo.init();

  const params = { 
    particleCount: 10000,
    separation: 0.15,
    frequencyX: 0.7,
    frequencyZ: 0.5,
    amplitudeX: 30,
    amplitudeZ: 30,
    speed: 2.0,
    particleSize: 0.05
  };

  // Create particle arrays
  const arrays = createParticleArrays(params.particleCount, true, false);

  // Create initialization compute
  const initCompute = createGridInitCompute(arrays, {
    particleCount: params.particleCount,
    separation: params.separation,
    randomizeColor: true,
    randomizeHeight: false
  });

  // Execute initialization
  initCompute().compute(params.particleCount);

  // Create wave update compute
  const timeUniform = uniform(0);
  const waveCompute = createWaveUpdateCompute(arrays, params.particleCount, {
    frequencyX: params.frequencyX,
    frequencyZ: params.frequencyZ,
    amplitudeX: params.amplitudeX,
    amplitudeZ: params.amplitudeZ,
    speed: params.speed,
    separation: 100
  });

  // Create particle mesh
  const particleGeometry = new THREE.SphereGeometry(params.particleSize, 8, 8);
  const particleMaterial = new THREE.MeshBasicNodeMaterial();
  
  // Use storage attributes for instanced rendering
  particleMaterial.colorNode = arrays.colors ? arrays.colors.toAttribute() : vec3(1.0);
  particleMaterial.positionNode = arrays.positions.toAttribute();

  const particles = new THREE.InstancedMesh(
    particleGeometry,
    particleMaterial,
    params.particleCount
  );
  particles.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
  demo.scene.add(particles);

  // Add lighting
  const light = new THREE.DirectionalLight(0xffffff, 2);
  light.position.set(10, 20, 10);
  demo.scene.add(light);
  demo.scene.add(new THREE.AmbientLight(0x333333));

  // Position camera to see the wave
  demo.camera.position.set(0, 80, 80);
  demo.camera.lookAt(0, 0, 0);
  demo.controls.target.set(0, 0, 0);
  demo.controls.update();

  const gui = demo.gui.addFolder('Particle System');
  gui.add(params, 'frequencyX', 0.1, 2.0).name('Frequency X');
  gui.add(params, 'frequencyZ', 0.1, 2.0).name('Frequency Z');
  gui.add(params, 'amplitudeX', 10, 100).name('Amplitude X');
  gui.add(params, 'amplitudeZ', 10, 100).name('Amplitude Z');
  gui.add(params, 'speed', 0.5, 10.0).name('Wave Speed');
  gui.open();

  let time = 0;
  demo.animate(() => {
    time += 0.01 * params.speed;
    timeUniform.value = (time % 10) / 10; // Normalize to 0-1

    // Update wave with new parameters
    const updatedWaveCompute = createWaveUpdateCompute(arrays, params.particleCount, {
      frequencyX: params.frequencyX,
      frequencyZ: params.frequencyZ,
      amplitudeX: params.amplitudeX,
      amplitudeZ: params.amplitudeZ,
      speed: params.speed,
      separation: 100
    });
    
    updatedWaveCompute(timeUniform).compute(params.particleCount);
  });

  return () => demo.cleanup();
}

