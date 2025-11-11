/**
 * Pixellation Demo
 * Mosaic/pixelation effect
 */

import * as THREE from 'three/webgpu';
import { pass, uniform } from 'three/tsl';
import { pixelationPass as pixellationNode } from 'three/addons/tsl/display/PixelationPassNode.js';
import { DemoBase } from './_demoBase.js';

export async function init(canvas, controlsContainer) {
  const demo = new DemoBase(canvas, controlsContainer);
  await demo.init();

  const params = { pixelSize: 8.0 };

  // Scene setup
  const geometry = new THREE.SphereGeometry(1, 32, 32);
  const material = new THREE.MeshStandardNodeMaterial({ color: 0xff3366 });
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
    const pixelPass = pixellationNode(scenePass, uniform(params.pixelSize));
    postProcessing.outputNode = pixelPass;
  }

  updatePostProcessing();

  demo.gui.add(params, 'pixelSize', 2.0, 32.0, 1.0).onChange(updatePostProcessing);

  demo.animate(() => {
    mesh.rotation.x += 0.005;
    mesh.rotation.y += 0.01;
    postProcessing.render();
  });

  return () => demo.cleanup();
}

