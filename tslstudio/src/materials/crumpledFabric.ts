/**
 * Crumpled Fabric Material
 * 
 * Wrinkled fabric texture
 * 
 * @module materials/crumpledFabric
 */

import { Color } from 'three'
import {
  exp,
  Loop,
  positionGeometry,
  vec3,
} from 'three/tsl'
import { noise, prepare, TSLFn } from './utils.js'

/**
 * Default crumpled fabric parameters
 */
const defaults = {
  $name: 'Crumpled fabric',
  scale: 2,
  pinch: 0.5,
  color: new Color(0xB0F0FF),
  subcolor: new Color(0x4040F0),
  background: new Color(0x003000),
  seed: 0,
}

/**
 * Crumpled fabric material generator
 * 
 * Creates wrinkled fabric texture with multiple colors
 * 
 * @param params - Material parameters
 * @param params.scale - Overall scale (default: 2)
 * @param params.pinch - Wrinkle amount (default: 0.5)
 * @param params.color - Main fabric color (default: light blue)
 * @param params.subcolor - Secondary color (default: blue)
 * @param params.background - Shadow color (default: dark green)
 * @param params.seed - Random seed (default: 0)
 * @returns Color node
 * 
 * @example
 * ```typescript
 * import { crumpledFabric } from '@tslstudio/materials'
 * 
 * material.colorNode = crumpledFabric({
 *   scale: 2.5,
 *   pinch: 0.7,
 *   color: new Color(0xFFFFFF),
 *   subcolor: new Color(0x8080FF)
 * })
 * ```
 */
export const crumpledFabric = TSLFn(([params]: any) => {
  params = prepare([params], defaults)

  const pos = positionGeometry
    .mul(exp(params.scale.sub(0.5)))
    .add(params.seed)
    .toVar()

  Loop(4, () => {
    const x = noise(pos.xyz).mul(params.pinch)
    const y = noise(pos.yzx).mul(params.pinch)
    const z = noise(pos.zxy).mul(params.pinch)

    pos.addAssign(vec3(x, y, z))
  })

  const k = noise(pos).add(1).div(2).clamp(0, 1)

  const color1 = params.color.mul(k.mul(2).sub(1).abs().oneMinus())
  const color2 = params.subcolor.mul(k).pow(2)
  const color3 = params.background.mul(k.oneMinus().pow(2))

  return color1.add(color2).add(color3)
}, defaults)

