/**
 * Planet Material
 * 
 * Procedural planet surface with oceans, land, and snow
 * 
 * @module materials/planet
 */

import { Color } from 'three'
import {
  exp,
  float,
  If,
  Loop,
  mix,
  mul,
  positionGeometry,
  remap,
  smoothstep,
  vec3,
} from 'three/tsl'
import { noise, prepare, TSLFn } from './utils.js'

/**
 * Default planet parameters
 */
const defaults = {
  $name: 'Planet',
  scale: 2,
  iterations: 5,
  levelSea: 0.3,
  levelMountain: 0.7,
  balanceWater: 0.3,
  balanceSand: 0.2,
  balanceSnow: 0.8,
  colorDeep: new Color(0x123a59).convertLinearToSRGB(), // SteelBlue
  colorShallow: new Color(0x87CEEB).convertLinearToSRGB(), // SkyBlue
  colorBeach: new Color(0xFFFACD).convertLinearToSRGB(), // LemonChiffon
  colorGrass: new Color(0x3CB371).convertLinearToSRGB(), // MediumSeaGreen
  colorForest: new Color(0x003000).convertLinearToSRGB(), // Dark green
  colorSnow: new Color(0xF0FFFF).convertLinearToSRGB(), // Azure
  seed: 0,
}

/**
 * Planet material generator
 * 
 * Creates realistic planet surface with elevation-based biomes
 * 
 * @param params - Material parameters
 * @param params.scale - Overall scale (default: 2)
 * @param params.iterations - Detail iterations (default: 5)
 * @param params.levelSea - Sea level (default: 0.3)
 * @param params.levelMountain - Mountain level (default: 0.7)
 * @param params.balanceWater - Water balance (default: 0.3)
 * @param params.balanceSand - Sand balance (default: 0.2)
 * @param params.balanceSnow - Snow balance (default: 0.8)
 * @param params.colorDeep - Deep ocean color (default: steel blue)
 * @param params.colorShallow - Shallow water color (default: sky blue)
 * @param params.colorBeach - Beach color (default: lemon chiffon)
 * @param params.colorGrass - Grass color (default: sea green)
 * @param params.colorForest - Forest color (default: dark green)
 * @param params.colorSnow - Snow color (default: azure)
 * @param params.seed - Random seed (default: 0)
 * @returns Color node
 * 
 * @example
 * ```typescript
 * import { planet } from '@tslstudio/materials'
 * 
 * material.colorNode = planet({
 *   scale: 2.5,
 *   iterations: 6,
 *   levelSea: 0.35,
 *   levelMountain: 0.75
 * })
 * ```
 */
export const planet = TSLFn(([params]: any) => {
  params = prepare([params], defaults)

  const k = float(0).toVar()
  const sum = float(0).toVar()
  const scale = exp(params.scale.sub(2)).toVar()
  const power = float(2).toVar()

  Loop(params.iterations.add(10), () => {
    k.addAssign(mul(power, noise(positionGeometry.mul(scale).add(params.seed))))
    sum.addAssign(power)
    scale.mulAssign(1.5)
    power.mulAssign(0.8)
  })

  k.assign(mul(k, k, 0.5).div(sum))

  const levelSea = params.levelSea.pow(2).toVar()
  const levelMountain = params.levelMountain.pow(2).toVar()
  const levelSand = mix(levelSea, levelMountain, params.balanceSand).toVar()
  const levelCoast = mix(levelSea, levelSand, 0.4).toVar()
  const levelGrass = mix(levelSea, levelSand, 0.6).toVar()

  const color = vec3().toVar()

  // Process water
  If(k.lessThan(levelSea), () => {
    // Deep-shallow
    color.assign(
      mix(
        params.colorDeep,
        params.colorShallow,
        remap(k, 0, levelSea, 0, 1).pow(exp(params.balanceWater.mul(-8).add(4)))
      )
    )
  })
    .ElseIf(k.lessThan(levelCoast), () => {
      // Shallow-sand
      color.assign(mix(params.colorShallow, params.colorBeach, remap(k, levelSea, levelCoast)))
    })
    .ElseIf(k.lessThan(levelGrass), () => {
      // Sand
      color.assign(params.colorBeach)
    })
    .ElseIf(k.lessThan(levelSand), () => {
      // Shallow-sand-grass
      color.assign(mix(params.colorBeach, params.colorGrass, remap(k, levelGrass, levelSand)))
    })
    .ElseIf(k.lessThan(levelMountain), () => {
      // Grass-forest
      color.assign(mix(params.colorGrass, params.colorForest, remap(k, levelSand, levelMountain).pow(0.75)))
    })
    .Else(() => {
      // Forest-snow
      const levelSnow = mix(1, levelMountain, params.balanceSnow)
      color.assign(
        mix(
          params.colorForest,
          params.colorSnow,
          smoothstep(mix(levelSnow, levelMountain, params.balanceSnow.pow(0.5)), levelSnow, k)
        )
      )
    })

  return color
}, defaults)

