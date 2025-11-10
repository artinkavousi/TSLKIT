/**
 * Ambient Light Node
 * 
 * Simple ambient lighting calculation
 * 
 * @module tsl/lighting/ambient
 */

import { Fn } from 'three/tsl'

/**
 * Ambient Light Node
 * 
 * Computes uniform ambient illumination
 * 
 * @param lightColor - Color of the ambient light
 * @param intensity - Light intensity
 * @returns Ambient light contribution
 * 
 * @example
 * ```typescript
 * const ambient = ambientLightNode(vec3(1, 1, 1), 0.1)
 * ```
 */
export const ambientLightNode = /*#__PURE__*/ Fn(
  ([lightColor, intensity]) => {
    return lightColor.mul(intensity)
  }
)
