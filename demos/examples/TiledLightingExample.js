/**
 * Tiled Lighting System - Isolated Example
 * 
 * Professional showcase of GPU-accelerated tiled lighting.
 * Tests: performance with 100-1000 lights, scalability, tile visualization.
 */

import * as THREE from 'three';
import WebGPU from 'three/addons/capabilities/WebGPU.js';
import WebGPURenderer from 'three/addons/renderers/webgpu/WebGPURenderer.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { GUI } from 'three/addons/libs/lil-gui.module.min.js';
import { tiledLights } from '../../packages/tsl-kit/src/lighting/TiledLightsNode';

if (WebGPU.isAvailable() === false) {
  document.body.appendChild(WebGPU.getErrorMessage());
  throw new Error('No WebGPU support');
}

const scene = new THREE.Scene();
scene.background = new THREE.Color(0x000000);

const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 200);
camera.position.set(0, 20, 30);

const renderer = new WebGPURenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const controls = new OrbitControls(camera, renderer.domElement);

// Enable tiled lighting
const tiledLightsNode = tiledLights(1024, 32);
renderer.lightsNode = tiledLightsNode;

// Ground
const ground = new THREE.Mesh(
  new THREE.PlaneGeometry(100, 100),
  new THREE.MeshStandardNodeMaterial({ color: 0x333333, roughness: 0.8 })
);
ground.rotation.x = -Math.PI / 2;
scene.add(ground);

// Test spheres
for (let i = 0; i < 50; i++) {
  const sphere = new THREE.Mesh(
    new THREE.SphereGeometry(1, 32, 32),
    new THREE.MeshStandardNodeMaterial({ color: 0xcccccc, roughness: 0.5, metalness: 0.2 })
  );
  sphere.position.x = (Math.random() - 0.5) * 60;
  sphere.position.z = (Math.random() - 0.5) * 60;
  sphere.position.y = 1;
  scene.add(sphere);
}

// Create lights
const lights = [];
function createLights(count) {
  lights.forEach(l => scene.remove(l));
  lights.length = 0;
  
  for (let i = 0; i < count; i++) {
    const color = new THREE.Color().setHSL(Math.random(), 1.0, 0.5);
    const light = new THREE.PointLight(color, 5, 12, 2);
    light.position.x = (Math.random() - 0.5) * 60;
    light.position.y = Math.random() * 8 + 2;
    light.position.z = (Math.random() - 0.5) * 60;
    light.userData = {
      basePos: light.position.clone(),
      offset: Math.random() * Math.PI * 2,
    };
    scene.add(light);
    lights.push(light);
  }
}

createLights(200);

// GUI
const gui = new GUI({ title: 'Tiled Lighting' });
const params = { lightCount: 200 };
gui.add(params, 'lightCount', 50, 1000, 50).name('Light Count').onChange(createLights);

// Stats
const statsDiv = document.createElement('div');
statsDiv.style.cssText = `
  position: absolute;
  top: 10px;
  right: 10px;
  color: white;
  background: rgba(0,0,0,0.8);
  padding: 10px;
  font-family: monospace;
  font-size: 12px;
`;
document.body.appendChild(statsDiv);

let fps = 0, frameCount = 0, lastTime = performance.now();

function animate() {
  requestAnimationFrame(animate);
  
  const time = performance.now() * 0.001;
  
  // Animate lights
  lights.forEach(light => {
    const { basePos, offset } = light.userData;
    light.position.x = basePos.x + Math.sin(time + offset) * 5;
    light.position.z = basePos.z + Math.cos(time + offset) * 5;
  });
  
  // FPS
  frameCount++;
  const now = performance.now();
  if (now - lastTime >= 1000) {
    fps = Math.round((frameCount * 1000) / (now - lastTime));
    frameCount = 0;
    lastTime = now;
  }
  
  statsDiv.innerHTML = `FPS: ${fps}<br>Lights: ${lights.length}<br>Calls: ${renderer.info.render.calls}`;
  
  controls.update();
  renderer.render(scene, camera);
}

animate();

console.log('✅ Tiled Lighting Example Running');

