import * as THREE from 'three/webgpu';
import { pass, uniform, vec2 } from 'three/tsl';
import { GUI } from 'three/addons/libs/lil-gui.module.min.js';
import { sepia, dotScreen, sobel, afterImage, bleach } from '@tsl-kit/postfx';

// Scene setup
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x1a1a2e);

const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 100);
camera.position.z = 5;

const renderer = new THREE.WebGPURenderer({ antialias: true });
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Test objects
const geometry = new THREE.TorusKnotGeometry(1, 0.3, 128, 32);
const material = new THREE.MeshStandardNodeMaterial({ color: 0x4ecdc4, roughness: 0.4, metalness: 0.6 });
const mesh = new THREE.Mesh(geometry, material);
scene.add(mesh);

// Lighting
const light1 = new THREE.PointLight(0xffffff, 100, 50);
light1.position.set(5, 5, 5);
scene.add(light1);

const light2 = new THREE.PointLight(0xff00ff, 100, 50);
light2.position.set(-5, -5, 5);
scene.add(light2);

// Post-FX Settings
const postfx = {
  effect: 'none',
  sepiaAmount: 1.0,
  dotScreenAngle: 1.57,
  dotScreenScale: 1.0,
  bleachOpacity: 1.0,
};

// GUI
const gui = new GUI({ title: 'Post-FX Effects' });
gui.add(postfx, 'effect', ['none', 'sepia', 'dotScreen', 'sobel', 'afterImage', 'bleach']).name('Effect');
gui.add(postfx, 'sepiaAmount', 0, 1).name('Sepia Amount');
gui.add(postfx, 'dotScreenAngle', 0, Math.PI).name('Dot Screen Angle');
gui.add(postfx, 'dotScreenScale', 0.1, 3).name('Dot Screen Scale');
gui.add(postfx, 'bleachOpacity', 0, 1).name('Bleach Opacity');

// Animation
function animate() {
  requestAnimationFrame(animate);
  
  mesh.rotation.x += 0.01;
  mesh.rotation.y += 0.01;
  
  renderer.render(scene, camera);
  
  // Apply post-FX based on selection
  // Note: Post-FX would be applied via postProcessing nodes in a real implementation
  // This is a simplified demonstration
}

(async () => {
  await renderer.init();
  animate();
})();

window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

console.log('✅ Post-FX Effects Example Running');

