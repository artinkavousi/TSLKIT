/**
 * Denoise Post-Processing Effect
 * Re-exports from Three.js official TSL implementation
 *
 * Denoises data like raw screen-space ambient occlusion output.
 * Can noticeably improve AO quality but adds overhead.
 *
 * @module postfx/denoise
 */
export { DenoiseNode, denoise } from 'three/tsl';
/**
 * Applies spatial denoising to improve quality of effects like AO.
 *
 * @example
 * ```ts
 * import { denoise } from '@tsl-kit/postfx/denoise.js';
 *
 * const denoised = denoise(
 *   aoTexture,
 *   depthTexture,
 *   normalTexture,
 *   camera
 * );
 * ```
 *
 * Reference: Self-Supervised Poisson-Gaussian Denoising (WACV 2021)
 *
 * @param textureNode - Input texture to denoise (e.g., AO)
 * @param depthNode - Scene depth
 * @param normalNode - Scene normals (optional but recommended)
 * @param camera - The rendering camera
 * @returns Denoised output
 */
//# sourceMappingURL=denoise.d.ts.map