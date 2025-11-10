/**
 * Scream Material
 * 
 * Edvard Munch's "The Scream" inspired pattern
 * 
 * @module materials/scream
 */

import { Color } from 'three'
import {
  add,
  cos,
  exp,
  mix,
  positionGeometry,
  sin,
} from 'three/tsl'
import { hsl, noise, prepare, toHsl, TSLFn } from './utils.js'

/**
 * Default scream parameters
 */
const defaults = {
  $name: 'Scream',
  scale: 2,
  variety: 1,
  color: new Color(0xF0F060),
  background: new Color(0xD09090),
  seed: 0,
}

/**
 * Scream material generator
 * 
 * Creates Edvard Munch's "The Scream" inspired pattern
 * 
 * @param params - Material parameters
 * @param params.scale - Overall scale (default: 2)
 * @param params.variety - Color variety (default: 1)
 * @param params.color - Primary color (default: yellow)
 * @param params.background - Background color (default: pink)
 * @param params.seed - Random seed (default: 0)
 * @returns Color node
 * 
 * @example
 * ```typescript
 * import { scream } from '@tslstudio/materials'
 * 
 * material.colorNode = scream({
 *   scale: 2.5,
 *   variety: 1.5,
 *   color: new Color(0xFFFF00),
 *   background: new Color(0xFF9090)
 * })
 * ```
 */
export const scream = TSLFn(([params]: any) => {
  params = prepare([params], defaults)

  let pos = positionGeometry.mul(exp(params.scale)).add(params.seed).toVar()

  let k = noise(add(sin(pos.xyz), cos(pos.yzx)))

  pos.assign(positionGeometry.mul(exp(params.scale).mul(k)).add(params.seed))

  k = noise(add(sin(pos.xyz), cos(pos.yzx)).mul(2))

  const col = mix(params.background, params.color, k).toVar()

  const HSL = toHsl(col).toVar()

  return hsl(add(HSL.x, params.variety.mul(sin(k.mul(Math.PI))).mul(0.5)), HSL.y, HSL.z)
}, defaults)

