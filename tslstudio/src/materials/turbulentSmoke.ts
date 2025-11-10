/**
 * Turbulent Smoke Material
 * 
 * Turbulent smoke/fog effect
 * 
 * @module materials/turbulentSmoke
 */

import {
  exp,
  mx_fractal_noise_float,
  mx_fractal_noise_vec3,
  mx_worley_noise_float,
  positionGeometry,
  time,
  vec3,
} from 'three/tsl'
import { prepare, TSLFn } from './utils.js'

/**
 * Default turbulent smoke parameters
 */
const defaults = {
  $name: 'Turbulent smoke',
  scale: 2,
  speed: 0,
  details: 5,
  seed: 0,
}

/**
 * Turbulent smoke material generator
 * 
 * Creates turbulent smoke/fog effect
 * 
 * @param params - Material parameters
 * @param params.scale - Overall scale (default: 2)
 * @param params.speed - Animation speed (default: 0)
 * @param params.details - Detail level (default: 5)
 * @param params.seed - Random seed (default: 0)
 * @returns Grayscale node
 * 
 * @example
 * ```typescript
 * import { turbulentSmoke } from '@tslstudio/materials'
 * 
 * material.colorNode = turbulentSmoke({
 *   scale: 2.5,
 *   speed: 1.0,
 *   details: 6
 * })
 * ```
 */
export const turbulentSmoke = TSLFn(([params]: any) => {
  params = prepare([params], defaults)

  const pos = positionGeometry
    .mul(exp(params.scale.sub(1)))
    .add(params.seed)
    .toVar()

  const t = time.mul(params.speed.sub(1).exp())

  const q = pos.add(
    vec3(
      mx_fractal_noise_float(pos.add(vec3(1, t.sin(), -1))),
      mx_fractal_noise_float(pos.add(vec3(t.add((2 * Math.PI) / 3).sin(), 1, -1))),
      mx_fractal_noise_float(pos.add(vec3(1, -1, t.add((4 * Math.PI) / 3).sin())))
    )
  )

  const p = mx_fractal_noise_vec3(q, params.details)

  const k = mx_worley_noise_float(pos.add(p.div(2))).pow(4).mul(4).oneMinus()

  return k
}, defaults)

