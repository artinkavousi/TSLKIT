/**
 * Reticular Veins Material
 * 
 * Biological cell vein network
 * 
 * @module materials/reticularVeins
 */

import { Color } from 'three'
import {
  exp,
  mix,
  mx_worley_noise_float,
  positionGeometry,
} from 'three/tsl'
import { noise, prepare, TSLFn } from './utils.js'

/**
 * Default reticular veins parameters
 */
const defaults = {
  $name: 'Reticular veins',
  scale: 2,
  reticulation: 5,
  strength: 0.2,
  organelles: 0.2,
  color: new Color(0xFFFFF0),
  background: new Color(0x208020),
  seed: 0,
}

/**
 * Reticular veins material generator
 * 
 * Creates biological cell vein network
 * 
 * @param params - Material parameters
 * @param params.scale - Overall scale (default: 2)
 * @param params.reticulation - Vein density (default: 5)
 * @param params.strength - Vein strength (default: 0.2)
 * @param params.organelles - Organelle amount (default: 0.2)
 * @param params.color - Cell color (default: cream)
 * @param params.background - Vein color (default: green)
 * @param params.seed - Random seed (default: 0)
 * @returns Color node
 * 
 * @example
 * ```typescript
 * import { reticularVeins } from '@tslstudio/materials'
 * 
 * material.colorNode = reticularVeins({
 *   scale: 2.5,
 *   reticulation: 6,
 *   strength: 0.3,
 *   color: new Color(0xFFFFE0),
 *   background: new Color(0x20A020)
 * })
 * ```
 */
export const reticularVeins = TSLFn(([params]: any) => {
  params = prepare([params], defaults)

  const pos = positionGeometry
    .mul(exp(params.scale.div(2).add(0.5)))
    .add(params.seed)
    .toVar()

  const k1 = mx_worley_noise_float(pos.mul(1))
  const k2 = mx_worley_noise_float(pos.add(100).mul(params.reticulation)).mul(params.strength)
  const dots = noise(pos.mul(100)).mul(params.strength, params.organelles)

  const k = k1.add(k2).add(dots)

  return mix(params.background, params.color, k)
}, defaults)

