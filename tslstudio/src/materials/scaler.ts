/**
 * Scaler Material
 * 
 * 3D scaling transformation
 * 
 * @module materials/scaler
 */

import { Vector2, Vector3 } from 'three'
import {
  cross,
  Fn,
  mix,
  normalLocal,
  positionGeometry,
  sub,
  tangentLocal,
  transformNormalToView,
  vec3,
  vec4,
} from 'three/tsl'
import { prepare, TSLFn } from './utils.js'
import { matScale, matTrans, selectPlanar } from './utils-matrix.js'

/**
 * Default scaler parameters
 */
const defaults = {
  $name: 'Scaler',
  $positionNode: true,
  $selectorPlanar: true,
  scales: new Vector3(0.01, 0.9, 1.7),
  center: new Vector3(0, 0, 0),
  selectorCenter: new Vector3(0, 0, 0),
  selectorAngles: new Vector2(0, 0),
  selectorWidth: 2,
}

/**
 * Calculate surface position with scaling
 */
const surfacePos = Fn(([pos, params]: any) => {
  const zone = selectPlanar(pos, params.selectorAngles, params.selectorCenter, params.selectorWidth)

  const S = matScale(mix(vec3(1, 1, 1), params.scales, zone))
  const T = matTrans(params.center)
  const TN = matTrans(params.center.negate())

  return T.mul(S).mul(TN).mul(vec4(pos, 1)).xyz
})

/**
 * Scaler material generator
 * 
 * Creates 3D scaling transformation (position node)
 * 
 * Note: This material returns a position transformation, not a color.
 * Use with material.positionNode or custom material setup
 * 
 * @param params - Material parameters
 * @param params.scales - Scale factors (default: 0.01, 0.9, 1.7)
 * @param params.center - Scale center (default: 0, 0, 0)
 * @param params.selectorCenter - Selection center (default: 0, 0, 0)
 * @param params.selectorAngles - Selection angles (default: 0, 0)
 * @param params.selectorWidth - Selection width (default: 2)
 * @returns Position node
 * 
 * @example
 * ```typescript
 * import { scaler } from '@tslstudio/materials'
 * 
 * // Use as position transformation
 * material.positionNode = scaler({
 *   scales: new Vector3(0.5, 1.5, 1.0)
 * })
 * 
 * // Use normal map
 * material.normalNode = scaler.normal({
 *   scales: new Vector3(0.5, 1.5, 1.0)
 * })
 * ```
 */
export const scaler = TSLFn(([params]: any) => {
  params = prepare([params], defaults)

  return surfacePos(positionGeometry, params)
}, defaults)

/**
 * Scaler normal map
 */
;(scaler as any).normal = TSLFn(([params]: any) => {
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

