/**
 * Hemisphere Light Node
 * 
 * Two-tone hemisphere lighting (sky and ground)
 * 
 * @module tsl/lighting/hemisphere
 */

import { Fn, mix } from 'three/tsl'

/**
 * Hemisphere Light Node
 * 
 * Computes hemisphere lighting that blends between sky and ground colors
 * based on surface normal orientation
 * 
 * @param normal - Surface normal (normalized)
 * @param groundColor - Color for downward-facing surfaces
 * @param skyColor - Color for upward-facing surfaces
 * @returns Blended hemisphere light color
 * 
 * @example
 * ```typescript
 * const hemiLight = createHemisphereLight(
 *   normal,
 *   vec3(0.3, 0.2, 0.1),  // ground (brownish)
 *   vec3(0.5, 0.7, 1.0)   // sky (blue)
 * )
 * ```
 */
export const createHemisphereLight = /*#__PURE__*/ Fn(
  ([normal, groundColor, skyColor]) => {
    const hemiMix = normal.y.mul(0.5).add(0.5)
    return mix(groundColor, skyColor, hemiMix)
  }
)
