/**
 * Circles Material
 * 
 * Concentric circles pattern with color variation
 * 
 * @module materials/circles
 */

import { Color } from 'three'
import {
  acos,
  clamp,
  exp,
  float,
  positionGeometry,
  select,
  sin,
} from 'three/tsl'
import { hsl, prepare, toHsl, TSLFn } from './utils.js'

/**
 * Default circles parameters
 */
const defaults = {
  $name: 'Circles',
  scale: 2,
  variety: 1,
  color: new Color(0xF0E0D0),
  flat: 0,
  seed: 0,
}

/**
 * Circles material generator
 * 
 * Creates concentric circles with color variation
 * 
 * @param params - Material parameters
 * @param params.scale - Overall scale (default: 2)
 * @param params.variety - Color variety (default: 1)
 * @param params.color - Base color (default: beige)
 * @param params.flat - Flat mode (0 or 1) (default: 0)
 * @param params.seed - Random seed (default: 0)
 * @returns Color node
 * 
 * @example
 * ```typescript
 * import { circles } from '@tslstudio/materials'
 * 
 * material.colorNode = circles({
 *   scale: 2.5,
 *   variety: 1.5,
 *   color: new Color(0xFFDDCC)
 * })
 * ```
 */
export const circles = TSLFn(([params]: any) => {
  params = prepare([params], defaults)

  const pos = select(params.flat, positionGeometry, positionGeometry.normalize())

  const angle = acos(clamp(pos.y, -1, 1)).mul(20)

  const scale = exp(params.scale.sub(1))

  const x = angle.div(3000).mul(scale)

  const k = float(params.seed.sin().mul(100)).toVar()

  for (let n = 0; n <= 10; n++) {
    k.addAssign(sin(x.mul(2 ** n).sub((Math.PI * n) / 2)).mul((-n * (n + 1)) / 2))
  }

  k.assign(k.div(200).clamp(-2, 2))

  const HSL = toHsl(params.color)

  const hue = HSL.x.add(k.mul(params.variety)).mod(1).mul(10)

  const huei = hue.floor()
  let huef = hue.sub(huei)
  huef = select(huef.lessThan(0.5), huef.pow(1.5), huef.pow(1 / 1.5))

  return hsl(huei.add(huef).div(10), HSL.y, HSL.z)
}, defaults)

