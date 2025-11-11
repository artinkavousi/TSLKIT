/**
 * Fractal Brownian Motion (FBM) Noise Functions
 *
 * @author Maxime Heckel
 * @source https://github.com/MaximeHeckel/fragments-boilerplate
 * @license MIT
 * @version Ported to Three.js r181+
 *
 * Collection of FBM noise variants that combine multiple octaves of simplex noise
 * at different frequencies and amplitudes to create rich, detailed patterns.
 *
 * Includes:
 * - Standard FBM: Classic fractal noise
 * - Ridged FBM: Creates sharp ridges for terrain
 * - Domain Warped FBM: Self-warping noise for organic patterns
 */
/**
 * Fractal Brownian Motion using 3D simplex noise
 *
 * Combines multiple octaves of noise at different frequencies and amplitudes.
 * Higher frequencies (lacunarity) add fine detail, while lower amplitudes (gain)
 * reduce their contribution.
 *
 * @param p - Input 3D position (vec3)
 * @param octaves - Number of noise octaves (default: 4.0)
 * @param frequency - Base frequency (default: 1.0)
 * @param amplitude - Base amplitude (default: 1.0)
 * @param lacunarity - Frequency multiplier between octaves (default: 2.0)
 * @param gain - Amplitude multiplier between octaves (default: 0.5)
 * @returns FBM noise value in range [-1, 1] (float)
 *
 * @example
 * ```typescript
 * import { fbm } from '@tslstudio/tsl-kit/noise'
 * import { vec3, uv } from 'three/tsl'
 *
 * // Terrain height with 6 octaves
 * const height = fbm(vec3(uv().mul(10.0), 0), 6.0)
 * ```
 */
export declare const fbm: any;
/**
 * Ridged FBM variant that creates sharp ridges
 *
 * Inverts and squares the absolute value of each octave to create sharp ridges.
 * Perfect for mountainous terrain and crystalline structures.
 *
 * @param p - Input 3D position (vec3)
 * @param octaves - Number of noise octaves (default: 4.0)
 * @param frequency - Base frequency (default: 1.0)
 * @param amplitude - Base amplitude (default: 1.0)
 * @param lacunarity - Frequency multiplier between octaves (default: 2.0)
 * @param gain - Amplitude multiplier between octaves (default: 0.5)
 * @returns Ridged FBM noise value in range [0, 1] (float)
 *
 * @example
 * ```typescript
 * import { ridgedFbm } from '@tslstudio/tsl-kit/noise'
 *
 * // Mountain terrain with sharp peaks
 * const height = ridgedFbm(position.mul(0.5), 5.0)
 * ```
 */
export declare const ridgedFbm: any;
/**
 * Domain warped FBM that uses FBM to warp the input coordinates
 *
 * Uses FBM to offset the sampling position before sampling FBM again,
 * creating flowing, organic patterns with self-similarity at all scales.
 *
 * @param p - Input 3D position (vec3)
 * @param octaves - Number of noise octaves (default: 4.0)
 * @param frequency - Base frequency (default: 1.0)
 * @param amplitude - Base amplitude (default: 1.0)
 * @param lacunarity - Frequency multiplier between octaves (default: 2.0)
 * @param gain - Amplitude multiplier between octaves (default: 0.5)
 * @param warpStrength - Strength of domain warping (default: 0.1)
 * @returns Domain warped FBM noise value in range [-1, 1] (float)
 *
 * @example
 * ```typescript
 * import { domainWarpedFbm } from '@tslstudio/tsl-kit/noise'
 *
 * // Organic, flowing patterns
 * const pattern = domainWarpedFbm(position, 4.0, 1.0, 1.0, 2.0, 0.5, 0.3)
 * ```
 */
export declare const domainWarpedFbm: any;
//# sourceMappingURL=fbm.d.ts.map