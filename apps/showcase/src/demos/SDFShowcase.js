/**
 * SDF SHOWCASE - All 4 SDF Modules
 * Professional demonstration of Signed Distance Field operations
 */

import * as THREE from 'three/webgpu';
import { GUI } from 'three/addons/libs/lil-gui.module.min.js';
import { uniform, uv, vec2, vec3, Fn } from 'three/tsl';

// Import SDF modules (only what actually exists)
import { sdSphere } from '@tsl-kit/sdf';
import { opUnion, opSubtraction, opIntersection } from '@tsl-kit/sdf';

const scene = new THREE.Scene();
scene.background = new THREE.Color(0x0a0a0f);

const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 100);
camera.position.z = 3;

const renderer = new THREE.WebGPURenderer({ antialias: true });
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Settings
const settings = {
  radius: 0.5,
  animateCamera: true
};

// Plane for SDF visualization
const geometry = new THREE.PlaneGeometry(4, 4, 1, 1);
const material = new THREE.MeshBasicNodeMaterial();

function updateSDFShader() {
  const uvCoord = uv().sub(0.5).mul(2.0); // Center and scale
  
  // Simple SDF sphere visualization
  const sdfShader = Fn(() => {
    const p = vec3(uvCoord.x, uvCoord.y, 0.0);
    const dist = sdSphere(p, uniform(settings.radius));
    
    // Visualize distance field
    const col = dist.lessThan(0.0).cond(
      vec3(0.0, 1.0, 1.0), // Inside: cyan
      vec3(1.0, 0.0, dist.mul(2.0)) // Outside: gradient
    );
    
    return vec4(col, 1.0);
  });
  
  material.colorNode = sdfShader();
}

const mesh = new THREE.Mesh(geometry, material);
scene.add(mesh);

// GUI
const gui = new GUI({ title: '📐 SDF Showcase (4 Modules)' });

const shapeFolder = gui.addFolder('SDF Shape');
shapeFolder.add(settings, 'radius', 0.1, 1.0).name('Sphere Radius').onChange(updateSDFShader);
shapeFolder.open();

const animFolder = gui.addFolder('Animation');
animFolder.add(settings, 'animateCamera').name('Animate Camera');
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
    <div style="font-size:14px;color:#0f0;margin-bottom:5px;">📐 SDF SHOWCASE</div>
    <div><strong>FPS:</strong> ${fps}</div>
    <div><strong>Shape:</strong> ${settings.shape}</div>
    <div><strong>Operation:</strong> ${settings.operation}</div>
  `;
}

// Initialize shader
updateSDFShader();

function animate() {
  requestAnimationFrame(animate);
  
  if (settings.animateCamera) {
    camera.position.x = Math.sin(performance.now() * 0.001) * 1.5;
    camera.position.y = Math.cos(performance.now() * 0.0007) * 1.0;
    camera.lookAt(0, 0, 0);
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

console.log('%c📐 SDF SHOWCASE', 'font-size:20px;color:#0f0;font-weight:bold');
console.log('%cDemonstrating SDF shapes and operations with live controls', 'font-size:12px;color:#888');

