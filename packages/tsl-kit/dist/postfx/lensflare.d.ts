/**
 * Lensflare Post-Processing Effect
 * Re-exports from Three.js official TSL implementation
 *
 * Bloom-based lens flare effect that creates realistic lens artifacts.
 * Requires a bloom pass to extract bright areas first.
 *
 * @module postfx/lensflare
 */
export { LensflareNode, lensflare } from 'three/tsl';
/**
 * Adds a bloom-based lens flare effect.
 *
 * @example
 * ```ts
 * import { lensflare } from '@tsl-kit/postfx/lensflare.js';
 *
 * const flareEffect = lensflare(bloomTexture, {
 *   ghostTint: vec3(1, 1, 1),
 *   threshold: float(0.5),
 *   ghostSamples: float(4),
 *   ghostSpacing: float(0.25),
 *   ghostAttenuationFactor: float(25),
 *   downSampleRatio: 4
 * });
 * ```
 *
 * References:
 * - https://john-chapman-graphics.blogspot.com/2013/02/pseudo-lens-flare.html
 * - https://john-chapman.github.io/2017/11/05/pseudo-lens-flare.html
 */
//# sourceMappingURL=lensflare.d.ts.map