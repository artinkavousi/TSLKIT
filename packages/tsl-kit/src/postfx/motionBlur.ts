/**
 * Motion Blur Post-Processing Effect
 * Re-exports from Three.js official TSL implementation
 * 
 * @module postfx/motionBlur
 */

export { motionBlur } from 'three/tsl';

/**
 * Applies a motion blur effect to the given input node.
 * Requires velocity/motion vectors from the scene.
 * 
 * @example
 * ```ts
 * import { motionBlur } from '@tsl-kit/postfx/motionBlur.js';
 * 
 * // In post-processing pipeline
 * const blurred = motionBlur(scenePass, velocityBuffer, int(16));
 * ```
 * 
 * @param inputNode - The input color texture
 * @param velocity - Motion vectors (2D velocity field)
 * @param numSamples - Number of blur samples (default: 16)
 * @returns Motion blurred output
 */

