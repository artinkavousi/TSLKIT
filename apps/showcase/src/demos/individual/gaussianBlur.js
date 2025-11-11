/**
 * Gaussian Blur Demo
 * Smooth blur effect
 */

import * as THREE from 'three/webgpu';
import { pass, uniform } from 'three/tsl';
import { gaussianBlur as gaussianBlurNode } from 'three/addons/tsl/display/GaussianBlurNode.js';
import { DemoBase } from './_demoBase.js';

export async function init(canvas, controlsContainer) {
  const demo = new DemoBase(canvas, controlsContainer);
  await demo.init();

  const params = { radius: 5.0 };

  // Scene setup
  const geometry = new THREE.DodecahedronGeometry(1, 0);
  const material = new THREE.MeshStandardNodeMaterial({ color: 0xff00aa });
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
    const blurPass = gaussianBlurNode(scenePass, uniform(params.radius));
    postProcessing.outputNode = blurPass;
  }

  updatePostProcessing();

  demo.gui.add(params, 'radius', 0.0, 20.0).onChange(updatePostProcessing);

  demo.animate(() => {
    mesh.rotation.x += 0.01;
    mesh.rotation.y += 0.015;
    postProcessing.render();
  });

  return () => demo.cleanup();
}

