/**
 * STANDALONE NOISE DEMO
 * Showcasing simplex noise 3D with live controls
 */

import * as THREE from 'three/webgpu';
import { GUI } from 'three/addons/libs/lil-gui.module.min.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { uniform, uv, vec3, vec4, sin, cos } from 'three/tsl';
import { simplexNoise3d } from '@tsl-kit/noise';

const scene = new THREE.Scene();
scene.background = new THREE.Color(0x0a0a0f);

const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 100);
camera.position.z = 3;

const renderer = new THREE.WebGPURenderer({ antialias: true });
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;

const settings = {
  frequency: 2.0,
  amplitude: 1.0,
  speed: 0.5,
  colorize: true,
  animate: true
};

// Manual time tracking
const timeUniform = uniform(0);

// Create sphere with noise material
const geometry = new THREE.SphereGeometry(1, 128, 128);
const material = new THREE.MeshBasicNodeMaterial();

function updateNoiseShader() {
  const animTime = timeUniform.mul(uniform(settings.speed));
  const uvCoord = uv();
  
  // Convert UV to 3D position
  const theta = uvCoord.x.mul(Math.PI * 2);
  const phi = uvCoord.y.mul(Math.PI);
  const pos = vec3(
    sin(phi).mul(cos(theta)),
    sin(phi).mul(sin(theta)),
    cos(phi)
  ).mul(uniform(settings.frequency));
  
  // Add time animation
  const noisePos = vec3(pos.x, pos.y, pos.z.add(animTime));
  const noise = simplexNoise3d(noisePos).mul(uniform(settings.amplitude));
  
  if (settings.colorize) {
    const r = noise.add(1).div(2);
    const g = sin(noise.mul(3.14159)).add(1).div(2);
    const b = cos(noise.mul(3.14159)).add(1).div(2);
    material.colorNode = vec4(r, g, b, 1.0);
  } else {
    const gray = noise.add(1).div(2);
    material.colorNode = vec4(gray, gray, gray, 1.0);
  }
}

updateNoiseShader();

const mesh = new THREE.Mesh(geometry, material);
scene.add(mesh);

// Lighting
const light = new THREE.DirectionalLight(0xffffff, 3);
light.position.set(2, 2, 2);
scene.add(light);
scene.add(new THREE.AmbientLight(0x404040, 2));

// GUI
const gui = new GUI({ title: '🌊 Noise Demo (Simplex 3D)' });
const noiseFolder = gui.addFolder('Noise Parameters');
noiseFolder.add(settings, 'frequency', 0.1, 10, 0.1).name('Frequency').onChange(updateNoiseShader);
noiseFolder.add(settings, 'amplitude', 0, 5, 0.1).name('Amplitude').onChange(updateNoiseShader);
noiseFolder.add(settings, 'speed', 0, 2, 0.1).name('Speed').onChange(updateNoiseShader);
noiseFolder.add(settings, 'colorize').name('Colorize').onChange(updateNoiseShader);
noiseFolder.add(settings, 'animate').name('Animate');
noiseFolder.open();

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
    <div style="font-size:14px;color:#0f0;margin-bottom:5px;">🌊 NOISE DEMO</div>
    <div><strong>FPS:</strong> ${fps}</div>
    <div><strong>Noise:</strong> Simplex 3D</div>
  `;
}

// Animation
function animate() {
  requestAnimationFrame(animate);
  
  if (settings.animate) {
    timeUniform.value += 0.016 * settings.speed;
  }
  
  mesh.rotation.y += 0.002;
  
  controls.update();
  updateStats();
  renderer.render(scene, camera);
}

// Handle resize
window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

// Start
(async () => {
  await renderer.init();
  console.log('%c🌊 NOISE DEMO', 'font-size:20px;color:#0f0;font-weight:bold');
  console.log('%cDemonstrating Simplex Noise 3D with live controls', 'font-size:12px;color:#888');
  animate();
})();
