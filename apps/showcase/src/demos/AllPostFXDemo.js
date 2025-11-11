/**
 * STANDALONE ALL POST-FX DEMO
 * Properly showcasing bloom with WebGPU PostProcessing pipeline
 */

import * as THREE from 'three/webgpu';
import { PostProcessing } from 'three/webgpu';
import { GUI } from 'three/addons/libs/lil-gui.module.min.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { pass, uniform, Fn, vec4, float, mix, smoothstep, length, vec3 } from 'three/tsl';

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
  bloomStrength: 0.5,
  bloomThreshold: 0.5,
  exposure: 1.5
};

// Create emissive geometry
const geometry = new THREE.IcosahedronGeometry(1.5, 2);
const material = new THREE.MeshStandardNodeMaterial({ 
  color: 0xff6600,
  emissive: 0xff6600,
  emissiveIntensity: 1.5,
  metalness: 0.5,
  roughness: 0.2
});

const mesh = new THREE.Mesh(geometry, material);
scene.add(mesh);

// Add point lights for visual interest
const light1 = new THREE.PointLight(0x00ff88, 50, 20);
light1.position.set(3, 0, 0);
scene.add(light1);

const light2 = new THREE.PointLight(0xff0088, 50, 20);
light2.position.set(-3, 0, 0);
scene.add(light2);

const ambientLight = new THREE.AmbientLight(0x404040, 0.5);
scene.add(ambientLight);

// Post-processing setup
let postProcessing = null;

function setupPostProcessing() {
  const scenePass = pass(scene, camera);
  const sceneColor = scenePass.getTextureNode('output');
  
  // Simple bloom effect using TSL
  const bloomEffect = Fn(() => {
    const color = sceneColor;
    
    // Calculate luminance
    const lum = color.r.mul(0.299).add(color.g.mul(0.587)).add(color.b.mul(0.114));
    
    // Threshold
    const bloomMask = smoothstep(
      uniform(settings.bloomThreshold), 
      uniform(settings.bloomThreshold).add(0.1), 
      lum
    );
    
    // Create bloom glow
    const bloomColor = color.mul(bloomMask).mul(uniform(settings.bloomStrength).mul(2.0));
    
    // Mix with original
    const finalColor = color.add(bloomColor);
    
    return vec4(finalColor.rgb.mul(uniform(settings.exposure)), color.a);
  });
  
  postProcessing = new PostProcessing(renderer);
  postProcessing.outputNode = bloomEffect();
}

function updatePostProcessing() {
  if (postProcessing) {
    setupPostProcessing();
  }
}

// GUI
const gui = new GUI({ title: '🎨 All Post-FX Demo (Bloom)' });

const bloomFolder = gui.addFolder('Bloom Parameters');
bloomFolder.add(settings, 'bloomStrength', 0, 3, 0.01).name('Strength').onChange(updatePostProcessing);
bloomFolder.add(settings, 'bloomThreshold', 0, 1, 0.01).name('Threshold').onChange(updatePostProcessing);
bloomFolder.open();

const renderFolder = gui.addFolder('Rendering');
renderFolder.add(settings, 'exposure', 0, 3, 0.1).name('Exposure').onChange(updatePostProcessing);
renderFolder.open();

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
    <div style="font-size:14px;color:#0f0;margin-bottom:5px;">🎨 POST-FX DEMO</div>
    <div><strong>FPS:</strong> ${fps}</div>
    <div><strong>Effect:</strong> Bloom</div>
  `;
}

// Animation
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
  
  // Render with post-processing
  if (postProcessing) {
    postProcessing.render();
  }
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
  setupPostProcessing();
  console.log('%c🎨 ALL POST-FX DEMO', 'font-size:20px;color:#0f0;font-weight:bold');
  console.log('%cDemonstrating Bloom effect with live controls', 'font-size:12px;color:#888');
  animate();
})();
