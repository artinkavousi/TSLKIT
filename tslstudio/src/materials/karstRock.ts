/**
 * Karst Rock Material
 * 
 * Karst rock surface texture
 * 
 * @module materials/karstRock
 */

import { Color } from 'three'
import {
  exp,
  mix,
  positionGeometry,
} from 'three/tsl'
import { noise, prepare, TSLFn } from './utils.js'

/**
 * Default karst rock parameters
 */
const defaults = {
  $name: 'Karst rock',
  scale: 2,
  color: new Color(0xFFF4F0),
  background: new Color(0xD0D0D0),
  seed: 0,
}

/**
 * Karst rock material generator
 * 
 * Creates karst limestone rock texture
 * 
 * @param params - Material parameters
 * @param params.scale - Overall scale (default: 2)
 * @param params.color - Light rock color (default: off-white)
 * @param params.background - Dark rock color (default: gray)
 * @param params.seed - Random seed (default: 0)
 * @returns Color node
 * 
 * @example
 * ```typescript
 * import { karstRock } from '@tslstudio/materials'
 * 
 * material.colorNode = karstRock({
 *   scale: 2.5,
 *   color: new Color(0xFFFFE0),
 *   background: new Color(0xC0C0C0)
 * })
 * ```
 */
export const karstRock = TSLFn(([params]: any) => {
  params = prepare([params], defaults)

  const pos = positionGeometry
    .mul(exp(params.scale))
    .add(params.seed.sin().mul(5))
    .toVar()

  const pos2 = pos.add(noise(pos.mul(2))).toVar()

  const k = noise(pos2).div(noise(pos2.mul(1.01))).clamp(0, 2).toVar()

  k.addAssign(noise(pos.mul(100)).div(3))
  k.addAssign(noise(pos.mul(2)).div(2))

  return mix(params.background, params.color, k).mul(k.pow(0.1))
}, defaults)

