/**
 * Melter Material
 * 
 * Melting/warping effect
 * 
 * @module materials/melter
 */

import { Vector2, Vector3 } from 'three'
import {
  cross,
  float,
  Fn,
  normalLocal,
  positionGeometry,
  sub,
  tangentLocal,
  transformNormalToView,
  vec4,
} from 'three/tsl'
import { noise, prepare, TSLFn } from './utils.js'
import { matTrans } from './utils-matrix.js'

/**
 * Default melter parameters
 */
const defaults = {
  $name: 'Melter',
  $positionNode: true,
  $selectorPlanar: true,
  distance: new Vector3(0, -0.5, 0),
  selectorCenter: new Vector3(0, 0, 0),
  selectorAngles: new Vector2(0, 0),
  selectorWidth: 1.7,
}

/**
 * Calculate surface position with melting
 */
const surfacePos = Fn(([pos, params]: any) => {
  const zone = float(1).toVar()
  const n = noise(pos.mul(2)).add(1).div(2) // noise factor
  const k = params.distance.normalize().dot(normalLocal.normalize()).max(0).pow(10)

  const T = matTrans(params.distance.mul(zone).mul(n).mul(k).pow(0.1))

  return T.mul(vec4(pos, 1)).xyz
})

/**
 * Melter material generator
 * 
 * Creates melting/warping effect (position node)
 * 
 * Note: This material returns a position transformation, not a color.
 * Use with material.positionNode or custom material setup
 * 
 * @param params - Material parameters
 * @param params.distance - Melt direction (default: 0, -0.5, 0)
 * @param params.selectorCenter - Selection center (default: 0, 0, 0)
 * @param params.selectorAngles - Selection angles (default: 0, 0)
 * @param params.selectorWidth - Selection width (default: 1.7)
 * @returns Position node
 * 
 * @example
 * ```typescript
 * import { melter } from '@tslstudio/materials'
 * 
 * // Use as position transformation
 * material.positionNode = melter({
 *   distance: new Vector3(0, -1, 0)
 * })
 * 
 * // Use normal map
 * material.normalNode = melter.normal({
 *   distance: new Vector3(0, -1, 0)
 * })
 * ```
 */
export const melter = TSLFn(([params]: any) => {
  params = prepare([params], defaults)

  return surfacePos(positionGeometry, params)
}, defaults)

/**
 * Melter normal map
 */
;(melter as any).normal = TSLFn(([params]: any) => {
  params = prepare([params], defaults)

  const eps = 0.01

  const position = positionGeometry
  const normal = normalLocal.normalize().toVar()
  const tangent = tangentLocal.normalize().mul(eps).toVar()
  const bitangent = cross(normal, tangent).normalize().mul(eps).toVar()

  const pos = surfacePos(position, params)
  const posU = surfacePos(position.add(tangent), params)
  const posV = surfacePos(position.add(bitangent), params)

  const dU = sub(posU, pos)
  const dV = sub(posV, pos)

  return transformNormalToView(cross(dU, dV).normalize())
}, defaults)

