/**
 * Material Presets Library
 * 
 * Ready-to-use material configurations for common surfaces.
 * 
 * @module materials/presets
 */

export * from './skin';
export * from './metal';
export * from './carPaint';
export * from './glass';
export * from './fabric';

// Re-export all presets for convenience
import { skinPresets } from './skin';
import { metalPresets } from './metal';
import { carPaintPresets } from './carPaint';
import { glassPresets } from './glass';
import { fabricPresets } from './fabric';

/**
 * All material presets organized by category
 */
export const materialPresets = {
  skin: skinPresets,
  metal: metalPresets,
  carPaint: carPaintPresets,
  glass: glassPresets,
  fabric: fabricPresets
};

/**
 * Get total count of all presets
 */
export function getPresetCount(): {
  skin: number;
  metal: number;
  carPaint: number;
  glass: number;
  fabric: number;
  total: number;
} {
  return {
    skin: Object.keys(skinPresets).length,
    metal: Object.keys(metalPresets).length,
    carPaint: Object.keys(carPaintPresets).length,
    glass: Object.keys(glassPresets).length,
    fabric: Object.keys(fabricPresets).length,
    total: 
      Object.keys(skinPresets).length +
      Object.keys(metalPresets).length +
      Object.keys(carPaintPresets).length +
      Object.keys(glassPresets).length +
      Object.keys(fabricPresets).length
  };
}

