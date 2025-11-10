/**
 * @vitest-environment node
 */

import { describe, it, expect } from 'vitest'
import { 
  sdSphere, 
  sdBox2d, 
  sdBox3d,
  sdfUnion,
  sdfSmoothUnion,
  sdfRepeat 
} from '../../src/tsl/sdf'

describe('SDF Module', () => {
  describe('Shape Functions', () => {
    it('sdSphere should be defined', () => {
      expect(sdSphere).toBeDefined()
      expect(typeof sdSphere).toBe('function')
      expect(sdSphere).toHaveProperty('isNode')
    })

    it('sdBox2d should be defined', () => {
      expect(sdBox2d).toBeDefined()
      expect(typeof sdBox2d).toBe('function')
      expect(sdBox2d).toHaveProperty('isNode')
    })

    it('sdBox3d should be defined', () => {
      expect(sdBox3d).toBeDefined()
      expect(typeof sdBox3d).toBe('function')
      expect(sdBox3d).toHaveProperty('isNode')
    })
  })

  describe('Operation Functions', () => {
    it('sdfUnion should be defined', () => {
      expect(sdfUnion).toBeDefined()
      expect(typeof sdfUnion).toBe('function')
      expect(sdfUnion).toHaveProperty('isNode')
    })

    it('sdfSmoothUnion should be defined', () => {
      expect(sdfSmoothUnion).toBeDefined()
      expect(typeof sdfSmoothUnion).toBe('function')
      expect(sdfSmoothUnion).toHaveProperty('isNode')
    })

    it('sdfRepeat should be defined', () => {
      expect(sdfRepeat).toBeDefined()
      expect(typeof sdfRepeat).toBe('function')
      expect(sdfRepeat).toHaveProperty('isNode')
    })
  })
})

