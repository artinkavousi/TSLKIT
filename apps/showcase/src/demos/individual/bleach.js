/**
 * Bleach Bypass Demo
 * High contrast desaturation effect
 */

import * as THREE from 'three/webgpu';
import { pass, uniform } from 'three/tsl';
import { bleach as bleachNode } from 'three/addons/tsl/display/BleachBypass.js';
import { DemoBase } from './_demoBase.js';

export async function init(canvas, controlsContainer) {
  const demo = new DemoBase(canvas, controlsContainer);
  await demo.init();

  const params = { opacity: 0.7 };

  // Scene setup
  const geometry = new THREE.TorusGeometry(0.7, 0.3, 32, 100);
  const material = new THREE.MeshStandardNodeMaterial({ 
    color: 0xff6600, 
    roughness: 0.4, 
    metalness: 0.6 
  });
  const mesh = new THREE.Mesh(geometry, material);
  demo.scene.add(mesh);

  const light = new THREE.DirectionalLight(0xffffff, 3);
  light.position.set(5, 5, 5);
  demo.scene.add(light);
  demo.scene.add(new THREE.AmbientLight(0x444444));

  // Post-processing
  const postProcessing = new THREE.PostProcessing(demo.renderer);
  postProcessing.outputColorTransform = false;

  function updatePostProcessing() {
    const scenePass = pass(demo.scene, demo.camera);
    const bleachPass = bleachNode(scenePass, uniform(params.opacity));
    postProcessing.outputNode = bleachPass;
  }

  updatePostProcessing();

  demo.gui.add(params, 'opacity', 0.0, 1.0).onChange(updatePostProcessing);

  demo.animate(() => {
    mesh.rotation.x += 0.005;
    mesh.rotation.y += 0.01;
    postProcessing.render();
  });

  return () => demo.cleanup();
}

