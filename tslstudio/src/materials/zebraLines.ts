/**
 * Zebra Lines Material
 * 
 * Zebra stripe pattern
 * 
 * @module materials/zebraLines
 */

import { Color } from 'three'
import {
  acos,
  clamp,
  cos,
  exp,
  mix,
  positionGeometry,
  select,
  sin,
  vec2,
} from 'three/tsl'
import { prepare, spherical, TSLFn } from './utils.js'

/**
 * Default zebra lines parameters
 */
const defaults = {
  $name: 'Zebra lines',
  scale: 2,
  thinness: 0.5,
  phi: 0,
  theta: 0,
  color: new Color(0x000000),
  background: new Color(0xFFFFFF),
  flat: 0,
}

/**
 * Zebra lines material generator
 * 
 * Creates zebra stripe pattern
 * 
 * @param params - Material parameters
 * @param params.scale - Overall scale (default: 2)
 * @param params.thinness - Stripe thinness (default: 0.5)
 * @param params.phi - Phi angle (default: 0)
 * @param params.theta - Theta angle (default: 0)
 * @param params.color - Stripe color (default: black)
 * @param params.background - Background color (default: white)
 * @param params.flat - Flat mode (0 or 1) (default: 0)
 * @returns Color node
 * 
 * @example
 * ```typescript
 * import { zebraLines } from '@tslstudio/materials'
 * 
 * material.colorNode = zebraLines({
 *   scale: 2.5,
 *   thinness: 0.6,
 *   phi: 0.5,
 *   color: new Color(0x000000)
 * })
 * ```
 */
export const zebraLines = TSLFn(([params]: any) => {
  params = prepare([params], defaults)

  const pos = select(params.flat, positionGeometry, positionGeometry.normalize()).toVar()

  const dir = select(
    params.flat,
    vec2(cos(params.phi), sin(params.phi)),
    spherical(params.phi, params.theta)
  ).toVar()

  const angle = select(
    params.flat,
    clamp(dir.dot(pos), -2, 2),
    acos(clamp(dir.dot(pos), -1, 1))
  ).toVar()

  const scale = exp(params.scale.add(1)).toVar()

  let k = sin(angle.mul(scale)).sub(params.thinness.sub(0.5).mul(2))

  k = clamp(k.mul(1000).div(scale), -1, 1).mul(0.5).add(0.5)

  return mix(params.background, params.color, k)
}, defaults)

