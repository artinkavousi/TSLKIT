/**
 * Simplex Noise 2D
 *
 * 2D simplex noise implementation providing smooth, natural-looking noise patterns.
 * Faster than Perlin noise and has better visual characteristics with no directional artifacts.
 *
 * @module noise/simplexNoise2d
 * @category Noise
 * @source portfolio-main (Maxime Heckel)
 * @author Maxime Heckel
 * @license MIT
 * @version r170 → r181
 */
/**
 * Permutation helper for noise generation
 * @internal
 */
export declare const permute2d: any;
/**
 * 2D Simplex Noise
 *
 * Generates coherent noise values in the range [-1, 1] based on 2D input coordinates.
 *
 * @param v - 2D input position (vec2)
 * @returns Noise value in range [-1, 1] (float)
 *
 * @example
 * ```typescript
 * import { simplexNoise2d } from '@tslstudio/tsl-kit/noise';
 * import { uv } from 'three/tsl';
 *
 * // Basic usage
 * const noise = simplexNoise2d(uv().mul(5.0));
 *
 * // Animated noise
 * const animatedNoise = simplexNoise2d(uv().mul(scale).add(time));
 * ```
 */
export declare const simplexNoise2d: any;
//# sourceMappingURL=simplexNoise2d.d.ts.map