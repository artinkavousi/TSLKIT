/**
 * Chromatic Aberration Effect
 *
 * Simulates lens color fringing by separating and offsetting RGB channels.
 * Creates the color distortion seen in real camera lenses, especially at edges.
 *
 * @module postfx/chromaticAberration
 * @category Post-Processing
 * @source Three.js r181 Official
 * @author Three.js Contributors
 * @license MIT
 * @version r181
 */
// Re-export official Three.js r181 chromatic aberration node
export { default as ChromaticAberrationNode, chromaticAberration } from 'three/addons/tsl/display/ChromaticAberrationNode.js';
/**
 * Chromatic Aberration Post-Processing Effect
 *
 * **Usage:**
 * ```typescript
 * import { chromaticAberration } from '@tslstudio/tsl-kit/postfx';
 * import { pass } from 'three/tsl';
 *
 * // Basic chromatic aberration
 * const scenePass = pass(scene, camera);
 * const aberrated = chromaticAberration(scenePass);
 *
 * // Custom strength and center
 * const strong = chromaticAberration(
 *   scenePass,
 *   2.5,                    // strength
 *   vec2(0.5, 0.5),         // center point
 *   1.2                     // scale factor
 * );
 *
 * // Subtle edge aberration
 * const subtle = chromaticAberration(scenePass, 0.5);
 *
 * // Off-center aberration
 * const offCenter = chromaticAberration(
 *   scenePass,
 *   1.5,
 *   vec2(0.3, 0.7)  // aberration center
 * );
 * ```
 *
 * **Parameters:**
 * - `node`: Input texture/pass (vec4)
 * - `strength`: Effect intensity (default: 1.0). Higher = more separation
 * - `center`: Center point for radial aberration (default: vec2(0.5, 0.5))
 * - `scale`: Scale factor for stepped scaling (default: 1.1)
 *
 * **Effect Details:**
 * - Separates RGB channels radially from center point
 * - Red channel scaled outward, blue inward, green stays centered
 * - Creates realistic lens distortion
 * - Distance-based aberration strength
 *
 * **Performance:** Medium (3 texture samples)
 *
 * **Use Cases:**
 * - Cinematic lens simulation
 * - Impact/damage effects
 * - Retro/VHS aesthetics
 * - Screen-space distortion
 */
//# sourceMappingURL=chromaticAberration.js.map