/**
 * Tiled Lighting Demo
 * Efficient rendering of 1000+ lights with compute culling
 */

import * as THREE from 'three/webgpu';
import { tiledLights } from '@tsl-kit/lighting';
import { DemoBase } from './_demoBase.js';

export async function init(canvas, controlsContainer) {
  const demo = new DemoBase(canvas, controlsContainer);
  await demo.init();

  const params = {
    numLights: 100,
    lightRadius: 10,
    tileSize: 32,
    animateSpeed: 1.0
  };

  // Create scene objects
  const objects = [];
  for (let i = 0; i < 20; i++) {
    const geometry = i % 3 === 0 ? new THREE.BoxGeometry(1, 1, 1) :
                     i % 3 === 1 ? new THREE.SphereGeometry(0.5, 32, 32) :
                     new THREE.ConeGeometry(0.5, 1, 32);
    const material = new THREE.MeshStandardNodeMaterial({
      color: new THREE.Color().setHSL(i / 20, 0.7, 0.5),
      roughness: 0.7,
      metalness: 0.3
    });
    const mesh = new THREE.Mesh(geometry, material);
    mesh.position.set(
      (Math.random() - 0.5) * 10,
      (Math.random() - 0.5) * 10,
      (Math.random() - 0.5) * 10
    );
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    demo.scene.add(mesh);
    objects.push(mesh);
  }

  // Create many point lights
  const lights = [];
  for (let i = 0; i < params.numLights; i++) {
    const light = new THREE.PointLight(
      new THREE.Color().setHSL(i / params.numLights, 1.0, 0.5),
      10,
      params.lightRadius
    );
    light.position.set(
      (Math.random() - 0.5) * 20,
      (Math.random() - 0.5) * 20,
      (Math.random() - 0.5) * 20
    );
    demo.scene.add(light);
    lights.push(light);
  }

  // Setup tiled lighting
  const tiledLightsNode = tiledLights(2048, params.tileSize);
  demo.renderer.lightsNode = tiledLightsNode;

  demo.camera.position.set(15, 15, 15);
  demo.camera.lookAt(0, 0, 0);

  // GUI
  const lightsFolder = demo.gui.addFolder('Tiled Lights');
  lightsFolder.add(params, 'numLights', 10, 500, 10).name('Light Count (reload)');
  lightsFolder.add(params, 'lightRadius', 5, 50).name('Light Radius');
  lightsFolder.add(params, 'tileSize', 16, 64, 16).name('Tile Size (reload)');
  lightsFolder.add(params, 'animateSpeed', 0.0, 3.0).name('Animation Speed');
  lightsFolder.open();

  // Animation
  demo.animate(() => {
    const time = performance.now() * 0.001 * params.animateSpeed;
    
    lights.forEach((light, i) => {
      const angle = time + (i / lights.length) * Math.PI * 2;
      const radius = 10;
      light.position.x = Math.cos(angle) * radius;
      light.position.z = Math.sin(angle) * radius;
      light.position.y = Math.sin(time * 0.5 + i) * 5;
      light.distance = params.lightRadius;
    });

    objects.forEach((obj, i) => {
      obj.rotation.x += 0.01 * params.animateSpeed;
      obj.rotation.y += 0.005 * params.animateSpeed;
    });
  });

  return () => demo.cleanup();
}

