/**
 * Tiger Fur Material
 * 
 * Tiger fur stripe pattern
 * 
 * @module materials/tigerFur
 */

import { Color } from 'three'
import {
  exp,
  mix,
  positionGeometry,
  vec3,
} from 'three/tsl'
import { noise, prepare, TSLFn } from './utils.js'

/**
 * Default tiger fur parameters
 */
const defaults = {
  $name: 'Tiger fur',
  scale: 2,
  lengths: 4,
  blur: 0.3,
  strength: 0.3,
  hairs: 0.5,
  color: new Color(0xFFAA00),
  bottomColor: new Color(0xFFFFEE),
  seed: 0,
}

/**
 * Tiger fur material generator
 * 
 * Creates realistic tiger stripe pattern
 * 
 * @param params - Material parameters
 * @param params.scale - Overall scale (default: 2)
 * @param params.lengths - Stripe length (default: 4)
 * @param params.blur - Stripe blur (default: 0.3)
 * @param params.strength - Stripe strength (default: 0.3)
 * @param params.hairs - Hair detail (default: 0.5)
 * @param params.color - Stripe color (default: orange)
 * @param params.bottomColor - Base fur color (default: cream)
 * @param params.seed - Random seed (default: 0)
 * @returns Color node
 * 
 * @example
 * ```typescript
 * import { tigerFur } from '@tslstudio/materials'
 * 
 * material.colorNode = tigerFur({
 *   scale: 2.5,
 *   lengths: 5,
 *   strength: 0.4,
 *   color: new Color(0xFF9900)
 * })
 * ```
 */
export const tigerFur = TSLFn(([params]: any) => {
  params = prepare([params], defaults)

  const scale = params.scale.div(2).add(1).toVar()
  const pos = positionGeometry.mul(exp(scale)).add(params.seed).toVar()

  const len = params.lengths.add(5).reciprocal().toVar()
  const hairs = params.hairs.mul(0.3).toVar()
  let k = noise(pos.mul(scale, vec3(1, len, len)))
  k = k.add(noise(pos.mul(vec3(25, 1, 1))).add(1).mul(hairs))
  k = k.add(params.strength.sub(0.5)).smoothstep(params.blur.negate(), params.blur).oneMinus()

  const n = positionGeometry.y.add(hairs.sub(0.5)).smoothstep(-1, 0.5)

  return mix(params.bottomColor, params.color, n).mul(k)
}, defaults)

