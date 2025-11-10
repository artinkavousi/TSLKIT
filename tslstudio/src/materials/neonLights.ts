/**
 * Neon Lights Material
 * 
 * Neon light tubes effect
 * 
 * @module materials/neonLights
 */

import { Color } from 'three'
import {
  abs,
  exp,
  oneMinus,
  positionGeometry,
  select,
  sqrt,
  vec3,
} from 'three/tsl'
import { hsl, noise, prepare, toHsl, TSLFn } from './utils.js'

/**
 * Default neon lights parameters
 */
const defaults = {
  $name: 'Neon Lights',
  scale: 1.5,
  thinness: 0.8,
  mode: 0, // 0=additive, 1=subtractive
  colorA: new Color(0xFF0000),
  colorB: new Color(0x00FF00),
  colorC: new Color(0x0000FF),
  background: new Color(0x000000),
  seed: 0,
}

/**
 * Neon lights material generator
 * 
 * Creates neon light tubes effect with RGB colors
 * 
 * @param params - Material parameters
 * @param params.scale - Overall scale (default: 1.5)
 * @param params.thinness - Light thinness (default: 0.8)
 * @param params.mode - Blend mode: 0=additive, 1=subtractive (default: 0)
 * @param params.colorA - First neon color (default: red)
 * @param params.colorB - Second neon color (default: green)
 * @param params.colorC - Third neon color (default: blue)
 * @param params.background - Background color (default: black)
 * @param params.seed - Random seed (default: 0)
 * @returns Color node
 * 
 * @example
 * ```typescript
 * import { neonLights } from '@tslstudio/materials'
 * 
 * material.colorNode = neonLights({
 *   scale: 2,
 *   thinness: 0.9,
 *   mode: 0,
 *   colorA: new Color(0xFF00FF),
 *   colorB: new Color(0x00FFFF),
 *   colorC: new Color(0xFFFF00)
 * })
 * ```
 */
export const neonLights = TSLFn(([params]: any) => {
  params = prepare([params], defaults)

  const pos = positionGeometry

  const scale = exp(params.scale.remap(0, 4, 2, -2)).toVar()
  const thinness = exp(params.thinness.remap(0, 1, 1.5, 0)).toVar()

  const color = params.background.toVar()
  const neon = vec3(0).toVar()

  const x = noise(pos.xyz).toVar()
  const y = noise(pos.yzx).toVar()
  const z = noise(pos.zxy).toVar()

  // Red channel
  let k = noise(vec3(x, y, z).mul(scale).add(params.seed)).toVar()
  k.assign(oneMinus(sqrt(abs(k))).pow(3))

  neon.assign(params.colorA)
  let HSL = toHsl(neon)
  neon.assign(hsl(HSL.x, HSL.y, HSL.z.mul(k)))

  color.addAssign(select(params.mode.equal(0), neon, neon.negate()).mul(thinness))

  // Green channel
  k.assign(noise(vec3(y, z, x).mul(scale).sub(params.seed)))
  k.assign(oneMinus(sqrt(abs(k))).pow(3))

  neon.assign(params.colorB)
  HSL = toHsl(neon)
  neon.assign(hsl(HSL.x, HSL.y, HSL.z.mul(k)))

  color.addAssign(select(params.mode.equal(0), neon, neon.negate()).mul(thinness))

  // Blue channel
  k.assign(noise(vec3(z, x, y.negate()).mul(scale).add(params.seed)))
  k.assign(oneMinus(sqrt(abs(k))).pow(3))

  neon.assign(params.colorC)
  HSL = toHsl(neon)
  neon.assign(hsl(HSL.x, HSL.y, HSL.z.mul(k)))

  color.addAssign(select(params.mode.equal(0), neon, neon.negate()).mul(thinness))

  return color
}, defaults)

