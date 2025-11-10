/**
 * Cork Material
 * 
 * Natural cork texture with cellular structure
 * 
 * @module materials/cork
 */

import { Color } from 'three'
import {
  exp,
  float,
  Fn,
  If,
  Loop,
  mix,
  positionGeometry,
  vec3,
} from 'three/tsl'
import { noise, prepare, TSLFn, vnoise } from './utils.js'

/**
 * Default cork parameters
 */
const defaults = {
  $name: 'Cork',
  scale: 1,
  straight: 1,
  noise: 0.3,
  color: new Color(0xfff0c0),
  background: new Color(0xd08060),
  seed: 0,
}

/**
 * Cell center calculation
 */
const cellCenter = Fn(([cell]: any) => {
  return cell.add(vnoise(cell))
})

/**
 * Cork material generator
 * 
 * Creates natural cork texture with cellular structure
 * 
 * @param params - Material parameters
 * @param params.scale - Overall scale (default: 1)
 * @param params.straight - Cell straightness (default: 1)
 * @param params.noise - Noise amount (default: 0.3)
 * @param params.color - Cork color (default: beige)
 * @param params.background - Dark cork color (default: tan)
 * @param params.seed - Random seed (default: 0)
 * @returns Color node
 * 
 * @example
 * ```typescript
 * import { cork } from '@tslstudio/materials'
 * 
 * material.colorNode = cork({
 *   scale: 1.5,
 *   straight: 0.8,
 *   noise: 0.4
 * })
 * ```
 */
export const cork = TSLFn(([params]: any) => {
  params = prepare([params], defaults)

  const pos = positionGeometry
    .mul(exp(params.scale.div(1.5).add(1)))
    .add(params.seed)
    .toVar()

  const midCell = pos.round().toVar()

  const minCell = midCell.toVar()
  const minDist = float(1).toVar()

  const cell = vec3().toVar()
  const dist = float().toVar()

  const i = float(0).toVar()

  Loop(27, () => {
    const ix = i.mod(3).sub(1)
    const iy = i.div(3).floor().mod(3).sub(1)
    const iz = i.div(9).floor().sub(1)
    
    cell.assign(midCell.add(vec3(ix, iy, iz)))
    dist.assign(pos.distance(cellCenter(cell)))

    dist.addAssign(noise(pos.add(cell)).div(params.straight.exp()))

    If(dist.lessThan(minDist), () => {
      minDist.assign(dist)
      minCell.assign(cell)
    })
    
    i.addAssign(1)
  })

  const n = noise(minCell.mul(Math.PI)).toVar()
  const r = noise(pos.mul(12)).toVar()
  r.assign(r.sign().mul(r.abs().pow3()))
  r.addAssign(noise(pos.mul(40)).div(3))
  const k = n.add(1).div(2)

  const color = mix(params.color, params.background, k.add(r.mul(params.noise))).toVar()

  return color
}, defaults)

