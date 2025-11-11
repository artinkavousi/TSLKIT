/**
 * WebGPU Device Capability Detection
 * 
 * @author TSLStudio
 * @license MIT
 * @version Three.js r181+
 * 
 * Utilities for detecting WebGPU support, querying device limits,
 * and automatically selecting appropriate quality presets based on hardware.
 * 
 * Essential for building responsive WebGPU applications that adapt to
 * different hardware capabilities.
 */

/**
 * WebGPU device limits
 */
export interface DeviceLimits {
  maxTextureDimension2D: number
  maxTextureArrayLayers: number
  maxBindGroups: number
  maxDynamicUniformBuffersPerPipelineLayout: number
  maxDynamicStorageBuffersPerPipelineLayout: number
  maxSampledTexturesPerShaderStage: number
  maxSamplersPerShaderStage: number
  maxStorageBuffersPerShaderStage: number
  maxStorageTexturesPerShaderStage: number
  maxUniformBuffersPerShaderStage: number
  maxUniformBufferBindingSize: number
  maxStorageBufferBindingSize: number
  maxVertexBuffers: number
  maxVertexAttributes: number
  maxVertexBufferArrayStride: number
  maxComputeWorkgroupStorageSize: number
  maxComputeInvocationsPerWorkgroup: number
  maxComputeWorkgroupSizeX: number
  maxComputeWorkgroupSizeY: number
  maxComputeWorkgroupSizeZ: number
}

/**
 * Device capability summary
 */
export interface DeviceCapabilities {
  supported: boolean
  adapter: string
  vendor: string
  architecture: string
  limits: DeviceLimits
  features: string[]
}

/**
 * Quality preset levels
 */
export type QualityPreset = 'low' | 'medium' | 'high' | 'ultra'

/**
 * Quality preset configuration
 */
export interface QualitySettings {
  preset: QualityPreset
  shadowMapSize: number
  maxLights: number
  postProcessing: boolean
  antialiasing: 'none' | 'msaa' | 'taa'
  bloomEnabled: boolean
  aoEnabled: boolean
  maxParticles: number
  reflectionsEnabled: boolean
}

/**
 * Checks if WebGPU is supported in the current environment
 * 
 * @returns Promise resolving to true if WebGPU is supported
 * 
 * @example
 * ```typescript
 * import { checkWebGPUSupport } from '@tslstudio/tsl-kit/utils'
 * 
 * if (await checkWebGPUSupport()) {
 *   // Initialize WebGPU renderer
 * } else {
 *   // Fallback to WebGL
 * }
 * ```
 */
export async function checkWebGPUSupport(): Promise<boolean> {
  try {
    if (!navigator.gpu) {
      return false
    }

    const adapter = await navigator.gpu.requestAdapter()
    return adapter !== null
  } catch (error) {
    console.warn('WebGPU support check failed:', error)
    return false
  }
}

/**
 * Gets detailed WebGPU device limits
 * 
 * @returns Promise resolving to device limits object
 * 
 * @example
 * ```typescript
 * import { getDeviceLimits } from '@tslstudio/tsl-kit/utils'
 * 
 * const limits = await getDeviceLimits()
 * console.log(`Max texture size: ${limits.maxTextureDimension2D}`)
 * ```
 */
export async function getDeviceLimits(): Promise<DeviceLimits> {
  if (!navigator.gpu) {
    throw new Error('WebGPU is not supported')
  }

  const adapter = await navigator.gpu.requestAdapter()
  if (!adapter) {
    throw new Error('Failed to get WebGPU adapter')
  }

  return {
    maxTextureDimension2D: adapter.limits.maxTextureDimension2D,
    maxTextureArrayLayers: adapter.limits.maxTextureArrayLayers,
    maxBindGroups: adapter.limits.maxBindGroups,
    maxDynamicUniformBuffersPerPipelineLayout: adapter.limits.maxDynamicUniformBuffersPerPipelineLayout,
    maxDynamicStorageBuffersPerPipelineLayout: adapter.limits.maxDynamicStorageBuffersPerPipelineLayout,
    maxSampledTexturesPerShaderStage: adapter.limits.maxSampledTexturesPerShaderStage,
    maxSamplersPerShaderStage: adapter.limits.maxSamplersPerShaderStage,
    maxStorageBuffersPerShaderStage: adapter.limits.maxStorageBuffersPerShaderStage,
    maxStorageTexturesPerShaderStage: adapter.limits.maxStorageTexturesPerShaderStage,
    maxUniformBuffersPerShaderStage: adapter.limits.maxUniformBuffersPerShaderStage,
    maxUniformBufferBindingSize: adapter.limits.maxUniformBufferBindingSize,
    maxStorageBufferBindingSize: adapter.limits.maxStorageBufferBindingSize,
    maxVertexBuffers: adapter.limits.maxVertexBuffers,
    maxVertexAttributes: adapter.limits.maxVertexAttributes,
    maxVertexBufferArrayStride: adapter.limits.maxVertexBufferArrayStride,
    maxComputeWorkgroupStorageSize: adapter.limits.maxComputeWorkgroupStorageSize,
    maxComputeInvocationsPerWorkgroup: adapter.limits.maxComputeInvocationsPerWorkgroup,
    maxComputeWorkgroupSizeX: adapter.limits.maxComputeWorkgroupSizeX,
    maxComputeWorkgroupSizeY: adapter.limits.maxComputeWorkgroupSizeY,
    maxComputeWorkgroupSizeZ: adapter.limits.maxComputeWorkgroupSizeZ,
  }
}

