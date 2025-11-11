/**
 * Bayer Matrix Texture Demo
 * Texture-based ordered dithering
 */

import * as THREE from 'three/webgpu';
import { uv, vec3, Fn, uniform, floor, div } from 'three/tsl';
import { bayerMatrixTexture } from '@tsl-kit/math';
import { DemoBase } from './_demoBase.js';

export async function init(canvas, controlsContainer) {
  const demo = new DemoBase(canvas, controlsContainer);
  await demo.init();

  const params = {
    ditherStrength: 0.5,
    colorLevels: 16,
    showPattern: false
  };

  const geometry = new THREE.PlaneGeometry(2, 2);
  const material = new THREE.MeshBasicNodeMaterial();
  
  // Create a simple gradient texture
  const bayerTex = new THREE.DataTexture(
    new Uint8Array([0, 128, 32, 160, 192, 64, 224, 96, 48, 176, 16, 144, 240, 112, 208, 80].map(v => [v, v, v, 255]).flat()),
    4, 4, THREE.RGBAFormat
  );
  bayerTex.needsUpdate = true;

  function updateMaterial() {
    material.colorNode = Fn(() => {
      const uvCoord = uv();
      
      if (params.showPattern) {
        return bayerMatrixTexture(uvCoord, bayerTex);
      }
      
      const gradient = vec3(uvCoord.x, uvCoord.y, uvCoord.x.mul(uvCoord.y));
      const dither = bayerMatrixTexture(uvCoord, bayerTex).sub(0.5).mul(uniform(params.ditherStrength));
      const dithered = gradient.add(dither);
      const levels = uniform(params.colorLevels);
      return floor(dithered.mul(levels)).div(levels);
    })();
    material.needsUpdate = true;
  }

  updateMaterial();
  const mesh = new THREE.Mesh(geometry, material);
  demo.scene.add(mesh);

  const ditherFolder = demo.gui.addFolder('Bayer Texture Dithering');
  ditherFolder.add(params, 'ditherStrength', 0.0, 1.0).onChange(updateMaterial);
  ditherFolder.add(params, 'colorLevels', 2, 64, 1).onChange(updateMaterial);
  ditherFolder.add(params, 'showPattern').name('Show Pattern').onChange(updateMaterial);
  ditherFolder.open();

  demo.animate(() => {});
  return () => demo.cleanup();
}

