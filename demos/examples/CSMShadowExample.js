/**
 * CSM Shadow System - Isolated Example
 * 
 * Professional showcase of Cascade Shadow Maps (CSM) system.
 * Tests: shadow quality, cascade splitting, fade, performance.
 */

import * as THREE from 'three';
import WebGPU from 'three/addons/capabilities/WebGPU.js';
import WebGPURenderer from 'three/addons/renderers/webgpu/WebGPURenderer.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { GUI } from 'three/addons/libs/lil-gui.module.min.js';
import { CSMShadowNode } from '../../packages/tsl-kit/src/shadows/CSMShadowNode';

if (WebGPU.isAvailable() === false) {
  document.body.appendChild(WebGPU.getErrorMessage());
  throw new Error('No WebGPU support');
}

// Scene setup
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x87CEEB);
scene.fog = new THREE.Fog(0x87CEEB, 50, 200);

const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 500);
camera.position.set(30, 20, 30);

const renderer = new WebGPURenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;

// Sun with CSM
const sun = new THREE.DirectionalLight(0xffffff, 2.0);
sun.position.set(50, 50, 30);
sun.castShadow = true;
scene.add(sun);

const csm = new CSMShadowNode(sun, {
  cascades: 3,
  mode: 'practical',
  maxFar: 200,
});

// Ground
const ground = new THREE.Mesh(
  new THREE.PlaneGeometry(200, 200),
  new THREE.MeshStandardNodeMaterial({ color: 0x5a5a5a })
);
ground.rotation.x = -Math.PI / 2;
ground.receiveShadow = true;
scene.add(ground);

// Test objects
for (let i = 0; i < 20; i++) {
  const mesh = new THREE.Mesh(
    new THREE.BoxGeometry(2, 2, 2),
    new THREE.MeshStandardNodeMaterial({ color: Math.random() * 0xffffff })
  );
  mesh.position.x = (Math.random() - 0.5) * 80;
  mesh.position.z = (Math.random() - 0.5) * 80;
  mesh.position.y = 1;
  mesh.castShadow = true;
  mesh.receiveShadow = true;
  scene.add(mesh);
}

// GUI
const gui = new GUI({ title: 'CSM Shadow System' });
const params = {
  cascades: 3,
  mode: 'practical',
  fade: true,
  lightX: 50,
  lightY: 50,
  lightZ: 30,
};

gui.add(params, 'cascades', 1, 5, 1).name('Cascades').onChange(v => {
  csm.cascades = v;
  csm.updateFrustums();
});
gui.add(params, 'mode', ['uniform', 'logarithmic', 'practical', 'custom']).name('Split Mode').onChange(v => {
  csm.mode = v;
  csm.updateFrustums();
});
gui.add(params, 'fade').name('Fade').onChange(v => csm.fade = v);
gui.add(params, 'lightX', -100, 100).name('Light X').onChange(v => sun.position.x = v);
gui.add(params, 'lightY', 10, 100).name('Light Y').onChange(v => sun.position.y = v);
gui.add(params, 'lightZ', -100, 100).name('Light Z').onChange(v => sun.position.z = v);

function animate() {
  requestAnimationFrame(animate);
  csm.updateFrustums();
  controls.update();
  renderer.render(scene, camera);
}

animate();

console.log('✅ CSM Shadow System Example Running');

