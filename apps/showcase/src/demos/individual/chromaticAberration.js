/**
 * Chromatic Aberration Demo
 * RGB channel separation effect
 */

import * as THREE from 'three/webgpu';
import { pass, uniform, vec2 } from 'three/tsl';
import { chromaticAberration as chromaticAberrationNode } from 'three/addons/tsl/display/ChromaticAberrationNode.js';
import { DemoBase } from './_demoBase.js';

export async function init(canvas, controlsContainer) {
  const demo = new DemoBase(canvas, controlsContainer);
  await demo.init();

  const params = { offsetX: 0.01, offsetY: 0.01 };

  // Scene setup
  const geometry = new THREE.IcosahedronGeometry(1, 1);
  const material = new THREE.MeshStandardNodeMaterial({ 
    color: 0xffffff, 
    roughness: 0.2, 
    metalness: 0.9 
  });
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
    const aberrationPass = chromaticAberrationNode(
      scenePass, 
      vec2(uniform(params.offsetX), uniform(params.offsetY))
    );
    postProcessing.outputNode = aberrationPass;
  }

  updatePostProcessing();

  const gui = demo.gui.addFolder('Chromatic Aberration');
  gui.add(params, 'offsetX', 0.0, 0.05).onChange(updatePostProcessing);
  gui.add(params, 'offsetY', 0.0, 0.05).onChange(updatePostProcessing);
  gui.open();

  demo.animate(() => {
    mesh.rotation.x += 0.01;
    mesh.rotation.y += 0.015;
    postProcessing.render();
  });

  return () => demo.cleanup();
}

