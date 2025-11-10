/**
 * Bloom Effect Utilities
 * 
 * @module tsl/utils/bloom
 */

import { Fn, pow } from 'three/tsl'

/**
 * Bloom Edge Pattern
 * 
 * Creates a bloomed edge effect based on pattern and edge values
 * 
 * @param pattern - Input pattern value
 * @param edge - Edge value
 * @param exponent - Bloom exponent (higher = sharper bloom)
 * @returns Bloomed edge value
 * 
 * @example
 * ```typescript
 * const bloomed = bloom(pattern, 0.5, 3.0)
 * ```
 */
export const bloom = /*#__PURE__*/ Fn(
  ([pattern, edge, exponent]) => {
    pattern.assign(pow(edge.div(pattern), exponent))
    return pattern
  }
)
