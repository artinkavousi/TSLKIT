/**
 * Screen Aspect UV Correction
 * 
 * @module tsl/utils/screenAspectUv
 */

import { float, Fn, uv, vec2, select } from 'three/tsl'

/**
 * Screen Aspect UV
 * 
 * Adjusts UV coordinates to maintain aspect ratio
 * Useful for preventing distortion on non-square viewports
 * 
 * @param r - Render size (vec2: width, height)
 * @param range - UV range (default: 0.5 for [-0.5, 0.5])
 * @returns Aspect-corrected UV coordinates
 * 
 * @example
 * ```typescript
 * const aspectUv = screenAspectUV(resolution, 0.5)
 * const circle = length(aspectUv).sub(0.3)
 * ```
 */
export const screenAspectUV = /*#__PURE__*/ Fn(
  ([r, range = float(0.5)]) => {
    const _uv = uv().sub(range)
    const final = select(
      r.x.greaterThan(r.y),
      vec2(_uv.x.mul(r.x.div(r.y)), _uv.y),
      vec2(_uv.x, _uv.y.mul(r.y.div(r.x)))
    )
    
    return final
  }
)
