/**
 * Rough Clay Material
 * 
 * Rough clay surface normal map
 * 
 * @module materials/roughClay
 */

import {
  cross,
  exp,
  Fn,
  mx_worley_noise_float,
  normalLocal,
  positionGeometry,
  sub,
  tangentLocal,
  transformNormalToView,
} from 'three/tsl'
import { noise, prepare, TSLFn } from './utils.js'

/**
 * Default rough clay parameters
 */
const defaults = {
  $name: 'Rough clay',
  $normalNode: true,
  scale: 2,
  bump: 0.5,
  curvature: 0.2,
  seed: 0,
}

/**
 * Calculate surface position with roughness
 */
const surfacePos = Fn(([pos, normal, bump, curvature]: any) => {
  const k1 = mx_worley_noise_float(pos.add(noise(pos).mul(curvature)))
    .add(0.8)
    .pow(5)
    .toVar()
  k1.addAssign(k1.pow(0.5))
  return pos.add(normal.mul(k1).mul(bump))
})

/**
 * Rough clay material generator
 * 
 * Creates rough clay surface normal map
 * 
 * Note: This material returns a normal map, not a color.
 * Use with material.normalNode instead of colorNode
 * 
 * @param params - Material parameters
 * @param params.scale - Overall scale (default: 2)
 * @param params.bump - Bump height (default: 0.5)
 * @param params.curvature - Surface curvature (default: 0.2)
 * @param params.seed - Random seed (default: 0)
 * @returns Normal node
 * 
 * @example
 * ```typescript
 * import { roughClay } from '@tslstudio/materials'
 * 
 * // Use as normal map
 * material.normalNode = roughClay({
 *   scale: 2.5,
 *   bump: 0.6,
 *   curvature: 0.3
 * })
 * ```
 */
export const roughClay = TSLFn(([params]: any) => {
  params = prepare([params], defaults)

  const eps = 0.001

  const bump = params.bump.div(50).toVar()

  const position = positionGeometry
    .mul(exp(params.scale.div(2)))
    .add(params.seed.sin().mul(10))
    .toVar()
  const normal = normalLocal.normalize().toVar()
  const tangent = tangentLocal.normalize().mul(eps).toVar()
  const bitangent = cross(normal, tangent).normalize().mul(eps).toVar()

  const pos = surfacePos(position, normal, bump, params.curvature)
  const posU = surfacePos(position.add(tangent), normal, bump, params.curvature)
  const posV = surfacePos(position.add(bitangent), normal, bump, params.curvature)

  const dU = sub(posU, pos)
  const dV = sub(posV, pos)

  return transformNormalToView(cross(dU, dV).normalize())
}, defaults)

