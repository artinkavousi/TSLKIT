import * as THREE from 'three/webgpu';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { tiledLights } from '@tsl-kit/lighting';

const scene = new THREE.Scene();
scene.background = new THREE.Color(0x050510);

const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 100);
camera.position.set(0, 10, 20);

const renderer = new THREE.WebGPURenderer({ antialias: true });
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;

// Ground
const ground = new THREE.Mesh(
  new THREE.PlaneGeometry(50, 50),
  new THREE.MeshStandardNodeMaterial({ color: 0x222222, roughness: 0.8 })
);
ground.rotation.x = -Math.PI / 2;
scene.add(ground);

// Objects
for (let i = 0; i < 20; i++) {
  const mesh = new THREE.Mesh(
    new THREE.SphereGeometry(0.5, 32, 32),
    new THREE.MeshStandardNodeMaterial({ color: 0xcccccc, roughness: 0.3, metalness: 0.7 })
  );
  mesh.position.set(
    (Math.random() - 0.5) * 30,
    Math.random() * 3 + 0.5,
    (Math.random() - 0.5) * 30
  );
  scene.add(mesh);
}

// Create 200 point lights
for (let i = 0; i < 200; i++) {
  const color = new THREE.Color().setHSL(Math.random(), 1.0, 0.5);
  const light = new THREE.PointLight(color, 5, 10, 2);
  light.position.set(
    (Math.random() - 0.5) * 40,
    Math.random() * 5 + 1,
    (Math.random() - 0.5) * 40
  );
  scene.add(light);
}

function animate() {
  requestAnimationFrame(animate);
  
  controls.update();
  renderer.render(scene, camera);
}

(async () => {
  await renderer.init();
  animate();
})();

console.log('✅ Tiled Lighting Example Running');

