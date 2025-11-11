/**
 * Repeating Pattern
 *
 * Creates repeating sine-based patterns with adjustable frequency and time offset.
 * Useful for waves, oscillations, and periodic animations.
 *
 * @module utils/repeatingPattern
 * @category Utilities
 * @source fragments-boilerplate (Maxime Heckel)
 * @author Maxime Heckel
 * @license MIT
 * @version r175 → r181
 */
/**
 * Repeating Sine Pattern
 *
 * Generates a repeating pattern using a sine function with controllable frequency.
 * Creates smooth, periodic variations for animations and procedural effects.
 *
 * @param pattern - Input pattern value (will be modified in-place)
 * @param repeat - Repeat frequency (higher = more repetitions)
 * @param _time - Time offset for animation (default: 0)
 * @returns Repeated sine pattern value
 *
 * @example
 * ```typescript
 * import { repeatingPattern } from '@tslstudio/tsl-kit/utils';
 * import { positionLocal, uniform, float } from 'three/tsl';
 *
 * const time = uniform(0);
 *
 * // Spatial repetition
 * const spatialPattern = repeatingPattern(
 *   positionLocal.x,
 *   float(5.0),
 *   float(0)
 * );
 *
 * // Animated pattern
 * const animatedPattern = repeatingPattern(
 *   positionLocal.y,
 *   float(3.0),
 *   time.mul(2.0)
 * );
 *
 * // Wave effect
 * const wave = repeatingPattern(
 *   positionLocal.x.add(positionLocal.z),
 *   float(8.0),
 *   time
 * );
 * ```
 */
export declare const repeatingPattern: any;
//# sourceMappingURL=repeatingPattern.d.ts.map