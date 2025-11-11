/**
 * Bloom Effect Helpers
 * 
 * @author Maxime Heckel
 * @source https://github.com/MaximeHeckel/fragments-boilerplate
 * @license MIT
 * @version Ported to Three.js r181+
 * 
 * Utility functions for creating bloom effects.
 * Bloom creates a glow effect by blurring bright areas of the image.
 */

import { Fn, pow } from 'three/tsl'

/**
 * Returns a bloomed edge based on input pattern
 * 
 * Creates an inverse brightness falloff for bloom effects.
 * Higher exponent = sharper bloom edge, lower exponent = softer bloom.
 * 
 * @param pattern - The input pattern/distance value (float)
 * @param edge - The edge threshold value (float)
 * @param exponent - The bloom falloff exponent (float)
 * @returns The bloomed edge value (float)
 * 
 * @example
 * ```typescript
 * import { bloom } from '@tslstudio/tsl-kit/postfx'
 * import { float } from 'three/tsl'
 * 
 * // Create soft bloom edge
 * const bloomValue = bloom(distancePattern, float(0.5), float(2.0))
 * material.emissiveNode = color.mul(bloomValue)
 * ```
 */
export const bloom = /*#__PURE__*/ Fn(([pattern, edge, exponent]) => {
  pattern.assign(pow(edge.div(pattern), exponent))
  return pattern
})