/**
 * Gets comprehensive device capabilities including limits and features
 * 
 * @returns Promise resolving to device capabilities object
 * 
 * @example
 * ```typescript
 * import { getDeviceCapabilities } from '@tslstudio/tsl-kit/utils'
 * 
 * const caps = await getDeviceCapabilities()
 * console.log(`GPU: ${caps.vendor} ${caps.architecture}`)
 * console.log(`Features: ${caps.features.join(', ')}`)
 * ```
 */
export async function getDeviceCapabilities(): Promise<DeviceCapabilities> {
  if (!navigator.gpu) {
    return {
      supported: false,
      adapter: 'none',
      vendor: 'unknown',
      architecture: 'unknown',
      limits: {} as DeviceLimits,
      features: [],
    }
  }

  const adapter = await navigator.gpu.requestAdapter()
  if (!adapter) {
    return {
      supported: false,
      adapter: 'none',
      vendor: 'unknown',
      architecture: 'unknown',
      limits: {} as DeviceLimits,
      features: [],
    }
  }

  const info = await adapter.requestAdapterInfo()
  const limits = await getDeviceLimits()

  return {
    supported: true,
    adapter: info.device || 'unknown',
    vendor: info.vendor || 'unknown',
    architecture: info.architecture || 'unknown',
    limits,
    features: Array.from(adapter.features),
  }
}

/**
 * Automatically selects an appropriate quality preset based on device capabilities
 * 
 * Uses heuristics based on GPU tier, memory, and features to recommend settings.
 * 
 * @returns Promise resolving to quality preset ('low', 'medium', 'high', 'ultra')
 * 
 * @example
 * ```typescript
 * import { selectQualityPreset } from '@tslstudio/tsl-kit/utils'
 * 
 * const preset = await selectQualityPreset()
 * console.log(`Recommended quality: ${preset}`)
 * ```
 */
export async function selectQualityPreset(): Promise<QualityPreset> {
  try {
    const caps = await getDeviceCapabilities()

    if (!caps.supported) {
      return 'low'
    }

    const { limits, features, vendor, architecture } = caps

    // Score based on texture size support (proxy for GPU power)
    let score = 0

    if (limits.maxTextureDimension2D >= 16384) score += 3
    else if (limits.maxTextureDimension2D >= 8192) score += 2
    else if (limits.maxTextureDimension2D >= 4096) score += 1

    // Bonus for advanced features
    if (features.includes('texture-compression-bc')) score += 1
    if (features.includes('texture-compression-etc2')) score += 1
    if (features.includes('texture-compression-astc')) score += 1
    if (features.includes('depth-clip-control')) score += 1
    if (features.includes('timestamp-query')) score += 1

    // Vendor-specific adjustments (rough heuristics)
    if (vendor.toLowerCase().includes('nvidia')) score += 1
    if (vendor.toLowerCase().includes('amd')) score += 0.5
    if (architecture.toLowerCase().includes('integrated')) score -= 1

    // Map score to preset
    if (score >= 7) return 'ultra'
    if (score >= 5) return 'high'
    if (score >= 3) return 'medium'
    return 'low'
  } catch (error) {
    console.warn('Quality preset selection failed:', error)
    return 'medium' // Safe fallback
  }
}

/**
 * Gets recommended quality settings for a given preset
 * 
 * @param preset - Quality preset level
 * @returns Quality settings configuration
 * 
 * @example
 * ```typescript
 * import { getQualitySettings, selectQualityPreset } from '@tslstudio/tsl-kit/utils'
 * 
 * const preset = await selectQualityPreset()
 * const settings = getQualitySettings(preset)
 * renderer.shadowMap.size = settings.shadowMapSize
 * ```
 */
export function getQualitySettings(preset: QualityPreset): QualitySettings {
  const settings: Record<QualityPreset, QualitySettings> = {
    low: {
      preset: 'low',
      shadowMapSize: 512,
      maxLights: 2,
      postProcessing: false,
      antialiasing: 'none',
      bloomEnabled: false,
      aoEnabled: false,
      maxParticles: 1000,
      reflectionsEnabled: false,
    },
    medium: {
      preset: 'medium',
      shadowMapSize: 1024,
      maxLights: 4,
      postProcessing: true,
      antialiasing: 'msaa',
      bloomEnabled: true,
      aoEnabled: false,
      maxParticles: 5000,
      reflectionsEnabled: false,
    },
    high: {
      preset: 'high',
      shadowMapSize: 2048,
      maxLights: 8,
      postProcessing: true,
      antialiasing: 'taa',
      bloomEnabled: true,
      aoEnabled: true,
      maxParticles: 10000,
      reflectionsEnabled: true,
    },
    ultra: {
      preset: 'ultra',
      shadowMapSize: 4096,
      maxLights: 16,
      postProcessing: true,
      antialiasing: 'taa',
      bloomEnabled: true,
      aoEnabled: true,
      maxParticles: 50000,
      reflectionsEnabled: true,
    },
  }

  return settings[preset]
}

/**
 * Convenience function: auto-detect and return recommended quality settings
 * 
 * @returns Promise resolving to recommended quality settings
 * 
 * @example
 * ```typescript
 * import { getRecommendedSettings } from '@tslstudio/tsl-kit/utils'
 * 
 * const settings = await getRecommendedSettings()
 * console.log(`Using ${settings.preset} preset with ${settings.shadowMapSize}px shadows`)
 * ```
 */
export async function getRecommendedSettings(): Promise<QualitySettings> {
  const preset = await selectQualityPreset()
  return getQualitySettings(preset)
}

