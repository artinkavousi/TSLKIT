/**
 * CSM Shadows Demo
 * Cascaded Shadow Maps for large scenes
 */

import * as THREE from 'three/webgpu';
import { CSMShadowNode } from '@tsl-kit/shadows';
import { DemoBase } from './_demoBase.js';

export async function init(canvas, controlsContainer) {
  const demo = new DemoBase(canvas, controlsContainer);
  await demo.init();

  // Parameters
  const params = {
    cascades: 3,
    maxFar: 500,
    mode: 'practical',
    lightMargin: 200,
    fade: true,
    shadowBias: -0.0001,
    animateObjects: true,
    animationSpeed: 1.0
  };

  // Sun (directional light)
  const sun = new THREE.DirectionalLight(0xffffff, 1.0);
  sun.position.set(5, 10, 5);
  sun.castShadow = true;
  sun.shadow.camera.near = 0.1;
  sun.shadow.camera.far = 500;
  sun.shadow.mapSize.width = 2048;
  sun.shadow.mapSize.height = 2048;
  sun.shadow.bias = params.shadowBias;
  demo.scene.add(sun);

  // CSM Setup
  let csm = new CSMShadowNode(sun, {
    cascades: params.cascades,
    maxFar: params.maxFar,
    mode: params.mode,
    lightMargin: params.lightMargin
  });
  csm.fade = params.fade;
  demo.renderer.shadowNode = csm;

  // Ground
  const groundGeometry = new THREE.PlaneGeometry(50, 50);
  const groundMaterial = new THREE.MeshStandardNodeMaterial({ color: 0x333333 });
  const ground = new THREE.Mesh(groundGeometry, groundMaterial);
  ground.rotation.x = -Math.PI / 2;
  ground.receiveShadow = true;
  demo.scene.add(ground);

  // Add some objects
  const objects = [];
  const geometries = [
    new THREE.BoxGeometry(1, 1, 1),
    new THREE.SphereGeometry(0.5, 32, 32),
    new THREE.ConeGeometry(0.5, 1, 32),
    new THREE.TorusGeometry(0.4, 0.15, 16, 32)
  ];

  for (let i = 0; i < 8; i++) {
    const geometry = geometries[i % geometries.length];
    const material = new THREE.MeshStandardNodeMaterial({
      color: new THREE.Color().setHSL(i / 8, 0.7, 0.5),
      roughness: 0.7,
      metalness: 0.3
    });
    const mesh = new THREE.Mesh(geometry, material);
    mesh.position.set(
      (Math.random() - 0.5) * 10,
      1.5,
      (Math.random() - 0.5) * 10
    );
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    demo.scene.add(mesh);
    objects.push(mesh);
  }

  // Ambient light
  const ambient = new THREE.AmbientLight(0x404040, 0.5);
  demo.scene.add(ambient);

  // Camera position
  demo.camera.position.set(10, 8, 10);
  demo.camera.lookAt(0, 0, 0);

  function updateCSM() {
    // Remove old CSM
    demo.renderer.shadowNode = null;
    
    // Create new CSM
    csm = new CSMShadowNode(sun, {
      cascades: params.cascades,
      maxFar: params.maxFar,
      mode: params.mode,
      lightMargin: params.lightMargin
    });
    csm.fade = params.fade;
    demo.renderer.shadowNode = csm;
    
    sun.shadow.bias = params.shadowBias;
  }

  // GUI
  const csmFolder = demo.gui.addFolder('CSM Settings');
  csmFolder.add(params, 'cascades', 1, 4, 1).name('Cascades').onChange(updateCSM);
  csmFolder.add(params, 'maxFar', 50, 1000).name('Max Distance').onChange(updateCSM);
  csmFolder.add(params, 'mode', ['uniform', 'logarithmic', 'practical']).name('Mode').onChange(updateCSM);
  csmFolder.add(params, 'lightMargin', 0, 500).name('Light Margin').onChange(updateCSM);
  csmFolder.add(params, 'fade').name('Fade Between Cascades').onChange(updateCSM);
  csmFolder.add(params, 'shadowBias', -0.01, 0.01, 0.0001).name('Shadow Bias').onChange(updateCSM);
  csmFolder.open();

  const animFolder = demo.gui.addFolder('Animation');
  animFolder.add(params, 'animateObjects').name('Animate Objects');
  animFolder.add(params, 'animationSpeed', 0, 3).name('Speed');
  animFolder.open();

  // Animation
  demo.animate(() => {
    const time = performance.now() * 0.001;
    
    if (params.animateObjects) {
      objects.forEach((obj, i) => {
        obj.rotation.x = time * params.animationSpeed * 0.5;
        obj.rotation.y = time * params.animationSpeed * 0.3 + i;
        obj.position.y = 1.5 + Math.sin(time * params.animationSpeed + i) * 0.5;
      });
    }
    
    csm.updateFrustums();
  });

  // Cleanup
  return () => demo.cleanup();
}

