/**
 * Bayer Matrix Demo
 * Ordered dithering for reducing color banding
 */

import * as THREE from 'three/webgpu';
import { uv, vec3, Fn, uniform, floor, div, mul } from 'three/tsl';
import { bayerMatrix } from '@tsl-kit/math';
import { DemoBase } from './_demoBase.js';

export async function init(canvas, controlsContainer) {
  const demo = new DemoBase(canvas, controlsContainer);
  await demo.init();

  const params = {
    ditherStrength: 0.5,
    colorLevels: 8,
    showOriginal: false,
    pattern: 'gradient'
  };

  // Create plane geometry
  const geometry = new THREE.PlaneGeometry(2, 2);
  const material = new THREE.MeshBasicNodeMaterial();

  function updateMaterial() {
    material.colorNode = Fn(() => {
      const uvCoord = uv();
      
      // Base pattern
      let baseColor;
      switch (params.pattern) {
        case 'gradient':
          baseColor = vec3(uvCoord.x, uvCoord.y, mul(uvCoord.x, uvCoord.y));
          break;
        case 'horizontal':
          baseColor = vec3(uvCoord.x);
          break;
        case 'vertical':
          baseColor = vec3(uvCoord.y);
          break;
        case 'radial':
          const center = uvCoord.sub(0.5);
          const dist = center.x.mul(center.x).add(center.y.mul(center.y)).sqrt();
          baseColor = vec3(dist.mul(2.0));
          break;
      }
      
      if (params.showOriginal) {
        return baseColor;
      }
      
      // Apply Bayer dithering
      const screenCoord = uvCoord.mul(vec2(demo.canvas.width, demo.canvas.height));
      const bayer = bayerMatrix(screenCoord);
      const dither = bayer.sub(0.5).mul(uniform(params.ditherStrength));
      const dithered = baseColor.add(dither);
      
      // Posterize
      const levels = uniform(params.colorLevels);
      const posterized = floor(dithered.mul(levels)).div(levels);
      
      return posterized;
    })();
    material.needsUpdate = true;
  }

  updateMaterial();

  const mesh = new THREE.Mesh(geometry, material);
  demo.scene.add(mesh);

  // GUI
  const ditherFolder = demo.gui.addFolder('Dithering Settings');
  ditherFolder.add(params, 'ditherStrength', 0.0, 1.0).name('Dither Strength').onChange(updateMaterial);
  ditherFolder.add(params, 'colorLevels', 2, 32, 1).name('Color Levels').onChange(updateMaterial);
  ditherFolder.add(params, 'showOriginal').name('Show Original').onChange(updateMaterial);
  ditherFolder.open();

  const patternFolder = demo.gui.addFolder('Pattern');
  patternFolder.add(params, 'pattern', ['gradient', 'horizontal', 'vertical', 'radial']).name('Type').onChange(updateMaterial);
  patternFolder.open();

  // Animation
  demo.animate(() => {
    // Static demo
  });

  return () => demo.cleanup();
}

