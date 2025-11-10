/**
 * Protozoa Material
 * 
 * Microscopic organism pattern
 * 
 * @module materials/protozoa
 */

import { Color } from 'three'
import {
  exp,
  float,
  Fn,
  Loop,
  matcapUV,
  mix,
  positionGeometry,
  vec3,
} from 'three/tsl'
import { noise, prepare, TSLFn } from './utils.js'

/**
 * Default protozoa parameters
 */
const defaults = {
  $name: 'Protozoa',
  scale: 1.5,
  fat: 0.7,
  amount: 0.4,
  color: new Color(0xA0A0A0),
  subcolor: new Color(0xE0E8FF),
  background: new Color(0xF0F8FF),
  seed: 0,
}

/**
 * Processed noise function
 */
const pnoise = Fn(([pos, fat]: any) => {
  return noise(pos).mul(fat).clamp(-3.14, 3.14).cos().add(1).div(2)
})

/**
 * Protozoa material generator
 * 
 * Creates microscopic organism pattern
 * 
 * @param params - Material parameters
 * @param params.scale - Overall scale (default: 1.5)
 * @param params.fat - Ring fatness (default: 0.7)
 * @param params.amount - Pattern amount (default: 0.4)
 * @param params.color - Primary color (default: gray)
 * @param params.subcolor - Secondary color (default: light blue)
 * @param params.background - Background color (default: alice blue)
 * @param params.seed - Random seed (default: 0)
 * @returns Color node
 * 
 * @example
 * ```typescript
 * import { protozoa } from '@tslstudio/materials'
 * 
 * material.colorNode = protozoa({
 *   scale: 2,
 *   fat: 0.8,
 *   amount: 0.5,
 *   color: new Color(0x808080),
 *   subcolor: new Color(0xCCDDFF)
 * })
 * ```
 */
export const protozoa = TSLFn(([params]: any) => {
  params = prepare([params], defaults)

  const pos = positionGeometry
    .mul(exp(params.scale.sub(1)))
    .add(params.seed)
    .toVar()

  const matcap = vec3(matcapUV, matcapUV.length()).toVar()

  const rings1 = float(0).toVar()
  const rings2 = float(0).toVar()

  const n1 = float(0).toVar()
  const n2 = float(0).toVar()

  const fat = params.fat.add(0.2).oneMinus().mul(60).add(30).toVar()
  const scale = float(2).toVar()

  const dPos = params.amount.div(2).add(0.5).exp().toVar()

  Loop(10, () => {
    rings1.assign(pnoise(pos.xyz.add(matcap), fat))
    rings2.assign(pnoise(pos.yzx.add(matcap), fat))

    n1.addAssign(rings1.mul(rings2).mul(scale))
    n2.addAssign(rings1.max(rings2).mul(scale))

    pos.assign(mix(pos.mul(dPos), 0, 0.4))

    scale.mulAssign(0.9)
  })

  return mix(params.background, mix(params.color, params.subcolor, n2.mul(0.1)), n1)
}, defaults)

