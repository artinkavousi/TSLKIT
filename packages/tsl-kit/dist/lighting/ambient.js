/**
 * Ambient Lighting
 *
 * @author Maxime Heckel
 * @source https://github.com/MaximeHeckel/portfolio
 * @license MIT
 * @version Ported to Three.js r181+
 *
 * Simple ambient lighting that uniformly illuminates all surfaces.
 *
 * @param lightColor - Light color (vec3 or color)
 * @param intensity - Light intensity multiplier (float)
 * @returns Ambient light contribution (vec3 or color)
 *
 * @example
 * ```typescript
 * import { ambientLightNode } from '@tslstudio/tsl-kit/lighting'
 * import { color, float } from 'three/tsl'
 *
 * const ambient = ambientLightNode(color(0.5, 0.6, 0.7), float(0.3))
 * material.colorNode = baseColor.mul(ambient)
 * ```
 */
import { Fn } from 'three/tsl';
export const ambientLightNode = /*#__PURE__*/ Fn(([lightColor, intensity]) => {
    return lightColor.mul(intensity);
});
//# sourceMappingURL=ambient.js.map