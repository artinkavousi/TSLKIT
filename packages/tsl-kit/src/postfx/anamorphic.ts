/**
 * Anamorphic Flare Post-Processing Effect
 * Re-exports from Three.js official TSL implementation
 * 
 * Creates cinematic anamorphic lens flare effect with horizontal streaks.
 * 
 * @module postfx/anamorphic
 */

export { AnamorphicNode, anamorphic } from 'three/tsl';

/**
 * Adds anamorphic lens flare effect with horizontal light streaks.
 * 
 * @example
 * ```ts
 * import { anamorphic } from '@tsl-kit/postfx/anamorphic.js';
 * 
 * const flare = anamorphic(
 *   sceneTexture,
 *   uniform(0.9),  // threshold
 *   uniform(0.3),  // scale
 *   5              // samples
 * );
 * ```
 * 
 * @param textureNode - Input texture
 * @param thresholdNode - Brightness threshold for flares
 * @param scaleNode - Vertical scale of flares
 * @param samples - Number of blur samples (more = larger flares)
 * @returns Anamorphic flare effect
 */

