/**
 * Dyson Sphere Material
 * 
 * Sci-fi megastructure pattern
 * 
 * @module materials/dysonSphere
 */

import { Color } from 'three'
import {
  exp,
  float,
  Fn,
  Loop,
  mix,
  positionGeometry,
  vec3,
} from 'three/tsl'
import { prepare, TSLFn } from './utils.js'

/**
 * Default dyson sphere parameters
 */
const defaults = {
  $name: 'Dyson sphere',
  scale: 2,
  complexity: 2,
  variation: 0,
  color: new Color(0xc0d0ff),
  background: new Color(0x000000),
  seed: 0,
}

/**
 * Atomic noise function
 */
const noisea = Fn(([pos]: any) => {
  const p = pos.mul(5 ** 0.5).fract().toVar()
  p.addAssign(p.dot(p.add(vec3(31.4159, 27.1828, 14.142))))
  return p.z.mul(p.x.add(p.y)).fract().mul(2).sub(1)
})

/**
 * Smooth interpolation function
 */
const smooth = Fn(([x]: any) => {
  const t = x.oneMinus().clamp(0, 1).toVar()
  return t.mul(t).mul(float(3).sub(t.mul(2)))
})

/**
 * Gradient noise function
 */
const noiseg = Fn(([pos]: any) => {
  const minx = pos.x.floor().toVar()
  const maxx = minx.add(1).toVar()

  const miny = pos.y.floor().toVar()
  const maxy = miny.add(1).toVar()

  const minz = pos.z.floor().toVar()
  const maxz = minz.add(1).toVar()

  const dx = smooth(pos.x.fract()).toVar()
  const dy = smooth(pos.y.fract()).toVar()
  const dz = smooth(pos.z.fract()).toVar()

  const mx = smooth(dx.oneMinus()).toVar()
  const my = smooth(dy.oneMinus()).toVar()
  const mz = smooth(dz.oneMinus()).toVar()

  const n000 = noisea(vec3(minx, miny, minz)).mul(mx).mul(my).mul(mz).toVar()
  const n001 = noisea(vec3(minx, miny, maxz)).mul(mx).mul(my).mul(dz).toVar()
  const n010 = noisea(vec3(minx, maxy, minz)).mul(mx).mul(dy).mul(mz).toVar()
  const n011 = noisea(vec3(minx, maxy, maxz)).mul(mx).mul(dy).mul(dz).toVar()
  const n100 = noisea(vec3(maxx, miny, minz)).mul(dx).mul(my).mul(mz).toVar()
  const n101 = noisea(vec3(maxx, miny, maxz)).mul(dx).mul(my).mul(dz).toVar()
  const n110 = noisea(vec3(maxx, maxy, minz)).mul(dx).mul(dy).mul(mz).toVar()
  const n111 = noisea(vec3(maxx, maxy, maxz)).mul(dx).mul(dy).mul(dz).toVar()

  return n000.add(n001).add(n010).add(n011).add(n100).add(n101).add(n110).add(n111)
})

/**
 * Dyson sphere material generator
 * 
 * Creates sci-fi megastructure pattern
 * 
 * @param params - Material parameters
 * @param params.scale - Overall scale (default: 2)
 * @param params.complexity - Pattern complexity (default: 2)
 * @param params.variation - Pattern variation (default: 0)
 * @param params.color - Structure color (default: light blue)
 * @param params.background - Space color (default: black)
 * @param params.seed - Random seed (default: 0)
 * @returns Color node
 * 
 * @example
 * ```typescript
 * import { dysonSphere } from '@tslstudio/materials'
 * 
 * material.colorNode = dysonSphere({
 *   scale: 2.5,
 *   complexity: 3,
 *   color: new Color(0xCCDDFF),
 *   background: new Color(0x000000)
 * })
 * ```
 */
export const dysonSphere = TSLFn(([params]: any) => {
  params = prepare([params], defaults)

  const pos = positionGeometry
    .mul(exp(params.scale.div(2).add(0.5)))
    .add(params.seed)
    .toVar()

  const res = vec3().toVar()
  const factor = float(1).toVar()

  Loop(params.complexity.add(4), () => {
    res.addAssign(noiseg(pos.mul(factor)))
    factor.addAssign(factor)
  })

  return mix(params.background, params.color, res.x.add(1).div(5))
}, defaults)

