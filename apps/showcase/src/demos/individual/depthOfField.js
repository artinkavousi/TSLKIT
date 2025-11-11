/**
 * Depth of Field Demo
 * Camera focus blur effect
 */

import * as THREE from 'three/webgpu';
import { pass, uniform } from 'three/tsl';
import { dof as depthOfFieldNode } from 'three/addons/tsl/display/DepthOfFieldNode.js';
import { DemoBase } from './_demoBase.js';

export async function init(canvas, controlsContainer) {
  const demo = new DemoBase(canvas, controlsContainer);
  await demo.init();

  const params = { focus: 5.0, aperture: 0.5, maxBlur: 0.01 };

  // Scene setup - multiple objects at different depths
  for (let i = 0; i < 5; i++) {
    const geometry = new THREE.SphereGeometry(0.3, 32, 32);
    const material = new THREE.MeshStandardNodeMaterial({ 
      color: new THREE.Color().setHSL(i / 5, 0.8, 0.6) 
    });
    const mesh = new THREE.Mesh(geometry, material);
    mesh.position.z = -i * 2;
    mesh.position.x = (i - 2) * 0.5;
    demo.scene.add(mesh);
  }

  const light = new THREE.DirectionalLight(0xffffff, 3);
  light.position.set(5, 5, 5);
  demo.scene.add(light);

  // Post-processing
  const postProcessing = new THREE.PostProcessing(demo.renderer);
  postProcessing.outputColorTransform = false;

  function updatePostProcessing() {
    const scenePass = pass(demo.scene, demo.camera);
    const dofPass = depthOfFieldNode(
      scenePass, 
      uniform(params.focus), 
      uniform(params.aperture), 
      uniform(params.maxBlur)
    );
    postProcessing.outputNode = dofPass;
  }

  updatePostProcessing();

  const gui = demo.gui.addFolder('Depth of Field');
  gui.add(params, 'focus', 1.0, 15.0).onChange(updatePostProcessing);
  gui.add(params, 'aperture', 0.0, 2.0).onChange(updatePostProcessing);
  gui.add(params, 'maxBlur', 0.0, 0.05).onChange(updatePostProcessing);
  gui.open();

  demo.animate(() => {
    postProcessing.render();
  });

  return () => demo.cleanup();
}

