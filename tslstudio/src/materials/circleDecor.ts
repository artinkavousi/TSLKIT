/**
 * Circle Decor Material
 * 
 * Decorative circular pattern
 * 
 * @module materials/circleDecor
 */

import { Color } from 'three'
import {
  exp,
  mix,
  mx_worley_noise_float,
  positionGeometry,
} from 'three/tsl'
import { noise, prepare, TSLFn } from './utils.js'

/**
 * Default circle decor parameters
 */
const defaults = {
  $name: 'Circle decor',
  scale: 2,
  grains: 0.2,
  complexity: 1,
  blur: 0.2,
  color: new Color(0x000000),
  background: new Color(0xFFFFFF),
  seed: 0,
}

/**
 * Circle decor material generator
 * 
 * Creates decorative circular pattern
 * 
 * @param params - Material parameters
 * @param params.scale - Overall scale (default: 2)
 * @param params.grains - Grain detail (default: 0.2)
 * @param params.complexity - Pattern complexity (default: 1)
 * @param params.blur - Edge blur (default: 0.2)
 * @param params.color - Pattern color (default: black)
 * @param params.background - Background color (default: white)
 * @param params.seed - Random seed (default: 0)
 * @returns Color node
 * 
 * @example
 * ```typescript
 * import { circleDecor } from '@tslstudio/materials'
 * 
 * material.colorNode = circleDecor({
 *   scale: 2.5,
 *   complexity: 1.5,
 *   color: new Color(0x000080)
 * })
 * ```
 */
export const circleDecor = TSLFn(([params]: any) => {
  params = prepare([params], defaults)

  const pos = positionGeometry
    .mul(exp(params.scale.div(4)))
    .add(params.seed)
    .toVar()
  const subpos = pos.mul(2).toVar()

  const k1 = mx_worley_noise_float(pos)
  const k2 = mx_worley_noise_float(subpos)
  const k3 = mx_worley_noise_float(pos.mul(params.grains.mul(4).add(2))).mul(2)

  const compScale = noise(pos).div(2).add(1)

  const k = k1
    .min(k2, k3)
    .clamp(0, 1)
    .mul(params.complexity.add(2).exp(), compScale, Math.PI)
    .sin()
    .smoothstep(params.blur.negate(), params.blur)

  return mix(params.color, params.background, k.oneMinus())
}, defaults)

