/**
 * Hemisphere Light Demo
 * Sky/ground color blending based on normal direction
 */

import * as THREE from 'three/webgpu';
import { normalWorld, color, Fn } from 'three/tsl';
import { hemi } from '@tsl-kit/lighting';
import { DemoBase } from './_demoBase.js';

export async function init(canvas, controlsContainer) {
  const demo = new DemoBase(canvas, controlsContainer);
  await demo.init();

  const params = {
    skyColor: '#4488ff',
    groundColor: '#ff8844',
    intensity: 1.5,
    geometry: 'torusKnot',
    wireframe: false
  };

  let geometry = new THREE.TorusKnotGeometry(0.8, 0.3, 128, 32);
  const material = new THREE.MeshBasicNodeMaterial();

  function updateMaterial() {
    const skyCol = color(params.skyColor);
    const groundCol = color(params.groundColor);
    
    material.colorNode = Fn(() => {
      const normal = normalWorld;
      return hemi(normal, groundCol, skyCol).mul(params.intensity);
    })();
    
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
      case 'suzanne':
        geometry = new THREE.DodecahedronGeometry(1, 2);
        break;
    }

    mesh.geometry = geometry;
    demo.scene.add(mesh);
  }

  updateMaterial();

  const mesh = new THREE.Mesh(geometry, material);
  demo.scene.add(mesh);

  // GUI
  const hemiFolder = demo.gui.addFolder('Hemisphere Light');
  hemiFolder.addColor(params, 'skyColor').name('Sky Color').onChange(updateMaterial);
  hemiFolder.addColor(params, 'groundColor').name('Ground Color').onChange(updateMaterial);
  hemiFolder.add(params, 'intensity', 0.5, 3.0).name('Intensity').onChange(updateMaterial);
  hemiFolder.open();

  const displayFolder = demo.gui.addFolder('Display');
  displayFolder.add(params, 'wireframe').name('Wireframe').onChange(updateMaterial);
  displayFolder.add(params, 'geometry', ['sphere', 'torusKnot', 'torus', 'icosahedron', 'suzanne']).name('Geometry').onChange(updateGeometry);
  displayFolder.open();

  // Animation
  demo.animate(() => {
    mesh.rotation.x += 0.003;
    mesh.rotation.y += 0.002;
  });

  return () => demo.cleanup();
}

