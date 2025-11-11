/**
 * Metal Material Presets
 * 
 * Physically accurate metal materials with correct F0 values.
 * 
 * @module materials/presets/metal
 */

import { vec3 } from 'three/tsl';

export interface MetalPreset {
  name: string;
  baseColor: { r: number; g: number; b: number };
  metallic: number;
  roughness: number;
  f0: { r: number; g: number; b: number };
  anisotropy?: number;
  anisotropyRotation?: number;
}

/**
 * Gold (pure)
 * F0: (1.022, 0.782, 0.344) - accurate measured values
 */
export const gold: MetalPreset = {
  name: 'Gold',
  baseColor: { r: 1.0, g: 0.766, b: 0.336 },
  metallic: 1.0,
  roughness: 0.2,
  f0: { r: 1.022, g: 0.782, b: 0.344 }
};

/**
 * Silver (pure)
 * F0: (0.972, 0.960, 0.915)
 */
export const silver: MetalPreset = {
  name: 'Silver',
  baseColor: { r: 0.972, g: 0.960, b: 0.915 },
  metallic: 1.0,
  roughness: 0.15,
  f0: { r: 0.972, g: 0.960, b: 0.915 }
};

/**
 * Copper
 * F0: (0.955, 0.638, 0.538)
 */
export const copper: MetalPreset = {
  name: 'Copper',
  baseColor: { r: 0.955, g: 0.638, b: 0.538 },
  metallic: 1.0,
  roughness: 0.25,
  f0: { r: 0.955, g: 0.638, b: 0.538 }
};

/**
 * Aluminum
 * F0: (0.913, 0.921, 0.925)
 */
export const aluminum: MetalPreset = {
  name: 'Aluminum',
  baseColor: { r: 0.913, g: 0.921, b: 0.925 },
  metallic: 1.0,
  roughness: 0.3,
  f0: { r: 0.913, g: 0.921, b: 0.925 }
};

/**
 * Iron
 * F0: (0.562, 0.565, 0.578)
 */
export const iron: MetalPreset = {
  name: 'Iron',
  baseColor: { r: 0.562, g: 0.565, b: 0.578 },
  metallic: 1.0,
  roughness: 0.45,
  f0: { r: 0.562, g: 0.565, b: 0.578 }
};

/**
 * Chromium (Chrome)
 * F0: (0.550, 0.556, 0.554)
 */
export const chrome: MetalPreset = {
  name: 'Chrome',
  baseColor: { r: 0.550, g: 0.556, b: 0.554 },
  metallic: 1.0,
  roughness: 0.05,
  f0: { r: 0.550, g: 0.556, b: 0.554 }
};

/**
 * Brushed aluminum (with anisotropy)
 */
export const brushedAluminum: MetalPreset = {
  name: 'Brushed Aluminum',
  baseColor: { r: 0.913, g: 0.921, b: 0.925 },
  metallic: 1.0,
  roughness: 0.4,
  f0: { r: 0.913, g: 0.921, b: 0.925 },
  anisotropy: 0.7,
  anisotropyRotation: 0
};

/**
 * Brushed steel
 */
export const brushedSteel: MetalPreset = {
  name: 'Brushed Steel',
  baseColor: { r: 0.65, g: 0.67, b: 0.68 },
  metallic: 1.0,
  roughness: 0.45,
  f0: { r: 0.65, g: 0.67, b: 0.68 },
  anisotropy: 0.6,
  anisotropyRotation: 0
};

/**
 * Titanium
 * F0: (0.542, 0.497, 0.449)
 */
export const titanium: MetalPreset = {
  name: 'Titanium',
  baseColor: { r: 0.542, g: 0.497, b: 0.449 },
  metallic: 1.0,
  roughness: 0.35,
  f0: { r: 0.542, g: 0.497, b: 0.449 }
};

/**
 * Brass
 * F0: (0.913, 0.777, 0.504)
 */
export const brass: MetalPreset = {
  name: 'Brass',
  baseColor: { r: 0.913, g: 0.777, b: 0.504 },
  metallic: 1.0,
  roughness: 0.3,
  f0: { r: 0.913, g: 0.777, b: 0.504 }
};

/**
 * All metal presets
 */
export const metalPresets = {
  gold,
  silver,
  copper,
  aluminum,
  iron,
  chrome,
  brushedAluminum,
  brushedSteel,
  titanium,
  brass
};

/**
 * Get metal preset by name
 */
export function getMetalPreset(name: keyof typeof metalPresets): MetalPreset {
  return metalPresets[name];
}

