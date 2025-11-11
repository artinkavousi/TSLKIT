/**
 * Depth of Field (DOF)
 *
 * Simulates camera lens focus with realistic bokeh blur.
 * Creates depth-based blur for cinematic focus effects.
 *
 * @module postfx/depthOfField
 * @category Post-Processing
 * @source Three.js r181 Official
 * @author Three.js Contributors
 * @license MIT
 * @version r181
 */
// Re-export official Three.js r181 DOF node
export { default as DepthOfFieldNode, dof } from 'three/addons/tsl/display/DepthOfFieldNode.js';
/**
 * Depth of Field Post-Processing Effect
 *
 * Simulates realistic camera lens focus with beautiful bokeh blur.
 * Uses circle-of-confusion and depth-aware gathering.
 *
 * **Usage:**
 * ```typescript
 * import { dof } from '@tslstudio/tsl-kit/postfx';
 * import { pass } from 'three/tsl';
 *
 * const scenePass = pass(scene, camera);
 *
 * // Basic DOF with auto-focus
 * const focused = dof(scenePass);
 *
 * // Custom focus distance and aperture
 * const customDOF = dof(
 *   scenePass,
 *   5.0,    // focus distance in world units
 *   0.02,   // aperture (f-stop simulation)
 *   10.0    // max blur radius
 * );
 *
 * // Cinematic shallow depth of field
 * const cinematic = dof(scenePass, 3.0, 0.05, 15.0);
 *
 * // Deep focus (everything sharp)
 * const deepFocus = dof(scenePass, 10.0, 0.001, 2.0);
 * ```
 *
 * **Parameters:**
 * - `node`: Input texture/pass (vec4)
 * - `focusDistance`: Distance to sharp focus plane (world units)
 * - `aperture`: Simulated f-stop (higher = more blur)
 * - `maxBlur`: Maximum blur radius (pixels)
 *
 * **Effect Details:**
 * - Circle of confusion calculation
 * - Depth-based blur strength
 * - Bokeh shape simulation
 * - Near and far blur
 * - Physically-based falloff
 *
 * **Performance:** High (multiple blur passes)
 *
 * **Technical Details:**
 * - Requires scene depth buffer
 * - Uses separable gaussian blur
 * - CoC-driven blur kernel size
 * - Foreground/background separation
 *
 * **Use Cases:**
 * - Cinematic focus effects
 * - Portrait-style rendering
 * - Drawing attention to subjects
 * - Realistic camera simulation
 * - Miniature/tilt-shift effects
 *
 * **Tips:**
 * - Smaller aperture = sharper (like real cameras)
 * - Match focus distance to subject
 * - Animate focus for rack focus effects
 * - Combine with camera motion for realism
 *
 * **Visual Impact:**
 * - High (very noticeable effect)
 * - Cinematic look
 * - Professional quality
 */
//# sourceMappingURL=depthOfField.js.map