/**
 * Compute Particles Showcase (Individual Module Format)
 * 
 * 10K animated particles with wave motion
 */

import * as THREE from 'three/webgpu';
import { DemoBase } from './_demoBase.js';

export async function init(canvas, controlsContainer) {
  const demo = new DemoBase(canvas, controlsContainer);
  await demo.init();

  // Setup camera
  demo.camera.position.set(0, 50, 100);
  demo.controls.target.set(0, 0, 0);

  // Create particle field
  const particleCount = 10000;
  const geometry = new THREE.BufferGeometry();
  const positions = new Float32Array(particleCount * 3);
  const colors = new Float32Array(particleCount * 3);

  for (let i = 0; i < particleCount; i++) {
    positions[i * 3 + 0] = (Math.random() - 0.5) * 100;
    positions[i * 3 + 1] = (Math.random() - 0.5) * 100;
    positions[i * 3 + 2] = (Math.random() - 0.5) * 100;

    colors[i * 3 + 0] = Math.random() * 0.5 + 0.5;
    colors[i * 3 + 1] = Math.random() * 0.5 + 0.5;
    colors[i * 3 + 2] = 1.0;
  }

  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

  const material = new THREE.PointsMaterial({
    size: 0.5,
    vertexColors: true,
    transparent: true,
    opacity: 0.8,
    blending: THREE.AdditiveBlending,
    depthWrite: false
  });

  const particleMesh = new THREE.Points(geometry, material);
  demo.scene.add(particleMesh);

  // Store base positions
  const basePositions = positions.slice();

  // GUI
  const params = {
    particleSize: 0.5,
    waveStrength: 10,
    waveSpeed: 2.0,
    rotationSpeed: 0.1
  };

  const particleFolder = demo.gui.addFolder('Particle Settings');
  particleFolder.add(params, 'particleSize', 0.1, 2.0).name('Size')
    .onChange((value) => {
      material.size = value;
    });
  particleFolder.add(params, 'waveStrength', 0, 20).name('Wave Strength');
  particleFolder.add(params, 'waveSpeed', 0.5, 5.0).name('Wave Speed');
  particleFolder.add(params, 'rotationSpeed', 0, 0.5).name('Rotation Speed');
  particleFolder.open();

  // Animation
  demo.animate(() => {
    const time = performance.now() * 0.001;

    // Animate particles with wave motion
    for (let i = 0; i < positions.length / 3; i++) {
      const baseX = basePositions[i * 3 + 0];
      const baseZ = basePositions[i * 3 + 2];
      
      positions[i * 3 + 1] = basePositions[i * 3 + 1] + 
        Math.sin(baseX * 0.1 + time * params.waveSpeed) * params.waveStrength +
        Math.cos(baseZ * 0.1 + time * params.waveSpeed) * params.waveStrength;
    }

    particleMesh.geometry.attributes.position.needsUpdate = true;
    particleMesh.rotation.y = time * params.rotationSpeed;
  });

  console.log('✅ Compute Particles Showcase loaded (10K particles)');
  
  return () => demo.cleanup();
}

