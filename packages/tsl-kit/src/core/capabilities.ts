/**
 * WebGPU Device Capability Detection
 * 
 * Detects and reports available WebGPU features, limits, and capabilities.
 * 
 * @module core/capabilities
 */

/// <reference types="@webgpu/types" />

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
export async function detectCapabilities(): Promise<WebGPUCapabilities> {
  // Check if WebGPU is supported
  if (!navigator.gpu) {
    return {
      isSupported: false,
      adapter: null,
      device: null,
      limits: {} as GPUSupportedLimits,
      features: new Set(),
      info: {
        vendor: 'unknown',
        architecture: 'unknown',
        device: 'unknown',
        description: 'WebGPU not supported'
      },
      tier: 'low'
    };
  }

  try {
    // Request adapter
    const adapter = await navigator.gpu.requestAdapter({
      powerPreference: 'high-performance'
    });

    if (!adapter) {
      throw new Error('Could not request WebGPU adapter');
    }

    // Get adapter info
    const adapterInfo = adapter.info || {
      vendor: 'unknown',
      architecture: 'unknown',
      device: 'unknown',
      description: 'No adapter info available'
    };

    // Request device
    const device = await adapter.requestDevice({
      requiredFeatures: [],
      requiredLimits: {}
    });

    // Determine performance tier
    const tier = determinePerformanceTier(adapter.limits);

    return {
      isSupported: true,
      adapter,
      device,
      limits: adapter.limits,
      features: new Set(adapter.features),
      info: {
        vendor: adapterInfo.vendor,
        architecture: adapterInfo.architecture,
        device: adapterInfo.device,
        description: adapterInfo.description
      },
      tier
    };
  } catch (error) {
    console.error('WebGPU detection error:', error);
    return {
      isSupported: false,
      adapter: null,
      device: null,
      limits: {} as GPUSupportedLimits,
      features: new Set(),
      info: {
        vendor: 'unknown',
        architecture: 'unknown',
        device: 'unknown',
        description: `Error: ${error instanceof Error ? error.message : 'Unknown error'}`
      },
      tier: 'low'
    };
  }
}

/**
 * Determine performance tier based on GPU limits
 */
function determinePerformanceTier(limits: GPUSupportedLimits): 'low' | 'mid' | 'high' | 'ultra' {
  // Use maxComputeWorkgroupStorageSize as a proxy for overall capability
  const storageSize = limits.maxComputeWorkgroupStorageSize;
  const bufferSize = limits.maxStorageBufferBindingSize;
  
  // Ultra: High-end desktop GPUs (RTX 3080+, RX 6800+)
  if (storageSize >= 32768 && bufferSize >= 2_147_483_648) {
    return 'ultra';
  }
  
  // High: Mid-to-high desktop GPUs (RTX 2070+, RX 5700+)
  if (storageSize >= 16384 && bufferSize >= 1_073_741_824) {
    return 'high';
  }
  
  // Mid: Entry-level desktop / high-end mobile (GTX 1660, integrated)
  if (storageSize >= 8192 && bufferSize >= 536_870_912) {
    return 'mid';
  }
  
  // Low: Low-end mobile / older hardware
  return 'low';
}

/**
 * Check if device meets specific requirements
 */
export function meetsRequirements(
  capabilities: WebGPUCapabilities,
  requirements: CapabilityRequirements
): { meets: boolean; missing: string[] } {
  const missing: string[] = [];

  if (!capabilities.isSupported) {
    missing.push('WebGPU not supported');
    return { meets: false, missing };
  }

  // Check compute units
  if (requirements.minComputeUnitsPerDispatch) {
    const available = capabilities.limits.maxComputeWorkgroupsPerDimension;
    if (available < requirements.minComputeUnitsPerDispatch) {
      missing.push(
        `Insufficient compute units: ${available} < ${requirements.minComputeUnitsPerDispatch}`
      );
    }
  }

  // Check storage buffer size
  if (requirements.minStorageBufferSize) {
    const available = capabilities.limits.maxStorageBufferBindingSize;
    if (available < requirements.minStorageBufferSize) {
      missing.push(
        `Insufficient storage buffer: ${available} < ${requirements.minStorageBufferSize}`
      );
    }
  }

  // Check texture size
  if (requirements.minTextureSize) {
    const available = capabilities.limits.maxTextureDimension2D;
    if (available < requirements.minTextureSize) {
      missing.push(
        `Insufficient texture size: ${available} < ${requirements.minTextureSize}`
      );
    }
  }

  // Check required features
  if (requirements.requiredFeatures) {
    for (const feature of requirements.requiredFeatures) {
      if (!capabilities.features.has(feature)) {
        missing.push(`Missing feature: ${feature}`);
      }
    }
  }

  return {
    meets: missing.length === 0,
    missing
  };
}

