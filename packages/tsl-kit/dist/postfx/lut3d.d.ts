/**
 * LUT 3D Color Grading Post-Processing Effect
 * Re-exports from Three.js official TSL implementation
 *
 * Color grading via 3D lookup tables for cinematic color transformations.
 *
 * @module postfx/lut3d
 */
export { Lut3DNode, lut3D } from 'three/tsl';
/**
 * Applies color grading using a 3D lookup table.
 *
 * @example
 * ```ts
 * import { lut3D } from '@tsl-kit/postfx/lut3d.js';
 *
 * const graded = lut3D(scenePass, lutTexture, 32, uniform(1.0));
 * ```
 *
 * @param inputNode - The input color texture
 * @param lutNode - The 3D LUT texture
 * @param size - Size of the LUT (typically 16, 32, or 64)
 * @param intensityNode - Effect intensity (0-1)
 * @returns Color graded output
 */
//# sourceMappingURL=lut3d.d.ts.map