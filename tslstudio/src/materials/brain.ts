/**
 * Brain Material
 * 
 * Organic brain tissue texture with wrinkles
 * 
 * @module materials/brain
 */

import { Color } from 'three'
import {
  exp,
  mix,
  mx_fractal_noise_float,
  positionGeometry,
  time,
  vec3,
} from 'three/tsl'
import { noise, prepare, TSLFn } from './utils.js'

/**
 * Default brain parameters
 */
const defaults = {
  $name: 'Brain',
  scale: 2,
  smooth: 0.5,
  wave: 0.5,
  speed: 2.5,
  color: new Color(0xFFD0D0),
  background: new Color(0x500000),
  seed: 0,
}

/**
 * Brain tissue material generator
 * 
 * Creates organic brain-like textures with wrinkles
 * 
 * @param params - Material parameters
 * @param params.scale - Overall scale (default: 2)
 * @param params.smooth - Smoothness factor (default: 0.5)
 * @param params.wave - Wave amount (default: 0.5)
 * @param params.speed - Animation speed (default: 2.5)
 * @param params.color - Tissue color (default: pink)
 * @param params.background - Dark tissue color (default: dark red)
 * @param params.seed - Random seed (default: 0)
 * @returns Color node
 * 
 * @example
 * ```typescript
 * import { brain } from '@tslstudio/materials'
 * 
 * material.colorNode = brain({
 *   scale: 2.5,
 *   smooth: 0.6,
 *   color: new Color(0xFFE0E0),
 *   background: new Color(0x600000)
 * })
 * 
 * // Access normal map
 * material.normalNode = brain.normal({
 *   scale: 2.5,
 *   wave: 0.7
 * })
 * ```
 */
export const brain = TSLFn(([params]: any) => {
  params = prepare([params], defaults)

  const pos = positionGeometry
    .mul(exp(params.scale.div(3)))
    .add(params.seed)
    .toVar()

  const octaves = exp(params.smooth.oneMinus().mul(2))

  const n = mx_fractal_noise_float(pos.mul(5), octaves)
    .add(1)
    .div(2)
    .clamp(0, 1)
    .pow(2)

  return mix(params.color, params.background, n)
}, defaults)

/**
 * Brain normal map
 * 
 * Generates animated normal map for brain tissue
 */
;(brain as any).normal = TSLFn(([params]: any) => {
  params = prepare([params], defaults)

  const pos = positionGeometry
    .mul(exp(params.scale.div(3)))
    .add(params.seed)
    .toVar()

  const octaves = exp(params.smooth.oneMinus().mul(2))

  const eps = 0.01
  const n = mx_fractal_noise_float(pos.mul(5), octaves)
  const dx = mx_fractal_noise_float(pos.add(vec3(eps, 0, 0)).mul(5), octaves)
    .sub(n)
    .div(eps)
  const dy = mx_fractal_noise_float(pos.add(vec3(0, eps, 0)).mul(5), octaves)
    .sub(n)
    .div(eps)

  const dTime = noise(pos.mul(params.wave.mul(5)))
    .add(1)
    .div(2)
    .mul(6.28)
  
  return vec3(dx, dy, time.mul(params.speed).add(dTime).sin().add(n, 1)).normalize()
}, defaults)

