/**
 * WebGPU Device Capability Detection
 *
 * Detects and reports available WebGPU features, limits, and capabilities.
 *
 * @module core/capabilities
 */
export interface WebGPUCapabilities {
    isSupported: boolean;
    adapter: GPUAdapter | null;
    device: GPUDevice | null;
    limits: GPUSupportedLimits;
    features: Set<string>;
    info: {
        vendor: string;
        architecture: string;
        device: string;
        description: string;
    };
    tier: 'low' | 'mid' | 'high' | 'ultra';
}
export interface CapabilityRequirements {
    minComputeUnitsPerDispatch?: number;
    minStorageBufferSize?: number;
    minTextureSize?: number;
    requiredFeatures?: string[];
}
/**
 * Detect WebGPU capabilities
 */
export declare function detectCapabilities(): Promise<WebGPUCapabilities>;
/**
 * Check if device meets specific requirements
 */
export declare function meetsRequirements(capabilities: WebGPUCapabilities, requirements: CapabilityRequirements): {
    meets: boolean;
    missing: string[];
};
/**
 * Get recommended settings based on capabilities
 */
export declare function getRecommendedGPUSettings(capabilities: WebGPUCapabilities): {
    particleCount: number;
    fluidGridSize: number;
    postProcessingQuality: 'low' | 'medium' | 'high' | 'ultra';
    shadowMapSize: number;
    enableAdvancedEffects: boolean;
};
/**
 * Generate capability report
 */
export declare function generateReport(capabilities: WebGPUCapabilities): string;
//# sourceMappingURL=capabilities.d.ts.map