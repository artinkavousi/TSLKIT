/**
 * Camouflage Material
 * 
 * Military camouflage pattern
 * 
 * @module materials/camouflage
 */

import { Color } from 'three'
import {
  exp,
  If,
  positionGeometry,
  round,
  vec3,
} from 'three/tsl'
import { noise, prepare, TSLFn } from './utils.js'

/**
 * Default camouflage parameters
 */
const defaults = {
  $name: 'Camouflage',
  scale: 2,
  colorA: new Color(0xc2bea8),
  colorB: new Color(0x9c895e),
  colorC: new Color(0x92a375),
  colorD: new Color(0x717561),
  seed: 0,
}

/**
 * Camouflage material generator
 * 
 * Creates military camouflage pattern with 4 colors
 * 
 * @param params - Material parameters
 * @param params.scale - Overall scale (default: 2)
 * @param params.colorA - First camo color (default: tan)
 * @param params.colorB - Second camo color (default: brown)
 * @param params.colorC - Third camo color (default: green)
 * @param params.colorD - Fourth camo color (default: dark green)
 * @param params.seed - Random seed (default: 0)
 * @returns Color node
 * 
 * @example
 * ```typescript
 * import { camouflage } from '@tslstudio/materials'
 * 
 * material.colorNode = camouflage({
 *   scale: 2.5,
 *   colorA: new Color(0xC0C0A0),
 *   colorB: new Color(0xA0A080),
 *   colorC: new Color(0x90A070),
 *   colorD: new Color(0x708060)
 * })
 * ```
 */
export const camouflage = TSLFn(([params]: any) => {
  params = prepare([params], defaults)

  const pos = positionGeometry.mul(exp(params.scale)).add(params.seed).toVar()

  const color = vec3(0, 0, 0).toVar()

  If(round(noise(pos, 1, 0.2)).greaterThanEqual(1), () => {
    color.assign(params.colorA)
  })
    .ElseIf(round(noise(pos.yzx, 1, 0.3)).greaterThanEqual(1), () => {
      color.assign(params.colorB)
    })
    .ElseIf(round(noise(pos.zxy, 1, 0.4)).greaterThanEqual(1), () => {
      color.assign(params.colorC)
    })
    .Else(() => {
      color.assign(params.colorD)
    })

  return color
}, defaults)

