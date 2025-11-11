/**
 * SDF Box 2D Demo
 * 2D box/rectangle distance field
 */

import * as THREE from 'three/webgpu';
import { uv, vec2, vec3, vec4, Fn, uniform, select } from 'three/tsl';
import { sdBox2d } from '@tsl-kit/sdf';
import { DemoBase } from './_demoBase.js';

export async function init(canvas, controlsContainer) {
  const demo = new DemoBase(canvas, controlsContainer);
  await demo.init();

  const params = {
    width: 0.5,
    height: 0.3,
    visualize: 'distance',
    insideColor: '#00ff00',
    outsideColor: '#ff0000',
    animate: true,
    speed: 0.5
  };

  const timeUniform = uniform(0);

  // Create plane geometry
  const geometry = new THREE.PlaneGeometry(2, 2);
  const material = new THREE.MeshBasicNodeMaterial();

  function updateMaterial() {
    material.colorNode = Fn(() => {
      const uvCoord = uv().sub(0.5).mul(2.0);
      const size = vec2(uniform(params.width), uniform(params.height));
      const dist = sdBox2d(uvCoord, size);
      
      let col;
      switch (params.visualize) {
        case 'distance':
          col = select(
            dist.lessThan(0.0),
            vec3(0.0, 1.0, 0.0), // Inside: green
            vec3(1.0, dist.mul(3.0), 0.0) // Outside: gradient
          );
          break;
        case 'binary':
          const insideCol = vec3(
            parseInt(params.insideColor.substr(1, 2), 16) / 255,
            parseInt(params.insideColor.substr(3, 2), 16) / 255,
            parseInt(params.insideColor.substr(5, 2), 16) / 255
          );
          const outsideCol = vec3(
            parseInt(params.outsideColor.substr(1, 2), 16) / 255,
            parseInt(params.outsideColor.substr(3, 2), 16) / 255,
            parseInt(params.outsideColor.substr(5, 2), 16) / 255
          );
          col = select(dist.lessThan(0.0), insideCol, outsideCol);
          break;
        case 'contours':
          const contour = dist.abs().fract().mul(2.0).sub(1.0).abs();
          col = vec3(contour);
          break;
      }
      
      return vec4(col, 1.0);
    })();
    material.needsUpdate = true;
  }

  updateMaterial();

  const mesh = new THREE.Mesh(geometry, material);
  demo.scene.add(mesh);

  // GUI
  const sdfFolder = demo.gui.addFolder('SDF Box Settings');
  sdfFolder.add(params, 'width', 0.1, 1.0).name('Width').onChange(updateMaterial);
  sdfFolder.add(params, 'height', 0.1, 1.0).name('Height').onChange(updateMaterial);
  sdfFolder.add(params, 'visualize', ['distance', 'binary', 'contours']).name('Visualization').onChange(updateMaterial);
  sdfFolder.open();

  const colorFolder = demo.gui.addFolder('Colors (Binary Mode)');
  colorFolder.addColor(params, 'insideColor').name('Inside').onChange(updateMaterial);
  colorFolder.addColor(params, 'outsideColor').name('Outside').onChange(updateMaterial);

  const animFolder = demo.gui.addFolder('Animation');
  animFolder.add(params, 'animate').name('Animate Size');
  animFolder.add(params, 'speed', 0.0, 2.0).name('Speed');
  animFolder.open();

  // Animation
  demo.animate(() => {
    if (params.animate) {
      const time = performance.now() * 0.001 * params.speed;
      params.width = 0.3 + Math.sin(time) * 0.2;
      params.height = 0.2 + Math.cos(time * 0.7) * 0.15;
      demo.gui.controllersRecursive().forEach(c => c.updateDisplay());
      updateMaterial();
    }
  });

  return () => demo.cleanup();
}

