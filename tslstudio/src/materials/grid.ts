/**
 * Grid Material
 * 
 * Regular grid pattern
 * 
 * @module materials/grid
 */

import { Color } from 'three'
import {
  abs,
  add,
  div,
  equirectUV,
  min,
  mix,
  mul,
  oneMinus,
  positionGeometry,
  pow,
  remapClamp,
  round,
  screenSize,
  screenUV,
  select,
  sin,
  smoothstep,
  sub,
} from 'three/tsl'
import { prepare, TSLFn } from './utils.js'

/**
 * Default grid parameters
 */
const defaults = {
  $name: 'Grid',
  countU: 32,
  countV: 16,
  thinness: 0.8,
  color: new Color(0x000000),
  background: new Color(0xFFFFFF),
  flat: 0,
}

/**
 * Grid material generator
 * 
 * Creates regular grid pattern with adjustable density
 * 
 * @param params - Material parameters
 * @param params.countU - Horizontal grid count (default: 32)
 * @param params.countV - Vertical grid count (default: 16)
 * @param params.thinness - Line thinness (default: 0.8)
 * @param params.color - Grid line color (default: black)
 * @param params.background - Background color (default: white)
 * @param params.flat - Flat mode (0 or 1) (default: 0)
 * @returns Color node
 * 
 * @example
 * ```typescript
 * import { grid } from '@tslstudio/materials'
 * 
 * material.colorNode = grid({
 *   countU: 40,
 *   countV: 20,
 *   thinness: 0.9,
 *   color: new Color(0x3333FF)
 * })
 * ```
 */
export const grid = TSLFn(([params]: any) => {
  params = prepare([params], defaults)

  const aspect = select(params.flat, screenSize.x.div(screenSize.y), 2)

  const uv = select(params.flat, screenUV, equirectUV(positionGeometry.normalize())).toVar()
  const a = mul(uv.x, aspect, Math.PI)
  const b = mul(uv.y, Math.PI).toVar()

  const uTo = div(round(mul(uv.x, params.countU)), params.countU)
  const vTo = div(round(mul(uv.y, params.countV)), params.countV)
  const aTo = mul(uTo, aspect, Math.PI)
  const bTo = mul(vTo, Math.PI)

  const angleU = abs(sub(a, aTo)).mul(select(params.flat, 1, sin(b)))
  const angleV = abs(sub(b, bTo))
  const angle = min(angleU, angleV)

  const threshold = mul(
    min(div(aspect.mul(Math.PI), params.countU), div(Math.PI, params.countV)),
    remapClamp(pow(params.thinness, 0.5), 0, 1, 0.9, 0.04),
    0.5
  )
  
  const k = oneMinus(smoothstep(sub(threshold, 0.002), add(threshold, 0.002), angle))

  return mix(params.background, params.color, k)
}, defaults)

