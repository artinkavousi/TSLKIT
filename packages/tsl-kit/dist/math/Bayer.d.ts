/**
 * Bayer Dithering Matrix
 *
 * @author Three.js Contributors
 * @source https://github.com/mrdoob/three.js/blob/r181/examples/jsm/tsl/math/Bayer.js
 * @license MIT
 * @version Three.js r181
 *
 * Bayer matrix for ordered dithering.
 *
 * Dithering is a technique used to create the illusion of color depth in images
 * with limited color palettes. The Bayer matrix provides a threshold pattern
 * that can be used for ordered dithering.
 *
 * **Uses**:
 * - Color quantization
 * - Blue noise generation
 * - Halftone effects
 * - Stippling
 * - Posterization with dithering
 *
 * @example
 * ```typescript
 * import { bayerMatrix } from '@tslstudio/tsl-kit/math'
 * import { Fn, positionLocal, texture } from 'three/tsl'
 *
 * // Dithered color quantization
 * const material = Fn(() => {
 *   const color = texture(colorMap, uv)
 *   const bayer = bayerMatrix(positionLocal.xy.mul(resolution))
 *
 *   // Apply dithering threshold
 *   const dithered = color.add(bayer.sub(0.5).mul(0.1))
 *   return vec4(floor(dithered.mul(8)).div(8), 1.0)
 * })
 * ```
 */
/**
 * 4x4 Bayer matrix for ordered dithering.
 *
 * This function generates a Bayer matrix value for a given screen position,
 * creating a spatially-varying threshold pattern useful for dithering.
 *
 * The Bayer matrix is a 4x4 pattern that repeats across the screen:
 * ```
 *  0/16   8/16   2/16  10/16
 * 12/16   4/16  14/16   6/16
 *  3/16  11/16   1/16   9/16
 * 15/16   7/16  13/16   5/16
 * ```
 *
 * @param coord - Screen coordinate (vec2), typically `positionLocal.xy` or fragment position
 * @returns Threshold value in range [0, 1] based on Bayer matrix
 *
 * @example
 * ```typescript
 * // Basic dithering
 * const bayer = bayerMatrix(gl_FragCoord.xy)
 * const dithered = color.greaterThan(bayer).select(1, 0)
 * ```
 *
 * @example
 * ```typescript
 * // Posterize with dithering
 * const bayer = bayerMatrix(positionLocal.xy.mul(resolution))
 * const levels = 4
 * const ditheredColor = color.add(bayer.sub(0.5).div(levels))
 * const posterized = floor(ditheredColor.mul(levels)).div(levels)
 * ```
 *
 * @example
 * ```typescript
 * // Blue noise from Bayer matrix
 * const bayer = bayerMatrix(uv.mul(resolution))
 * const noise = fract(bayer.add(time))
 * ```
 */
export declare const bayerMatrix: any;
/**
 * Alternative Bayer matrix implementation using texture sampling.
 * More efficient for repeated use, requires a Bayer texture.
 *
 * @param coord - Screen coordinate (vec2)
 * @param bayerTexture - 4x4 texture containing Bayer matrix
 * @returns Threshold value from texture
 *
 * @example
 * ```typescript
 * // Create Bayer texture once
 * const bayerData = new Uint8Array([
 *   0, 128, 32, 160,
 *   192, 64, 224, 96,
 *   48, 176, 16, 144,
 *   240, 112, 208, 80
 * ])
 * const bayerTexture = new DataTexture(bayerData, 4, 4, RedFormat)
 *
 * // Use in shader
 * const bayer = bayerMatrixTexture(coord, bayerTexture)
 * ```
 */
export declare const bayerMatrixTexture: any;
//# sourceMappingURL=Bayer.d.ts.map