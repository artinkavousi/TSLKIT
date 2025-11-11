/**
 * Median of Three
 *
 * Calculates the median value of three inputs.
 * Useful for filtering, smoothing, and noise reduction.
 *
 * @module utils/median3
 * @category Utilities
 * @source fragments-boilerplate (Maxime Heckel)
 * @author Maxime Heckel
 * @license MIT
 * @version r175 → r181
 */
/**
 * Median Filter (3 values)
 *
 * Returns the middle value of three inputs.
 * Commonly used for filtering and noise reduction without blurring.
 *
 * @param a - First value
 * @param b - Second value
 * @param c - Third value
 * @returns Median of the three values
 *
 * @example
 * ```typescript
 * import { median3 } from '@tslstudio/tsl-kit/utils';
 * import { float } from 'three/tsl';
 *
 * // Simple median
 * const result = median3(float(5.0), float(2.0), float(8.0)); // Returns 5.0
 *
 * // Filter noisy values
 * const filtered = median3(
 *   sampleLeft,
 *   sampleCenter,
 *   sampleRight
 * );
 *
 * // Noise reduction on texture samples
 * const smooth = median3(
 *   texture(tex, uv.add(vec2(-pixelSize, 0))),
 *   texture(tex, uv),
 *   texture(tex, uv.add(vec2(pixelSize, 0)))
 * );
 * ```
 */
export declare const median3: any;
//# sourceMappingURL=median3.d.ts.map