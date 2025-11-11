/**
 * Vignette Effect
 *
 * Creates a darkened border/edge effect that draws attention to the center of the frame.
 * Classic cinematic effect for depth and focus.
 *
 * @module postfx/vignette
 * @category Post-Processing
 * @source fragments-boilerplate (Maxime Heckel)
 * @author Maxime Heckel
 * @license MIT
 * @version r175 → r181
 */
import { Fn, smoothstep, pow, float } from 'three/tsl';
import { sdSphere } from '../sdf/shapes';
/**
 * Vignette Effect
 *
 * Creates a smooth darkening effect at the edges of the screen.
 * Uses a distance field to create the radial falloff.
 *
 * @param _uv - UV coordinates (vec2), typically centered at (0,0)
 * @param smoothing - Smoothness of the vignette transition (default: 0.45)
 * @param exponent - Power curve for intensity falloff (default: 1.2)
 * @returns Vignette mask value (0 = darkened edges, 1 = bright center)
 *
 * @example
 * ```typescript
 * import { vignetteEffect } from '@tslstudio/tsl-kit/postfx';
 * import { uv, vec3, texture } from 'three/tsl';
 *
 * const sceneColor = texture(sceneTexture, uv());
 * const vignette = vignetteEffect(uv().sub(0.5));
 * const final = vec3(sceneColor.rgb.mul(vignette));
 *
 * // Custom parameters
 * const strongVignette = vignetteEffect(
 *   uv().sub(0.5),
 *   float(0.3),   // tighter falloff
 *   float(2.0)    // stronger darkening
 * );
 *
 * // Subtle vignette
 * const subtleVignette = vignetteEffect(
 *   uv().sub(0.5),
 *   float(0.6),   // softer falloff
 *   float(0.8)    // lighter darkening
 * );
 * ```
 */
export const vignetteEffect = Fn(([_uv, smoothing = float(0.45), exponent = float(1.2)]) => {
    const vignette = smoothstep(smoothing, float(1.0), sdSphere(_uv)).oneMinus();
    return pow(vignette, exponent);
});
//# sourceMappingURL=vignette.js.map