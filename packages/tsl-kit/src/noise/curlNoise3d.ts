/**
 * 3D Curl Noise
 * 
 * @author Maxime Heckel (original), Based on https://al-ro.github.io/projects/embers/
 * @source https://github.com/MaximeHeckel/fragments-boilerplate
 * @license MIT
 * @version Ported to Three.js r181+
 * 
 * Generates divergence-free 3D noise using curl of simplex noise gradient.
 * Produces swirling, fluid-like vector fields ideal for particle systems,
 * fluid simulation, and organic motion.
 * 
 * The curl operation ensures the output vector field has zero divergence,
 * making it perfect for incompressible flow simulation.
 * 
 * @param input - 3D input coordinate (vec3)
 * @returns Normalized curl vector (vec3)
 * 
 * @example
 * ```typescript
 * import { curlNoise3d } from '@tslstudio/tsl-kit/noise'
 * import { vec3 } from 'three/tsl'
 * 
 * // Use for particle velocity field
 * const velocity = curlNoise3d(position.mul(0.5))
 * position.addAssign(velocity.mul(deltaTime))
 * ```
 */

import { EPSILON, cross, Fn, vec3 } from 'three/tsl'
import { simplexNoise3d } from './simplexNoise3d'

export const curlNoise3d = /*#__PURE__*/ Fn(([inputA_immutable]) => {
  const inputA = vec3(inputA_immutable).toVar()
  
  // Compute gradient of first noise field using central differences
  // X component gradient
  const aXPos = simplexNoise3d(inputA.add(vec3(EPSILON, 0, 0)))
  const aXNeg = simplexNoise3d(inputA.sub(vec3(EPSILON, 0, 0)))
  const aXAverage = aXPos.sub(aXNeg).div(EPSILON.mul(2))

  // Y component gradient
  const aYPos = simplexNoise3d(inputA.add(vec3(0, EPSILON, 0)))
  const aYNeg = simplexNoise3d(inputA.sub(vec3(0, EPSILON, 0)))
  const aYAverage = aYPos.sub(aYNeg).div(EPSILON.mul(2))

  // Z component gradient
  const aZPos = simplexNoise3d(inputA.add(vec3(0, 0, EPSILON)))
  const aZNeg = simplexNoise3d(inputA.sub(vec3(0, 0, EPSILON)))
  const aZAverage = aZPos.sub(aZNeg).div(EPSILON.mul(2))

  const aGrabNoise = vec3(aXAverage, aYAverage, aZAverage).normalize()

  // Offset position for second noise read to avoid correlation
  const inputB = inputA.add(3.5) // Offset breaks simplex pattern

  // Compute gradient of second noise field
  // X component gradient
  const bXPos = simplexNoise3d(inputB.add(vec3(EPSILON, 0, 0)))
  const bXNeg = simplexNoise3d(inputB.sub(vec3(EPSILON, 0, 0)))
  const bXAverage = bXPos.sub(bXNeg).div(EPSILON.mul(2))

  // Y component gradient
  const bYPos = simplexNoise3d(inputB.add(vec3(0, EPSILON, 0)))
  const bYNeg = simplexNoise3d(inputB.sub(vec3(0, EPSILON, 0)))
  const bYAverage = bYPos.sub(bYNeg).div(EPSILON.mul(2))

  // Z component gradient
  const bZPos = simplexNoise3d(inputB.add(vec3(0, 0, EPSILON)))
  const bZNeg = simplexNoise3d(inputB.sub(vec3(0, 0, EPSILON)))
  const bZAverage = bZPos.sub(bZNeg).div(EPSILON.mul(2))

  const bGrabNoise = vec3(bXAverage, bYAverage, bZAverage).normalize()

  // Curl is the cross product of the two gradients
  return cross(aGrabNoise, bGrabNoise).normalize()
  
  // @ts-ignore
}).setLayout({
  name: 'curlNoise3d',
  type: 'vec3',
  inputs: [{ name: 'input', type: 'vec3' }],
})

