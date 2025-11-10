/**
 * Diffuse Lighting Node
 * 
 * Lambertian diffuse shading
 * 
 * @module tsl/lighting/diffuse
 */

import { Fn, dot, max } from 'three/tsl'

/**
 * Diffuse Light Node
 * 
 * Computes Lambertian diffuse lighting
 * 
 * @param lightColor - Color of the light
 * @param lightDir - Direction to light (normalized)
 * @param normal - Surface normal (normalized)
 * @returns Diffuse light contribution
 * 
 * @example
 * ```typescript
 * const diffuse = diffuseNode(lightColor, lightDirection, surfaceNormal)
 * ```
 */
export const diffuseNode = /*#__PURE__*/ Fn(
  ([lightColor, lightDir, normal]) => {
    const dp = max(0, dot(lightDir, normal))
    return dp.mul(lightColor)
  }
)
