/**
 * Voronoi Cells Material
 * 
 * Voronoi cell pattern
 * 
 * @module materials/voronoiCells
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
import { noise, prepare, TSLFn } from './utils.js'

/**
 * Default voronoi cells parameters
 */
const defaults = {
  $name: 'Voronoi cells',
  scale: 2,
  variation: 0,
  facet: 0,
  color: new Color(0x000000),
  background: new Color(0xc0d0ff),
  seed: 0,
}

/**
 * Cell center calculation
 */
const cellCenter = Fn(([cell]: any) => {
  return cell.add(noise(cell.mul(Math.PI)))
})

/**
 * Voronoi cells material generator
 * 
 * Creates Voronoi cell pattern
 * 
 * @param params - Material parameters
 * @param params.scale - Overall scale (default: 2)
 * @param params.variation - Color variation (default: 0)
 * @param params.facet - Facet shading (default: 0)
 * @param params.color - Cell color (default: black)
 * @param params.background - Background color (default: light blue)
 * @param params.seed - Random seed (default: 0)
 * @returns Color node
 * 
 * @example
 * ```typescript
 * import { voronoiCells } from '@tslstudio/materials'
 * 
 * material.colorNode = voronoiCells({
 *   scale: 2.5,
 *   variation: 0.5,
 *   facet: 0.3,
 *   color: new Color(0x000000),
 *   background: new Color(0xFFFFFF)
 * })
 * ```
 */
export const voronoiCells = TSLFn(([params]: any) => {
  params = prepare([params], defaults)

  const pos = positionGeometry
    .mul(exp(params.scale.div(2).add(0.5)))
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
    dist.assign(pos.distance(cellCenter(cell)).add(noise(pos).div(5)))

    If(dist.lessThan(minDist), () => {
      minDist.assign(dist)
      minCell.assign(cell)
    })
    i.addAssign(1)
  })

  const n = noise(minCell.mul(Math.PI)).toVar()
  const k = mix(minDist, n.add(1).div(2), params.facet)

  const color = mix(params.color, params.background, k).toVar()
  const randomColor = vec3(n.mul(16.8), n.mul(31.4159), n.mul(27.1828))
    .sin()
    .add(1)
    .div(2)

  return mix(color, mix(color, randomColor, params.variation), params.variation)
}, defaults)

