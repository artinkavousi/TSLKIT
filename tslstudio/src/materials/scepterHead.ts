/**
 * Scepter Head Material
 * 
 * Ornate scepter head pattern
 * 
 * @module materials/scepterHead
 */

import { Color } from 'three'
import {
  abs,
  add,
  cos,
  floor,
  max,
  mix,
  mod,
  mul,
  positionGeometry,
  remapClamp,
  sign,
  tan,
  vec3,
} from 'three/tsl'
import { hsl, noise, prepare, remapExp, toHsl, TSLFn } from './utils.js'

/**
 * Default scepter head parameters
 */
const defaults = {
  $name: 'Scepter head',
  xFactor: 10,
  yFactor: 22,
  zFactor: 10,
  colorRim: new Color(0xFFFFFF),
  colorA: new Color(0x70E0FF),
  colorB: new Color(0x3000FF),
}

/**
 * Scepter head material generator
 * 
 * Creates ornate scepter head pattern
 * 
 * @param params - Material parameters
 * @param params.xFactor - X axis factor (default: 10)
 * @param params.yFactor - Y axis factor (default: 22)
 * @param params.zFactor - Z axis factor (default: 22)
 * @param params.colorRim - Rim color (default: white)
 * @param params.colorA - First pattern color (default: cyan)
 * @param params.colorB - Second pattern color (default: blue)
 * @returns Color node
 * 
 * @example
 * ```typescript
 * import { scepterHead } from '@tslstudio/materials'
 * 
 * material.colorNode = scepterHead({
 *   xFactor: 12,
 *   yFactor: 24,
 *   colorA: new Color(0x60D0FF),
 *   colorB: new Color(0x4000FF)
 * })
 * ```
 */
export const scepterHead = TSLFn(([params]: any) => {
  params = prepare([params], defaults)

  const pos = positionGeometry

  const fx = pos.x.mul(remapExp(params.xFactor, 0, 100, 1.35, 30)).toVar()
  const fy = pos.y.mul(remapExp(params.yFactor, 0, 100, 1.35, 30)).toVar()
  const fz = pos.z.mul(remapExp(params.zFactor, 0, 100, 1.35, 30)).toVar()

  const cosX = cos(fx).toVar()
  const cosY = cos(fy).toVar()
  const cosZ = cos(fz).toVar()

  let k = noise(vec3(pos.x.div(cosX), pos.y.div(cosY), pos.z.div(cosZ)))

  k = sign(k).mul(abs(k).pow(0.75))

  const dx = abs(mul(fx, tan(fx)).add(1).div(cos(fx)))
  const dy = abs(mul(fy, tan(fy)).add(1).div(cos(fy)))
  const dz = abs(mul(fz, tan(fz)).add(1).div(cos(fz)))

  const HSL = vec3().toVar()

  const indexX = abs(floor(fx.mul(2 / Math.PI).add(1).div(2)))
  const indexY = abs(floor(fy.mul(2 / Math.PI).add(1).div(2)))
  const indexZ = abs(floor(fz.mul(2 / Math.PI).add(1).div(2)))

  const index = mod(add(indexX, indexY, indexZ), 2)

  HSL.assign(toHsl(mix(params.colorA, params.colorB, index)))
  const color1 = hsl(HSL.x, HSL.y, HSL.z.mul(k)).toVar()

  HSL.assign(toHsl(params.colorRim))
  const color2 = hsl(HSL.x, HSL.y, mul(2, k, HSL.z)).toVar()

  return mix(color1, color2, remapClamp(max(dx, max(dy, dz)), 55 - 10, 55 + 10))
}, defaults)

