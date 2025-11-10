/**
 * @vitest-environment node
 */

import { describe, it, expect } from 'vitest'
import { 
  remap,
  remapFrom01,
  remapTo01,
  smoothMod,
  rotate3dX,
  rotate3dY,
  rotate3dZ,
  rotate2d,
  complexMul,
  cartesianToPolar,
  polarToCartesian
} from '../../src/tsl/math'

describe('Math Module', () => {
  describe('Remap Functions', () => {
    it('remap should be defined', () => {
      expect(remap).toBeDefined()
      expect(typeof remap).toBe('function')
      expect(remap).toHaveProperty('isNode')
    })

    it('remapFrom01 should be defined', () => {
      expect(remapFrom01).toBeDefined()
      expect(typeof remapFrom01).toBe('function')
      expect(remapFrom01).toHaveProperty('isNode')
    })

    it('remapTo01 should be defined', () => {
      expect(remapTo01).toBeDefined()
      expect(typeof remapTo01).toBe('function')
      expect(remapTo01).toHaveProperty('isNode')
    })
  })

  describe('Rotation Functions', () => {
    it('rotate3dX should be defined', () => {
      expect(rotate3dX).toBeDefined()
      expect(typeof rotate3dX).toBe('function')
      expect(rotate3dX).toHaveProperty('isNode')
    })

    it('rotate3dY should be defined', () => {
      expect(rotate3dY).toBeDefined()
      expect(typeof rotate3dY).toBe('function')
      expect(rotate3dY).toHaveProperty('isNode')
    })

    it('rotate3dZ should be defined', () => {
      expect(rotate3dZ).toBeDefined()
      expect(typeof rotate3dZ).toBe('function')
      expect(rotate3dZ).toHaveProperty('isNode')
    })

    it('rotate2d should be defined', () => {
      expect(rotate2d).toBeDefined()
      expect(typeof rotate2d).toBe('function')
      expect(rotate2d).toHaveProperty('isNode')
    })
  })

  describe('Complex Math', () => {
    it('complexMul should be defined', () => {
      expect(complexMul).toBeDefined()
      expect(typeof complexMul).toBe('function')
      expect(complexMul).toHaveProperty('isNode')
    })
  })

  describe('Coordinate Transforms', () => {
    it('cartesianToPolar should be defined', () => {
      expect(cartesianToPolar).toBeDefined()
      expect(typeof cartesianToPolar).toBe('function')
      expect(cartesianToPolar).toHaveProperty('isNode')
    })

    it('polarToCartesian should be defined', () => {
      expect(polarToCartesian).toBeDefined()
      expect(typeof polarToCartesian).toBe('function')
      expect(polarToCartesian).toHaveProperty('isNode')
    })
  })

  it('smoothMod should be defined', () => {
    expect(smoothMod).toBeDefined()
    expect(typeof smoothMod).toBe('function')
    expect(smoothMod).toHaveProperty('isNode')
  })
})

