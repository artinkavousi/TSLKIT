/**
 * NOISE SHOWCASE - All 10 Available Noise Functions
 * Professional demonstration of every noise module in TSL-Kit
 */

import * as THREE from 'three/webgpu';
import { GUI } from 'three/addons/libs/lil-gui.module.min.js';
import { 
  uniform,
  uv,
  vec2,
  vec3,
  vec4,
  sin,
  cos
} from 'three/tsl';

// Import ALL available noise functions (checking actual exports)
import {
  classicNoise3d,
  curlNoise3d,
  curlNoise4d,
  fbm,
  perlinNoise3d,
  simplexNoise2d,
  simplexNoise3d,
  simplexNoise4d,
  turbulence,
  voronoi
} from '@tsl-kit/noise';

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
  noiseType: 'simplexNoise2d',
  scale: 3.0,
  speed: 0.5,
  octaves: 4,
  lacunarity: 2.0,
  gain: 0.5,
  animate: true,
  colorize: true
};

// Uniforms
const scaleUniform = uniform(settings.scale);
const speedUniform = uniform(settings.speed);
const timeUniform = uniform(0); // Manual time tracking

// Plane for noise visualization
const geometry = new THREE.PlaneGeometry(3, 3, 256, 256);
const material = new THREE.MeshBasicNodeMaterial();

// Function to build shader based on selected noise
function updateNoiseShader() {
  const uvCoord = uv().mul(scaleUniform);
  const t = timeUniform.mul(speedUniform);
  
  let noiseValue;
  
  switch(settings.noiseType) {
    case 'simplexNoise2d':
      noiseValue = simplexNoise2d(uvCoord);
      break;
      
    case 'simplexNoise3d':
      noiseValue = simplexNoise3d(vec3(uvCoord, t));
      break;
      
    case 'simplexNoise4d':
      noiseValue = simplexNoise4d(vec4(uvCoord, t, t.mul(0.5)));
      break;
      
    case 'perlinNoise3d':
      noiseValue = perlinNoise3d(vec3(uvCoord, t));
      break;
      
    case 'classicNoise3d':
      noiseValue = classicNoise3d(vec3(uvCoord, t));
      break;
      
    case 'voronoi':
      const vor = voronoi(uvCoord.mul(5.0));
      noiseValue = vor;
      break;
      
    case 'fbm':
      noiseValue = fbm(
        vec3(uvCoord, t),
        uniform(settings.octaves),
        uniform(settings.lacunarity),
        uniform(settings.gain)
      );
      break;
      
    case 'turbulence':
      noiseValue = turbulence(
        vec3(uvCoord, t),
        uniform(settings.octaves),
        uniform(settings.lacunarity),
        uniform(settings.gain)
      );
      break;
      
    case 'curlNoise3d':
      const curl = curlNoise3d(vec3(uvCoord, t));
      noiseValue = curl.length();
      break;
      
    case 'curlNoise4d':
      const curl4 = curlNoise4d(vec4(uvCoord, t, t.mul(0.5)));
      noiseValue = curl4.length();
      break;
      
    default:
      noiseValue = simplexNoise2d(uvCoord);
  }
  
  // Colorize or grayscale
  if (settings.colorize) {
    // Rainbow colorization
    const r = sin(noiseValue.mul(3.14159).add(0.0)).mul(0.5).add(0.5);
    const g = sin(noiseValue.mul(3.14159).add(2.094)).mul(0.5).add(0.5);
    const b = sin(noiseValue.mul(3.14159).add(4.189)).mul(0.5).add(0.5);
    material.colorNode = vec4(r, g, b, 1.0);
  } else {
    // Grayscale
    const gray = noiseValue.mul(0.5).add(0.5);
    material.colorNode = vec4(gray, gray, gray, 1.0);
  }
}

const mesh = new THREE.Mesh(geometry, material);
scene.add(mesh);

// GUI
const gui = new GUI({ title: '🌊 Noise Showcase (10 Types)' });

const noiseFolder = gui.addFolder('Noise Type');
noiseFolder.add(settings, 'noiseType', [
  'simplexNoise2d',
  'simplexNoise3d',
  'simplexNoise4d',
  'perlinNoise3d',
  'classicNoise3d',
  'voronoi',
  'fbm',
  'turbulence',
  'curlNoise3d',
  'curlNoise4d'
]).name('Type').onChange(updateNoiseShader);
noiseFolder.open();

const paramsFolder = gui.addFolder('Parameters');
paramsFolder.add(settings, 'scale', 0.5, 10).onChange(v => scaleUniform.value = v);
paramsFolder.add(settings, 'speed', 0, 2);
paramsFolder.add(settings, 'animate').name('Animate');
paramsFolder.add(settings, 'colorize').name('Colorize').onChange(updateNoiseShader);
paramsFolder.open();

const fbmFolder = gui.addFolder('FBM/Turbulence Settings');
fbmFolder.add(settings, 'octaves', 1, 8, 1).onChange(updateNoiseShader);
fbmFolder.add(settings, 'lacunarity', 1, 4).onChange(updateNoiseShader);
fbmFolder.add(settings, 'gain', 0, 1).onChange(updateNoiseShader);

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
    <div style="font-size:14px;color:#0f0;margin-bottom:5px;">🌊 NOISE SHOWCASE</div>
    <div><strong>FPS:</strong> ${fps}</div>
    <div><strong>Type:</strong> ${settings.noiseType}</div>
    <div><strong>Scale:</strong> ${settings.scale.toFixed(2)}</div>
    <div><strong>Speed:</strong> ${settings.speed.toFixed(2)}</div>
    ${settings.noiseType === 'fbm' || settings.noiseType === 'turbulence' ? 
      `<div><strong>Octaves:</strong> ${settings.octaves}</div>` : ''}
  `;
}

// Initialize shader
updateNoiseShader();

function animate() {
  requestAnimationFrame(animate);
  
  // Update time uniform
  if (settings.animate) {
    timeUniform.value += 0.016 * settings.speed; // ~60fps
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

console.log('%c🌊 NOISE SHOWCASE', 'font-size:20px;color:#0f0;font-weight:bold');
console.log('%cDemonstrating 10 noise functions with live controls', 'font-size:12px;color:#888');

