/**
 * Rotator Material
 * 
 * 3D rotation transformation
 * 
 * @module materials/rotator
 */

import { Vector2, Vector3 } from 'three'
import {
  cross,
  Fn,
  normalLocal,
  positionGeometry,
  sub,
  tangentLocal,
  transformNormalToView,
  vec4,
} from 'three/tsl'
import { prepare, TSLFn } from './utils.js'
import { matRotYXZ, matTrans, selectPlanar } from './utils-matrix.js'

/**
 * Default rotator parameters
 */
const defaults = {
  $name: 'Rotator',
  $positionNode: true,
  $selectorPlanar: true,
  angles: new Vector3(0.4, -0.6, 0),
  center: new Vector3(0, 0, 0),
  selectorCenter: new Vector3(0, 0, 0),
  selectorAngles: new Vector2(0, 0),
  selectorWidth: 2,
}

/**
 * Calculate surface position with rotation
 */
const surfacePos = Fn(([pos, params]: any) => {
  const zone = selectPlanar(pos, params.selectorAngles, params.selectorCenter, params.selectorWidth)

  const R = matRotYXZ(params.angles.mul(zone))
  const T = matTrans(params.center)
  const TN = matTrans(params.center.negate())

  return T.mul(R).mul(TN).mul(vec4(pos, 1)).xyz
})

/**
 * Rotator material generator
 * 
 * Creates 3D rotation transformation (position node)
 * 
 * Note: This material returns a position transformation, not a color.
 * Use with material.positionNode or custom material setup
 * 
 * @param params - Material parameters
 * @param params.angles - Rotation angles (default: 0.4, -0.6, 0)
 * @param params.center - Rotation center (default: 0, 0, 0)
 * @param params.selectorCenter - Selection center (default: 0, 0, 0)
 * @param params.selectorAngles - Selection angles (default: 0, 0)
 * @param params.selectorWidth - Selection width (default: 2)
 * @returns Position node
 * 
 * @example
 * ```typescript
 * import { rotator } from '@tslstudio/materials'
 * 
 * // Use as position transformation
 * material.positionNode = rotator({
 *   angles: new Vector3(0.5, -0.7, 0.1)
 * })
 * 
 * // Use normal map
 * material.normalNode = rotator.normal({
 *   angles: new Vector3(0.5, -0.7, 0.1)
 * })
 * ```
 */
export const rotator = TSLFn(([params]: any) => {
  params = prepare([params], defaults)

  return surfacePos(positionGeometry, params)
}, defaults)

/**
 * Rotator normal map
 */
;(rotator as any).normal = TSLFn(([params]: any) => {
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

