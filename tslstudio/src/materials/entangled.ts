/**
 * Entangled Material
 * 
 * Intertwined pattern
 * 
 * @module materials/entangled
 */

import { Color } from 'three'
import {
  abs,
  exp,
  float,
  floor,
  Loop,
  max,
  mix,
  mul,
  oneMinus,
  positionGeometry,
  pow,
  sin,
} from 'three/tsl'
import { noise, prepare, TSLFn } from './utils.js'

/**
 * Default entangled parameters
 */
const defaults = {
  $name: 'Entangled',
  scale: 2,
  density: 10,
  color: new Color(0x002040),
  background: new Color(0xFFFFFF),
  seed: 0,
}

/**
 * Entangled material generator
 * 
 * Creates intertwined pattern
 * 
 * @param params - Material parameters
 * @param params.scale - Overall scale (default: 2)
 * @param params.density - Pattern density (default: 10)
 * @param params.color - Line color (default: dark blue)
 * @param params.background - Background color (default: white)
 * @param params.seed - Random seed (default: 0)
 * @returns Color node
 * 
 * @example
 * ```typescript
 * import { entangled } from '@tslstudio/materials'
 * 
 * material.colorNode = entangled({
 *   scale: 2.5,
 *   density: 12,
 *   color: new Color(0x004080)
 * })
 * ```
 */
export const entangled = TSLFn(([params]: any) => {
  params = prepare([params], defaults)

  const scale = exp(params.scale.div(2)).toVar()
  const pos = positionGeometry.add(params.seed).toVar()
  const k = float(-10000).toVar()
  const k1 = float(0).toVar()

  Loop(floor(float(params.density)), () => {
    k1.assign(sin(noise(mul(pos, scale)).mul(3 * Math.PI)))
    k.assign(max(k, k1))
    scale.mulAssign(1.2)
  })

  k.assign(oneMinus(pow(abs(k), 5)).mul(6))

  return mix(params.color, params.background, k)
}, defaults)

