/**
 * Fordite Material
 * 
 * Detroit agate / automotive paint layering
 * 
 * @module materials/fordite
 */

import { Color } from 'three'
import {
  exp,
  mul,
  positionGeometry,
  sin,
  vec3,
} from 'three/tsl'
import { hsl, noise, prepare, TSLFn } from './utils.js'

/**
 * Default fordite parameters
 */
const defaults = {
  $name: 'Fordite',
  scale: 2,
  color: new Color(0, 0, 0),
  seed: 0,
}

/**
 * Fordite material generator
 * 
 * Creates Detroit agate (automotive paint layering) pattern
 * 
 * @param params - Material parameters
 * @param params.scale - Overall scale (default: 2)
 * @param params.color - Color tint (default: black)
 * @param params.seed - Random seed (default: 0)
 * @returns Color node
 * 
 * @example
 * ```typescript
 * import { fordite } from '@tslstudio/materials'
 * 
 * material.colorNode = fordite({
 *   scale: 2.5,
 *   color: new Color(0.1, 0.1, 0.1)
 * })
 * ```
 */
export const fordite = TSLFn(([params]: any) => {
  params = prepare([params], defaults)

  const pos = positionGeometry.mul(exp(params.scale)).add(params.seed).toVar()

  const k = noise(
    vec3(noise(pos), noise(pos).mul(2), noise(pos).mul(3))
  ).toVar()

  return hsl(k, 1, sin(mul(k, Math.PI, 4)).mul(0.5).add(0.5)).add(params.color)
}, defaults)

