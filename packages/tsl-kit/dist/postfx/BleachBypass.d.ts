/**
 * Bleach Bypass Effect
 *
 * @author Three.js Contributors
 * @source https://github.com/mrdoob/three.js/blob/r181/examples/jsm/tsl/display/BleachBypass.js
 * @license MIT
 * @version Three.js r181
 *
 * Classic film processing effect that retains some color while increasing contrast.
 *
 * Named after a film processing technique where the bleaching step is skipped,
 * resulting in high contrast with retained silver and desaturated colors.
 * Creates a gritty, desaturated look popular in action movies and commercials.
 *
 * @example
 * ```typescript
 * import { bleach } from '@tslstudio/tsl-kit/postfx'
 * import { pass, uniform } from 'three/tsl'
 *
 * // Apply bleach bypass effect
 * const scenePass = pass(scene, camera)
 * const bleached = bleach(scenePass, uniform(1.0))
 * ```
 */
/**
 * Applies a bleach bypass (silver retention) effect.
 *
 * Creates a high-contrast, desaturated look characteristic of
 * the bleach bypass film processing technique. Increases perceived
 * sharpness and gives a gritty, realistic appearance.
 *
 * The effect works by:
 * 1. Converting to luminance-based blend
 * 2. Applying contrast curve based on luminance
 * 3. Blending between multiply and screen modes
 * 4. Mixing result with original based on opacity
 *
 * @param color - Input color (vec4)
 * @param opacity - Effect strength (float, 0-1, default: 1.0)
 *                  - 0.0 = no effect (original color)
 *                  - 0.5 = 50% blend
 *                  - 1.0 = full effect
 * @returns Bleached color (vec4)
 *
 * @example
 * ```typescript
 * // Full strength bleach bypass
 * const output = bleach(scenePass, float(1.0))
 * ```
 *
 * @example
 * ```typescript
 * // Subtle effect (50%)
 * const output = bleach(scenePass, float(0.5))
 * ```
 *
 * @example
 * ```typescript
 * // Animated intensity
 * const intensity = uniform(0.5).add(sin(time).mul(0.3))
 * const output = bleach(scenePass, intensity)
 * ```
 *
 * @example
 * ```typescript
 * // Combined with other effects
 * const bleached = bleach(scenePass, float(0.8))
 * const vignetted = vignette(bleached)
 * ```
 *
 * @remarks
 * Visual characteristics:
 * - Increased contrast (deep blacks, bright whites)
 * - Reduced color saturation
 * - Retained color information (unlike full desaturation)
 * - Gritty, realistic appearance
 * - Enhanced perceived sharpness
 *
 * Common use cases:
 * - Action movies (Saving Private Ryan style)
 * - War/combat scenes
 * - Gritty commercials
 * - Fashion photography
 * - Music videos
 * - Documentary-style footage
 *
 * Performance: Very cheap (single luminance + blend operation)
 */
export declare const bleach: any;
export default bleach;
//# sourceMappingURL=BleachBypass.d.ts.map