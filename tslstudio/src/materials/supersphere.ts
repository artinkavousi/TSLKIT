/**
 * Supersphere Material
 * 
 * Superquadric sphere deformation
 * 
 * @module materials/supersphere
 */

import {
  cross,
  float,
  Fn,
  normalLocal,
  positionGeometry,
  sub,
  tangentLocal,
  transformNormalToView,
} from 'three/tsl'
import { prepare, TSLFn } from './utils.js'

/**
 * Default supersphere parameters
 */
const defaults = {
  $name: 'Supersphere',
  $positionNode: true,
  exponent: 3,
}

/**
 * Calculate supersphere surface position
 */
const surfacePos = Fn(([pos, params]: any) => {
  const exponent = float(2).pow(params.exponent)
  const equPos = pos.div(pos.length()).toVar()

  const p = equPos.x
    .abs()
    .pow(exponent)
    .add(equPos.y.abs().pow(exponent))
    .add(equPos.z.abs().pow(exponent))
    .pow(float(1).div(exponent))

  return equPos.div(p)
})

/**
 * Supersphere material generator
 * 
 * Creates superquadric sphere deformation (position node)
 * 
 * Note: This material returns a position deformation, not a color.
 * Use with material.positionNode or custom material setup
 * 
 * @param params - Material parameters
 * @param params.exponent - Exponent for superquadric (default: 3)
 * @returns Position node
 * 
 * @example
 * ```typescript
 * import { supersphere } from '@tslstudio/materials'
 * 
 * // Use as position deformation
 * material.positionNode = supersphere({
 *   exponent: 4
 * })
 * 
 * // Use normal map
 * material.normalNode = supersphere.normal({
 *   exponent: 4
 * })
 * ```
 */
export const supersphere = TSLFn(([params]: any) => {
  params = prepare([params], defaults)

  return surfacePos(positionGeometry, params)
}, defaults)

/**
 * Supersphere normal map
 */
;(supersphere as any).normal = TSLFn(([params]: any) => {
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

