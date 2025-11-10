/**
 * Stars Material
 * 
 * Starfield texture
 * 
 * @module materials/stars
 */

import { Color } from 'three'
import {
  abs,
  add,
  exp,
  mix,
  positionGeometry,
  select,
} from 'three/tsl'
import { hsl, noise, prepare, toHsl, TSLFn } from './utils.js'

/**
 * Default stars parameters
 */
const defaults = {
  $name: 'Stars',
  scale: 2,
  density: 2,
  variation: 0,
  color: new Color(0xfff5f0),
  background: new Color(0x000060),
  seed: 0,
}

/**
 * Stars material generator
 * 
 * Creates starfield texture with color variation
 * 
 * @param params - Material parameters
 * @param params.scale - Overall scale (default: 2)
 * @param params.density - Star density (default: 2)
 * @param params.variation - Color variation (default: 0)
 * @param params.color - Star color (default: warm white)
 * @param params.background - Sky color (default: dark blue)
 * @param params.seed - Random seed (default: 0)
 * @returns Color node
 * 
 * @example
 * ```typescript
 * import { stars } from '@tslstudio/materials'
 * 
 * material.colorNode = stars({
 *   scale: 3,
 *   density: 2.5,
 *   variation: 0.1,
 *   color: new Color(0xFFFFFF),
 *   background: new Color(0x000030)
 * })
 * ```
 */
export const stars = TSLFn(([params]: any) => {
  params = prepare([params], defaults)

  const pos = positionGeometry
    .mul(exp(params.scale.div(2).add(3)))
    .add(params.seed)
    .toVar()

  let k = abs(noise(pos)).pow(10).mul(10)

  k = k.mul(exp(params.density.sub(2)))

  const dS = select(k.greaterThan(0.1), params.variation.mul(noise(pos)), 0)

  const col = toHsl(mix(params.background, params.color, k))

  return hsl(add(col.x, dS), col.y, col.z)
}, defaults)

