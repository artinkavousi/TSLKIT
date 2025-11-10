/**
 * Marble Material
 * 
 * Procedural marble texture with veining patterns
 * 
 * @module materials/marble
 */

import { Color } from 'three'
import {
  add,
  div,
  exp,
  If,
  mix,
  mul,
  oneMinus,
  positionGeometry,
  pow,
} from 'three/tsl'
import { noise, prepare, TSLFn } from './utils.js'

/**
 * Default marble parameters
 */
const defaults = {
  $name: 'Marble',
  scale: 1.2,
  thinness: 5,
  noise: 0.3,
  color: new Color(0x4545D3),
  background: new Color(0xF0F8FF),
  seed: 0,
}

/**
 * Marble material generator
 * 
 * Creates realistic marble patterns with veining
 * 
 * @param params - Material parameters
 * @param params.scale - Overall scale (default: 1.2)
 * @param params.thinness - Vein thinness (default: 5)
 * @param params.noise - Noise amount (default: 0.3)
 * @param params.color - Primary color (default: blue)
 * @param params.background - Background color (default: light blue)
 * @param params.seed - Random seed (default: 0)
 * @returns Color node
 * 
 * @example
 * ```typescript
 * import { marble } from '@tslstudio/materials'
 * 
 * material.colorNode = marble({
 *   scale: 1.5,
 *   thinness: 6,
 *   color: new Color(0x8B4513),
 *   background: new Color(0xF5F5DC)
 * })
 * ```
 */
export const marble = TSLFn(([params]: any) => {
  params = prepare([params], defaults)

  const pos = positionGeometry
    .mul(exp(params.scale))
    .add(params.seed)
    .toVar()

  const k = add(
    noise(pos),
    noise(pos.mul(2)).mul(0.5),
    noise(pos.mul(6)).mul(0.1)
  ).toVar()

  k.assign(oneMinus(k.abs().pow(2.5)))

  const maxSmooth = oneMinus(pow(0.5, params.thinness.add(7))).toVar()
  const minSmooth = oneMinus(pow(0.5, params.thinness.add(7).mul(0.5))).toVar()

  If(k.greaterThan(maxSmooth), () => {
    k.assign(1)
  })
    .ElseIf(k.lessThan(minSmooth), () => {
      k.assign(0)
    })
    .Else(() => {
      const a = k.sub(minSmooth)
      const b = maxSmooth.sub(minSmooth)
      k.assign(pow(div(a, b), 5).mul(0.75))
      k.assign(k.mul(add(0.5, noise(pos.mul(2)).mul(1.5))))
    })

  k.assign(k.add(mul(params.noise, noise(pos.mul(150)).abs().pow3())))

  return mix(params.background, params.color, k)
}, defaults)

