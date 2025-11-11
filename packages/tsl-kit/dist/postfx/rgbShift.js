/**
 * RGB Shift Effect
 *
 * Splits and offsets RGB color channels in a specific direction.
 * Creates glitch, VHS, or analog video distortion effects.
 *
 * @module postfx/rgbShift
 * @category Post-Processing
 * @source Three.js r181 Official
 * @author Three.js Contributors
 * @license MIT
 * @version r181
 */
// Re-export official Three.js r181 RGB shift node
export { default as RGBShiftNode, rgbShift } from 'three/addons/tsl/display/RGBShiftNode.js';
/**
 * RGB Shift/Split Post-Processing Effect
 *
 * **Usage:**
 * ```typescript
 * import { rgbShift } from '@tslstudio/tsl-kit/postfx';
 * import { pass, uniform } from 'three/tsl';
 *
 * const time = uniform(0);
 * const scenePass = pass(scene, camera);
 *
 * // Basic horizontal shift
 * const shifted = rgbShift(scenePass, 0.005, 0);
 *
 * // Vertical shift
 * const vertical = rgbShift(scenePass, 0.01, Math.PI / 2);
 *
 * // Diagonal shift
 * const diagonal = rgbShift(scenePass, 0.008, Math.PI / 4);
 *
 * // Animated glitch effect
 * const glitch = rgbShift(
 *   scenePass,
 *   0.003,
 *   time.mul(2.0)  // rotating shift
 * );
 *
 * // VHS distortion
 * const vhs = rgbShift(scenePass, 0.015, 0);
 * ```
 *
 * **Parameters:**
 * - `node`: Input texture/pass (vec4)
 * - `amount`: Shift distance (default: 0.005). Higher = more separation
 * - `angle`: Shift direction in radians (default: 0 = horizontal)
 *
 * **Effect Details:**
 * - Red channel offset in positive direction
 * - Blue channel offset in negative direction
 * - Green channel stays centered
 * - Directional offset based on angle
 *
 * **Performance:** Fast (3 texture samples)
 *
 * **Use Cases:**
 * - Glitch effects
 * - VHS/analog video simulation
 * - Screen damage/malfunction
 * - Retro aesthetics
 * - Cyberpunk visuals
 */
//# sourceMappingURL=rgbShift.js.map