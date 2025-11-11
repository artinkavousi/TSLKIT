/**
 * Bloom Post-Processing Demo
 * WebGPU bloom effect with full control
 */

import * as THREE from 'three/webgpu';
import { pass, uniform } from 'three/tsl';
import { bloom as bloomNode } from 'three/addons/tsl/display/BloomNode.js';
import { DemoBase } from './_demoBase.js';

export async function init(canvas, controlsContainer) {
  const demo = new DemoBase(canvas, controlsContainer);
  await demo.init();

  // Parameters
  const params = {
    strength: 0.5,
    threshold: 0.5,
    emissiveIntensity: 1.0,
    color: '#ff6600',
    rotationSpeed: 1.0
  };

  // Create emissive geometry
  const geometry = new THREE.IcosahedronGeometry(1.5, 2);
  const material = new THREE.MeshStandardNodeMaterial({
    color: 0xff6600,
    emissive: 0xff6600,
    emissiveIntensity: params.emissiveIntensity,
    roughness: 0.2,
    metalness: 0.8
  });
  const mesh = new THREE.Mesh(geometry, material);
  demo.scene.add(mesh);

  // Add lights
  const light1 = new THREE.PointLight(0xffffff, 100, 50);
  light1.position.set(5, 5, 5);
  demo.scene.add(light1);

  const light2 = new THREE.PointLight(0xff00ff, 100, 50);
  light2.position.set(-5, -5, 5);
  demo.scene.add(light2);

  // Post-processing setup
  const postProcessing = new THREE.PostProcessing(demo.renderer);
  postProcessing.outputColorTransform = false;

  function updatePostProcessing() {
    const scenePass = pass(demo.scene, demo.camera);
    const bloomPass = bloomNode(scenePass, uniform(params.strength), uniform(params.threshold));
    postProcessing.outputNode = bloomPass;

    // Update material
    const col = new THREE.Color(params.color);
    material.color.copy(col);
    material.emissive.copy(col);
    material.emissiveIntensity = params.emissiveIntensity;
    material.needsUpdate = true;
  }

  updatePostProcessing();

  // GUI
  const bloomFolder = demo.gui.addFolder('Bloom Settings');
  bloomFolder.add(params, 'strength', 0.0, 2.0).name('Strength').onChange(updatePostProcessing);
  bloomFolder.add(params, 'threshold', 0.0, 1.0).name('Threshold').onChange(updatePostProcessing);
  bloomFolder.open();

  const materialFolder = demo.gui.addFolder('Material');
  materialFolder.add(params, 'emissiveIntensity', 0.0, 2.0).name('Emissive Intensity').onChange(updatePostProcessing);
  materialFolder.addColor(params, 'color').name('Color').onChange(updatePostProcessing);
  materialFolder.add(params, 'rotationSpeed', 0.0, 3.0).name('Rotation Speed');
  materialFolder.open();

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

  // Override render to use postProcessing
  demo.renderer.render = () => {}; // Disable default render

  // Cleanup
  return () => {
    postProcessing.dispose();
    demo.cleanup();
  };
}

