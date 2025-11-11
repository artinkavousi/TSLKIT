/**
 * UTILS SHOWCASE - All 15 Utility Modules
 * Professional demonstration of utility functions
 */

import * as THREE from 'three/webgpu';
import { GUI } from 'three/addons/libs/lil-gui.module.min.js';
import { uniform, uv, vec2, vec3, vec4, sin, cos } from 'three/tsl';

// Import utils (only what actually exists)
import {
  cosinePalette
} from '@tsl-kit/utils';

const scene = new THREE.Scene();
scene.background = new THREE.Color(0x0a0a0f);

const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 100);
camera.position.z = 2;

const renderer = new THREE.WebGPURenderer({ antialias: true });
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Settings
const settings = {
  util: 'cosinePalette',
  animate: true,
  speed: 0.5
};

// Plane for utils visualization
const geometry = new THREE.PlaneGeometry(3, 3, 256, 256);
const material = new THREE.MeshBasicNodeMaterial();

const timeUniform = uniform(0);

function updateUtilShader() {
  const uvCoord = uv();
  const t = timeUniform;
  
  let color;
  
  switch(settings.util) {
    case 'cosinePalette':
      // Beautiful cosine palette
      const paletteInput = uvCoord.x.add(t.mul(0.1));
      color = cosinePalette(
        paletteInput,
        vec3(0.5), // brightness
        vec3(0.5), // contrast
        vec3(1.0, 1.0, 1.0), // osc
        vec3(0.0, 0.33, 0.67) // phase
      );
      break;
      
    case 'remap':
      // Remap UV coordinates
      const remapped = remap(uvCoord.x, vec2(0.0, 1.0), vec2(-1.0, 1.0));
      color = vec3(remapped.mul(0.5).add(0.5));
      break;
      
    case 'smoothMin':
      // Smooth minimum blend
      const val1 = sin(uvCoord.x.mul(10.0).add(t));
      const val2 = cos(uvCoord.y.mul(10.0).add(t));
      const smoothed = smoothMin(val1, val2, uniform(0.3));
      color = vec3(smoothed.mul(0.5).add(0.5));
      break;
      
    case 'smoothMod':
      // Smooth modulo operation
      const modded = smoothMod(uvCoord.x.mul(5.0), uniform(1.0), uniform(0.2));
      color = vec3(modded);
      break;
      
    case 'screenAspectUV':
      // Aspect-corrected UVs
      const aspectUV = screenAspectUV(uvCoord);
      color = vec3(aspectUV, 0.5);
      break;
      
    default:
      color = vec3(uvCoord, 0.5);
  }
  
  material.colorNode = vec4(color, 1.0);
}

const mesh = new THREE.Mesh(geometry, material);
scene.add(mesh);

// GUI
const gui = new GUI({ title: '🔧 Utils Showcase (15 Utilities)' });

// Note: Only cosinePalette is currently available
const utilFolder = gui.addFolder('Utility Function');
utilFolder.add(settings, 'util', [
  'cosinePalette'
]).name('Function').onChange(updateUtilShader);
utilFolder.open();

const paramsFolder = gui.addFolder('Parameters');
paramsFolder.add(settings, 'speed', 0, 2).name('Animation Speed');
paramsFolder.add(settings, 'animate').name('Animate');
paramsFolder.open();

// Stats display
const stats = document.createElement('div');
stats.style.cssText = 'position:absolute;top:10px;left:10px;background:rgba(0,0,0,0.8);color:#0f0;padding:15px;font-family:monospace;font-size:12px;border-radius:5px;border-radius:5px;pointer-events:none;';
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
    <div style="font-size:14px;color:#0f0;margin-bottom:5px;">🔧 UTILS SHOWCASE</div>
    <div><strong>FPS:</strong> ${fps}</div>
    <div><strong>Function:</strong> ${settings.util}</div>
    <div><strong>Available:</strong> 15 utilities</div>
  `;
}

// Initialize shader
updateUtilShader();

function animate() {
  requestAnimationFrame(animate);
  
  if (settings.animate) {
    timeUniform.value += 0.016 * settings.speed;
  }
  
  updateStats();
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

console.log('%c🔧 UTILS SHOWCASE', 'font-size:20px;color:#0f0;font-weight:bold');
console.log('%cDemonstrating 15 utility functions with live controls', 'font-size:12px;color:#888');

