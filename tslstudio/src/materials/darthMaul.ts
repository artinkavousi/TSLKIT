/**
 * Darth Maul Material
 * 
 * Star Wars inspired face paint pattern
 * 
 * @module materials/darthMaul
 */

import { Color, Vector3 } from 'three'
import {
  exp,
  mix,
  positionGeometry,
  select,
  vec3,
} from 'three/tsl'
import { noise, prepare, TSLFn } from './utils.js'

/**
 * Default darth maul parameters
 */
const defaults = {
  $name: 'Darth Maul',
  scale: 2,
  shift: new Vector3(0, 0, 0),
  complexity: 0,
  angle: 60,
  distance: 1.9,
  color: new Color(0xF04040),
  background: new Color(0x000000),
  balance: 0,
  seed: 0,
}

/**
 * Darth Maul material generator
 * 
 * Creates Star Wars inspired face paint pattern
 * 
 * @param params - Material parameters
 * @param params.scale - Overall scale (default: 2)
 * @param params.shift - Position shift (default: 0,0,0)
 * @param params.complexity - Pattern complexity (default: 0)
 * @param params.angle - Stripe angle (default: 60)
 * @param params.distance - Stripe distance (default: 1.9)
 * @param params.color - Paint color (default: red)
 * @param params.background - Skin color (default: black)
 * @param params.balance - Pattern balance (default: 0)
 * @param params.seed - Random seed (default: 0)
 * @returns Color node
 * 
 * @example
 * ```typescript
 * import { darthMaul } from '@tslstudio/materials'
 * 
 * material.colorNode = darthMaul({
 *   scale: 2.5,
 *   complexity: 0.5,
 *   angle: 45,
 *   color: new Color(0xFF0000)
 * })
 * ```
 */
export const darthMaul = TSLFn(([params]: any) => {
  params = prepare([params], defaults)

  const position = positionGeometry
    .add(params.shift)
    .mul(exp(params.scale.div(1.5).sub(1)))
    .sub(params.shift)
    .mul(vec3(1, 1 / 2, 1 / 2))
    .toVar()

  const s = select(
    positionGeometry.y
      .mul(params.angle.radians().cos())
      .add(positionGeometry.z.mul(params.angle.radians().sin()))
      .greaterThan(params.distance),
    1,
    0
  )

  // Implement symmetry
  position.x.assign(position.x.add(params.shift.x).abs())
  position.y.addAssign(params.seed)
  position.z.mulAssign(params.shift.z)

  const n = noise(position).toVar()

  const k = n
    .sin()
    .mul(n.mul(params.complexity.mul(2).add(1).exp()).sin())
    .remap(0, 0.2, 1, -1)
    .greaterThan(params.balance)
    .select(0, 1)

  const c = select(position.x.greaterThan(noise(position.mul(2.3)).abs().mul(0.5).add(0.02)), 1, 0)

  return mix(params.background, params.color, k.mul(s).mul(c).clamp(0, 1))
}, defaults)

