/**
 * Caustics Material
 * 
 * Water caustics light patterns
 * 
 * @module materials/caustics
 */

import { Color } from 'three'
import {
  exp,
  mx_worley_noise_float,
  mx_worley_noise_vec3,
  positionGeometry,
  time,
  vec3,
} from 'three/tsl'
import { prepare, TSLFn } from './utils.js'

/**
 * Default caustics parameters
 */
const defaults = {
  $name: 'Caustics',
  scale: 2,
  speed: 0,
  color: new Color(0x50A8C0),
  seed: 0,
}

/**
 * Caustics material generator
 * 
 * Creates animated water caustics light patterns
 * 
 * @param params - Material parameters
 * @param params.scale - Overall scale (default: 2)
 * @param params.speed - Animation speed (default: 0)
 * @param params.color - Caustics color tint (default: cyan)
 * @param params.seed - Random seed (default: 0)
 * @returns Color node
 * 
 * @example
 * ```typescript
 * import { caustics } from '@tslstudio/materials'
 * 
 * material.colorNode = caustics({
 *   scale: 2.5,
 *   speed: 1.0,
 *   color: new Color(0x60C0E0)
 * })
 * ```
 */
export const caustics = TSLFn(([params]: any) => {
  params = prepare([params], defaults)

  const pos = positionGeometry
    .mul(exp(params.scale.sub(1)))
    .add(params.seed)
    .toVar()

  const t = time
    .mul(params.speed.sub(1).exp())
    .add(vec3(0, (2 * Math.PI) / 3, (4 * Math.PI) / 3))
    .sin()

  const p = mx_worley_noise_vec3(
    pos.add(
      vec3(
        mx_worley_noise_float(pos.add(t.xyz)),
        mx_worley_noise_float(pos.add(t.yzx)),
        mx_worley_noise_float(pos.add(t.zxy)),
      )
    )
  )

  const k = p.length().div(Math.sqrt(3))

  return k.add(params.color.sub(0.5).mul(2))
}, defaults)

