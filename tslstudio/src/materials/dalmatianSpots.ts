/**
 * Dalmatian Spots Material
 * 
 * Dalmatian dog coat spot pattern
 * 
 * @module materials/dalmatianSpots
 */

import { Color } from 'three'
import {
  exp,
  float,
  Loop,
  mix,
  positionGeometry,
} from 'three/tsl'
import { noise, prepare, TSLFn } from './utils.js'

/**
 * Default dalmatian spots parameters
 */
const defaults = {
  $name: 'Dalmatian spots',
  scale: 2,
  density: 0.6,
  color: new Color(0xFFFFFF),
  background: new Color(0x000000),
  seed: 0,
}

/**
 * Dalmatian spots material generator
 * 
 * Creates dalmatian dog coat spot pattern
 * 
 * @param params - Material parameters
 * @param params.scale - Overall scale (default: 2)
 * @param params.density - Spot density (default: 0.6)
 * @param params.color - Spot color (default: white)
 * @param params.background - Base color (default: black)
 * @param params.seed - Random seed (default: 0)
 * @returns Color node
 * 
 * @example
 * ```typescript
 * import { dalmatianSpots } from '@tslstudio/materials'
 * 
 * material.colorNode = dalmatianSpots({
 *   scale: 2.5,
 *   density: 0.7,
 *   color: new Color(0xFFFFFF),
 *   background: new Color(0x000000)
 * })
 * ```
 */
export const dalmatianSpots = TSLFn(([params]: any) => {
  params = prepare([params], defaults)

  const pos = positionGeometry
    .mul(exp(params.scale))
    .add(params.seed)
    .sub(1000)
    .toVar()

  const k = float(1).toVar()

  const d = float(1.5).sub(params.density).mul(2).toVar()
  const count = params.density.mul(5).add(5).toVar()

  Loop(count, () => {
    k.mulAssign(noise(pos).abs().pow(d).mul(100).sub(50).clamp(0, 1).oneMinus())
    pos.assign(pos.mul(1.01))
    k.mulAssign(noise(pos.yzx).abs().pow(d).mul(100).sub(50).clamp(0, 1).oneMinus())
    pos.assign(pos.mul(1.01))
    k.mulAssign(noise(pos.zxy).abs().pow(d).mul(100).sub(50).clamp(0, 1).oneMinus())
    pos.assign(pos.mul(1.01))
  })

  return mix(params.background, params.color, k.clamp(0, 1))
}, defaults)

