/**
 * Returns a repeating pattern of lines with a bloom effect.
 * Combines repeating pattern generation with edge bloom for glowing line effects.
 *
 * @param pattern - The input pattern value
 * @param repeat - The repeat frequency
 * @param edge - The edge value (bloom threshold)
 * @param exponent - The bloom exponent (controls glow falloff)
 * @param _time - Optional time offset for animation
 * @returns The bloomed repeating pattern value
 *
 * @example
 * ```ts
 * import { bloomEdgePattern } from '@tsl-kit/utils/bloomEdgePattern.js';
 * const glowingLines = bloomEdgePattern(
 *   positionLocal.y,
 *   float(10.0),
 *   float(0.05),
 *   float(2.0),
 *   time.mul(0.5)
 * );
 * ```
 */
export declare const bloomEdgePattern: any;
//# sourceMappingURL=bloomEdgePattern.d.ts.map