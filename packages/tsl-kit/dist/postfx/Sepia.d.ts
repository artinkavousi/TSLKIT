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
import type { Node, ShaderNodeObject } from 'three/tsl';
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
export declare const sepia: (color: Node | ShaderNodeObject<Node>, amount?: Node | ShaderNodeObject<Node> | number) => ShaderNodeObject<Node>;
export default sepia;
//# sourceMappingURL=Sepia.d.ts.map