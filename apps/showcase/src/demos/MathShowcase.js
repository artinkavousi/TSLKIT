/**
 * MATH SHOWCASE - Bayer Dithering Matrix
 * Professional demonstration of Bayer dithering for ordered dithering effects
 */

import * as THREE from 'three/webgpu';
import { GUI } from 'three/addons/libs/lil-gui.module.min.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { uniform, uv, vec3, vec4, Fn, float } from 'three/tsl';
import { bayerMatrix } from '@tsl-kit/math';

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
  ditherStrength: 0.5,
  levels: 8,
  showOriginal: false,
  animate: true
};

// Create sphere with Bayer dithering shader
const geometry = new THREE.SphereGeometry(1, 128, 128);
const material = new THREE.MeshBasicNodeMaterial();

function updateShader() {
  const bayerShader = Fn(() => {
    const uvCoord = uv();
    
    // Create gradient color
    const gradient = uvCoord.y;
    const color = vec3(gradient, gradient.mul(0.5).add(0.3), gradient.mul(0.2).add(0.8));
    
    // Apply Bayer dithering for quantization
    if (!settings.showOriginal) {
      const bayerValue = bayerMatrix(uvCoord.mul(vec3(200.0)));
      
      // Quantize to N levels with dither threshold
      const levels = uniform(settings.levels);
      const ditherStrength = uniform(settings.ditherStrength);
      
      const quantized = color.mul(levels).add(bayerValue.mul(ditherStrength).sub(0.5));
      const dithered = quantized.floor().div(levels);
      
      return vec4(dithered, 1.0);
    } else {
      return vec4(color, 1.0);
    }
  });
  
  material.colorNode = bayerShader();
}

updateShader();

const mesh = new THREE.Mesh(geometry, material);
scene.add(mesh);

// Lighting
const light = new THREE.DirectionalLight(0xffffff, 3);
light.position.set(2, 2, 2);
scene.add(light);
scene.add(new THREE.AmbientLight(0x404040, 2));

// GUI
const gui = new GUI({ title: '🔢 Math Showcase (Bayer Dithering)' });

const bayerFolder = gui.addFolder('Bayer Dithering');
bayerFolder.add(settings, 'showOriginal').name('Show Original').onChange(updateShader);
bayerFolder.add(settings, 'ditherStrength', 0, 2, 0.1).name('Dither Strength').onChange(updateShader);
bayerFolder.add(settings, 'levels', 2, 32, 1).name('Color Levels').onChange(updateShader);
bayerFolder.open();

const animFolder = gui.addFolder('Animation');
animFolder.add(settings, 'animate').name('Auto Rotate');
animFolder.open();

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
    <div style="font-size:14px;color:#0f0;margin-bottom:5px;">🔢 MATH SHOWCASE</div>
    <div><strong>FPS:</strong> ${fps}</div>
    <div><strong>Effect:</strong> Bayer Dithering</div>
    <div><strong>Levels:</strong> ${settings.levels}</div>
  `;
}

// Animation
function animate() {
  requestAnimationFrame(animate);
  
  if (settings.animate) {
    mesh.rotation.y += 0.002;
  }
  
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
  console.log('%c🔢 MATH SHOWCASE', 'font-size:20px;color:#0f0;font-weight:bold');
  console.log('%cDemonstrating Bayer dithering matrix for ordered dithering', 'font-size:12px;color:#888');
  animate();
})();

