/**
 * @vitest-environment node
 */

import { describe, it, expect } from 'vitest'
import * as TSLStudio from '../src/index'

describe('TSLStudio Main Export', () => {
  it('should export noise functions', () => {
    expect(TSLStudio).toHaveProperty('simplexNoise3d')
    expect(TSLStudio).toHaveProperty('fbm')
    expect(TSLStudio).toHaveProperty('curlNoise3d')
  })

  it('should export SDF functions', () => {
    expect(TSLStudio).toHaveProperty('sdSphere')
    expect(TSLStudio).toHaveProperty('sdBox3d')
    expect(TSLStudio).toHaveProperty('sdfSmoothUnion')
  })

  it('should export lighting functions', () => {
    expect(TSLStudio).toHaveProperty('ambientLightNode')
    expect(TSLStudio).toHaveProperty('diffuseNode')
    expect(TSLStudio).toHaveProperty('directionalLightNode')
  })

  it('should export math functions', () => {
    expect(TSLStudio).toHaveProperty('remap')
    expect(TSLStudio).toHaveProperty('rotate3dY')
    expect(TSLStudio).toHaveProperty('complexMul')
  })

  it('should export color functions', () => {
    expect(TSLStudio).toHaveProperty('cosinePalette')
    expect(TSLStudio).toHaveProperty('acesTonemap')
  })

  it('should export util functions', () => {
    expect(TSLStudio).toHaveProperty('bloom')
    expect(TSLStudio).toHaveProperty('screenAspectUV')
  })
})

