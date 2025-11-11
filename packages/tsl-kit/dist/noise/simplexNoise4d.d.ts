/**
 * Simplex Noise 4D
 *
 * 4D simplex noise implementation for complex animations and higher-dimensional noise patterns.
 * Useful for time-varying 3D noise by treating the 4th dimension as time.
 *
 * @module noise/simplexNoise4d
 * @category Noise
 * @source portfolio-main (Maxime Heckel)
 * @author Maxime Heckel
 * @license MIT
 * @version r170 → r181
 */
/**
 * 4D Simplex Noise
 *
 * Generates coherent noise values in 4D space. Commonly used for time-varying 3D noise
 * where the 4th dimension represents time, creating smooth animated noise patterns.
 *
 * @param v - 4D input position (vec4). For animated 3D noise, use vec4(position, time)
 * @returns Noise value in range [-1, 1] (float)
 *
 * @example
 * ```typescript
 * import { simplexNoise4d } from '@tslstudio/tsl-kit/noise';
 * import { vec4, positionLocal, uniform } from 'three/tsl';
 *
 * const time = uniform(0);
 *
 * // Time-varying 3D noise
 * const animatedNoise = simplexNoise4d(
 *   vec4(positionLocal.mul(2.0), time)
 * );
 *
 * // Multiple frequencies
 * const detailedNoise = simplexNoise4d(
 *   vec4(positionLocal.mul(5.0), time.mul(0.5))
 * );
 * ```
 */
export declare const simplexNoise4d: any;
//# sourceMappingURL=simplexNoise4d.d.ts.map