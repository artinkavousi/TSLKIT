/**
 * Repeating Pattern Utilities
 * 
 * @module tsl/utils/repeatingPattern
 */

import { float, Fn, sin } from 'three/tsl'

/**
 * Repeating Pattern
 * 
 * Creates a repeating sine wave pattern
 * Useful for creating oscillating effects and patterns
 * 
 * @param pattern - Input pattern value
 * @param repeat - Repeat frequency
 * @param _time - Time offset (default: 0)
 * @returns Repeated sine pattern value
 * 
 * @example
 * ```typescript
 * const repeated = repeatingPattern(uv.x, 10.0, time)
 * ```
 */
export const repeatingPattern = /*#__PURE__*/ Fn(
  ([pattern, repeat, _time = float(0)]) => {
    pattern.assign(sin(pattern.mul(repeat).add(_time)).div(repeat))
    return pattern
  }
)
