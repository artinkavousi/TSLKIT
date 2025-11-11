/**
 * Car Paint Material Presets
 * 
 * Multi-layer automotive paint with metallic flakes and clearcoat.
 * 
 * @module materials/presets/carPaint
 */

export interface CarPaintPreset {
  name: string;
  baseColor: { r: number; g: number; b: number };
  metallic: number;
  roughness: number;
  
  // Metallic flakes
  flakeColor: { r: number; g: number; b: number };
  flakeSize: number;
  flakeDensity: number;
  
  // Clearcoat layer
  clearcoat: number;
  clearcoatRoughness: number;
  clearcoatNormalStrength: number;
  
  // Optional effects
  anisotropy?: number;
  iridescence?: number;
  iridescenceIOR?: number;
  iridescenceThickness?: number;
}

/**
 * Classic red sports car paint
 */
export const sportsRed: CarPaintPreset = {
  name: 'Sports Red',
  baseColor: { r: 0.8, g: 0.05, b: 0.05 },
  metallic: 0.9,
  roughness: 0.15,
  flakeColor: { r: 1.0, g: 0.3, b: 0.2 },
  flakeSize: 0.01,
  flakeDensity: 0.7,
  clearcoat: 0.85,
  clearcoatRoughness: 0.05,
  clearcoatNormalStrength: 0.2
};

/**
 * Deep blue metallic
 */
export const deepBlue: CarPaintPreset = {
  name: 'Deep Blue',
  baseColor: { r: 0.05, g: 0.12, b: 0.45 },
  metallic: 0.95,
  roughness: 0.1,
  flakeColor: { r: 0.4, g: 0.5, b: 0.9 },
  flakeSize: 0.008,
  flakeDensity: 0.8,
  clearcoat: 0.9,
  clearcoatRoughness: 0.03,
  clearcoatNormalStrength: 0.15
};

/**
 * Pearl white with subtle iridescence
 */
export const pearlWhite: CarPaintPreset = {
  name: 'Pearl White',
  baseColor: { r: 0.95, g: 0.95, b: 0.98 },
  metallic: 0.7,
  roughness: 0.12,
  flakeColor: { r: 1.0, g: 1.0, b: 1.0 },
  flakeSize: 0.005,
  flakeDensity: 0.6,
  clearcoat: 0.88,
  clearcoatRoughness: 0.04,
  clearcoatNormalStrength: 0.1,
  iridescence: 0.3,
  iridescenceIOR: 1.4,
  iridescenceThickness: 0.2
};

/**
 * Black piano finish
 */
export const pianoBlack: CarPaintPreset = {
  name: 'Piano Black',
  baseColor: { r: 0.02, g: 0.02, b: 0.02 },
  metallic: 0.0,
  roughness: 0.05,
  flakeColor: { r: 0.1, g: 0.1, b: 0.1 },
  flakeSize: 0.003,
  flakeDensity: 0.3,
  clearcoat: 0.95,
  clearcoatRoughness: 0.01,
  clearcoatNormalStrength: 0.05
};

/**
 * Candy apple red (translucent over metallic)
 */
export const candyRed: CarPaintPreset = {
  name: 'Candy Red',
  baseColor: { r: 0.9, g: 0.0, b: 0.05 },
  metallic: 1.0,
  roughness: 0.08,
  flakeColor: { r: 0.95, g: 0.85, b: 0.4 }, // Gold flakes underneath
  flakeSize: 0.012,
  flakeDensity: 0.9,
  clearcoat: 0.92,
  clearcoatRoughness: 0.02,
  clearcoatNormalStrength: 0.12
};

/**
 * Matte military green
 */
export const matteGreen: CarPaintPreset = {
  name: 'Matte Green',
  baseColor: { r: 0.25, g: 0.35, b: 0.22 },
  metallic: 0.1,
  roughness: 0.8,
  flakeColor: { r: 0.3, g: 0.4, b: 0.25 },
  flakeSize: 0.002,
  flakeDensity: 0.2,
  clearcoat: 0.3,
  clearcoatRoughness: 0.6,
  clearcoatNormalStrength: 0.3
};

/**
 * Chrome silver
 */
export const chromeSilver: CarPaintPreset = {
  name: 'Chrome Silver',
  baseColor: { r: 0.85, g: 0.87, b: 0.88 },
  metallic: 1.0,
  roughness: 0.02,
  flakeColor: { r: 0.95, g: 0.96, b: 0.97 },
  flakeSize: 0.006,
  flakeDensity: 0.95,
  clearcoat: 0.95,
  clearcoatRoughness: 0.01,
  clearcoatNormalStrength: 0.08
};

/**
 * Orange with metallic flakes
 */
export const metallicOrange: CarPaintPreset = {
  name: 'Metallic Orange',
  baseColor: { r: 0.95, g: 0.45, b: 0.05 },
  metallic: 0.85,
  roughness: 0.18,
  flakeColor: { r: 1.0, g: 0.6, b: 0.2 },
  flakeSize: 0.009,
  flakeDensity: 0.75,
  clearcoat: 0.87,
  clearcoatRoughness: 0.04,
  clearcoatNormalStrength: 0.18
};

/**
 * Purple with color-shift iridescence
 */
export const chameleonPurple: CarPaintPreset = {
  name: 'Chameleon Purple',
  baseColor: { r: 0.35, g: 0.15, b: 0.55 },
  metallic: 0.9,
  roughness: 0.12,
  flakeColor: { r: 0.7, g: 0.3, b: 0.8 },
  flakeSize: 0.007,
  flakeDensity: 0.85,
  clearcoat: 0.9,
  clearcoatRoughness: 0.03,
  clearcoatNormalStrength: 0.15,
  iridescence: 0.8,
  iridescenceIOR: 1.6,
  iridescenceThickness: 0.5
};

/**
 * All car paint presets
 */
export const carPaintPresets = {
  sportsRed,
  deepBlue,
  pearlWhite,
  pianoBlack,
  candyRed,
  matteGreen,
  chromeSilver,
  metallicOrange,
  chameleonPurple
};

/**
 * Get car paint preset by name
 */
export function getCarPaintPreset(name: keyof typeof carPaintPresets): CarPaintPreset {
  return carPaintPresets[name];
}

