/**
 * Simplex Noise Material
 * 
 * Basic simplex noise visualization
 * 
 * @module materials/simplexNoise
 */

import { Color } from 'three'
import {
  clamp,
  exp,
  mix,
  positionGeometry,
} from 'three/tsl'
import { noise, prepare, TSLFn } from './utils.js'

/**
 * Default simplex noise parameters
 */
const defaults = {
  $name: 'Simplex noise',
  scale: 2,
  balance: 0,
  contrast: 0,
  color: new Color(0xFFFFFF),
  background: new Color(0x000000),
  seed: 0,
}

/**
 * Simplex noise material generator
 * 
 * Creates basic simplex noise visualization
 * 
 * @param params - Material parameters
 * @param params.scale - Overall scale (default: 2)
 * @param params.balance - Brightness balance (default: 0)
 * @param params.contrast - Contrast amount (default: 0)
 * @param params.color - High value color (default: white)
 * @param params.background - Low value color (default: black)
 * @param params.seed - Random seed (default: 0)
 * @returns Color node
 * 
 * @example
 * ```typescript
 * import { simplexNoise } from '@tslstudio/materials'
 * 
 * material.colorNode = simplexNoise({
 *   scale: 3,
 *   contrast: 0.5,
 *   color: new Color(0xFFFFFF),
 *   background: new Color(0x000000)
 * })
 * ```
 */
export const simplexNoise = TSLFn(([params]: any) => {
  params = prepare([params], defaults)

  const pos = positionGeometry.mul(exp(params.scale)).add(params.seed)

  const k = clamp(0, 1, noise(pos).mul(0.5, exp(params.contrast)).add(0.5, params.balance))

  return mix(params.background, params.color, k)
}, defaults)

