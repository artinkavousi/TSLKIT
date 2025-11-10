/**
 * 3D Rotation Functions
 * 
 * @module tsl/math/rotate3dY
 */

import { Fn, vec3, vec2, cos, sin } from 'three/tsl'

/**
 * Rotate a 3D point around the Y axis
 * 
 * @param p - 3D position to rotate
 * @param angle - Rotation angle in radians
 * @returns Rotated position
 * 
 * @example
 * ```typescript
 * const rotated = rotate3dY(position, time)
 * ```
 */
export const rotate3dY = /*#__PURE__*/ Fn(
  ([p, angle]) => {
    const c = cos(angle)
    const s = sin(angle)
    return vec3(
      p.x.mul(c).sub(p.z.mul(s)),
      p.y,
      p.x.mul(s).add(p.z.mul(c))
    )
  }
)

/**
 * Rotate a 3D point around the X axis
 * 
 * @param p - 3D position to rotate
 * @param angle - Rotation angle in radians
 * @returns Rotated position
 */
export const rotate3dX = /*#__PURE__*/ Fn(
  ([p, angle]) => {
    const c = cos(angle)
    const s = sin(angle)
    return vec3(
      p.x,
      p.y.mul(c).sub(p.z.mul(s)),
      p.y.mul(s).add(p.z.mul(c))
    )
  }
)

/**
 * Rotate a 3D point around the Z axis
 * 
 * @param p - 3D position to rotate
 * @param angle - Rotation angle in radians
 * @returns Rotated position
 */
export const rotate3dZ = /*#__PURE__*/ Fn(
  ([p, angle]) => {
    const c = cos(angle)
    const s = sin(angle)
    return vec3(
      p.x.mul(c).sub(p.y.mul(s)),
      p.x.mul(s).add(p.y.mul(c)),
      p.z
    )
  }
)

/**
 * Rotate a 2D point
 * 
 * @param p - 2D position to rotate
 * @param angle - Rotation angle in radians
 * @returns Rotated position
 */
export const rotate2d = /*#__PURE__*/ Fn(
  ([p, angle]) => {
    const c = cos(angle)
    const s = sin(angle)
    return vec2(
      p.x.mul(c).sub(p.y.mul(s)),
      p.x.mul(s).add(p.y.mul(c))
    )
  }
)
