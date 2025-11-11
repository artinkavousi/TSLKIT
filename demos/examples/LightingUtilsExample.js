/**
 * Lighting Utilities - Isolated Example
 * 
 * Professional showcase of lighting helper functions.
 * Tests: fresnel, hemisphere, diffuse, specular utilities.
 */

import * as THREE from 'three';
import WebGPU from 'three/addons/capabilities/WebGPU.js';
import WebGPURenderer from 'three/addons/renderers/webgpu/WebGPURenderer.js';
import { MeshBasicNodeMaterial } from 'three/webgpu';
import { Fn, vec3, normalize, cameraPosition, positionWorld, normalWorld } from 'three/tsl';
import { GUI } from 'three/addons/libs/lil-gui.module.min.js';
import { fresnel, hemi, diffuse, phongSpecular } from '../../packages/tsl-kit/src/lighting/utils';

if (WebGPU.isAvailable() === false) {
  document.body.appendChild(WebGPU.getErrorMessage());
  throw new Error('No WebGPU support');
}

const scene = new THREE.Scene();
scene.background = new THREE.Color(0x222222);

const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 100);
camera.position.set(0, 3, 8);

const renderer = new WebGPURenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Test sphere with custom lighting
const sphere = new THREE.Mesh(
  new THREE.SphereGeometry(2, 64, 64),
  null // Will set material dynamically
);
scene.add(sphere);

// Light for diffuse/specular
const light = new THREE.DirectionalLight(0xffffff, 1.0);
light.position.set(2, 3, 2);
scene.add(light);

// GUI
const gui = new GUI({ title: 'Lighting Utilities' });
const params = {
  mode: 'fresnel',
  fresnelPower: 2,
  skyColor: '#8080ff',
  groundColor: '#404020',
  specularPower: 32,
};

gui.add(params, 'mode', ['fresnel', 'hemisphere', 'diffuse', 'specular', 'combined']).name('Mode').onChange(updateMaterial);
gui.add(params, 'fresnelPower', 1, 5).name('Fresnel Power').onChange(updateMaterial);
gui.addColor(params, 'skyColor').name('Sky Color').onChange(updateMaterial);
gui.addColor(params, 'groundColor').name('Ground Color').onChange(updateMaterial);
gui.add(params, 'specularPower', 8, 128).name('Specular Power').onChange(updateMaterial);

function updateMaterial() {
  const colorFn = Fn(() => {
    const viewDir = normalize(cameraPosition.sub(positionWorld));
    const normal = normalWorld;
    const lightDir = normalize(vec3(2, 3, 2));
    
    const skyColor = vec3(
      parseInt(params.skyColor.slice(1, 3), 16) / 255,
      parseInt(params.skyColor.slice(3, 5), 16) / 255,
      parseInt(params.skyColor.slice(5, 7), 16) / 255
    );
    
    const gndColor = vec3(
      parseInt(params.groundColor.slice(1, 3), 16) / 255,
      parseInt(params.groundColor.slice(3, 5), 16) / 255,
      parseInt(params.groundColor.slice(5, 7), 16) / 255
    );
    
    switch (params.mode) {
      case 'fresnel':
        return fresnel(viewDir, normal, params.fresnelPower);
        
      case 'hemisphere':
        return hemi(normal, gndColor, skyColor);
        
      case 'diffuse':
        return diffuse(lightDir, normal, vec3(1, 1, 1));
        
      case 'specular':
        return phongSpecular(viewDir, normal, lightDir, params.specularPower);
        
      case 'combined':
        const f = fresnel(viewDir, normal, 2);
        const h = hemi(normal, gndColor, skyColor);
        const d = diffuse(lightDir, normal, vec3(1, 1, 1));
        const s = phongSpecular(viewDir, normal, lightDir, params.specularPower);
        return h.mul(d).add(s.mul(0.5)).add(f.mul(0.3));
        
      default:
        return vec3(1, 1, 1);
    }
  });
  
  sphere.material = new MeshBasicNodeMaterial({
    colorNode: colorFn()
  });
}

updateMaterial();

function animate() {
  requestAnimationFrame(animate);
  sphere.rotation.y += 0.01;
  renderer.render(scene, camera);
}

animate();

console.log('✅ Lighting Utilities Example Running');

