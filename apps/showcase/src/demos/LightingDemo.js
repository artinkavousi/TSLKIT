/**
 * STANDALONE LIGHTING DEMO
 * Showcasing fresnel effect with live controls
 */

import * as THREE from 'three/webgpu';
import { GUI } from 'three/addons/libs/lil-gui.module.min.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { vec3, normalWorld, positionWorld, cameraPosition, normalize, mix, float } from 'three/tsl';
import { fresnel } from '@tsl-kit/lighting';

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
  power: 3.0,
  fresnelR: 0,
  fresnelG: 255,
  fresnelB: 255,
  baseR: 26,
  baseG: 26,
  baseB: 46,
  intensity: 1.5
};

// Create torus knot with fresnel material
const geometry = new THREE.TorusKnotGeometry(0.8, 0.3, 128, 32);
const material = new THREE.MeshBasicNodeMaterial();

function updateMaterial() {
  const viewDir = normalize(cameraPosition.sub(positionWorld));
  const normal = normalWorld;
  
  const fresnelValue = fresnel(viewDir, normal, float(settings.power));
  const fresnelCol = vec3(settings.fresnelR / 255, settings.fresnelG / 255, settings.fresnelB / 255);
  const baseCol = vec3(settings.baseR / 255, settings.baseG / 255, settings.baseB / 255);
  
  material.colorNode = mix(baseCol, fresnelCol.mul(settings.intensity), fresnelValue);
}

updateMaterial();

const mesh = new THREE.Mesh(geometry, material);
scene.add(mesh);

// GUI
const gui = new GUI({ title: '💡 Lighting Demo (Fresnel)' });

const fresnelFolder = gui.addFolder('Fresnel Parameters');
fresnelFolder.add(settings, 'power', 0.1, 10, 0.1).name('Power').onChange(updateMaterial);
fresnelFolder.add(settings, 'intensity', 0, 5, 0.1).name('Intensity').onChange(updateMaterial);
fresnelFolder.open();

const fresnelColorFolder = gui.addFolder('Fresnel Color');
fresnelColorFolder.add(settings, 'fresnelR', 0, 255, 1).name('R').onChange(updateMaterial);
fresnelColorFolder.add(settings, 'fresnelG', 0, 255, 1).name('G').onChange(updateMaterial);
fresnelColorFolder.add(settings, 'fresnelB', 0, 255, 1).name('B').onChange(updateMaterial);
fresnelColorFolder.open();

const baseColorFolder = gui.addFolder('Base Color');
baseColorFolder.add(settings, 'baseR', 0, 255, 1).name('R').onChange(updateMaterial);
baseColorFolder.add(settings, 'baseG', 0, 255, 1).name('G').onChange(updateMaterial);
baseColorFolder.add(settings, 'baseB', 0, 255, 1).name('B').onChange(updateMaterial);
baseColorFolder.open();

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
    <div style="font-size:14px;color:#0f0;margin-bottom:5px;">💡 LIGHTING DEMO</div>
    <div><strong>FPS:</strong> ${fps}</div>
    <div><strong>Effect:</strong> Fresnel</div>
  `;
}

// Animation
function animate() {
  requestAnimationFrame(animate);
  
  mesh.rotation.x += 0.003;
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
  console.log('%c💡 LIGHTING DEMO', 'font-size:20px;color:#0f0;font-weight:bold');
  console.log('%cDemonstrating Fresnel effect with live controls', 'font-size:12px;color:#888');
  animate();
})();
