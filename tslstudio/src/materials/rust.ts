/**
 * Rust Material
 * 
 * Corroded metal rust texture
 * 
 * @module materials/rust
 */

import { Color } from 'three'
import {
  exp,
  Fn,
  Loop,
  mix,
  positionGeometry,
} from 'three/tsl'
import { noise, prepare, TSLFn } from './utils.js'

/**
 * Default rust parameters
 */
const defaults = {
  $name: 'Rust',
  scale: 2,
  iterations: 8,
  amount: -0.3,
  opacity: 0.5,
  noise: 0.5,
  noiseScale: 0.5,
  color: new Color(0xC08000),
  background: new Color(0x000020),
  seed: 0,
}

/**
 * Internal rust calculation
 */
const _rust = Fn((params: any) => {
  const pos = positionGeometry
    .mul(exp(params.scale.div(4).add(-1)))
    .add(params.seed)
    .toVar()

  const amount = params.amount
    .mul(noise(pos.mul(params.amount.div(2).add(4))).add(4))
    .toVar()

  const k = noise(pos).toVar()

  Loop(params.iterations, () => {
    pos.mulAssign(2)
    k.addAssign(noise(pos))
  })

  k.subAssign(noise(pos.mul(2)).abs())

  k.assign(k.sub(amount).clamp(0, 15))

  return k
})

/**
 * Rust material generator
 * 
 * Creates corroded metal rust texture
 * 
 * @param params - Material parameters
 * @param params.scale - Overall scale (default: 2)
 * @param params.iterations - Rust detail iterations (default: 8)
 * @param params.amount - Rust amount (default: -0.3)
 * @param params.opacity - Opacity factor (default: 0.5)
 * @param params.noise - Noise amount (default: 0.5)
 * @param params.noiseScale - Noise scale (default: 0.5)
 * @param params.color - Rust color (default: orange-brown)
 * @param params.background - Metal color (default: dark blue)
 * @param params.seed - Random seed (default: 0)
 * @returns Color node
 * 
 * @example
 * ```typescript
 * import { rust } from '@tslstudio/materials'
 * 
 * material.colorNode = rust({
 *   scale: 2.5,
 *   iterations: 10,
 *   amount: -0.4,
 *   color: new Color(0xA07000)
 * })
 * 
 * // Access opacity channel
 * material.opacityNode = rust.opacity({
 *   scale: 2.5,
 *   opacity: 0.6
 * })
 * ```
 */
export const rust = TSLFn(([params]: any) => {
  params = prepare([params], defaults)

  const k = _rust(params).mul(1.25).pow(0.5)

  const pos = positionGeometry.mul(exp(params.scale.add(params.noiseScale.mul(3), 2)))

  k.addAssign(params.noise.mul(noise(pos).abs().add(0.1).pow(2)))

  return mix(params.color, params.background, k)
}, defaults)

/**
 * Rust opacity channel
 */
;(rust as any).opacity = TSLFn(([params]: any) => {
  params = prepare([params], defaults)

  const k = _rust(params).mul(params.opacity.add(0.2))

  return k.oneMinus()
}, defaults)

