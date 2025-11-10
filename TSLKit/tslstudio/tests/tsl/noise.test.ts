/**
 * @vitest-environment node
 */

import { describe, it, expect } from 'vitest'
import { simplexNoise3d, fbm, curlNoise3d } from '../../src/tsl/noise'

describe('Noise Module', () => {
  describe('simplexNoise3d', () => {
    it('should be defined', () => {
      expect(simplexNoise3d).toBeDefined()
      expect(typeof simplexNoise3d).toBe('function')
    })

    it('should return a TSL node function', () => {
      expect(simplexNoise3d).toHaveProperty('isNode')
    })
  })

  describe('fbm', () => {
    it('should be defined', () => {
      expect(fbm).toBeDefined()
      expect(typeof fbm).toBe('function')
    })

    it('should return a TSL node function', () => {
      expect(fbm).toHaveProperty('isNode')
    })
  })

  describe('curlNoise3d', () => {
    it('should be defined', () => {
      expect(curlNoise3d).toBeDefined()
      expect(typeof curlNoise3d).toBe('function')
    })

    it('should return a TSL node function', () => {
      expect(curlNoise3d).toHaveProperty('isNode')
    })
  })
})

