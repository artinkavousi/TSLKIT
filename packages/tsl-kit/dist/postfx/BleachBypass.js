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
import { Fn, vec3, vec4, min, max, mix, luminance, float } from 'three/tsl';
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
export const bleach = /*@__PURE__*/ Fn(([color, opacity = 1]) => {
    const base = vec4(color);
    const lum = luminance(base.rgb);
    const blend = vec3(lum);
    // Contrast curve based on luminance
    // L ranges from 0-1 based on how far luminance is from 0.45
    const L = min(1.0, max(0.0, float(10.0).mul(lum.sub(0.45))));
    // Multiply blend mode (darkens)
    const result1 = blend.mul(base.rgb).mul(2.0);
    // Screen blend mode (lightens)
    const result2 = float(2.0)
        .mul(blend.oneMinus())
        .mul(base.rgb.oneMinus())
        .oneMinus();
    // Mix between multiply and screen based on luminance curve
    const newColor = mix(result1, result2, L);
    // Apply opacity blending
    const A2 = base.a.mul(opacity);
    const mixRGB = A2.mul(newColor).add(base.rgb.mul(A2.oneMinus()));
    return vec4(mixRGB, base.a);
});
export default bleach;
//# sourceMappingURL=BleachBypass.js.map