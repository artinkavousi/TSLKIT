/**
 * Diffuse Lighting
 *
 * @author Maxime Heckel
 * @source https://github.com/MaximeHeckel/portfolio
 * @license MIT
 * @version Ported to Three.js r181+
 *
 * Lambertian diffuse lighting calculation.
 * Light intensity is proportional to the cosine of the angle between
 * the light direction and surface normal.
 *
 * @param lightColor - Light color (vec3 or color)
 * @param lightDir - Normalized light direction vector (vec3)
 * @param normal - Normalized surface normal (vec3)
 * @returns Diffuse light contribution (vec3 or color)
 *
 * @example
 * ```typescript
 * import { diffuseNode } from '@tslstudio/tsl-kit/lighting'
 * import { color, vec3, normalView } from 'three/tsl'
 *
 * const lightDir = vec3(0.5, 1.0, 0.5).normalize()
 * const diffuse = diffuseNode(color(1, 1, 1), lightDir, normalView)
 * material.colorNode = baseColor.mul(diffuse)
 * ```
 */
export declare const diffuseNode: any;
//# sourceMappingURL=diffuse.d.ts.map