/**
 * Diffuse Lighting Demo
 * Lambertian diffuse shading model
 */

import * as THREE from 'three/webgpu';
import { vec3, normalWorld, uniform, Fn, normalize } from 'three/tsl';
import { diffuse } from '@tsl-kit/lighting';
import { DemoBase } from './_demoBase.js';

export async function init(canvas, controlsContainer) {
  const demo = new DemoBase(canvas, controlsContainer);
  await demo.init();

  const params = {
    lightColor: '#ffffff',
    lightIntensity: 1.0,
    objectColor: '#ff6600',
    geometry: 'torusKnot',
    wireframe: false,
    animateLight: true,
    lightSpeed: 1.0
  };

  // Light direction (will be animated)
  const lightDir = new THREE.Vector3(1, 1, 1).normalize();
  const lightDirUniform = uniform(lightDir);

  let geometry = new THREE.TorusKnotGeometry(0.8, 0.3, 128, 32);
  const material = new THREE.MeshBasicNodeMaterial();

  function updateMaterial() {
    const lightCol = new THREE.Color(params.lightColor);
    const objectCol = new THREE.Color(params.objectColor);
    
    material.colorNode = Fn(() => {
      const normal = normalWorld;
      const lightDirection = normalize(lightDirUniform);
      const diffuseColor = vec3(lightCol.r, lightCol.g, lightCol.b);
      
      const diffuseContrib = diffuse(lightDirection, normal, diffuseColor);
      const finalColor = vec3(objectCol.r, objectCol.g, objectCol.b).mul(diffuseContrib).mul(params.lightIntensity);
      
      return finalColor;
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
      case 'suzanne':
        geometry = new THREE.IcosahedronGeometry(1, 2);
        break;
    }

    mesh.geometry = geometry;
    demo.scene.add(mesh);
  }

  updateMaterial();

  const mesh = new THREE.Mesh(geometry, material);
  demo.scene.add(mesh);

  // GUI
  const lightFolder = demo.gui.addFolder('Light Settings');
  lightFolder.addColor(params, 'lightColor').name('Light Color').onChange(updateMaterial);
  lightFolder.add(params, 'lightIntensity', 0.0, 3.0).name('Intensity').onChange(updateMaterial);
  lightFolder.add(params, 'animateLight').name('Animate Light');
  lightFolder.add(params, 'lightSpeed', 0.0, 3.0).name('Light Speed');
  lightFolder.open();

  const materialFolder = demo.gui.addFolder('Material');
  materialFolder.addColor(params, 'objectColor').name('Object Color').onChange(updateMaterial);
  materialFolder.add(params, 'wireframe').name('Wireframe').onChange(updateMaterial);
  materialFolder.add(params, 'geometry', ['sphere', 'torusKnot', 'torus', 'suzanne']).name('Geometry').onChange(updateGeometry);
  materialFolder.open();

  // Animation
  demo.animate(() => {
    mesh.rotation.x += 0.003;
    mesh.rotation.y += 0.002;
    
    if (params.animateLight) {
      const time = performance.now() * 0.001 * params.lightSpeed;
      lightDir.set(
        Math.cos(time),
        Math.sin(time * 0.7),
        Math.sin(time)
      ).normalize();
      lightDirUniform.value.copy(lightDir);
    }
  });

  return () => demo.cleanup();
}

