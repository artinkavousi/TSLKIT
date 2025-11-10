/**
 * Watermelon Material
 * 
 * Watermelon rind pattern
 * 
 * @module materials/watermelon
 */

import { Color } from 'three'
import {
  equirectUV,
  exp,
  mix,
  positionGeometry,
  screenUV,
  select,
  vec3,
} from 'three/tsl'
import { noise, prepare, TSLFn } from './utils.js'

/**
 * Default watermelon parameters
 */
const defaults = {
  $name: 'Watermelon',
  scale: 2,
  stripes: 12,
  variation: 0.5,
  noise: 0.25,
  color: new Color('yellowgreen'),
  background: new Color('darkgreen'),
  flat: 0,
  seed: 0,
}

/**
 * Watermelon material generator
 * 
 * Creates watermelon rind stripe pattern
 * 
 * @param params - Material parameters
 * @param params.scale - Overall scale (default: 2)
 * @param params.stripes - Number of stripes (default: 12)
 * @param params.variation - Pattern variation (default: 0.5)
 * @param params.noise - Noise amount (default: 0.25)
 * @param params.color - Light stripe color (default: yellow-green)
 * @param params.background - Dark stripe color (default: dark green)
 * @param params.flat - Flat mode (0 or 1) (default: 0)
 * @param params.seed - Random seed (default: 0)
 * @returns Color node
 * 
 * @example
 * ```typescript
 * import { watermelon } from '@tslstudio/materials'
 * 
 * material.colorNode = watermelon({
 *   scale: 2.5,
 *   stripes: 15,
 *   variation: 0.6,
 *   color: new Color('lime'),
 *   background: new Color('green')
 * })
 * ```
 */
export const watermelon = TSLFn(([params]: any) => {
  params = prepare([params], defaults)

  const variation = select(params.flat, params.variation.mul(0.85).add(0.15), params.variation)

  const pos = positionGeometry
    .mul(exp(params.scale.div(4).add(2)))
    .add(params.seed)
    .toVar()

  const uv = select(params.flat, screenUV, equirectUV(positionGeometry.normalize())).toVar()
  const a = uv.x
    .mul(params.stripes.round(), select(params.flat, Math.PI, 2 * Math.PI))
    .add(noise(pos.mul(vec3(1, 0.3, 1))).mul(2))

  const k = a
    .sin()
    .add(0.5)
    .div(2)
    .mul(uv.y.remap(0, 1, -Math.PI, Math.PI).cos().add(1.2).clamp(0, 1))
    .add(variation.mul(2, noise(pos.mul(1.5)).div(2)))
    .add(variation.mul(2, noise(pos.mul(4)).div(6)))
    .toVar()

  k.assign(
    k.mix(k.round(), 0.75)
      .add(noise(pos.mul(2)).mul(params.noise, 0.5))
      .add(noise(pos.mul(3)).mul(params.noise, 1))
      .add(noise(pos.mul(15)).mul(params.noise, 0.2))
      .clamp(0, 1)
  )

  const color = mix(params.background, params.color, k).toVar()

  return color
}, defaults)

