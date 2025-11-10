/**
 * Concrete Material
 * 
 * Concrete surface with bumps and irregularities (normal map)
 * 
 * @module materials/concrete
 */

import {
  abs,
  cos,
  cross,
  exp,
  Fn,
  normalLocal,
  positionGeometry,
  pow,
  remap,
  sin,
  sub,
  tangentLocal,
  transformNormalToView,
  vec3,
} from 'three/tsl'
import { noise, prepare, TSLFn } from './utils.js'

/**
 * Default concrete parameters
 */
const defaults = {
  $name: 'Concrete',
  $normalNode: true,
  scale: 2,
  density: 0.5,
  bump: 0.5,
  seed: 0,
}

/**
 * Calculate surface position with bumps
 */
const surfacePos = Fn(([pos, normal, bump, density, seed]: any) => {
  let k = noise(pos.add(seed)).mul(0.5).add(0.5)
  k = bump.mul(pow(abs(k), density))

  return pos.add(k.mul(normal))
})

/**
 * Concrete material generator
 * 
 * Creates realistic concrete surface normal map
 * 
 * Note: This material returns a normal map, not a color.
 * Use with material.normalNode instead of colorNode
 * 
 * @param params - Material parameters
 * @param params.scale - Overall scale (default: 2)
 * @param params.density - Bump density (default: 0.5)
 * @param params.bump - Bump height (default: 0.5)
 * @param params.seed - Random seed (default: 0)
 * @returns Normal node
 * 
 * @example
 * ```typescript
 * import { concrete } from '@tslstudio/materials'
 * 
 * // Use as normal map
 * material.normalNode = concrete({
 *   scale: 2.5,
 *   density: 0.6,
 *   bump: 0.7
 * })
 * 
 * // Set base color separately
 * material.colorNode = vec3(0.7, 0.7, 0.7)
 * ```
 */
export const concrete = TSLFn(([params]: any) => {
  params = prepare([params], defaults)

  const eps = 0.001

  const position = positionGeometry.mul(exp(params.scale.div(2).add(2))).toVar()
  const normal = normalLocal.normalize().toVar()
  const tangent = tangentLocal.normalize().mul(eps).toVar()
  const bitangent = cross(normal, tangent).normalize().mul(eps).toVar()

  const density = remap(params.density, 0, 1, 10, 0.5).toVar()
  const seed = vec3(
    sin(params.seed).mul(100),
    cos(params.seed.div(2)).mul(100),
    sin(params.seed.div(3)).mul(100)
  ).toVar()

  const pos = surfacePos(position, normal, params.bump, density, seed)
  const posU = surfacePos(position.add(tangent), normal, params.bump, density, seed)
  const posV = surfacePos(position.add(bitangent), normal, params.bump, density, seed)

  const dU = sub(posU, pos)
  const dV = sub(posV, pos)

  return transformNormalToView(cross(dU, dV).normalize())
}, defaults)

