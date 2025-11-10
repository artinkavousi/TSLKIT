/**
 * @vitest-environment node
 */

import { describe, it, expect } from 'vitest'
import { 
  ambientLightNode,
  diffuseNode,
  directionalLightNode,
  createFresnelNode,
  createHemisphereLight
} from '../../src/tsl/lighting'

describe('Lighting Module', () => {
  it('ambientLightNode should be defined', () => {
    expect(ambientLightNode).toBeDefined()
    expect(typeof ambientLightNode).toBe('function')
    expect(ambientLightNode).toHaveProperty('isNode')
  })

  it('diffuseNode should be defined', () => {
    expect(diffuseNode).toBeDefined()
    expect(typeof diffuseNode).toBe('function')
    expect(diffuseNode).toHaveProperty('isNode')
  })

  it('directionalLightNode should be defined', () => {
    expect(directionalLightNode).toBeDefined()
    expect(typeof directionalLightNode).toBe('function')
    expect(directionalLightNode).toHaveProperty('isNode')
  })

  it('createFresnelNode should be defined', () => {
    expect(createFresnelNode).toBeDefined()
    expect(typeof createFresnelNode).toBe('function')
    expect(createFresnelNode).toHaveProperty('isNode')
  })

  it('createHemisphereLight should be defined', () => {
    expect(createHemisphereLight).toBeDefined()
    expect(typeof createHemisphereLight).toBe('function')
    expect(createHemisphereLight).toHaveProperty('isNode')
  })
})

