/**
 * Cosine Palette
 * 
 * Procedural color palette generator using cosine functions.
 * Creates smooth, continuous color gradients perfect for procedural textures and gradients.
 * Based on Iñigo Quilez's cosine palette technique.
 * 
 * @module utils/cosinePalette
 * @category Utilities
 * @source fragments-boilerplate (Maxime Heckel)
 * @author Maxime Heckel, Iñigo Quilez (technique)
 * @license MIT
 * @version r175 → r181
 * @see https://iquilezles.org/articles/palettes/
 */

import { Fn, float, cos, PI, vec3, ShaderNodeObject, Node } from 'three/tsl';

/**
 * Cosine-based Procedural Color Palette
 * 
 * Generates smooth color gradients using cosine functions.
 * Allows for infinite color variations with just a few parameters.
 * 
 * @param t - Time/position parameter (0-1)
 * @param a - Base color offset (vec3)
 * @param b - Color amplitude (vec3)
 * @param c - Color frequency (vec3)
 * @param d - Phase offset (vec3)
 * @param e - Cosine scalar (default: 2π for full period)
 * @returns RGB color value (vec3)
 * 
 * @example
 * ```typescript
 * import { cosinePalette } from '@tslstudio/tsl-kit/utils';
 * import { uv, uniform, vec3, float } from 'three/tsl';
 * 
 * const time = uniform(0);
 * 
 * // Rainbow palette
 * const rainbow = cosinePalette(
 *   uv().x,
 *   vec3(0.5, 0.5, 0.5),  // base
 *   vec3(0.5, 0.5, 0.5),  // amplitude
 *   vec3(1.0, 1.0, 1.0),  // frequency
 *   vec3(0.0, 0.33, 0.67) // phase
 * );
 * 
 * // Sunset palette
 * const sunset = cosinePalette(
 *   time,
 *   vec3(0.5, 0.5, 0.5),
 *   vec3(0.5, 0.5, 0.5),
 *   vec3(1.0, 1.0, 0.5),
 *   vec3(0.8, 0.9, 0.3)
 * );
 * 
 * // Fire palette
 * const fire = cosinePalette(
 *   noise,
 *   vec3(0.5, 0.5, 0.5),
 *   vec3(0.5, 0.5, 0.5),
 *   vec3(1.0, 0.7, 0.4),
 *   vec3(0.0, 0.15, 0.20)
 * );
 * ```
 */
export const cosinePalette = Fn<ShaderNodeObject<Node>[]>(
    ([t, a, b, c, d, e = float(6.28318)]) => {
        return a.add(b.mul(cos(e.mul(c.mul(t).add(d)))));
    }
);

