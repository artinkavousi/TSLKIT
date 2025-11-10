/**
 * Bricks Material
 * 
 * Brick wall pattern with mortar joints
 * 
 * @module materials/bricks
 */

import { Color, Vector3 } from 'three'
import {
  exp,
  float,
  mix,
  mul,
  mx_fractal_noise_vec3,
  positionGeometry,
  vec3,
} from 'three/tsl'
import { noise, prepare, remapExp, TSLFn } from './utils.js'

/**
 * Default bricks parameters
 */
const defaults = {
  $name: 'Bricks',
  scale: 2,
  brickSize: new Vector3(2, 1, 2),
  brickShift: 2,
  jointSize: 0.05,
  jointSpan: 0.5,
  jointJitter: 0.5,
  jointBlur: 0.03,
  noiseSize: 0.5,
  noiseStrength: 0.2,
  colorShade: 0.5,
  color: new Color(0xFF4000),
  additional: new Color(0xD0A030),
  background: new Color(0xAAAAAA),
  seed: 0,
}

/**
 * Bricks material generator
 * 
 * Creates realistic brick wall with mortar joints
 * 
 * @param params - Material parameters
 * @param params.scale - Overall scale (default: 2)
 * @param params.brickSize - Brick dimensions (default: 2,1,2)
 * @param params.brickShift - Brick offset pattern (default: 2)
 * @param params.jointSize - Mortar joint thickness (default: 0.05)
 * @param params.jointSpan - Joint variation (default: 0.5)
 * @param params.jointJitter - Joint irregularity (default: 0.5)
 * @param params.jointBlur - Joint edge softness (default: 0.03)
 * @param params.noiseSize - Surface noise scale (default: 0.5)
 * @param params.noiseStrength - Surface noise amount (default: 0.2)
 * @param params.colorShade - Color variation (default: 0.5)
 * @param params.color - Primary brick color (default: red)
 * @param params.additional - Secondary brick color (default: orange)
 * @param params.background - Mortar color (default: gray)
 * @param params.seed - Random seed (default: 0)
 * @returns Color node
 * 
 * @example
 * ```typescript
 * import { bricks } from '@tslstudio/materials'
 * 
 * material.colorNode = bricks({
 *   scale: 2.5,
 *   brickSize: new Vector3(2, 1, 3),
 *   color: new Color(0xCC3300),
 *   background: new Color(0xCCCCCC)
 * })
 * ```
 */
export const bricks = TSLFn(([params]: any) => {
  params = prepare([params], defaults)

  const pos = positionGeometry.mul(exp(params.scale)).add(params.seed).toVar()

  const size = params.brickSize

  const floor = pos.div(size).floor().div(params.brickShift)

  const offset = vec3(floor.y, 0, floor.y).toVar()

  const p = pos.div(size).fract().add(offset).fract().toVar()

  const n = mx_fractal_noise_vec3(pos.mul(remapExp(params.jointSpan, 0, 1, 20, 0.2)))
    .div(remapExp(params.jointJitter, 0, 1, 500, 1))
    .toVar()

  const border = mul(
    p.mul(size).add(n.z).smoothstep(size.y.sub(params.jointSize, params.jointBlur), size.y.sub(params.jointSize)).y.oneMinus(),
    p.mul(size).add(n.y).smoothstep(params.jointSize, params.jointSize.add(params.jointBlur)).y,

    p.mul(size).add(n.y).smoothstep(size.x.sub(params.jointSize, params.jointBlur), size.x.sub(params.jointSize)).x.oneMinus(),
    p.mul(size).add(n.x).smoothstep(params.jointSize, params.jointSize.add(params.jointBlur)).x,

    p.mul(size).add(n.x).smoothstep(size.z.sub(params.jointSize, params.jointBlur), size.z.sub(params.jointSize)).z.oneMinus(),
    p.mul(size).add(n.z).smoothstep(params.jointSize, params.jointSize.add(params.jointBlur)).z,
  ).clamp(0, 1)

  const shade = mix(
    float(1),
    noise(noise(pos.xyz.div(size).add(offset).floor().zxy.mul(100).add(Math.PI)).mul(10))
      .add(2)
      .div(2)
      .pow(4)
      .clamp(0, 1),
    params.colorShade
  )

  const ns = noise(pos.mul(remapExp(params.noiseSize, 0, 1, 5, 250)))
    .mul(params.noiseStrength)
    .add(1)

  const brickNoise = noise(noise(pos.xyz.div(size).add(offset).floor().zxy.mul(200).add(Math.PI)).mul(10))
    .add(1)
    .div(1)
  
  const brickColor = mix(params.color, params.additional, brickNoise.pow(2))

  return mix(params.background, shade.mul(brickColor, border), border).mul(ns)
}, defaults)

