/**
 * 3D Curl Noise
 * 
 * Based on https://al-ro.github.io/projects/embers/
 * 
 * @module tsl/noise/curlNoise3d
 */

import {
  Fn,
  vec3,
  cross,
  float,
} from 'three/tsl'
import { simplexNoise3d } from './simplexNoise3d.js'

/**
 * 3D Curl Noise Function
 * 
 * Generates divergence-free vector field using curl of noise
 * Useful for fluid-like motion and particle systems
 * 
 * @param input - 3D position vector
 * @returns Curl noise vector (divergence-free)
 * 
 * @example
 * ```typescript
 * import { curlNoise3d } from '@tslstudio/tsl/noise'
 * 
 * const velocity = curlNoise3d(position)
 * ```
 */
export const curlNoise3d = /*#__PURE__*/ Fn(
  ([inputA]) => {
    const eps = float(0.0001)
    
    // Compute gradient of noise along X axis
    const aXPos = simplexNoise3d(inputA.add(vec3(eps, 0, 0)))
    const aXNeg = simplexNoise3d(inputA.sub(vec3(eps, 0, 0)))
    const aXAverage = aXPos.sub(aXNeg).div(eps.mul(2))
    
    // Compute gradient along Y axis
    const aYPos = simplexNoise3d(inputA.add(vec3(0, eps, 0)))
    const aYNeg = simplexNoise3d(inputA.sub(vec3(0, eps, 0)))
    const aYAverage = aYPos.sub(aYNeg).div(eps.mul(2))
    
    // Compute gradient along Z axis
    const aZPos = simplexNoise3d(inputA.add(vec3(0, 0, eps)))
    const aZNeg = simplexNoise3d(inputA.sub(vec3(0, 0, eps)))
    const aZAverage = aZPos.sub(aZNeg).div(eps.mul(2))
    
    const aGrabNoise = vec3(aXAverage, aYAverage, aZAverage).normalize()
    
    // Offset position for second noise sample
    const inputB = inputA.add(3.5)
    
    // Compute second gradient field
    const bXPos = simplexNoise3d(inputB.add(vec3(eps, 0, 0)))
    const bXNeg = simplexNoise3d(inputB.sub(vec3(eps, 0, 0)))
    const bXAverage = bXPos.sub(bXNeg).div(eps.mul(2))
    
    const bYPos = simplexNoise3d(inputB.add(vec3(0, eps, 0)))
    const bYNeg = simplexNoise3d(inputB.sub(vec3(0, eps, 0)))
    const bYAverage = bYPos.sub(bYNeg).div(eps.mul(2))
    
    const bZPos = simplexNoise3d(inputB.add(vec3(0, 0, eps)))
    const bZNeg = simplexNoise3d(inputB.sub(vec3(0, 0, eps)))
    const bZAverage = bZPos.sub(bZNeg).div(eps.mul(2))
    
    const bGrabNoise = vec3(bXAverage, bYAverage, bZAverage).normalize()
    
    // Curl = cross product of the two gradient fields
    return cross(aGrabNoise, bGrabNoise).normalize()
  }
).setLayout({
  name: 'curlNoise3d',
  type: 'vec3',
  inputs: [{ name: 'input', type: 'vec3' }],
})
