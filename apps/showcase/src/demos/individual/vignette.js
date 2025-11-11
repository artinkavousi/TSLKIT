/**
 * Vignette Post-FX Demo
 * Edge darkening effect for cinematic look
 */

import * as THREE from 'three/webgpu';
import { pass, uniform, uv } from 'three/tsl';
import { vignetteEffect } from '@tsl-kit/postfx';
import { DemoBase } from './_demoBase.js';

export async function init(canvas, controlsContainer) {
  const demo = new DemoBase(canvas, controlsContainer);
  await demo.init();

  const params = {
    strength: 0.5,
    smoothing: 0.45,
    color: '#ff6600',
    rotationSpeed: 1.0
  };

  // Create scene objects
  const geometry = new THREE.IcosahedronGeometry(1.5, 2);
  const material = new THREE.MeshStandardNodeMaterial({
    color: 0xff6600,
    roughness: 0.3,
    metalness: 0.7
  });
  const mesh = new THREE.Mesh(geometry, material);
  demo.scene.add(mesh);

  // Add lights
  const light1 = new THREE.PointLight(0xffffff, 100, 50);
  light1.position.set(5, 5, 5);
  demo.scene.add(light1);

  const light2 = new THREE.PointLight(0x00ffff, 100, 50);
  light2.position.set(-5, -5, 5);
  demo.scene.add(light2);

  // Post-processing setup
  const postProcessing = new THREE.PostProcessing(demo.renderer);
  postProcessing.outputColorTransform = false;

  function updatePostProcessing() {
    const scenePass = pass(demo.scene, demo.camera);
    const uvCoord = uv().sub(0.5);
    const vignetteMask = vignetteEffect(uvCoord, uniform(params.smoothing), uniform(params.strength * 2.0));
    const finalPass = scenePass.mul(vignetteMask);
    
    postProcessing.outputNode = finalPass;

    // Update material color
    const col = new THREE.Color(params.color);
    material.color.copy(col);
    material.needsUpdate = true;
  }

  updatePostProcessing();

  // GUI
  const vignetteFolder = demo.gui.addFolder('Vignette Settings');
  vignetteFolder.add(params, 'strength', 0.0, 1.0).name('Strength').onChange(updatePostProcessing);
  vignetteFolder.add(params, 'smoothing', 0.1, 0.9).name('Smoothing').onChange(updatePostProcessing);
  vignetteFolder.open();

  const sceneFolder = demo.gui.addFolder('Scene');
  sceneFolder.addColor(params, 'color').name('Object Color').onChange(updatePostProcessing);
  sceneFolder.add(params, 'rotationSpeed', 0.0, 3.0).name('Rotation Speed');
  sceneFolder.open();

  // Animation
  demo.animate(() => {
    mesh.rotation.x += 0.003 * params.rotationSpeed;
    mesh.rotation.y += 0.002 * params.rotationSpeed;
    
    const time = performance.now() * 0.001;
    light1.position.x = Math.sin(time) * 3;
    light1.position.z = Math.cos(time) * 3;
    light2.position.x = Math.cos(time * 0.7) * 3;
    light2.position.z = Math.sin(time * 0.7) * 3;
    
    postProcessing.render();
  });

  // Override default render
  demo.renderer.render = () => {};

  return () => {
    postProcessing.dispose();
    demo.cleanup();
  };
}

