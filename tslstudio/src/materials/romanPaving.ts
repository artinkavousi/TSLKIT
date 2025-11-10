/**
 * Roman Paving Material
 * 
 * Roman-style stone paving pattern
 * 
 * @module materials/romanPaving
 */

import {
  exp,
  mx_worley_noise_vec2,
  positionGeometry,
} from 'three/tsl'
import { prepare, TSLFn } from './utils.js'

/**
 * Default roman paving parameters
 */
const defaults = {
  $name: 'Roman paving',
  scale: 2,
  depth: 0.5,
  seed: 0,
}

/**
 * Roman paving material generator
 * 
 * Creates Roman-style stone paving pattern
 * 
 * @param params - Material parameters
 * @param params.scale - Overall scale (default: 2)
 * @param params.depth - Joint depth (default: 0.5)
 * @param params.seed - Random seed (default: 0)
 * @returns Grayscale node
 * 
 * @example
 * ```typescript
 * import { romanPaving } from '@tslstudio/materials'
 * 
 * material.colorNode = romanPaving({
 *   scale: 2.5,
 *   depth: 0.7
 * })
 * ```
 */
export const romanPaving = TSLFn(([params]: any) => {
  params = prepare([params], defaults)

  const pos = positionGeometry.mul(exp(params.scale)).add(params.seed).toVar()

  const k = mx_worley_noise_vec2(pos).toVar()

  return k.y.sub(k.x).pow(params.depth.mul(3).sub(3).exp()).smoothstep(0, 1)
}, defaults)

