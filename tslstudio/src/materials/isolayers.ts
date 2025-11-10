/**
 * Isolayers Material
 * 
 * Layered elevation bands
 * 
 * @module materials/isolayers
 */

import { Color } from 'three'
import {
  exp,
  float,
  mix,
  positionGeometry,
} from 'three/tsl'
import { hsl, noise, prepare, toHsl, TSLFn } from './utils.js'

/**
 * Default isolayers parameters
 */
const defaults = {
  $name: 'Isolayers',
  scale: 2,
  layers: 10,
  edge: 0.5,
  darkness: 0,
  color: new Color(0xFFFFF0),
  background: new Color(0xFF4040),
  seed: 0,
}

/**
 * Isolayers material generator
 * 
 * Creates layered elevation bands with edge highlights
 * 
 * @param params - Material parameters
 * @param params.scale - Overall scale (default: 2)
 * @param params.layers - Number of layers (default: 10)
 * @param params.edge - Edge sharpness (default: 0.5)
 * @param params.darkness - Layer darkness gradient (default: 0)
 * @param params.color - Top layer color (default: cream)
 * @param params.background - Bottom layer color (default: red)
 * @param params.seed - Random seed (default: 0)
 * @returns Color node
 * 
 * @example
 * ```typescript
 * import { isolayers } from '@tslstudio/materials'
 * 
 * material.colorNode = isolayers({
 *   scale: 2.5,
 *   layers: 12,
 *   edge: 0.7,
 *   color: new Color(0xFFFFE0),
 *   background: new Color(0xFF6060)
 * })
 * ```
 */
export const isolayers = TSLFn(([params]: any) => {
  params = prepare([params], defaults)

  const pos = positionGeometry
    .mul(exp(params.scale.sub(1)))
    .add(params.seed)
    .toVar()

  const depth = params.edge.remap(0, 1, 40, 10)

  const k = noise(pos).mul(1.2).add(1).div(2)

  const i = k.mul(params.layers).round().div(params.layers).clamp(0, 1)
  const f = k
    .sub(float(0.5 + 0.03).div(params.layers))
    .mul(params.layers)
    .fract()
    .mul(float(2).pow(depth.reciprocal()))
    .pow(depth)
    .sub(1)
    .abs()
    .oneMinus()

  const hslColor = mix(toHsl(params.background), toHsl(params.color), i).toVar()
  hslColor.z.mulAssign(mix(1, i.mul(1.5), params.darkness).clamp(0, 1))

  return hsl(hslColor.x, hslColor.y, hslColor.z).sub(f)
}, defaults)

