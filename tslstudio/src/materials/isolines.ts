/**
 * Isolines Material
 * 
 * Contour/topographic map lines
 * 
 * @module materials/isolines
 */

import { Color } from 'three'
import {
  add,
  exp,
  mix,
  oneMinus,
  positionGeometry,
  sin,
  smoothstep,
  sub,
} from 'three/tsl'
import { noise, prepare, TSLFn } from './utils.js'

/**
 * Default isolines parameters
 */
const defaults = {
  $name: 'Isolines',
  scale: 2,
  density: 40,
  blur: 0.3,
  thinness: 0.6,
  color: new Color(0xFFFFFF),
  background: new Color(0x000000),
  seed: 0,
}

/**
 * Isolines material generator
 * 
 * Creates contour/topographic map lines
 * 
 * @param params - Material parameters
 * @param params.scale - Overall scale (default: 2)
 * @param params.density - Line density (default: 40)
 * @param params.blur - Line blur (default: 0.3)
 * @param params.thinness - Line thinness (default: 0.6)
 * @param params.color - Line color (default: white)
 * @param params.background - Background color (default: black)
 * @param params.seed - Random seed (default: 0)
 * @returns Color node
 * 
 * @example
 * ```typescript
 * import { isolines } from '@tslstudio/materials'
 * 
 * material.colorNode = isolines({
 *   scale: 2.5,
 *   density: 50,
 *   thinness: 0.7,
 *   color: new Color(0x00FFFF)
 * })
 * ```
 */
export const isolines = TSLFn(([params]: any) => {
  params = prepare([params], defaults)

  const pos = positionGeometry.mul(exp(params.scale)).add(params.seed).toVar()

  let k = noise(pos).mul(params.density)

  k = oneMinus(sin(k)).div(2)

  k = smoothstep(sub(params.thinness, params.blur), add(params.thinness, params.blur), k)

  return mix(params.color, params.background, k)
}, defaults)

