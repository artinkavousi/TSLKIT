import { abs, float, Fn } from 'three/tsl';
import { repeatingPattern } from './repeatingPattern.js';
import { bloom } from './bloom.js';

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
export const bloomEdgePattern = Fn(([pattern, repeat, edge, exponent, _time = float(0)]) => {
  const result = pattern.toVar();
  result.assign(repeatingPattern(result, repeat, _time));
  result.assign(abs(result));
  result.assign(bloom(result, edge, exponent));

  return result;
});

