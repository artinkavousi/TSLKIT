/**
 * Clouds Material
 * 
 * Procedural cloud formations
 * 
 * @module materials/clouds
 */

import { Color } from 'three'
import {
  add,
  clamp,
  exp,
  Fn,
  mix,
  mul,
  positionGeometry,
  vec4,
} from 'three/tsl'
import { noised, prepare, TSLFn } from './utils.js'

/**
 * Default clouds parameters
 */
const defaults = {
  $name: 'Clouds',
  scale: 2,
  density: 0.5,
  opacity: 1,
  color: new Color(0xFFFFFF),
  subcolor: new Color(0xA0A0B0),
  seed: 0,
}

/**
 * Internal clouds implementation with opacity
 */
const _clouds = Fn((params: any) => {
  const pos = positionGeometry
  const scale = exp(params.scale.div(1.5).sub(0.5))

  // Color blending with multiple octaves
  const k = add(
    noised(pos, scale, 1, params.seed),
    noised(pos, scale, 2, params.seed).mul(0.80),
    noised(pos, scale, 6, params.seed).mul(0.10),
    noised(pos, scale, 8, params.seed).mul(0.07),
    params.density.remap(0, 1, -0.5, 1.5)
  )

  // Opacity calculation
  const a = clamp(0, 1, mul(k, 2).pow(1.5).sub(1).mul(params.opacity))

  // Final color + opacity
  return vec4(mix(params.subcolor, params.color, k.clamp(0, 1)), a)
})

/**
 * Clouds material generator
 * 
 * Creates realistic cloud formations with opacity
 * 
 * @param params - Material parameters
 * @param params.scale - Cloud scale (default: 2)
 * @param params.density - Cloud density (default: 0.5)
 * @param params.opacity - Overall opacity (default: 1)
 * @param params.color - Cloud color (default: white)
 * @param params.subcolor - Shadow color (default: light gray)
 * @param params.seed - Random seed (default: 0)
 * @returns Color node (RGB)
 * 
 * @example
 * ```typescript
 * import { clouds } from '@tslstudio/materials'
 * 
 * material.colorNode = clouds({
 *   scale: 2.5,
 *   density: 0.6,
 *   color: new Color(0xFFFFFF),
 *   subcolor: new Color(0x8090A0)
 * })
 * 
 * // Access opacity separately
 * material.opacityNode = clouds.opacity({ scale: 2.5, density: 0.6 })
 * ```
 */
export const clouds = TSLFn(([params]: any) => {
  params = prepare([params], defaults)
  return _clouds(params).rgb
}, defaults)

/**
 * Clouds opacity channel
 * 
 * Returns only the alpha channel for use with transparent materials
 */
;(clouds as any).opacity = TSLFn(([params]: any) => {
  params = prepare([params], defaults)
  return _clouds(params).a
}, defaults)

