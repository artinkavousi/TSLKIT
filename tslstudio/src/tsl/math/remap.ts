/**
 * Remap/Map Range Functions
 * 
 * @module tsl/math/remap
 */

import { Fn } from 'three/tsl'

/**
 * Remap a value from one range to another
 * 
 * @param value - Input value
 * @param inMin - Input range minimum
 * @param inMax - Input range maximum
 * @param outMin - Output range minimum
 * @param outMax - Output range maximum
 * @returns Remapped value
 * 
 * @example
 * ```typescript
 * // Remap from [0, 1] to [-1, 1]
 * const remapped = remap(value, 0, 1, -1, 1)
 * ```
 */
export const remap = /*#__PURE__*/ Fn(
  ([value, inMin, inMax, outMin, outMax]) => {
    return outMin.add(value.sub(inMin).mul(outMax.sub(outMin)).div(inMax.sub(inMin)))
  }
)

/**
 * Normalized remap from [0, 1] to [outMin, outMax]
 * 
 * @param value - Input value in range [0, 1]
 * @param outMin - Output range minimum
 * @param outMax - Output range maximum
 * @returns Remapped value
 */
export const remapFrom01 = /*#__PURE__*/ Fn(
  ([value, outMin, outMax]) => {
    return outMin.add(value.mul(outMax.sub(outMin)))
  }
)

/**
 * Remap to [0, 1] from arbitrary range
 * 
 * @param value - Input value
 * @param inMin - Input range minimum
 * @param inMax - Input range maximum
 * @returns Normalized value in [0, 1]
 */
export const remapTo01 = /*#__PURE__*/ Fn(
  ([value, inMin, inMax]) => {
    return value.sub(inMin).div(inMax.sub(inMin))
  }
)
