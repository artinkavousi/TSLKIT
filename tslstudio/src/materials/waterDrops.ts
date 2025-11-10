/**
 * Water Drops Material
 * 
 * Water droplets surface normal map
 * 
 * @module materials/waterDrops
 */

import {
  cos,
  cross,
  exp,
  Fn,
  normalLocal,
  positionGeometry,
  remap,
  sin,
  sub,
  tangentLocal,
  transformNormalToView,
  vec3,
} from 'three/tsl'
import { noise, prepare, TSLFn } from './utils.js'

/**
 * Default water drops parameters
 */
const defaults = {
  $name: 'Water Drops',
  $normalNode: true,
  scale: 1.4,
  density: 0.5,
  bump: 0.6,
  seed: 0,
}

/**
 * Calculate surface position with droplets
 */
const surfacePos = Fn(([pos, normal, bump, density, seed]: any) => {
  let k = noise(pos.add(seed)).add(density).clamp(0, 1)
  k = cos(k.mul(Math.PI)).add(1).pow(0.5).toVar()

  return pos.add(k.mul(normal, bump))
})

/**
 * Water drops material generator
 * 
 * Creates water droplet normal map
 * 
 * Note: This material returns a normal map, not a color.
 * Use with material.normalNode instead of colorNode
 * 
 * @param params - Material parameters
 * @param params.scale - Overall scale (default: 1.4)
 * @param params.density - Droplet density (default: 0.5)
 * @param params.bump - Droplet height (default: 0.6)
 * @param params.seed - Random seed (default: 0)
 * @returns Normal node
 * 
 * @example
 * ```typescript
 * import { waterDrops } from '@tslstudio/materials'
 * 
 * // Use as normal map
 * material.normalNode = waterDrops({
 *   scale: 1.5,
 *   density: 0.6,
 *   bump: 0.7
 * })
 * ```
 */
export const waterDrops = TSLFn(([params]: any) => {
  params = prepare([params], defaults)

  const eps = 0.001

  const position = positionGeometry.mul(exp(params.scale.div(1).add(1))).toVar()
  const normal = normalLocal.normalize().toVar()
  const tangent = tangentLocal.normalize().mul(eps).toVar()
  const bitangent = cross(normal, tangent).normalize().mul(eps).toVar()

  const density = remap(params.density, 0, 1, 1.5, 0.7).toVar()
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

