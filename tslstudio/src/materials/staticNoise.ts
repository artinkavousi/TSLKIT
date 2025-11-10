/**
 * Static Noise Material
 * 
 * TV static / white noise effect
 * 
 * @module materials/staticNoise
 */

import {
  clamp,
  exp,
  screenCoordinate,
  time,
  vec3,
} from 'three/tsl'
import { noise, prepare, TSLFn, vnoise } from './utils.js'

/**
 * Default static noise parameters
 */
const defaults = {
  $name: 'Static noise',
  scale: 2,
  balance: 0,
  contrast: 0,
  delay: 0,
  seed: 0,
}

/**
 * Static noise material generator
 * 
 * Creates TV static / white noise effect
 * 
 * @param params - Material parameters
 * @param params.scale - Overall scale (default: 2)
 * @param params.balance - Brightness balance (default: 0)
 * @param params.contrast - Contrast amount (default: 0)
 * @param params.delay - Animation delay (default: 0)
 * @param params.seed - Random seed (default: 0)
 * @returns Color node
 * 
 * @example
 * ```typescript
 * import { staticNoise } from '@tslstudio/materials'
 * 
 * material.colorNode = staticNoise({
 *   scale: 3,
 *   contrast: 0.5,
 *   delay: 0.5
 * })
 * ```
 */
export const staticNoise = TSLFn(([params]: any) => {
  params = prepare([params], defaults)

  const pos = screenCoordinate.div(exp(params.scale)).add(params.seed)

  const speed = params.delay.sub(1).mul(5).exp()
  const t = time.div(speed).round().mul(speed)

  const offset = vnoise(t.sin()).mul(1000)

  let k = clamp(0, 1, noise(pos.add(offset)))

  k = k.mul(0.5, exp(params.contrast)).add(0.5, params.balance)

  return vec3(k)
}, defaults)

