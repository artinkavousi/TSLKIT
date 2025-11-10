/**
 * Wood Material
 * 
 * Procedural wood grain texture
 * 
 * @module materials/wood
 */

import { Color } from 'three'
import {
  add,
  cos,
  exp,
  float,
  Loop,
  mix,
  mul,
  positionGeometry,
  radians,
  reciprocal,
  sin,
  sub,
  vec3,
} from 'three/tsl'
import { noise, prepare, TSLFn } from './utils.js'

/**
 * Default wood parameters
 */
const defaults = {
  $name: 'Wood',
  scale: 2.5,
  rings: 4.5,
  lengths: 1,
  angle: 0,
  fibers: 0.3,
  fibersDensity: 10,
  color: new Color(0.8, 0.4, 0),
  background: new Color(0.4, 0.1, 0),
  seed: 0,
}

/**
 * Wood grain material generator
 * 
 * Creates realistic wood with rings and fibers
 * 
 * @param params - Material parameters
 * @param params.scale - Overall scale (default: 2.5)
 * @param params.rings - Ring frequency (default: 4.5)
 * @param params.lengths - Length scaling (default: 1)
 * @param params.angle - Rotation angle in degrees (default: 0)
 * @param params.fibers - Fiber amount (default: 0.3)
 * @param params.fibersDensity - Fiber density (default: 10)
 * @param params.color - Wood color (default: brown)
 * @param params.background - Dark wood color (default: dark brown)
 * @param params.seed - Random seed (default: 0)
 * @returns Color node
 * 
 * @example
 * ```typescript
 * import { wood } from '@tslstudio/materials'
 * 
 * material.colorNode = wood({
 *   scale: 3.0,
 *   rings: 5.0,
 *   angle: 45,
 *   color: new Color(0.9, 0.5, 0.1)
 * })
 * ```
 */
export const wood = TSLFn(([params]: any) => {
  params = prepare([params], defaults)

  const angle = radians(params.angle).toVar()
  const posLocal = vec3(
    sub(positionGeometry.x.mul(cos(angle)), positionGeometry.y.mul(sin(angle))),
    add(positionGeometry.x.mul(sin(angle)), positionGeometry.y.mul(cos(angle))),
    positionGeometry.z,
  ).toVar()

  // Main pattern with rings
  const pos = posLocal
    .mul(exp(params.scale.sub(3)).mul(vec3(reciprocal(params.lengths), 4, reciprocal(params.lengths))))
    .add(params.seed)
    .toVar()
  
  const k = noise(pos).add(1).mul(10).mul(params.rings).toVar()
  k.assign(k.add(k.cos()).cos().add(1).div(2))

  const kk = float(0).toVar()
  const sum = float(0).toVar()
  const scale = exp(params.scale.sub(2)).mul(vec3(1, params.fibersDensity, 1)).toVar()
  const power = float(2).toVar()

  Loop(10, () => {
    kk.addAssign(mul(power, noise(posLocal.mul(scale).add(params.seed))))
    sum.addAssign(power)
    scale.mulAssign(1.8)
    power.mulAssign(0.6)
  })

  kk.assign(mul(kk, 5).div(sum).mul(10).sin().add(1).div(2))

  return mix(params.color, params.background, mix(k, kk, params.fibers))
}, defaults)

