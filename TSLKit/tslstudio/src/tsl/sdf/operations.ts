/**
 * SDF Operations
 * 
 * Boolean operations and modifiers for combining and transforming SDFs
 * 
 * @module tsl/sdf/operations
 */

import { Fn, min, max, abs, float, mod } from 'three/tsl'

/**
 * Smooth Minimum (polynomial smooth union)
 * 
 * Smoothly blends two SDFs together
 * 
 * @param a - First SDF value
 * @param b - Second SDF value
 * @param factor - Smoothing factor (higher = smoother)
 * @returns Smooth minimum of a and b
 * 
 * @example
 * ```typescript
 * const blended = smin(sphere1, sphere2, 0.1)
 * ```
 */
export const smin = /*#__PURE__*/ Fn(
  ([a, b, factor]) => {
    const h = max(factor.sub(abs(a.sub(b))), 0).div(factor)
    return min(a, b).sub(h.mul(h).mul(factor).mul(0.25))
  }
)

/**
 * Smooth Maximum (smooth intersection)
 * 
 * Smoothly intersects two SDFs
 * 
 * @param a - First SDF value
 * @param b - Second SDF value
 * @param k - Smoothing factor (default: 0.0)
 * @returns Smooth maximum of a and b
 */
export const smax = /*#__PURE__*/ Fn(
  ([a, b, k = float(0)]) => {
    return smin(a, b, k.negate())
  }
)

/**
 * SDF Union (minimum)
 * 
 * Combines two SDFs using union (minimum distance)
 * 
 * @param d1 - First SDF value
 * @param d2 - Second SDF value
 * @returns Union of the two SDFs
 */
export const sdfUnion = /*#__PURE__*/ Fn(
  ([d1, d2]) => {
    return min(d1, d2)
  }
)

/**
 * SDF Subtraction
 * 
 * Subtracts second SDF from first
 * 
 * @param d1 - First SDF value
 * @param d2 - Second SDF value (to subtract)
 * @returns Subtraction result
 */
export const sdfSubtraction = /*#__PURE__*/ Fn(
  ([d1, d2]) => {
    return max(d1, d2.negate())
  }
)

/**
 * SDF Intersection (maximum)
 * 
 * Intersects two SDFs using maximum distance
 * 
 * @param d1 - First SDF value
 * @param d2 - Second SDF value
 * @returns Intersection of the two SDFs
 */
export const sdfIntersection = /*#__PURE__*/ Fn(
  ([d1, d2]) => {
    return max(d1, d2)
  }
)

/**
 * Smooth Union (using smin)
 * 
 * @param d1 - First SDF value
 * @param d2 - Second SDF value
 * @param k - Smoothing factor
 * @returns Smoothly blended union
 */
export const sdfSmoothUnion = /*#__PURE__*/ Fn(
  ([d1, d2, k]) => {
    return smin(d1, d2, k)
  }
)

/**
 * Smooth Subtraction
 * 
 * @param d1 - First SDF value
 * @param d2 - Second SDF value (to subtract)
 * @param k - Smoothing factor
 * @returns Smoothly blended subtraction
 */
export const sdfSmoothSubtraction = /*#__PURE__*/ Fn(
  ([d1, d2, k]) => {
    return smax(d1, d2.negate(), k)
  }
)

/**
 * Smooth Intersection
 * 
 * @param d1 - First SDF value
 * @param d2 - Second SDF value
 * @param k - Smoothing factor
 * @returns Smoothly blended intersection
 */
export const sdfSmoothIntersection = /*#__PURE__*/ Fn(
  ([d1, d2, k]) => {
    return smax(d1, d2, k)
  }
)

/**
 * SDF Repetition (infinite domain repetition)
 * 
 * Repeats an SDF infinitely in space
 * 
 * @param p - Position vector
 * @param spacing - Repetition spacing
 * @returns Repeated position
 * 
 * @example
 * ```typescript
 * const repeatedPos = sdfRepeat(position, 2.0)
 * const shape = sdSphere(repeatedPos, 0.5)
 * ```
 */
export const sdfRepeat = /*#__PURE__*/ Fn(
  ([p, spacing]) => {
    return mod(p.add(spacing.mul(0.5)), spacing).sub(spacing.mul(0.5))
  }
)

/**
 * SDF Onion (hollowing)
 * 
 * Converts a solid SDF into a hollow shell
 * 
 * @param sdf - SDF value
 * @param thickness - Shell thickness
 * @returns Hollowed SDF
 */
export const sdfOnion = /*#__PURE__*/ Fn(
  ([sdf, thickness]) => {
    return abs(sdf).sub(thickness)
  }
)
