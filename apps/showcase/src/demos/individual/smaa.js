/**
 * SMAA Demo
 * Subpixel morphological anti-aliasing
 */

import * as THREE from 'three/webgpu';
import { pass } from 'three/tsl';
import { smaa as smaaNode } from 'three/addons/tsl/display/SMAANode.js';
import { DemoBase } from './_demoBase.js';

export async function init(canvas, controlsContainer) {
  const demo = new DemoBase(canvas, controlsContainer);
  await demo.init();

  // Scene setup
  const geometry = new THREE.OctahedronGeometry(1, 0);
  const material = new THREE.MeshStandardNodeMaterial({ 
    color: 0x44ff88, 
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
  const aaPass = smaaNode(scenePass);
  postProcessing.outputNode = aaPass;

  demo.animate(() => {
    mesh.rotation.x += 0.01;
    mesh.rotation.y += 0.015;
    postProcessing.render();
  });

  return () => demo.cleanup();
}

