/**
 * Smooth Modulo Functions
 * 
 * @module tsl/math/smoothMod
 */

import { Fn, mod, mix, smoothstep } from 'three/tsl'

/**
 * Smooth modulo operation
 * 
 * Creates smooth transitions at modulo boundaries
 * 
 * @param x - Input value
 * @param period - Modulo period
 * @param smoothness - Smoothing factor (default: 0.1)
 * @returns Smoothed modulo result
 * 
 * @example
 * ```typescript
 * const smooth = smoothMod(position, 2.0, 0.2)
 * ```
 */
export const smoothMod = /*#__PURE__*/ Fn(
  ([x, period, smoothness = 0.1]) => {
    const modVal = mod(x, period)
    const edge1 = smoothstep(0, smoothness, modVal)
    const edge2 = smoothstep(period, period.sub(smoothness), modVal)
    return mix(modVal, modVal, edge1.mul(edge2))
  }
)
