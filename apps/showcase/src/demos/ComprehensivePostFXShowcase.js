/**
 * COMPREHENSIVE POST-FX SHOWCASE
 * Demonstrates bloom, vignette, film grain, tonemapping
 */

import * as THREE from 'three/webgpu';
import { PostProcessing } from 'three/webgpu';
import { GUI } from 'three/addons/libs/lil-gui.module.min.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { pass, uniform, Fn, vec4, vec3, float, smoothstep, length, uv, sin } from 'three/tsl';
import { vignetteEffect, filmGrainEffect } from '@tsl-kit/postfx';

const scene = new THREE.Scene();
scene.background = new THREE.Color(0x000000);

const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 100);
camera.position.z = 5;

const renderer = new THREE.WebGPURenderer({ antialias: true });
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;

const settings = {
  effect: 'bloom',
  bloomStrength: 0.5,
  vignetteStrength: 0.5,
  grainAmount: 0.05,
  exposure: 1.5
};

// Scene objects
const geometry = new THREE.TorusKnotGeometry(1, 0.3, 128, 32);
const material = new THREE.MeshStandardNodeMaterial({ 
  color: 0xff6600,
  emissive: 0xff6600,
  emissiveIntensity: 1.5,
  metalness: 0.5,
  roughness: 0.2
});

const mesh = new THREE.Mesh(geometry, material);
scene.add(mesh);

// Lights
const light1 = new THREE.PointLight(0x00ff88, 50, 20);
light1.position.set(3, 0, 0);
scene.add(light1);

const light2 = new THREE.PointLight(0xff0088, 50, 20);
light2.position.set(-3, 0, 0);
scene.add(light2);

scene.add(new THREE.AmbientLight(0x404040, 0.5));

// Post-processing
let postProcessing = null;

function setupPostProcessing() {
  const scenePass = pass(scene, camera);
  const sceneColor = scenePass.getTextureNode('output');
  
  const effectNode = Fn(() => {
    let color = sceneColor;
    const uvCoord = uv();
    
    // Apply selected effect
    if (settings.effect === 'bloom') {
      const lum = color.r.mul(0.299).add(color.g.mul(0.587)).add(color.b.mul(0.114));
      const bloomMask = smoothstep(0.5, 0.6, lum);
      const bloomColor = color.mul(bloomMask).mul(uniform(settings.bloomStrength).mul(2.0));
      color = color.add(bloomColor);
    } 
    else if (settings.effect === 'vignette') {
      const vignette = vignetteEffect(uvCoord.sub(0.5));
      const vignetted = color.rgb.mul(vignette.mul(uniform(settings.vignetteStrength)));
      color = vec4(vignetted, color.a);
    }
    else if (settings.effect === 'filmGrain') {
      const grain = filmGrainEffect(uvCoord);
      const grained = color.rgb.add(grain.mul(uniform(settings.grainAmount)));
      color = vec4(grained, color.a);
    }
    
    return vec4(color.rgb.mul(uniform(settings.exposure)), color.a);
  });
  
  postProcessing = new PostProcessing(renderer);
  postProcessing.outputNode = effectNode();
}

// GUI
const gui = new GUI({ title: '🎨 Comprehensive Post-FX' });

gui.add(settings, 'effect', ['bloom', 'vignette', 'filmGrain']).name('Effect').onChange(setupPostProcessing);

const bloomFolder = gui.addFolder('Bloom');
bloomFolder.add(settings, 'bloomStrength', 0, 3, 0.01).name('Strength').onChange(setupPostProcessing);

const vignetteFolder = gui.addFolder('Vignette');
vignetteFolder.add(settings, 'vignetteStrength', 0, 2, 0.01).name('Strength').onChange(setupPostProcessing);

const grainFolder = gui.addFolder('Film Grain');
grainFolder.add(settings, 'grainAmount', 0, 0.2, 0.001).name('Amount').onChange(setupPostProcessing);

gui.add(settings, 'exposure', 0, 3, 0.1).name('Exposure').onChange(setupPostProcessing);

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
    <div style="font-size:14px;color:#0f0;margin-bottom:5px;">🎨 POST-FX</div>
    <div><strong>FPS:</strong> ${fps}</div>
    <div><strong>Effect:</strong> ${settings.effect}</div>
  `;
}

function animate() {
  requestAnimationFrame(animate);
  
  const time = performance.now() * 0.001;
  
  mesh.rotation.x += 0.003;
  mesh.rotation.y += 0.002;
  
  light1.position.x = Math.sin(time) * 3;
  light1.position.z = Math.cos(time) * 3;
  
  light2.position.x = Math.cos(time * 0.7) * 3;
  light2.position.z = Math.sin(time * 0.7) * 3;
  
  controls.update();
  updateStats();
  
  if (postProcessing) {
    postProcessing.render();
  }
}

window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

(async () => {
  await renderer.init();
  setupPostProcessing();
  console.log('%c🎨 COMPREHENSIVE POST-FX', 'font-size:20px;color:#0f0;font-weight:bold');
  animate();
})();

