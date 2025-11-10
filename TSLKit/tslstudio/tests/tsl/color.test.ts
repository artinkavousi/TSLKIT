/**
 * @vitest-environment node
 */

import { describe, it, expect } from 'vitest'
import { 
  cosinePalette,
  reinhardTonemap,
  acesTonemap,
  uncharted2Tonemap
} from '../../src/tsl/color'

describe('Color Module', () => {
  it('cosinePalette should be defined', () => {
    expect(cosinePalette).toBeDefined()
    expect(typeof cosinePalette).toBe('function')
    expect(cosinePalette).toHaveProperty('isNode')
  })

  it('reinhardTonemap should be defined', () => {
    expect(reinhardTonemap).toBeDefined()
    expect(typeof reinhardTonemap).toBe('function')
    expect(reinhardTonemap).toHaveProperty('isNode')
  })

  it('acesTonemap should be defined', () => {
    expect(acesTonemap).toBeDefined()
    expect(typeof acesTonemap).toBe('function')
    expect(acesTonemap).toHaveProperty('isNode')
  })

  it('uncharted2Tonemap should be defined', () => {
    expect(uncharted2Tonemap).toBeDefined()
    expect(typeof uncharted2Tonemap).toBe('function')
    expect(uncharted2Tonemap).toHaveProperty('isNode')
  })
})

