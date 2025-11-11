/**
 * Post-FX Effects - Isolated Example
 * 
 * Professional showcase of all post-processing effects.
 * Tests: Sepia, DotScreen, Sobel edge detection.
 */

import * as THREE from 'three';
import WebGPU from 'three/addons/capabilities/WebGPU.js';
import WebGPURenderer from 'three/addons/renderers/webgpu/WebGPURenderer.js';
import { pass, uniform, vec2 } from 'three/tsl';
import { GUI } from 'three/addons/libs/lil-gui.module.min.js';
import { sepia } from '../../packages/tsl-kit/src/postfx/Sepia';
import { dotScreen } from '../../packages/tsl-kit/src/postfx/DotScreenNode';
import { sobel } from '../../packages/tsl-kit/src/postfx/SobelOperatorNode';

if (WebGPU.isAvailable() === false) {
  document.body.appendChild(WebGPU.getErrorMessage());
  throw new Error('No WebGPU support');
}

const scene = new THREE.Scene();
scene.background = new THREE.Color(0x87CEEB);

const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 100);
camera.position.set(0, 5, 15);

const renderer = new WebGPURenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Add test objects
const group = new THREE.Group();
scene.add(group);

const geometries = [
  new THREE.BoxGeometry(2, 2, 2),
  new THREE.SphereGeometry(1.2, 32, 32),
  new THREE.TorusGeometry(1, 0.4, 16, 32),
];

for (let i = 0; i < 3; i++) {
  const mesh = new THREE.Mesh(
    geometries[i],
    new THREE.MeshStandardMaterial({ 
      color: [0xff6b6b, 0x4ecdc4, 0xffe66d][i],
      roughness: 0.5
    })
  );
  mesh.position.x = (i - 1) * 4;
  group.add(mesh);
}

// Lights
const ambient = new THREE.AmbientLight(0x404040);
scene.add(ambient);

const directional = new THREE.DirectionalLight(0xffffff, 1.5);
directional.position.set(5, 5, 5);
scene.add(directional);

// Post-processing setup
const scenePass = pass(scene, camera);
const resolution = uniform(vec2(window.innerWidth, window.innerHeight));

let currentEffect = 'none';
let outputNode = scenePass;

// GUI
const gui = new GUI({ title: 'Post-FX Effects' });
const params = {
  effect: 'none',
  sepiaAmount: 0.8,
  dotScreenScale: 1.5,
  dotScreenAngle: 1.57,
};

gui.add(params, 'effect', ['none', 'sepia', 'dotScreen', 'sobel', 'combined']).name('Effect').onChange(v => {
  currentEffect = v;
  updateEffect();
});
gui.add(params, 'sepiaAmount', 0, 1).name('Sepia Amount');
gui.add(params, 'dotScreenScale', 0.5, 3).name('Dot Scale');
gui.add(params, 'dotScreenAngle', 0, Math.PI * 2).name('Dot Angle');

function updateEffect() {
  switch (currentEffect) {
    case 'sepia':
      outputNode = sepia(scenePass, uniform(params.sepiaAmount));
      break;
    case 'dotScreen':
      outputNode = dotScreen(scenePass, vec2(0.5, 0.5), uniform(params.dotScreenAngle), uniform(params.dotScreenScale));
      break;
    case 'sobel':
      const edges = sobel(scenePass, resolution);
      outputNode = vec4(vec3(edges), 1.0);
      break;
    case 'combined':
      const sepiaEffect = sepia(scenePass, uniform(params.sepiaAmount));
      const dotEffect = dotScreen(sepiaEffect);
      outputNode = dotEffect;
      break;
    default:
      outputNode = scenePass;
  }
  
  renderer.outputNode = outputNode;
}

updateEffect();

function animate() {
  requestAnimationFrame(animate);
  
  group.rotation.y += 0.01;
  group.children.forEach((child, i) => {
    child.rotation.x += 0.01 * (i + 1);
    child.rotation.z += 0.005 * (i + 1);
  });
  
  renderer.render(scene, camera);
}

animate();

window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
  resolution.value.set(window.innerWidth, window.innerHeight);
});

console.log('✅ Post-FX Effects Example Running');

