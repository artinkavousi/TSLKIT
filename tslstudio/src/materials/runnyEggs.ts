/**
 * Runny Eggs Material
 * 
 * Fried egg pattern with yolk and white
 * 
 * @module materials/runnyEggs
 */

import { Color } from 'three'
import {
  cross,
  exp,
  Fn,
  mix,
  mx_worley_noise_float,
  normalLocal,
  positionGeometry,
  sub,
  tangentLocal,
  transformNormalToView,
} from 'three/tsl'
import { prepare, TSLFn } from './utils.js'

/**
 * Default runny eggs parameters
 */
const defaults = {
  $name: 'Runny eggs',
  scale: 1,
  sizeYolk: 0.2,
  sizeWhite: 0.7,
  colorYolk: new Color('orange'),
  colorWhite: new Color('white'),
  colorBackground: new Color('lightgray'),
  seed: 0,
}

/**
 * Calculate surface position with eggs
 */
const surfacePos = Fn(([pos, normal, bump, sizeYolk, sizeWhite]: any) => {
  const n = mx_worley_noise_float(pos).toVar()
  const whites = n.add(sizeWhite).pow(8).oneMinus()
  const yolks = n.add(sizeYolk).pow(18).oneMinus().clamp(0, 1)

  const k = mix(0, mix(0, 1, yolks), whites)

  return pos.add(normal.mul(k).mul(bump))
})

/**
 * Runny eggs material generator
 * 
 * Creates fried egg pattern with yolk and white
 * 
 * @param params - Material parameters
 * @param params.scale - Overall scale (default: 1)
 * @param params.sizeYolk - Yolk size (default: 0.2)
 * @param params.sizeWhite - White size (default: 0.7)
 * @param params.colorYolk - Yolk color (default: orange)
 * @param params.colorWhite - White color (default: white)
 * @param params.colorBackground - Background color (default: light gray)
 * @param params.seed - Random seed (default: 0)
 * @returns Color node
 * 
 * @example
 * ```typescript
 * import { runnyEggs } from '@tslstudio/materials'
 * 
 * material.colorNode = runnyEggs({
 *   scale: 1.5,
 *   sizeYolk: 0.25,
 *   colorYolk: new Color(0xFFCC00)
 * })
 * 
 * // Use normal map
 * material.normalNode = runnyEggs.normal({
 *   scale: 1.5
 * })
 * 
 * // Use roughness map
 * material.roughnessNode = runnyEggs.roughness({
 *   scale: 1.5
 * })
 * ```
 */
export const runnyEggs = TSLFn(([params]: any) => {
  params = prepare([params], defaults)

  const pos = positionGeometry
    .mul(exp(params.scale.div(1)))
    .add(params.seed.sin().mul(10))
    .toVar()

  const sizeYolk = params.sizeYolk.oneMinus()
  const sizeWhite = params.sizeWhite.oneMinus()

  const n = mx_worley_noise_float(pos).toVar()
  const whites = n.add(sizeWhite).pow(8).oneMinus().clamp(-0.5, 1)
  const yolks = n.add(sizeYolk).pow(18).oneMinus().clamp(0, 1).pow(0.4).clamp(0, 1)

  return mix(params.colorBackground, mix(params.colorWhite, params.colorYolk, yolks), whites)
}, defaults)

/**
 * Runny eggs normal map
 */
;(runnyEggs as any).normal = TSLFn(([params]: any) => {
  params = prepare([params], defaults)

  const eps = 0.001
  const bump = 0.05

  const position = positionGeometry
    .mul(exp(params.scale.div(1)))
    .add(params.seed.sin().mul(10))
    .toVar()
  const normal = normalLocal.normalize().toVar()
  const tangent = tangentLocal.normalize().mul(eps).toVar()
  const bitangent = cross(normal, tangent).normalize().mul(eps).toVar()

  const sizeYolk = params.sizeYolk.oneMinus()
  const sizeWhite = params.sizeWhite.oneMinus()

  const pos = surfacePos(position, normal, bump, sizeYolk, sizeWhite)
  const posU = surfacePos(position.add(tangent), normal, bump, sizeYolk, sizeWhite)
  const posV = surfacePos(position.add(bitangent), normal, bump, sizeYolk, sizeWhite)

  const dU = sub(posU, pos)
  const dV = sub(posV, pos)

  return transformNormalToView(cross(dU, dV).normalize())
}, defaults)

/**
 * Runny eggs roughness map
 */
;(runnyEggs as any).roughness = TSLFn(([params]: any) => {
  params = prepare([params], defaults)

  const pos = positionGeometry
    .mul(exp(params.scale.div(1)))
    .add(params.seed.sin().mul(10))
    .toVar()

  const sizeYolk = params.sizeYolk.oneMinus()

  const n = mx_worley_noise_float(pos).toVar()
  const yolks = n.add(sizeYolk).pow(18).clamp(0, 1)

  return yolks
}, defaults)

