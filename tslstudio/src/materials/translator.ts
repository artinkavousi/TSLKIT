/**
 * Translator Material
 * 
 * 3D translation transformation
 * 
 * @module materials/translator
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
import { matTrans, selectPlanar } from './utils-matrix.js'

/**
 * Default translator parameters
 */
const defaults = {
  $name: 'Translator',
  $positionNode: true,
  $selectorPlanar: true,
  distance: new Vector3(-0.5, 0, 0.2),
  selectorCenter: new Vector3(0, 0, 0),
  selectorAngles: new Vector2(0, 0),
  selectorWidth: 0.7,
}

/**
 * Calculate surface position with translation
 */
const surfacePos = Fn(([pos, params]: any) => {
  const zone = selectPlanar(pos, params.selectorAngles, params.selectorCenter, params.selectorWidth)

  const T = matTrans(params.distance.mul(zone))

  return T.mul(vec4(pos, 1)).xyz
})

/**
 * Translator material generator
 * 
 * Creates 3D translation transformation (position node)
 * 
 * Note: This material returns a position transformation, not a color.
 * Use with material.positionNode or custom material setup
 * 
 * @param params - Material parameters
 * @param params.distance - Translation distance (default: -0.5, 0, 0.2)
 * @param params.selectorCenter - Selection center (default: 0, 0, 0)
 * @param params.selectorAngles - Selection angles (default: 0, 0)
 * @param params.selectorWidth - Selection width (default: 0.7)
 * @returns Position node
 * 
 * @example
 * ```typescript
 * import { translator } from '@tslstudio/materials'
 * 
 * // Use as position transformation
 * material.positionNode = translator({
 *   distance: new Vector3(0, -1, 0)
 * })
 * 
 * // Use normal map
 * material.normalNode = translator.normal({
 *   distance: new Vector3(0, -1, 0)
 * })
 * ```
 */
export const translator = TSLFn(([params]: any) => {
  params = prepare([params], defaults)

  return surfacePos(positionGeometry, params)
}, defaults)

/**
 * Translator normal map
 */
;(translator as any).normal = TSLFn(([params]: any) => {
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

