/**
 * Hemisphere Lighting
 *
 * @author Maxime Heckel
 * @source https://github.com/MaximeHeckel/portfolio
 * @license MIT
 * @version Ported to Three.js r181+
 *
 * Hemisphere lighting that interpolates between ground and sky colors
 * based on the surface normal's Y component.
 *
 * Provides soft, ambient-like lighting with directional bias.
 * Surfaces facing up receive sky color, surfaces facing down receive ground color.
 *
 * @param normal - Surface normal vector (vec3)
 * @param groundColor - Color for downward-facing surfaces (vec3 or color)
 * @param skyColor - Color for upward-facing surfaces (vec3 or color)
 * @returns Hemisphere light color (vec3 or color)
 *
 * @example
 * ```typescript
 * import { createHemisphereLight } from '@tslstudio/tsl-kit/lighting'
 * import { color, normalView } from 'three/tsl'
 *
 * const hemiLight = createHemisphereLight(
 *   normalView,
 *   color(0.4, 0.3, 0.2), // Ground (warm brown)
 *   color(0.5, 0.6, 0.8)  // Sky (cool blue)
 * )
 * material.colorNode = baseColor.mul(hemiLight)
 * ```
 */
import { Fn, mix } from 'three/tsl';
export const createHemisphereLight = /*#__PURE__*/ Fn(([normal, groundColor, skyColor]) => {
    // Convert normal.y from [-1, 1] to [0, 1] for mixing
    const hemiMix = normal.y.mul(0.5).add(0.5);
    return mix(groundColor, skyColor, hemiMix);
});
//# sourceMappingURL=hemisphere.js.map