/**
 * Directional Light Demo
 * Directional lighting with Blinn-Phong shading
 */

import * as THREE from 'three/webgpu';
import { vec3, normalWorld, uniform, Fn, normalize, color } from 'three/tsl';
import { directionalLightNode } from '@tsl-kit/lighting';
import { DemoBase } from './_demoBase.js';

export async function init(canvas, controlsContainer) {
  const demo = new DemoBase(canvas, controlsContainer);
  await demo.init();

  const params = {
    lightColor: '#ffffff',
    intensity: 1.0,
    specularPower: 32,
    objectColor: '#6633cc'
  };

  const lightDir = new THREE.Vector3(1, 1, 1).normalize();
  const lightDirUniform = uniform(lightDir);
  const material = new THREE.MeshBasicNodeMaterial();

  function updateMaterial() {
    const lightCol = color(params.lightColor);
    const objCol = color(params.objectColor);
    
    material.colorNode = Fn(() => {
      const normal = normalWorld;
      const lightPos = lightDirUniform;
      const viewDir = normalize(vec3(0, 0, 1));
      
      const lighting = directionalLightNode(
        lightCol,
        uniform(params.intensity),
        normal,
        lightPos,
        viewDir,
        uniform(params.specularPower)
      );
      
      return objCol.mul(lighting);
    })();
    material.needsUpdate = true;
  }

  updateMaterial();
  const geometry = new THREE.TorusKnotGeometry(0.8, 0.3, 128, 32);
  const mesh = new THREE.Mesh(geometry, material);
  demo.scene.add(mesh);

  const lightFolder = demo.gui.addFolder('Directional Light');
  lightFolder.addColor(params, 'lightColor').onChange(updateMaterial);
  lightFolder.add(params, 'intensity', 0.0, 3.0).onChange(updateMaterial);
  lightFolder.add(params, 'specularPower', 1, 128).onChange(updateMaterial);
  lightFolder.open();

  demo.gui.addColor(params, 'objectColor').name('Object Color').onChange(updateMaterial);

  demo.animate(() => {
    const time = performance.now() * 0.001;
    lightDir.set(Math.cos(time), 1, Math.sin(time)).normalize();
    lightDirUniform.value.copy(lightDir);
    mesh.rotation.x += 0.003;
    mesh.rotation.y += 0.002;
  });

  return () => demo.cleanup();
}

