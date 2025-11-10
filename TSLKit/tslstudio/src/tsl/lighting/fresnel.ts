/**
 * Fresnel Effect Node
 * 
 * Schlick's approximation of Fresnel reflection
 * 
 * @module tsl/lighting/fresnel
 */

import { Fn, dot, float, max } from 'three/tsl'

/**
 * Fresnel Node
 * 
 * Computes Fresnel effect (rim lighting/edge glow)
 * Uses Schlick's approximation
 * 
 * @param viewDir - View direction (normalized)
 * @param normal - Surface normal (normalized)
 * @param power - Fresnel power/exponent (default: 1)
 * @returns Fresnel term [0, 1]
 * 
 * @example
 * ```typescript
 * const fresnel = createFresnelNode(viewDirection, normal, 5.0)
 * const rimColor = mix(baseColor, glowColor, fresnel)
 * ```
 */
export const createFresnelNode = /*#__PURE__*/ Fn(
  ([viewDir, normal, power = 1]) => {
    return float(1)
      .sub(max(0, dot(viewDir, normal)))
      .pow(power)
  }
)
