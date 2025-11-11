/**
 * COMPREHENSIVE SDF SHOWCASE
 * Demonstrates all SDF shapes: sphere, box, hexagon, torus
 */

import * as THREE from 'three/webgpu';
import { GUI } from 'three/addons/libs/lil-gui.module.min.js';
import { uniform, uv, vec3, vec4, Fn, float, length, select } from 'three/tsl';
import { sdSphere, sdBox2d, sdHexagon, sdDiamond } from '@tsl-kit/sdf';

const scene = new THREE.Scene();
scene.background = new THREE.Color(0x0a0a0f);

const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 100);
camera.position.z = 2;

const renderer = new THREE.WebGPURenderer({ antialias: true });
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const settings = {
  shape: 'sphere',
  size: 0.5,
  animate: true
};

const timeUniform = uniform(0);

const geometry = new THREE.PlaneGeometry(2, 2);
const material = new THREE.MeshBasicNodeMaterial();

function updateShader() {
  const sdfShader = Fn(() => {
    const uvCoord = uv().sub(0.5).mul(2.0);
    const t = timeUniform.mul(0.5);
    let dist;
    
    switch(settings.shape) {
      case 'sphere':
        dist = sdSphere(uvCoord, uniform(settings.size));
        break;
      case 'box':
        dist = sdBox2d(uvCoord, uniform(settings.size));
        break;
      case 'hexagon':
        dist = sdHexagon(uvCoord, uniform(settings.size));
        break;
      case 'diamond':
        dist = sdDiamond(uvCoord, uniform(settings.size));
        break;
      default:
        dist = sdSphere(uvCoord, uniform(settings.size));
    }
    
    // Visualize SDF
    const col = select(
      dist.lessThan(0.0),
      vec3(0.0, 1.0, 1.0), // Inside: cyan
      vec3(1.0, dist.mul(2.0), 0.0) // Outside: gradient
    );
    
    return vec4(col, 1.0);
  });
  
  material.colorNode = sdfShader();
}

updateShader();

const mesh = new THREE.Mesh(geometry, material);
scene.add(mesh);

// GUI
const gui = new GUI({ title: '📐 Comprehensive SDF Showcase' });

gui.add(settings, 'shape', ['sphere', 'box', 'hexagon', 'diamond']).name('Shape').onChange(updateShader);
gui.add(settings, 'size', 0.1, 1.0, 0.01).name('Size').onChange(updateShader);
gui.add(settings, 'animate').name('Animate');

// Stats
const stats = document.createElement('div');
stats.style.cssText = 'position:absolute;top:10px;left:10px;background:rgba(0,0,0,0.8);color:#0f0;padding:15px;font-family:monospace;font-size:12px;border-radius:5px;';
document.body.appendChild(stats);

let fps = 0;
let frameCount = 0;
let lastTime = performance.now();

function updateStats() {
  const now = performance.now();
  frameCount++;
  
  if (now - lastTime >= 1000) {
    fps = Math.round((frameCount * 1000) / (now - lastTime));
    frameCount = 0;
    lastTime = now;
  }
  
  stats.innerHTML = `
    <div style="font-size:14px;color:#0f0;margin-bottom:5px;">📐 SDF SHOWCASE</div>
    <div><strong>FPS:</strong> ${fps}</div>
    <div><strong>Shape:</strong> ${settings.shape}</div>
  `;
}

function animate() {
  requestAnimationFrame(animate);
  
  if (settings.animate) {
    timeUniform.value += 0.016;
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
  console.log('%c📐 COMPREHENSIVE SDF SHOWCASE', 'font-size:20px;color:#0f0;font-weight:bold');
  animate();
})();

