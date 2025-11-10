/**
 * Processed Wood Material
 * 
 * Processed wood texture with grain
 * 
 * @module materials/processedWood
 */

import { Color } from 'three'
import {
  add,
  cos,
  exp,
  mix,
  positionGeometry,
  radians,
  sin,
  sub,
  vec3,
} from 'three/tsl'
import { noise, prepare, TSLFn } from './utils.js'

/**
 * Default processed wood parameters
 */
const defaults = {
  $name: 'Processed wood',
  scale: 2,
  lengths: 4,
  strength: 0.3,
  angle: 0,
  color: new Color(0x702020),
  background: new Color(0xF0D0A0),
  seed: 0,
}

/**
 * Processed wood material generator
 * 
 * Creates processed wood texture with grain patterns
 * 
 * @param params - Material parameters
 * @param params.scale - Overall scale (default: 2)
 * @param params.lengths - Grain length (default: 4)
 * @param params.strength - Grain strength (default: 0.3)
 * @param params.angle - Rotation angle (default: 0)
 * @param params.color - Dark wood color (default: dark brown)
 * @param params.background - Light wood color (default: tan)
 * @param params.seed - Random seed (default: 0)
 * @returns Color node
 * 
 * @example
 * ```typescript
 * import { processedWood } from '@tslstudio/materials'
 * 
 * material.colorNode = processedWood({
 *   scale: 2.5,
 *   lengths: 5,
 *   strength: 0.4,
 *   angle: 45
 * })
 * ```
 */
export const processedWood = TSLFn(([params]: any) => {
  params = prepare([params], defaults)

  const angle = radians(params.angle).toVar()
  const posLocal = vec3(
    sub(positionGeometry.x.mul(cos(angle)), positionGeometry.y.mul(sin(angle))),
    add(positionGeometry.x.mul(sin(angle)), positionGeometry.y.mul(cos(angle))),
    positionGeometry.z,
  ).toVar()

  const scale = params.scale.div(2).add(1).toVar()
  const pos = posLocal.mul(exp(scale)).add(params.seed).toVar()

  const len = params.lengths.add(5).reciprocal().toVar()
  let k = noise(pos.mul(scale, vec3(1, len, len)))
  k = k.mul(noise(pos.mul(vec3(25, 1, 1))).add(-1).mul(0.2))
  k = k.add(params.strength.sub(0.5)).smoothstep(-0.3, 0.3).oneMinus()

  return mix(params.color, params.background, k)
}, defaults)

