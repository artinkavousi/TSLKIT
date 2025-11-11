/**
 * RGB Shift Demo
 * Color channel displacement
 */

import * as THREE from 'three/webgpu';
import { pass, uniform, vec2 } from 'three/tsl';
import { rgbShift as rgbShiftNode } from 'three/addons/tsl/display/RGBShiftNode.js';
import { DemoBase } from './_demoBase.js';

export async function init(canvas, controlsContainer) {
  const demo = new DemoBase(canvas, controlsContainer);
  await demo.init();

  const params = { amount: 0.005, angle: 0.0 };

  // Scene setup
  const geometry = new THREE.BoxGeometry(1, 1, 1);
  const material = new THREE.MeshStandardNodeMaterial({ color: 0x00ff88 });
  const mesh = new THREE.Mesh(geometry, material);
  demo.scene.add(mesh);

  const light = new THREE.DirectionalLight(0xffffff, 3);
  light.position.set(5, 5, 5);
  demo.scene.add(light);

  // Post-processing
  const postProcessing = new THREE.PostProcessing(demo.renderer);
  postProcessing.outputColorTransform = false;

  function updatePostProcessing() {
    const scenePass = pass(demo.scene, demo.camera);
    const shiftPass = rgbShiftNode(
      scenePass, 
      uniform(params.amount), 
      uniform(params.angle)
    );
    postProcessing.outputNode = shiftPass;
  }

  updatePostProcessing();

  const gui = demo.gui.addFolder('RGB Shift');
  gui.add(params, 'amount', 0.0, 0.02).onChange(updatePostProcessing);
  gui.add(params, 'angle', 0.0, Math.PI * 2).onChange(updatePostProcessing);
  gui.open();

  demo.animate(() => {
    mesh.rotation.x += 0.01;
    mesh.rotation.y += 0.015;
    postProcessing.render();
  });

  return () => demo.cleanup();
}