/**
 * Get recommended settings based on capabilities
 */
export function getRecommendedGPUSettings(capabilities: WebGPUCapabilities): {
  particleCount: number;
  fluidGridSize: number;
  postProcessingQuality: 'low' | 'medium' | 'high' | 'ultra';
  shadowMapSize: number;
  enableAdvancedEffects: boolean;
} {
  switch (capabilities.tier) {
    case 'ultra':
      return {
        particleCount: 1_000_000,
        fluidGridSize: 256,
        postProcessingQuality: 'ultra',
        shadowMapSize: 4096,
        enableAdvancedEffects: true
      };
    
    case 'high':
      return {
        particleCount: 500_000,
        fluidGridSize: 128,
        postProcessingQuality: 'high',
        shadowMapSize: 2048,
        enableAdvancedEffects: true
      };
    
    case 'mid':
      return {
        particleCount: 100_000,
        fluidGridSize: 64,
        postProcessingQuality: 'medium',
        shadowMapSize: 1024,
        enableAdvancedEffects: false
      };
    
    case 'low':
    default:
      return {
        particleCount: 10_000,
        fluidGridSize: 32,
        postProcessingQuality: 'low',
        shadowMapSize: 512,
        enableAdvancedEffects: false
      };
  }
}

/**
 * Generate capability report
 */
export function generateReport(capabilities: WebGPUCapabilities): string {
  const lines: string[] = [];
  
  lines.push('=== WebGPU Capabilities Report ===\n');
  
  if (!capabilities.isSupported) {
    lines.push('❌ WebGPU is NOT supported on this device');
    lines.push(`Reason: ${capabilities.info.description}\n`);
    return lines.join('\n');
  }
  
  lines.push('✅ WebGPU is supported\n');
  
  lines.push('Device Information:');
  lines.push(`  Vendor: ${capabilities.info.vendor}`);
  lines.push(`  Device: ${capabilities.info.device}`);
  lines.push(`  Architecture: ${capabilities.info.architecture}`);
  lines.push(`  Performance Tier: ${capabilities.tier.toUpperCase()}\n`);
  
  lines.push('Key Limits:');
  lines.push(`  Max Texture Size 2D: ${capabilities.limits.maxTextureDimension2D}px`);
  lines.push(`  Max Storage Buffer: ${(capabilities.limits.maxStorageBufferBindingSize / 1_073_741_824).toFixed(2)} GB`);
  lines.push(`  Max Compute Workgroups: ${capabilities.limits.maxComputeWorkgroupsPerDimension}`);
  lines.push(`  Max Workgroup Storage: ${capabilities.limits.maxComputeWorkgroupStorageSize} bytes\n`);
  
  if (capabilities.features.size > 0) {
    lines.push(`Supported Features (${capabilities.features.size}):`);
    Array.from(capabilities.features).forEach(feature => {
      lines.push(`  • ${feature}`);
    });
  } else {
    lines.push('No optional features supported');
  }
  
  const settings = getRecommendedGPUSettings(capabilities);
  lines.push('\nRecommended Settings:');
  lines.push(`  Particle Count: ${settings.particleCount.toLocaleString()}`);
  lines.push(`  Fluid Grid Size: ${settings.fluidGridSize}³`);
  lines.push(`  Post-Processing: ${settings.postProcessingQuality}`);
  lines.push(`  Shadow Maps: ${settings.shadowMapSize}px`);
  lines.push(`  Advanced Effects: ${settings.enableAdvancedEffects ? 'Enabled' : 'Disabled'}`);
  
  return lines.join('\n');
}

