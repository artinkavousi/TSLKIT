/**
 * Fresnel Effect Demo
 * Demonstrates view-dependent rim lighting
 */

import * as THREE from 'three/webgpu';
import { vec3, normalWorld, positionWorld, cameraPosition, color, mix, normalize, Fn, float } from 'three/tsl';
import { fresnel } from '@tsl-kit/lighting';
import { DemoBase } from './_demoBase.js';

export async function init(canvas, controlsContainer) {
  const demo = new DemoBase(canvas, controlsContainer);
  await demo.init();

  // Parameters
  const params = {
    power: 3.0,
    fresnelColor: '#00ffff',
    baseColor: '#1a1a2e',
    intensity: 1.5,
    geometry: 'torusKnot',
    wireframe: false
  };

  // Create geometry
  let geometry = new THREE.TorusKnotGeometry(0.8, 0.3, 128, 32);
  const material = new THREE.MeshBasicNodeMaterial();

  function updateMaterial() {
    const viewDir = normalize(cameraPosition.sub(positionWorld));
    const normal = normalWorld;

    const fresnelEffect = fresnel(viewDir, normal, params.power);
    const fresnelCol = color(params.fresnelColor);
    const baseCol = color(params.baseColor);
    
    material.colorNode = mix(baseCol, fresnelCol.mul(params.intensity), fresnelEffect);
    material.wireframe = params.wireframe;
    material.needsUpdate = true;
  }

  function updateGeometry() {
    demo.scene.remove(mesh);
    if (geometry) geometry.dispose();

    switch (params.geometry) {
      case 'sphere':
        geometry = new THREE.SphereGeometry(1, 64, 64);
        break;
      case 'torusKnot':
        geometry = new THREE.TorusKnotGeometry(0.8, 0.3, 128, 32);
        break;
      case 'torus':
        geometry = new THREE.TorusGeometry(0.8, 0.4, 64, 128);
        break;
      case 'icosahedron':
        geometry = new THREE.IcosahedronGeometry(1, 3);
        break;
    }

    mesh.geometry = geometry;
    demo.scene.add(mesh);
  }

  updateMaterial();

  const mesh = new THREE.Mesh(geometry, material);
  demo.scene.add(mesh);

  // GUI
  const fresnelFolder = demo.gui.addFolder('Fresnel Settings');
  fresnelFolder.add(params, 'power', 0.5, 8.0).name('Power').onChange(updateMaterial);
  fresnelFolder.add(params, 'intensity', 0.5, 3.0).name('Intensity').onChange(updateMaterial);
  fresnelFolder.addColor(params, 'fresnelColor').name('Rim Color').onChange(updateMaterial);
  fresnelFolder.addColor(params, 'baseColor').name('Base Color').onChange(updateMaterial);
  fresnelFolder.open();

  const displayFolder = demo.gui.addFolder('Display');
  displayFolder.add(params, 'geometry', ['sphere', 'torusKnot', 'torus', 'icosahedron']).name('Geometry').onChange(updateGeometry);
  displayFolder.add(params, 'wireframe').name('Wireframe').onChange(updateMaterial);
  displayFolder.open();

  // Animation
  demo.animate(() => {
    mesh.rotation.x += 0.003;
    mesh.rotation.y += 0.002;
  });

  // Cleanup
  return () => demo.cleanup();
}

