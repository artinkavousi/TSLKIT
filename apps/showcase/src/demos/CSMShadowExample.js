import * as THREE from 'three/webgpu';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { CSMShadowNode } from '@tsl-kit/shadows';

const scene = new THREE.Scene();
scene.background = new THREE.Color(0x87ceeb);
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 500);
camera.position.set(15, 10, 15);

const renderer = new THREE.WebGPURenderer({ antialias: true });
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;

// Ground
const ground = new THREE.Mesh(
  new THREE.PlaneGeometry(100, 100),
  new THREE.MeshStandardNodeMaterial({ color: 0x7cfc00 })
);
ground.rotation.x = -Math.PI / 2;
ground.receiveShadow = true;
scene.add(ground);

// Objects
for (let i = 0; i < 10; i++) {
  const mesh = new THREE.Mesh(
    new THREE.BoxGeometry(2, 2, 2),
    new THREE.MeshStandardNodeMaterial({ color: Math.random() * 0xffffff })
  );
  mesh.position.set((Math.random() - 0.5) * 40, 1, (Math.random() - 0.5) * 40);
  mesh.castShadow = true;
  mesh.receiveShadow = true;
  scene.add(mesh);
}

// Directional light with CSM
const sun = new THREE.DirectionalLight(0xffffff, 3);
sun.position.set(50, 50, 25);
sun.castShadow = true;
scene.add(sun);

// CSM Setup
const csm = new CSMShadowNode(sun, {
  cascades: 3,
  mode: 'practical',
  maxFar: 200,
  lightMargin: 100,
});
csm.fade = true;

// ✅ APPLY CSM TO RENDERER
renderer.shadowNode = csm;

function animate() {
  requestAnimationFrame(animate);
  csm.updateFrustums();
  controls.update();
  renderer.render(scene, camera);
}

(async () => {
  await renderer.init();
  animate();
})();

console.log('✅ CSM Shadow System Example Running');

