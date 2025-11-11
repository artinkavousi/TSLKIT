/**
 * WGSL Periodic Simplex Noise (PSRD Noise)
 *
 * High-quality 3D periodic simplex noise with gradients.
 * Based on the work of Stefan Gustavson and Ian McEwan.
 *
 * @module wgsl/noise
 * @license MIT - Copyright (c) 2021-2022 Stefan Gustavson and Ian McEwan
 */
/**
 * Periodic Simplex Noise 3D with gradient output
 *
 * Returns a vec4 with gradient in xyz and noise value in w.
 * The noise is periodic with period p, and can be rotated by alpha.
 *
 * @param x - Input coordinates
 * @param p - Period vector (use vec3(0) for non-periodic)
 * @param alpha - Rotation angle for domain rotation
 * @returns vec4(gradient.xyz, noise_value)
 *
 * @example
 * ```ts
 * import { psrdNoise3 } from '@tslstudio/tsl-kit/wgsl';
 *
 * // Non-periodic noise
 * const noise = psrdNoise3(position, vec3(0), 0);
 *
 * // Periodic noise with period of 8 units
 * const periodicNoise = psrdNoise3(position, vec3(8, 8, 8), 0);
 *
 * // Rotating noise animation
 * const rotatingNoise = psrdNoise3(position, vec3(0), time);
 * ```
 *
 * @see {@link https://github.com/stegu/psrdnoise} Original implementation
 */
export declare const psrdNoise3: any;
//# sourceMappingURL=noise.d.ts.map