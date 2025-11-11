/**
 * Cosine Palette Demo
 * Procedural color gradient generation
 */

import * as THREE from 'three/webgpu';
import { uv, vec3, uniform, Fn } from 'three/tsl';
import { cosinePalette } from '@tsl-kit/utils';
import { DemoBase } from './_demoBase.js';

export async function init(canvas, controlsContainer) {
  const demo = new DemoBase(canvas, controlsContainer);
  await demo.init();

  // Parameters
  const params = {
    speed: 0.5,
    animate: true,
    // Palette parameters (vec3)
    brightness: { r: 0.5, g: 0.5, b: 0.5 },
    contrast: { r: 0.5, g: 0.5, b: 0.5 },
    osc: { r: 1.0, g: 1.0, b: 1.0 },
    phase: { r: 0.0, g: 0.33, b: 0.67 },
    preset: 'rainbow'
  };

  const presets = {
    rainbow: {
      brightness: { r: 0.5, g: 0.5, b: 0.5 },
      contrast: { r: 0.5, g: 0.5, b: 0.5 },
      osc: { r: 1.0, g: 1.0, b: 1.0 },
      phase: { r: 0.0, g: 0.33, b: 0.67 }
    },
    sunset: {
      brightness: { r: 0.5, g: 0.3, b: 0.2 },
      contrast: { r: 0.5, g: 0.4, b: 0.3 },
      osc: { r: 1.0, g: 0.8, b: 0.6 },
      phase: { r: 0.0, g: 0.2, b: 0.5 }
    },
    ocean: {
      brightness: { r: 0.2, g: 0.4, b: 0.6 },
      contrast: { r: 0.3, g: 0.3, b: 0.4 },
      osc: { r: 0.5, g: 0.8, b: 1.0 },
      phase: { r: 0.3, g: 0.5, b: 0.7 }
    },
    fire: {
      brightness: { r: 0.7, g: 0.3, b: 0.1 },
      contrast: { r: 0.5, g: 0.4, b: 0.2 },
      osc: { r: 1.0, g: 0.7, b: 0.3 },
      phase: { r: 0.0, g: 0.15, b: 0.4 }
    }
  };

  const timeUniform = uniform(0);

  // Create plane geometry
  const geometry = new THREE.PlaneGeometry(3, 3, 1, 1);
  const material = new THREE.MeshBasicNodeMaterial();

  function updateMaterial() {
    const uvCoord = uv().sub(0.5).mul(2.0);
    
    material.colorNode = Fn(() => {
      const t = uvCoord.x.add(timeUniform.mul(0.1));
      const col = cosinePalette(
        t,
        vec3(params.brightness.r, params.brightness.g, params.brightness.b),
        vec3(params.contrast.r, params.contrast.g, params.contrast.b),
        vec3(params.osc.r, params.osc.g, params.osc.b),
        vec3(params.phase.r, params.phase.g, params.phase.b)
      );
      return col;
    })();
    
    material.needsUpdate = true;
  }

  function applyPreset(presetName) {
    const preset = presets[presetName];
    Object.assign(params.brightness, preset.brightness);
    Object.assign(params.contrast, preset.contrast);
    Object.assign(params.osc, preset.osc);
    Object.assign(params.phase, preset.phase);
    demo.gui.controllersRecursive().forEach(c => c.updateDisplay());
    updateMaterial();
  }

  updateMaterial();

  const mesh = new THREE.Mesh(geometry, material);
  demo.scene.add(mesh);

  // GUI
  demo.gui.add(params, 'preset', Object.keys(presets)).name('Preset').onChange(applyPreset);

  const brightnessFolder = demo.gui.addFolder('Brightness (RGB)');
  brightnessFolder.add(params.brightness, 'r', 0, 1).name('R').onChange(updateMaterial);
  brightnessFolder.add(params.brightness, 'g', 0, 1).name('G').onChange(updateMaterial);
  brightnessFolder.add(params.brightness, 'b', 0, 1).name('B').onChange(updateMaterial);

  const contrastFolder = demo.gui.addFolder('Contrast (RGB)');
  contrastFolder.add(params.contrast, 'r', 0, 1).name('R').onChange(updateMaterial);
  contrastFolder.add(params.contrast, 'g', 0, 1).name('G').onChange(updateMaterial);
  contrastFolder.add(params.contrast, 'b', 0, 1).name('B').onChange(updateMaterial);

  const oscFolder = demo.gui.addFolder('Oscillation (RGB)');
  oscFolder.add(params.osc, 'r', 0, 2).name('R').onChange(updateMaterial);
  oscFolder.add(params.osc, 'g', 0, 2).name('G').onChange(updateMaterial);
  oscFolder.add(params.osc, 'b', 0, 2).name('B').onChange(updateMaterial);

  const phaseFolder = demo.gui.addFolder('Phase (RGB)');
  phaseFolder.add(params.phase, 'r', 0, 1).name('R').onChange(updateMaterial);
  phaseFolder.add(params.phase, 'g', 0, 1).name('G').onChange(updateMaterial);
  phaseFolder.add(params.phase, 'b', 0, 1).name('B').onChange(updateMaterial);

  const animFolder = demo.gui.addFolder('Animation');
  animFolder.add(params, 'animate').name('Animate');
  animFolder.add(params, 'speed', 0, 2).name('Speed');
  animFolder.open();

  // Animation
  demo.animate(() => {
    if (params.animate) {
      timeUniform.value += 0.016 * params.speed;
    }
  });

  // Cleanup
  return () => demo.cleanup();
}

