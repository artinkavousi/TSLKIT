/**
 * FXAA Demo
 * Fast approximate anti-aliasing
 */

import * as THREE from 'three/webgpu';
import { pass } from 'three/tsl';
import { fxaa as fxaaNode } from 'three/addons/tsl/display/FXAANode.js';
import { DemoBase } from './_demoBase.js';

export async function init(canvas, controlsContainer) {
  const demo = new DemoBase(canvas, controlsContainer);
  await demo.init();

  // Scene setup - geometry with hard edges to show AA
  const geometry = new THREE.BoxGeometry(1, 1, 1);
  const material = new THREE.MeshStandardNodeMaterial({ 
    color: 0xffffff, 
    flatShading: true 
  });
  const mesh = new THREE.Mesh(geometry, material);
  demo.scene.add(mesh);

  const light = new THREE.DirectionalLight(0xffffff, 3);
  light.position.set(5, 5, 5);
  demo.scene.add(light);

  // Post-processing
  const postProcessing = new THREE.PostProcessing(demo.renderer);
  postProcessing.outputColorTransform = false;

  const scenePass = pass(demo.scene, demo.camera);
  const aaPass = fxaaNode(scenePass);
  postProcessing.outputNode = aaPass;

  demo.animate(() => {
    mesh.rotation.x += 0.01;
    mesh.rotation.y += 0.015;
    postProcessing.render();
  });

  return () => demo.cleanup();
}

