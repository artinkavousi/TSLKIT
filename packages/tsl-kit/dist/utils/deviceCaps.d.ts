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
    maxTextureDimension2D: number;
    maxTextureArrayLayers: number;
    maxBindGroups: number;
    maxDynamicUniformBuffersPerPipelineLayout: number;
    maxDynamicStorageBuffersPerPipelineLayout: number;
    maxSampledTexturesPerShaderStage: number;
    maxSamplersPerShaderStage: number;
    maxStorageBuffersPerShaderStage: number;
    maxStorageTexturesPerShaderStage: number;
    maxUniformBuffersPerShaderStage: number;
    maxUniformBufferBindingSize: number;
    maxStorageBufferBindingSize: number;
    maxVertexBuffers: number;
    maxVertexAttributes: number;
    maxVertexBufferArrayStride: number;
    maxComputeWorkgroupStorageSize: number;
    maxComputeInvocationsPerWorkgroup: number;
    maxComputeWorkgroupSizeX: number;
    maxComputeWorkgroupSizeY: number;
    maxComputeWorkgroupSizeZ: number;
}
/**
 * Device capability summary
 */
export interface DeviceCapabilities {
    supported: boolean;
    adapter: string;
    vendor: string;
    architecture: string;
    limits: DeviceLimits;
    features: string[];
}
/**
 * Quality preset levels
 */
export type QualityPreset = 'low' | 'medium' | 'high' | 'ultra';
/**
 * Quality preset configuration
 */
export interface QualitySettings {
    preset: QualityPreset;
    shadowMapSize: number;
    maxLights: number;
    postProcessing: boolean;
    antialiasing: 'none' | 'msaa' | 'taa';
    bloomEnabled: boolean;
    aoEnabled: boolean;
    maxParticles: number;
    reflectionsEnabled: boolean;
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
export declare function checkWebGPUSupport(): Promise<boolean>;
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
export declare function getDeviceLimits(): Promise<DeviceLimits>;
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
export declare function getDeviceCapabilities(): Promise<DeviceCapabilities>;
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
export declare function selectQualityPreset(): Promise<QualityPreset>;
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
export declare function getQualitySettings(preset: QualityPreset): QualitySettings;
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
export declare function getRecommendedSettings(): Promise<QualitySettings>;
//# sourceMappingURL=deviceCaps.d.ts.map