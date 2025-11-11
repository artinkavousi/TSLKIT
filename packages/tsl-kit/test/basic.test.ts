/**
 * Basic Import Tests for @tslstudio/tsl-kit
 * 
 * Verifies that all modules can be imported without errors
 * and basic type safety is working.
 */

import { describe, it, expect } from '@jest/globals'

// Test all module imports
describe('@tslstudio/tsl-kit - Module Imports', () => {
  it('should import noise functions', async () => {
    const { simplexNoise3d, perlinNoise3d, curlNoise3d, fbm } = await import('../src/noise')
    
    expect(simplexNoise3d).toBeDefined()
    expect(perlinNoise3d).toBeDefined()
    expect(curlNoise3d).toBeDefined()
    expect(fbm).toBeDefined()
  })

  it('should import lighting functions', async () => {
    const { createFresnelNode, ambientLightNode, diffuseNode, createHemisphereLight } = await import('../src/lighting')
    
    expect(createFresnelNode).toBeDefined()
    expect(ambientLightNode).toBeDefined()
    expect(diffuseNode).toBeDefined()
    expect(createHemisphereLight).toBeDefined()
  })

  it('should import utility functions', async () => {
    const { remapNode, smoothmin, compose, cartesianToPolar } = await import('../src/utils')
    
    expect(remapNode).toBeDefined()
    expect(smoothmin).toBeDefined()
    expect(compose).toBeDefined()
    expect(cartesianToPolar).toBeDefined()
  })

  it('should import SDF functions', async () => {
    const { sdSphere, sdBox3d, smin, smax } = await import('../src/sdf')
    
    expect(sdSphere).toBeDefined()
    expect(sdBox3d).toBeDefined()
    expect(smin).toBeDefined()
    expect(smax).toBeDefined()
  })

  it('should import post-FX functions', async () => {
    const { bloom, reinhardTonemap, gaussianBlur } = await import('../src/postfx')
    
    expect(bloom).toBeDefined()
    expect(reinhardTonemap).toBeDefined()
    expect(gaussianBlur).toBeDefined()
  })

  it('should import device capabilities', async () => {
    const { checkWebGPUSupport, getRecommendedSettings } = await import('../src/utils/deviceCaps')
    
    expect(checkWebGPUSupport).toBeDefined()
    expect(getRecommendedSettings).toBeDefined()
  })

  it('should import from main barrel export', async () => {
    const tslKit = await import('../src/index')
    
    // Verify main exports exist
    expect(tslKit.simplexNoise3d).toBeDefined()
    expect(tslKit.createFresnelNode).toBeDefined()
    expect(tslKit.sdSphere).toBeDefined()
    expect(tslKit.remapNode).toBeDefined()
    expect(tslKit.bloom).toBeDefined()
  })
})

describe('@tslstudio/tsl-kit - Device Capabilities', () => {
  it('should check WebGPU support without throwing', async () => {
    const { checkWebGPUSupport } = await import('../src/utils/deviceCaps')
    
    // Should return boolean, not throw
    const supported = await checkWebGPUSupport()
    expect(typeof supported).toBe('boolean')
  })

  it('should provide quality presets', async () => {
    const { getQualitySettings } = await import('../src/utils/deviceCaps')
    
    const settings = getQualitySettings('medium')
    expect(settings.preset).toBe('medium')
    expect(settings.shadowMapSize).toBe(1024)
    expect(settings.maxLights).toBe(4)
  })
})

console.log('✅ All basic imports successful!')

