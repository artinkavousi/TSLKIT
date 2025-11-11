/**
 * Sepia Tone Effect
 * 
 * @author Three.js Contributors
 * @source https://github.com/mrdoob/three.js/blob/r181/examples/jsm/tsl/display/Sepia.js
 * @license MIT
 * @version Three.js r181
 * 
 * Classic sepia tone color grading effect.
 * 
 * Converts color images to a warm brown tone reminiscent of old photographs.
 * 
 * @example
 * ```typescript
 * import { sepia } from '@tslstudio/tsl-kit/postfx'
 * import { pass } from 'three/tsl'
 * 
 * // Apply sepia tone to scene
 * const scenePass = pass(scene, camera)
 * const sepiaPass = sepia(scenePass)
 * ```
 */

import { Fn, vec3, dot, nodeProxy } from 'three/tsl'
import type { Node, ShaderNodeObject } from 'three/tsl'

/**
 * Sepia tone color conversion matrix.
 * 
 * Transforms RGB color to warm sepia tones.
 * Based on standard sepia tone algorithm.
 */
const sepiaMatrix = vec3(
  vec3(0.393, 0.769, 0.189),  // Red channel
  vec3(0.349, 0.686, 0.168),  // Green channel
  vec3(0.272, 0.534, 0.131)   // Blue channel
)

/**
 * Apply sepia tone effect to a color or texture.
 * 
 * Converts the input to a vintage sepia tone using a standard
 * color transformation matrix.
 * 
 * @param color - Input color (vec3 or vec4) or texture node
 * @param amount - Sepia effect strength (0 = original, 1 = full sepia, default: 1)
 * @returns Sepia-toned color
 * 
 * @example
 * ```typescript
 * // Full sepia tone
 * const output = sepia(inputColor)
 * ```
 * 
 * @example
 * ```typescript
 * // Partial sepia (50% blend)
 * const output = sepia(inputColor, 0.5)
 * ```
 * 
 * @example
 * ```typescript
 * // In a post-processing chain
 * const finalColor = Fn(() => {
 *   let color = scenePass
 *   color = sepia(color, 0.8)  // 80% sepia
 *   return color
 * })()
 * ```
 */
export const sepia: (
  color: Node | ShaderNodeObject<Node>,
  amount?: Node | ShaderNodeObject<Node> | number
) => ShaderNodeObject<Node> = /*@__PURE__*/ Fn(([color, amount = 1.0]) => {
  // Extract RGB from input (handles vec3 or vec4)
  const c = vec3(color)

  // Apply sepia transformation
  const sepiaColor = vec3(
    dot(c, sepiaMatrix.x),
    dot(c, sepiaMatrix.y),
    dot(c, sepiaMatrix.z)
  )

  // Blend between original and sepia based on amount
  return c.mix(sepiaColor, amount)
})

export default sepia

