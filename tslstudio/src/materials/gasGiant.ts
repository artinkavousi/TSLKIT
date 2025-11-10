/**
 * Gas Giant Material
 * 
 * Gas giant planet atmosphere
 * 
 * @module materials/gasGiant
 */

import { Color } from 'three'
import {
  exp,
  mix,
  positionGeometry,
  vec3,
} from 'three/tsl'
import { hsl, noise, prepare, toHsl, TSLFn } from './utils.js'

/**
 * Default gas giant parameters
 */
const defaults = {
  $name: 'Gas giant',
  scale: 2,
  turbulence: 0.3,
  blur: 0.6,
  colorA: new Color(0xFFF8F0),
  colorB: new Color(0xF0E8B0),
  colorC: new Color(0xAFA0D0),
  seed: 0,
}

/**
 * Gas giant material generator
 * 
 * Creates gas giant planet atmosphere with turbulence
 * 
 * @param params - Material parameters
 * @param params.scale - Overall scale (default: 2)
 * @param params.turbulence - Turbulence amount (default: 0.3)
 * @param params.blur - Blur amount (default: 0.6)
 * @param params.colorA - Primary color (default: cream)
 * @param params.colorB - Secondary color (default: beige)
 * @param params.colorC - Tertiary color (default: purple)
 * @param params.seed - Random seed (default: 0)
 * @returns Color node
 * 
 * @example
 * ```typescript
 * import { gasGiant } from '@tslstudio/materials'
 * 
 * material.colorNode = gasGiant({
 *   scale: 2.5,
 *   turbulence: 0.4,
 *   colorA: new Color(0xFFFFCC),
 *   colorB: new Color(0xFFCC99),
 *   colorC: new Color(0xCC99FF)
 * })
 * ```
 */
export const gasGiant = TSLFn(([params]: any) => {
  params = prepare([params], defaults)

  const scale = params.scale.div(2).add(1).toVar()
  const pos = positionGeometry.mul(exp(scale)).add(params.seed).toVar()

  // Turbulence strength
  const turbulence = params.turbulence
    .mul(
      noise(vec3(0, pos.y.mul(0.5), 0).add(1)).add(
        noise(vec3(0, pos.y.mul(1), 0).add(1)).mul(0.5),
        noise(vec3(1, pos.y.mul(2), 1).add(1)).mul(0.25)
      )
    )
    .mul(5)
    .abs()
    .toVar()

  const spot = noise(pos.div(4)).add(1).div(2).pow(10).mul(10).smoothstep(0, 1)

  // Apply turbulence
  pos.addAssign(vec3(noise(pos), noise(pos.yxz), noise(pos.yzx)).mul(turbulence.mul(spot.mul(2).exp())))

  const blur = params.blur.pow(0.2).oneMinus().mul(turbulence.add(1)).toVar()

  let k = noise(pos.mul(vec3(0, scale, 0)))
  k = k.add(noise(pos.mul(vec3(1, 15, 1))).mul(blur))
  k = k.add(-0.5).smoothstep(-1, 1).oneMinus()

  const n = noise(vec3(0, pos.y.mul(0.75), 0)).add(1)

  const HSL = toHsl(mix(params.colorB, params.colorA, n))
  const color = hsl(HSL.x.add(noise(pos.mul(vec3(0, scale, 0))).div(4)), HSL.y, HSL.z).toVar()

  color.assign(mix(color, params.colorC, turbulence.mul(0.3)))

  return color.mul(k)
}, defaults)

