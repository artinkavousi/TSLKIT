import * as THREE from 'three/webgpu';
import { fresnel, hemi, diffuse, phongSpecular } from '@tsl-kit/lighting';
import { vec3, normalWorld, positionWorld, cameraPosition, color, mix, dot, max, normalize } from 'three/tsl';

const scene = new THREE.Scene();
scene.background = new THREE.Color(0x0a0a0f);

const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 100);
camera.position.z = 3;

const renderer = new THREE.WebGPURenderer({ antialias: true });
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Create sphere with fresnel material
const geometry = new THREE.SphereGeometry(1, 64, 64);
const material = new THREE.MeshBasicNodeMaterial();

const viewDir = normalize(cameraPosition.sub(positionWorld));
const normal = normalWorld;

// Fresnel effect
const fresnelValue = fresnel(viewDir, normal, 3);
const fresnelCol = color('#00ffff');
const baseCol = color('#1a1a2e');

material.colorNode = mix(baseCol, fresnelCol.mul(1.5), fresnelValue);

const sphere = new THREE.Mesh(geometry, material);
scene.add(sphere);

// Lighting
const light = new THREE.PointLight(0xffffff, 100, 50);
light.position.set(3, 3, 3);
scene.add(light);

function animate() {
  requestAnimationFrame(animate);
  sphere.rotation.y += 0.01;
  renderer.render(scene, camera);
}

(async () => {
  await renderer.init();
  animate();
})();

console.log('✅ Lighting Utilities Example Running');

