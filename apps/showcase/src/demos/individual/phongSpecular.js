/**
 * Phong Specular Demo
 * Classic Phong specular highlights
 */

import * as THREE from 'three/webgpu';
import { vec3, normalWorld, positionWorld, cameraPosition, normalize, Fn, color } from 'three/tsl';
import { phongSpecular } from '@tsl-kit/lighting';
import { DemoBase } from './_demoBase.js';

export async function init(canvas, controlsContainer) {
  const demo = new DemoBase(canvas, controlsContainer);
  await demo.init();

  const params = {
    power: 32,
    baseColor: '#3366cc',
    specularColor: '#ffffff',
    lightColor: '#ffffff'
  };

  const lightDir = new THREE.Vector3(1, 1, 1).normalize();
  const material = new THREE.MeshBasicNodeMaterial();

  function updateMaterial() {
    material.colorNode = Fn(() => {
      const viewDir = normalize(cameraPosition.sub(positionWorld));
      const normal = normalWorld;
      const lightDirection = normalize(vec3(lightDir.x, lightDir.y, lightDir.z));
      
      const spec = phongSpecular(viewDir, normal, lightDirection, uniform(params.power));
      const baseCol = color(params.baseColor);
      const specCol = color(params.specularColor);
      
      return baseCol.add(specCol.mul(spec));
    })();
    material.needsUpdate = true;
  }

  updateMaterial();
  const geometry = new THREE.SphereGeometry(1, 64, 64);
  const mesh = new THREE.Mesh(geometry, material);
  demo.scene.add(mesh);

  const specFolder = demo.gui.addFolder('Phong Specular');
  specFolder.add(params, 'power', 1, 128).onChange(updateMaterial);
  specFolder.addColor(params, 'baseColor').onChange(updateMaterial);
  specFolder.addColor(params, 'specularColor').onChange(updateMaterial);
  specFolder.open();

  demo.animate(() => {
    const time = performance.now() * 0.001;
    lightDir.set(Math.cos(time), 1, Math.sin(time)).normalize();
  });

  return () => demo.cleanup();
}

