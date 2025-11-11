/**
 * SDF Sphere Demo
 * Signed Distance Field sphere with distance visualization
 */

import * as THREE from 'three/webgpu';
import { uv, vec3, vec4, Fn, uniform, select, length } from 'three/tsl';
import { sdSphere } from '@tsl-kit/sdf';
import { DemoBase } from './_demoBase.js';

export async function init(canvas, controlsContainer) {
  const demo = new DemoBase(canvas, controlsContainer);
  await demo.init();

  // Parameters
  const params = {
    radius: 0.5,
    visualize: 'distance',
    insideColor: '#00ffff',
    outsideColor: '#ff0000',
    animate: true,
    speed: 0.5
  };

  const timeUniform = uniform(0);

  // Create plane geometry
  const geometry = new THREE.PlaneGeometry(2, 2);
  const material = new THREE.MeshBasicNodeMaterial();

  function updateMaterial() {
    const radiusUniform = uniform(params.radius);
    
    material.colorNode = Fn(() => {
      const uvCoord = uv().sub(0.5).mul(2.0);
      const offset = vec3(
        uniform(0.3).mul(Math.cos(timeUniform.value * params.speed)),
        uniform(0.3).mul(Math.sin(timeUniform.value * params.speed)),
        0.0
      );
      const p = vec3(uvCoord.x, uvCoord.y, 0.0).add(offset);
      const dist = sdSphere(p, radiusUniform);
      
      let col;
      switch (params.visualize) {
        case 'distance':
          // Gradient based on distance
          col = select(
            dist.lessThan(0.0),
            vec3(0.0, 1.0, 1.0), // Inside: cyan
            vec3(1.0, dist.mul(2.0), 0.0) // Outside: gradient
          );
          break;
        case 'binary':
          // Binary inside/outside
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
          // Contour lines
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
  const sdfFolder = demo.gui.addFolder('SDF Settings');
  sdfFolder.add(params, 'radius', 0.1, 1.0).name('Radius').onChange(updateMaterial);
  sdfFolder.add(params, 'visualize', ['distance', 'binary', 'contours']).name('Visualization').onChange(updateMaterial);
  sdfFolder.open();

  const colorFolder = demo.gui.addFolder('Colors (Binary Mode)');
  colorFolder.addColor(params, 'insideColor').name('Inside').onChange(updateMaterial);
  colorFolder.addColor(params, 'outsideColor').name('Outside').onChange(updateMaterial);

  const animFolder = demo.gui.addFolder('Animation');
  animFolder.add(params, 'animate').name('Animate');
  animFolder.add(params, 'speed', 0, 2).name('Speed');
  animFolder.open();

  // Animation
  demo.animate(() => {
    if (params.animate) {
      timeUniform.value = performance.now() * 0.001;
      updateMaterial();
    }
  });

  // Cleanup
  return () => demo.cleanup();
}

