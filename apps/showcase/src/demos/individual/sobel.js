/**
 * Sobel Edge Detection Demo
 * Edge detection using Sobel operator
 */

import * as THREE from 'three/webgpu';
import { pass } from 'three/tsl';
import { sobel as sobelNode } from 'three/addons/tsl/display/SobelOperatorNode.js';
import { DemoBase } from './_demoBase.js';

export async function init(canvas, controlsContainer) {
  const demo = new DemoBase(canvas, controlsContainer);
  await demo.init();

  // Scene setup
  const geometry = new THREE.SphereGeometry(1, 64, 64);
  const material = new THREE.MeshStandardNodeMaterial({ color: 0xff5533, roughness: 0.5 });
  const mesh = new THREE.Mesh(geometry, material);
  demo.scene.add(mesh);

  const light = new THREE.DirectionalLight(0xffffff, 3);
  light.position.set(5, 5, 5);
  demo.scene.add(light);

  // Post-processing
  const postProcessing = new THREE.PostProcessing(demo.renderer);
  postProcessing.outputColorTransform = false;

  const scenePass = pass(demo.scene, demo.camera);
  const sobelPass = sobelNode(scenePass);
  postProcessing.outputNode = sobelPass;

  demo.animate(() => {
    mesh.rotation.x += 0.005;
    mesh.rotation.y += 0.01;
    postProcessing.render();
  });

  return () => demo.cleanup();
}

