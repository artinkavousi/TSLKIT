/**
 * Smooth Modulo
 *
 * A smooth, continuous alternative to the standard modulo operation.
 * Creates smooth repeating patterns without the sharp discontinuities of regular mod.
 *
 * @module utils/smoothMod
 * @category Utilities
 * @source portfolio-main (Maxime Heckel)
 * @author Maxime Heckel
 * @license MIT
 * @version r170 → r181
 */
/**
 * Smooth Modulo Function
 *
 * Creates a smooth, periodic function without sharp discontinuities.
 * Useful for creating repeating patterns, animations, and procedural effects.
 *
 * @param axis - Input value to apply smooth modulo to
 * @param amp - Amplitude/period of the repeating pattern
 * @param rad - Smoothing radius (higher = smoother transitions)
 * @returns Smoothly repeating value
 *
 * @example
 * ```typescript
 * import { smoothMod } from '@tslstudio/tsl-kit/utils';
 * import { positionLocal, uniform } from 'three/tsl';
 *
 * const time = uniform(0);
 *
 * // Smooth repeating pattern
 * const pattern = smoothMod(positionLocal.x, float(2.0), float(0.5));
 *
 * // Animated smooth repetition
 * const animated = smoothMod(
 *   positionLocal.x.add(time),
 *   float(3.0),
 *   float(0.8)
 * );
 *
 * // Combine with noise for organic repetition
 * const organic = smoothMod(
 *   positionLocal.y.add(noise),
 *   float(1.5),
 *   float(0.3)
 * );
 * ```
 */
export declare const smoothMod: any;
//# sourceMappingURL=smoothMod.d.ts.map