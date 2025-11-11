/**
 * Dot Screen Demo
 * Halftone dot pattern effect
 */

import * as THREE from 'three/webgpu';
import { pass, uniform } from 'three/tsl';
import { dotScreen as dotScreenNode } from 'three/addons/tsl/display/DotScreenNode.js';
import { DemoBase } from './_demoBase.js';

export async function init(canvas, controlsContainer) {
  const demo = new DemoBase(canvas, controlsContainer);
  await demo.init();

  const params = { scale: 10.0, angle: 0.5 };
  
  // Scene setup
  const geometry = new THREE.TorusKnotGeometry(0.7, 0.3, 128, 32);
  const material = new THREE.MeshStandardNodeMaterial({ color: 0x00aaff, roughness: 0.3, metalness: 0.8 });
  const mesh = new THREE.Mesh(geometry, material);
  demo.scene.add(mesh);

  const light = new THREE.DirectionalLight(0xffffff, 3);
  light.position.set(5, 5, 5);
  demo.scene.add(light);
  demo.scene.add(new THREE.AmbientLight(0x333333));

  // Post-processing
  const postProcessing = new THREE.PostProcessing(demo.renderer);
  postProcessing.outputColorTransform = false;

  function updatePostProcessing() {
    const scenePass = pass(demo.scene, demo.camera);
    const dotPass = dotScreenNode(scenePass, uniform(params.scale), uniform(params.angle));
    postProcessing.outputNode = dotPass;
  }

  updatePostProcessing();

  const gui = demo.gui.addFolder('Dot Screen');
  gui.add(params, 'scale', 1.0, 30.0).onChange(updatePostProcessing);
  gui.add(params, 'angle', 0.0, Math.PI).onChange(updatePostProcessing);
  gui.open();

  demo.animate(() => {
    mesh.rotation.x += 0.01;
    mesh.rotation.y += 0.02;
    postProcessing.render();
  });

  return () => demo.cleanup();
}

