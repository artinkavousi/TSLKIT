/**
 * Voronoi Noise Demo
 * Cellular/Worley noise for organic patterns
 */

import * as THREE from 'three/webgpu';
import { vec3, uv, uniform, Fn } from 'three/tsl';
import { voronoi } from '@tsl-kit/noise';
import { DemoBase } from './_demoBase.js';

export async function init(canvas, controlsContainer) {
  const demo = new DemoBase(canvas, controlsContainer);
  await demo.init();

  const params = {
    scale: 8.0,
    speed: 0.5,
    animate: true,
    invert: false,
    colorMode: 'cells'
  };

  const timeUniform = uniform(0);

  // Create plane geometry
  const geometry = new THREE.PlaneGeometry(2, 2);
  const material = new THREE.MeshBasicNodeMaterial();

  function updateMaterial() {
    material.colorNode = Fn(() => {
      const uvCoord = uv().mul(params.scale);
      const timeOffset = params.animate ? timeUniform.mul(0.1) : uniform(0);
      const noiseInput = vec3(uvCoord.x, uvCoord.y, timeOffset);
      
      const noise = voronoi(noiseInput);

      let finalColor;
      switch (params.colorMode) {
        case 'cells':
          // Show cell colors
          finalColor = params.invert ? vec3(noise.oneMinus()) : vec3(noise);
          break;
        case 'edges':
          // Show cell edges
          const edge = noise.mul(noise);
          finalColor = vec3(edge);
          break;
        case 'colored':
          // Colorful cells
          const r = noise;
          const g = noise.mul(noise);
          const b = noise.mul(0.5).add(0.5);
          finalColor = vec3(r, g, b);
          break;
      }

      return finalColor;
    })();
    material.needsUpdate = true;
  }

  updateMaterial();

  const mesh = new THREE.Mesh(geometry, material);
  demo.scene.add(mesh);

  // GUI
  const voronoiFolder = demo.gui.addFolder('Voronoi Settings');
  voronoiFolder.add(params, 'scale', 2.0, 20.0).name('Scale').onChange(updateMaterial);
  voronoiFolder.add(params, 'colorMode', ['cells', 'edges', 'colored']).name('Color Mode').onChange(updateMaterial);
  voronoiFolder.add(params, 'invert').name('Invert').onChange(updateMaterial);
  voronoiFolder.open();

  const animFolder = demo.gui.addFolder('Animation');
  animFolder.add(params, 'animate').name('Animate');
  animFolder.add(params, 'speed', 0.0, 2.0).name('Speed');
  animFolder.open();

  // Animation
  demo.animate(() => {
    if (params.animate) {
      timeUniform.value = performance.now() * 0.001 * params.speed;
      updateMaterial();
    }
  });

  return () => demo.cleanup();
}

