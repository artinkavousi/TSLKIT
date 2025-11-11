/**
 * Classic Noise 3D
 *
 * Classic/standard 3D noise implementation (also known as Perlin noise).
 * Provides smooth, continuous noise patterns without directional artifacts.
 *
 * @module noise/classicNoise3d
 * @category Noise
 * @source portfolio-main (Maxime Heckel)
 * @author Maxime Heckel
 * @license MIT
 * @version r170 → r181
 */
/**
 * Permutation function for noise generation
 * @internal
 */
export declare const permuteClassic: any;
/**
 * Taylor inverse square root approximation for normalization
 * @internal
 */
export declare const taylorInvSqrtClassic: any;
/**
 * Fade function for smooth interpolation
 * @internal
 */
export declare const fadeClassic: any;
/**
 * Classic Noise 3D
 *
 * Generates coherent 3D noise using the classic Perlin noise algorithm.
 * Produces smooth, continuous patterns without directional artifacts.
 *
 * @param P - 3D input position (vec3)
 * @returns Noise value in range [-1, 1] (float)
 *
 * @example
 * ```typescript
 * import { classicNoise3d } from '@tslstudio/tsl-kit/noise';
 * import { positionLocal, uniform } from 'three/tsl';
 *
 * // Basic 3D noise
 * const noise = classicNoise3d(positionLocal.mul(2.0));
 *
 * // Animated noise
 * const time = uniform(0);
 * const animatedNoise = classicNoise3d(
 *   positionLocal.mul(3.0).add(vec3(time.mul(0.5), 0.0, 0.0))
 * );
 *
 * // Multiple octaves for detail
 * const detailedNoise = classicNoise3d(positionLocal.mul(5.0))
 *   .add(classicNoise3d(positionLocal.mul(10.0)).mul(0.5))
 *   .add(classicNoise3d(positionLocal.mul(20.0)).mul(0.25));
 * ```
 */
export declare const classicNoise3d: any;
//# sourceMappingURL=classicNoise3d.d.ts.map