/**
 * 4D Curl Noise
 * 
 * Based on https://al-ro.github.io/projects/embers/
 * Extended to 4D
 * 
 * @module tsl/noise/curlNoise4d
 */

import {
  Fn,
  vec3,
  vec4,
  cross,
  float,
} from 'three/tsl'
import { simplexNoise4d } from './simplexNoise4d.js'

/**
 * 4D Curl Noise Function
 * 
 * Generates divergence-free vector field using curl of 4D noise
 * The 4th dimension can be used for time-varying animation
 * 
 * @param input - 4D position vector (xyz + time/variation)
 * @returns Curl noise vector (divergence-free)
 * 
 * @example
 * ```typescript
 * import { curlNoise4d } from '@tslstudio/tsl/noise'
 * 
 * const velocity = curlNoise4d(vec4(position, time))
 * ```
 */
export const curlNoise4d = /*#__PURE__*/ Fn(
  ([inputA]) => {
    const eps = float(0.0001)
    
    // Compute gradient of noise along X axis
    const aXPos = simplexNoise4d(inputA.add(vec4(eps, 0, 0, 0)))
    const aXNeg = simplexNoise4d(inputA.sub(vec4(eps, 0, 0, 0)))
    const aXAverage = aXPos.sub(aXNeg).div(eps.mul(2))
    
    // Compute gradient along Y axis
    const aYPos = simplexNoise4d(inputA.add(vec4(0, eps, 0, 0)))
    const aYNeg = simplexNoise4d(inputA.sub(vec4(0, eps, 0, 0)))
    const aYAverage = aYPos.sub(aYNeg).div(eps.mul(2))
    
    // Compute gradient along Z axis
    const aZPos = simplexNoise4d(inputA.add(vec4(0, 0, eps, 0)))
    const aZNeg = simplexNoise4d(inputA.sub(vec4(0, 0, eps, 0)))
    const aZAverage = aZPos.sub(aZNeg).div(eps.mul(2))
    
    const aGrabNoise = vec3(aXAverage, aYAverage, aZAverage).normalize()
    
    // Second noise sample
    const inputB = inputA.add(3.5)
    
    // Compute second gradient field
    const bXPos = simplexNoise4d(inputB.add(vec4(eps, 0, 0, 0)))
    const bXNeg = simplexNoise4d(inputB.sub(vec4(eps, 0, 0, 0)))
    const bXAverage = bXPos.sub(bXNeg).div(eps.mul(2))
    
    const bYPos = simplexNoise4d(inputB.add(vec4(0, eps, 0, 0)))
    const bYNeg = simplexNoise4d(inputB.sub(vec4(0, eps, 0, 0)))
    const bYAverage = bYPos.sub(bYNeg).div(eps.mul(2))
    
    const bZPos = simplexNoise4d(inputB.add(vec4(0, 0, eps, 0)))
    const bZNeg = simplexNoise4d(inputB.sub(vec4(0, 0, eps, 0)))
    const bZAverage = bZPos.sub(bZNeg).div(eps.mul(2))
    
    const bGrabNoise = vec3(bXAverage, bYAverage, bZAverage).normalize()
    
    // Curl = cross product of the two gradient fields
    return cross(aGrabNoise, bGrabNoise).normalize()
  }
).setLayout({
  name: 'curlNoise4d',
  type: 'vec3',
  inputs: [{ name: 'input', type: 'vec4' }],
})
