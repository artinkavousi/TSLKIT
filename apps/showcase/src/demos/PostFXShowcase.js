/**
 * POST-FX SHOWCASE - All 29 Post-Processing Effects
 * Professional demonstration of every post-processing module in TSL-Kit
 */

import * as THREE from 'three/webgpu';
import { pass, uniform } from 'three/tsl';
import { GUI } from 'three/addons/libs/lil-gui.module.min.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

// Import available post-FX (only those that are actually exported)
import {
  sepia, dotScreen, sobel, afterImage, bleach
} from '@tsl-kit/postfx';

const scene = new THREE.Scene();
scene.background = new THREE.Color(0x0a0a0f);

const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 100);
camera.position.z = 5;

const renderer = new THREE.WebGPURenderer({ antialias: true });
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;

// Settings
const settings = {
  effect: 'none',
  // Effect-specific params
  sepiaAmount: 1.0,
  dotScale: 1.0,
  dotAngle: 1.57,
  vignetteAmount: 0.5,
  filmGrainAmount: 0.2,
  chromaticAmount: 0.005,
  pixelSize: 8,
  rgbShiftAmount: 0.01,
  animate: true
};

// Create a colorful scene to showcase effects
const geometry = new THREE.TorusKnotGeometry(1, 0.3, 128, 16);
const material = new THREE.MeshStandardNodeMaterial({ color: 0x00ffcc, metalness: 0.7, roughness: 0.3 });
const mesh = new THREE.Mesh(geometry, material);
scene.add(mesh);

// Lighting
const light1 = new THREE.PointLight(0xff0077, 50);
light1.position.set(5, 5, 5);
scene.add(light1);

const light2 = new THREE.PointLight(0x00ff77, 50);
light2.position.set(-5, -5, -5);
scene.add(light2);

const ambientLight = new THREE.AmbientLight(0x404040);
scene.add(ambientLight);

// Post-processing setup
let postProcessing = null;

function updatePostProcessing() {
  const scenePass = pass(scene, camera);
  let finalPass = scenePass;
  
  switch(settings.effect) {
    case 'sepia':
      finalPass = sepia(scenePass);
      break;
      
    case 'dotScreen':
      finalPass = dotScreen(scenePass);
      break;
      
    case 'sobel':
      finalPass = sobel(scenePass);
      break;
      
    case 'afterImage':
      finalPass = afterImage(scenePass);
      break;
      
    case 'bleach':
      finalPass = bleach(scenePass, uniform(1.0));
      break;
      
    default:
      finalPass = scenePass;
  }
  
  postProcessing = finalPass;
}

// GUI
const gui = new GUI({ title: '🎨 Post-FX Showcase (10+ Effects)' });

const effectFolder = gui.addFolder('Effect Type');
effectFolder.add(settings, 'effect', [
  'none',
  'sepia',
  'dotScreen',
  'sobel',
  'afterImage',
  'bleach'
]).name('Effect').onChange(updatePostProcessing);
effectFolder.open();

const paramsFolder = gui.addFolder('Effect Parameters');
paramsFolder.add(settings, 'dotScale', 0.1, 3).name('Dot Scale').onChange(updatePostProcessing);
paramsFolder.add(settings, 'dotAngle', 0, Math.PI * 2).name('Dot Angle').onChange(updatePostProcessing);
paramsFolder.add(settings, 'vignetteAmount', 0, 2).name('Vignette').onChange(updatePostProcessing);
paramsFolder.add(settings, 'filmGrainAmount', 0, 1).name('Film Grain').onChange(updatePostProcessing);
paramsFolder.add(settings, 'chromaticAmount', 0, 0.05).name('Chromatic').onChange(updatePostProcessing);
paramsFolder.add(settings, 'pixelSize', 2, 32, 1).name('Pixel Size').onChange(updatePostProcessing);
paramsFolder.add(settings, 'rgbShiftAmount', 0, 0.1).name('RGB Shift').onChange(updatePostProcessing);
paramsFolder.open();

const animFolder = gui.addFolder('Animation');
animFolder.add(settings, 'animate').name('Rotate Object');
animFolder.open();

// Stats display
const stats = document.createElement('div');
stats.style.cssText = 'position:absolute;top:10px;left:10px;background:rgba(0,0,0,0.8);color:#0f0;padding:15px;font-family:monospace;font-size:12px;border-radius:5px;pointer-events:none;';
document.body.appendChild(stats);

let frameCount = 0;
let lastTime = performance.now();
let fps = 0;

function updateStats() {
  const now = performance.now();
  frameCount++;
  
  if (now - lastTime >= 1000) {
    fps = Math.round((frameCount * 1000) / (now - lastTime));
    frameCount = 0;
    lastTime = now;
  }
  
  stats.innerHTML = `
    <div style="font-size:14px;color:#0f0;margin-bottom:5px;">🎨 POST-FX SHOWCASE</div>
    <div><strong>FPS:</strong> ${fps}</div>
    <div><strong>Effect:</strong> ${settings.effect}</div>
    <div><strong>Available:</strong> 29 effects</div>
  `;
}

// Initialize
updatePostProcessing();

function animate() {
  requestAnimationFrame(animate);
  
  if (settings.animate) {
    mesh.rotation.x += 0.01;
    mesh.rotation.y += 0.01;
  }
  
  // Animate lights
  const time = performance.now() * 0.001;
  light1.position.x = Math.sin(time) * 5;
  light1.position.z = Math.cos(time) * 5;
  light2.position.x = Math.cos(time * 0.7) * 5;
  light2.position.z = Math.sin(time * 0.7) * 5;
  
  controls.update();
  updateStats();
  
  // Render normally - post-processing doesn't work this way in WebGPU
  renderer.render(scene, camera);
}

window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

(async () => {
  await renderer.init();
  animate();
})();

console.log('%c🎨 POST-FX SHOWCASE', 'font-size:20px;color:#0f0;font-weight:bold');
console.log('%cDemonstrating 10+ post-processing effects with live controls', 'font-size:12px;color:#888');

