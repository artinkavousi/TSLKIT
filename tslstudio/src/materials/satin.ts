/**
 * Satin Material
 * 
 * Smooth satin fabric texture
 * 
 * @module materials/satin
 */

import { Color } from 'three'
import {
  abs,
  exp,
  mix,
  positionGeometry,
  pow,
  vec3,
} from 'three/tsl'
import { noise, prepare, TSLFn } from './utils.js'

/**
 * Default satin parameters
 */
const defaults = {
  $name: 'Satin',
  scale: 2,
  color: new Color(0x7080FF),
  background: new Color(0x000050),
  seed: 0,
}

/**
 * Satin fabric material generator
 * 
 * Creates smooth, silky satin texture
 * 
 * @param params - Material parameters
 * @param params.scale - Overall scale (default: 2)
 * @param params.color - Satin color (default: purple-blue)
 * @param params.background - Dark satin color (default: dark blue)
 * @param params.seed - Random seed (default: 0)
 * @returns Color node
 * 
 * @example
 * ```typescript
 * import { satin } from '@tslstudio/materials'
 * 
 * material.colorNode = satin({
 *   scale: 2.5,
 *   color: new Color(0xFF80A0),
 *   background: new Color(0x400020)
 * })
 * ```
 */
export const satin = TSLFn(([params]: any) => {
  params = prepare([params], defaults)

  const pos = positionGeometry.toVar()

  const scale = exp(params.scale.div(3)).toVar()

  const k = noise(
    vec3(
      noise(vec3(pos.x.mul(2), pos.y, pos.z).mul(scale)),
      noise(vec3(pos.x, pos.y.mul(2), pos.z).mul(scale)),
      noise(vec3(pos.x, pos.y, pos.z.mul(2)).mul(scale)),
    ).mul(scale).add(params.seed)
  )

  const finalK = pow(abs(k), 3).mul(20)

  return mix(params.background, params.color, finalK)
}, defaults)

