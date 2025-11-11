/**
 * Film Grain Post-FX Demo
 * Analog film grain noise effect
 */

import * as THREE from 'three/webgpu';
import { pass, uniform, uv, time } from 'three/tsl';
import { filmGrainEffect } from '@tsl-kit/postfx';
import { DemoBase } from './_demoBase.js';

export async function init(canvas, controlsContainer) {
  const demo = new DemoBase(canvas, controlsContainer);
  await demo.init();

  const params = {
    amount: 0.05,
    color: '#8844ff',
    rotationSpeed: 1.0
  };

  // Create scene objects
  const geometry = new THREE.TorusKnotGeometry(0.8, 0.3, 128, 32);
  const material = new THREE.MeshStandardNodeMaterial({
    color: 0x8844ff,
    roughness: 0.4,
    metalness: 0.6
  });
  const mesh = new THREE.Mesh(geometry, material);
  demo.scene.add(mesh);

  // Add lights
  const light1 = new THREE.DirectionalLight(0xffffff, 2);
  light1.position.set(5, 5, 5);
  demo.scene.add(light1);

  const ambient = new THREE.AmbientLight(0x404040, 0.5);
  demo.scene.add(ambient);

  // Post-processing setup
  const postProcessing = new THREE.PostProcessing(demo.renderer);
  postProcessing.outputColorTransform = false;

  function updatePostProcessing() {
    const scenePass = pass(demo.scene, demo.camera);
    const grain = filmGrainEffect(uv(), time).mul(uniform(params.amount));
    const finalPass = scenePass.add(grain);
    
    postProcessing.outputNode = finalPass;

    // Update material color
    const col = new THREE.Color(params.color);
    material.color.copy(col);
    material.needsUpdate = true;
  }

  updatePostProcessing();

  // GUI
  const grainFolder = demo.gui.addFolder('Film Grain Settings');
  grainFolder.add(params, 'amount', 0.0, 0.2).name('Grain Amount').onChange(updatePostProcessing);
  grainFolder.open();

  const sceneFolder = demo.gui.addFolder('Scene');
  sceneFolder.addColor(params, 'color').name('Object Color').onChange(updatePostProcessing);
  sceneFolder.add(params, 'rotationSpeed', 0.0, 3.0).name('Rotation Speed');
  sceneFolder.open();

  // Animation
  demo.animate(() => {
    mesh.rotation.x += 0.003 * params.rotationSpeed;
    mesh.rotation.y += 0.002 * params.rotationSpeed;
    
    postProcessing.render();
  });

  // Override default render
  demo.renderer.render = () => {};

  return () => {
    postProcessing.dispose();
    demo.cleanup();
  };
}

