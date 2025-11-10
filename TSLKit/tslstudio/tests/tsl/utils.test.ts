/**
 * @vitest-environment node
 */

import { describe, it, expect } from 'vitest'
import { bloom, screenAspectUV, repeatingPattern } from '../../src/tsl/utils'

describe('Utils Module', () => {
  it('bloom should be defined', () => {
    expect(bloom).toBeDefined()
    expect(typeof bloom).toBe('function')
    expect(bloom).toHaveProperty('isNode')
  })

  it('screenAspectUV should be defined', () => {
    expect(screenAspectUV).toBeDefined()
    expect(typeof screenAspectUV).toBe('function')
    expect(screenAspectUV).toHaveProperty('isNode')
  })

  it('repeatingPattern should be defined', () => {
    expect(repeatingPattern).toBeDefined()
    expect(typeof repeatingPattern).toBe('function')
    expect(repeatingPattern).toHaveProperty('isNode')
  })
})

