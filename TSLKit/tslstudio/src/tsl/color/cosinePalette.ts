/**
 * Cosine Palette Generator
 * 
 * Based on Inigo Quilez's cosine palette technique
 * http://www.iquilezles.org/www/articles/palettes/palettes.htm
 * 
 * @module tsl/color/cosinePalette
 */

import { Fn, float, cos } from 'three/tsl'

/**
 * Cosine Palette Generator
 * 
 * Generates smooth color palettes using cosine waves
 * Very efficient and produces beautiful gradients
 * 
 * @param t - Time/position parameter [0, 1]
 * @param a - Base color offset (vec3)
 * @param b - Color amplitude (vec3)
 * @param c - Color frequency (vec3)
 * @param d - Phase offset (vec3)
 * @param e - Cosine scalar (default: 2*PI = 6.28318)
 * @returns RGB color value
 * 
 * @example
 * ```typescript
 * // Rainbow palette
 * const color = cosinePalette(
 *   t,
 *   vec3(0.5, 0.5, 0.5),  // a: offset
 *   vec3(0.5, 0.5, 0.5),  // b: amplitude
 *   vec3(1.0, 1.0, 1.0),  // c: frequency
 *   vec3(0.0, 0.33, 0.67) // d: phase
 * )
 * ```
 */
export const cosinePalette = /*#__PURE__*/ Fn(
  ([t, a, b, c, d, e = float(6.28318)]) => {
    return a.add(b.mul(cos(e.mul(c.mul(t).add(d)))))
  }
)
