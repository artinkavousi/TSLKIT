/**
 * Photosphere Material
 * 
 * Solar photosphere surface
 * 
 * @module materials/photosphere
 */

import { Color } from 'three'
import {
  exp,
  Loop,
  mix,
  positionGeometry,
  vec3,
} from 'three/tsl'
import { applyEuler, noise, prepare, TSLFn } from './utils.js'

/**
 * Default photosphere parameters
 */
const defaults = {
  $name: 'Photosphere',
  scale: 2,
  color: new Color(0xFFFF00),
  background: new Color(0xFF0000),
  seed: 0,
}

/**
 * Photosphere material generator
 * 
 * Creates solar photosphere surface pattern
 * 
 * @param params - Material parameters
 * @param params.scale - Overall scale (default: 2)
 * @param params.color - Surface color (default: yellow)
 * @param params.background - Deep color (default: red)
 * @param params.seed - Random seed (default: 0)
 * @returns Color node
 * 
 * @example
 * ```typescript
 * import { photosphere } from '@tslstudio/materials'
 * 
 * material.colorNode = photosphere({
 *   scale: 2.5,
 *   color: new Color(0xFFFFCC),
 *   background: new Color(0xFF6600)
 * })
 * ```
 */
export const photosphere = TSLFn(([params]: any) => {
  params = prepare([params], defaults)

  const scale = exp(params.scale.add(1)).toVar()
  const pos = positionGeometry.toVar()

  const vec = vec3(pos).toVar()

  Loop(6, () => {
    vec.assign(applyEuler(vec, pos.mul(scale)))
    scale.mulAssign(params.seed.mul(scale).sin().mul(0.05).add(1.1))
  })

  const k = noise(vec).add(1).div(2)

  return mix(params.background, params.color, k)
}, defaults)

