/**
 * AfterImage Demo
 * Motion blur / trailing effect
 */

import * as THREE from 'three/webgpu';
import { pass, uniform } from 'three/tsl';
import { afterImage as afterImageNode } from 'three/addons/tsl/display/AfterImageNode.js';
import { DemoBase } from './_demoBase.js';

export async function init(canvas, controlsContainer) {
  const demo = new DemoBase(canvas, controlsContainer);
  await demo.init();

  const params = { persistence: 0.9 };

  // Scene setup
  const geometry = new THREE.BoxGeometry(0.5, 0.5, 0.5);
  const material = new THREE.MeshStandardNodeMaterial({ color: 0xff00ff });
  const mesh = new THREE.Mesh(geometry, material);
  demo.scene.add(mesh);

  const light = new THREE.PointLight(0xffffff, 2);
  light.position.set(3, 3, 3);
  demo.scene.add(light);

  // Post-processing
  const postProcessing = new THREE.PostProcessing(demo.renderer);
  postProcessing.outputColorTransform = false;

  function updatePostProcessing() {
    const scenePass = pass(demo.scene, demo.camera);
    const trailPass = afterImageNode(scenePass, uniform(params.persistence));
    postProcessing.outputNode = trailPass;
  }

  updatePostProcessing();

  demo.gui.add(params, 'persistence', 0.5, 0.99).onChange(updatePostProcessing);

  let time = 0;
  demo.animate(() => {
    time += 0.05;
    mesh.position.x = Math.sin(time) * 1.5;
    mesh.position.y = Math.cos(time * 1.5) * 1.0;
    mesh.rotation.x += 0.02;
    mesh.rotation.y += 0.03;
    postProcessing.render();
  });

  return () => demo.cleanup();
}

