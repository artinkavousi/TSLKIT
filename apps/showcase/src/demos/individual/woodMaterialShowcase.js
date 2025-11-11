/**
 * Wood Material Showcase (Individual Module Format)
 * 
 * Interactive demo of procedural wood material with TSL
 * Demonstrates 5 different wood presets with real-time controls
 */

import * as THREE from 'three/webgpu';
import { WoodNodeMaterial } from '@tsl-kit/materials';
import { DemoBase } from './_demoBase.js';

export async function init(canvas, controlsContainer) {
  const demo = new DemoBase(canvas, controlsContainer);
  await demo.init();

  // Setup camera for better wood viewing
  demo.camera.position.set(0, 0, 3);
  demo.controls.minDistance = 1;
  demo.controls.maxDistance = 10;

  // Create geometry  
  const geometry = new THREE.TorusKnotGeometry(0.6, 0.2, 128, 32);
  
  // Create wood material with default preset
  let woodMaterial = WoodNodeMaterial.fromPreset('walnut', 'raw');
  const mesh = new THREE.Mesh(geometry, woodMaterial);
  demo.scene.add(mesh);

  // Add lighting
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
  demo.scene.add(ambientLight);

  const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
  directionalLight.position.set(5, 5, 5);
  demo.scene.add(directionalLight);

  // GUI
  const params = {
    genus: 'walnut',
    finish: 'raw',
    autoRotate: true,
    rotationSpeed: 0.005
  };

  const woodFolder = demo.gui.addFolder('Wood Settings');
  woodFolder.add(params, 'genus', ['teak', 'walnut', 'white_oak', 'pine', 'cherry', 'mahogany'])
    .name('Wood Species')
    .onChange((value) => {
      // Recreate material with new preset
      mesh.material.dispose();
      woodMaterial = WoodNodeMaterial.fromPreset(value, params.finish);
      mesh.material = woodMaterial;
    });
  woodFolder.add(params, 'finish', ['raw', 'matte', 'semigloss', 'gloss'])
    .name('Finish')
    .onChange((value) => {
      // Recreate material with new preset
      mesh.material.dispose();
      woodMaterial = WoodNodeMaterial.fromPreset(params.genus, value);
      mesh.material = woodMaterial;
    });
  woodFolder.add(params, 'autoRotate').name('Auto Rotate');
  woodFolder.add(params, 'rotationSpeed', 0.001, 0.02).name('Rotation Speed');
  woodFolder.open();

  // Animation
  demo.animate(() => {
    if (params.autoRotate) {
      mesh.rotation.y += params.rotationSpeed;
    }
  });

  console.log('✅ Wood Material Showcase loaded');
  
  return () => demo.cleanup();
}

