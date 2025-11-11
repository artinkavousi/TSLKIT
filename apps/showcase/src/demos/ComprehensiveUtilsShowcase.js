/**
 * COMPREHENSIVE UTILS SHOWCASE
 * Demonstrates remap, smoothMin, cosinePalette, coordinates
 */

import * as THREE from 'three/webgpu';
import { GUI } from 'three/addons/libs/lil-gui.module.min.js';
import { uniform, uv, vec3, vec4, Fn, float } from 'three/tsl';
import { cosinePalette } from '@tsl-kit/utils';
import { remapNode } from '@tsl-kit/utils/remap';
import { smoothmin } from '@tsl-kit/utils/smoothMin';

const scene = new THREE.Scene();
scene.background = new THREE.Color(0x0a0a0f);

const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 100);
camera.position.z = 2;

const renderer = new THREE.WebGPURenderer({ antialias: true });
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const settings = {
  util: 'cosinePalette',
  speed: 0.5,
  animate: true
};

const timeUniform = uniform(0);

const geometry = new THREE.PlaneGeometry(2, 2);
const material = new THREE.MeshBasicNodeMaterial();

function updateShader() {
  const utilShader = Fn(() => {
    const uvCoord = uv().sub(0.5).mul(2.0);
    const t = timeUniform.mul(uniform(settings.speed));
    let color = vec3(0);
    
    switch(settings.util) {
      case 'cosinePalette':
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
        const value = uvCoord.x;
        const remapped = remapNode(value, float(-1.0), float(1.0), float(0.0), float(1.0));
        color = vec3(remapped, remapped.mul(0.5), remapped.mul(0.2).add(0.5));
        break;
        
      case 'smoothMin':
        const dist1 = uvCoord.x.mul(uvCoord.x).add(uvCoord.y.mul(uvCoord.y)).sub(0.3);
        const dist2 = uvCoord.x.add(0.3).mul(uvCoord.x.add(0.3)).add(uvCoord.y.mul(uvCoord.y)).sub(0.3);
        const smoothed = smoothmin(dist1, dist2, float(0.3));
        color = vec3(smoothed.add(0.5));
        break;
        
      default:
        color = vec3(uvCoord, 0.5);
    }
    
    return vec4(color, 1.0);
  });
  
  material.colorNode = utilShader();
}

updateShader();

const mesh = new THREE.Mesh(geometry, material);
scene.add(mesh);

// GUI
const gui = new GUI({ title: '🔧 Comprehensive Utils Showcase' });

gui.add(settings, 'util', ['cosinePalette', 'remap', 'smoothMin']).name('Utility').onChange(updateShader);
gui.add(settings, 'speed', 0, 2, 0.1).name('Speed').onChange(updateShader);
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
    <div style="font-size:14px;color:#0f0;margin-bottom:5px;">🔧 UTILS SHOWCASE</div>
    <div><strong>FPS:</strong> ${fps}</div>
    <div><strong>Utility:</strong> ${settings.util}</div>
  `;
}

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
  console.log('%c🔧 COMPREHENSIVE UTILS SHOWCASE', 'font-size:20px;color:#0f0;font-weight:bold');
  animate();
})();

