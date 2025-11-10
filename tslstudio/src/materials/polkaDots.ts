/**
 * Polka Dots Material
 * 
 * Polka dot pattern
 * 
 * @module materials/polkaDots
 */

import { Color } from 'three'
import {
  acos,
  add,
  distance,
  exp,
  float,
  If,
  Loop,
  mat2,
  max,
  min,
  mix,
  mod,
  mul,
  oneMinus,
  positionGeometry,
  pow,
  smoothstep,
  vec2,
} from 'three/tsl'
import { prepare, spherical, TSLFn } from './utils.js'

/**
 * Default polka dots parameters
 */
const defaults = {
  $name: 'Polka dots',
  count: 2,
  size: 0.5,
  blur: 0.25,
  color: new Color(0x000000),
  background: new Color(0xFFFFFF),
  flat: 0,
}

/**
 * Golden ratio constant
 */
const goldenRatio = (1 + 5 ** 0.5) / 2

/**
 * Polka dots material generator
 * 
 * Creates polka dot pattern
 * 
 * @param params - Material parameters
 * @param params.count - Dot density (default: 2)
 * @param params.size - Dot size (default: 0.5)
 * @param params.blur - Edge blur (default: 0.25)
 * @param params.color - Dot color (default: black)
 * @param params.background - Background color (default: white)
 * @param params.flat - Flat mode (0 or 1) (default: 0)
 * @returns Color node
 * 
 * @example
 * ```typescript
 * import { polkaDots } from '@tslstudio/materials'
 * 
 * material.colorNode = polkaDots({
 *   count: 3,
 *   size: 0.6,
 *   color: new Color(0xFF0000),
 *   background: new Color(0xFFFFFF)
 * })
 * ```
 */
export const polkaDots = TSLFn(([params]: any) => {
  params = prepare([params], defaults)

  const dist = float(1).toVar()

  If(params.flat.equal(1), () => {
    const cnt = params.count.pow(2).sub(0.5).toVar()
    const pos = positionGeometry.xy.mul(cnt).mul(mat2(vec2(1, 1), vec2(-1, 1)))
    const posTo = pos.round().toVar()

    dist.assign(pos.distance(posTo).div(cnt))
  }).Else(() => {
    const cnt = pow(10, params.count).toVar()
    const vec = positionGeometry.normalize().toVar()

    const besti = oneMinus(vec.y).mul(cnt).sub(1).div(2)

    const span = max(10, cnt.pow(0.5))

    const mini = besti.sub(span).floor().clamp(0, cnt)
    const maxi = besti.add(span).floor().clamp(0, cnt)

    dist.assign(1).toVar()

    Loop(maxi.sub(mini), ({ i }) => {
      const j = add(i, mini)
      const theta = mod(mul((2 * Math.PI) / goldenRatio, j), 2 * Math.PI)
      const phi = acos(oneMinus(float(j).mul(2).add(1).div(cnt)))
      const pnt = spherical(phi, theta)
      dist.assign(min(dist, distance(vec, pnt)))
    })
  })

  const size = exp(params.size.mul(5).sub(5)).toVar()
  const blur = params.blur.pow(4).toVar()
  const k = smoothstep(size.sub(blur), size.add(blur), dist)

  return mix(params.color, params.background, k)
}, defaults)

