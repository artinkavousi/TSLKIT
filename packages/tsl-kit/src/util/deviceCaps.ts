export type GPUFeatureName = string;

export interface WebGPUDeviceLimits {
  readonly maxColorAttachmentBytesPerSample?: number;
  readonly maxBufferSize?: number;
  readonly maxStorageBufferBindingSize?: number;
  readonly maxComputeWorkgroupSizeX?: number;
  readonly maxComputeInvocationsPerWorkgroup?: number;
}

export interface WebGPUDevice {
  readonly features: ReadonlySet<GPUFeatureName> | { readonly values: () => Iterable<GPUFeatureName> };
  readonly limits: WebGPUDeviceLimits;
}

export interface WebGPUAdapter {
  readonly name?: string;
}

function collectFeatures(features: WebGPUDevice['features']): GPUFeatureName[] {
  if (typeof (features as ReadonlySet<GPUFeatureName>).values === 'function') {
    return Array.from((features as ReadonlySet<GPUFeatureName>).values());
  }

  const record = features as { readonly values: () => Iterable<GPUFeatureName> };
  return Array.from(record.values());
}

export interface WebGPURequiredLimits {
  readonly maxColorAttachmentBytesPerSample?: number;
  readonly maxBufferSize?: number;
  readonly maxStorageBufferBindingSize?: number;
  readonly maxComputeWorkgroupSizeX?: number;
  readonly maxComputeInvocationsPerWorkgroup?: number;
}

export interface DeviceCapabilityReport {
  readonly adapterName: string;
  readonly supportsTimestampQueries: boolean;
  readonly features: readonly GPUFeatureName[];
  readonly requiredLimits: WebGPURequiredLimits;
}

export function createDeviceCapabilityReport(adapter: WebGPUAdapter, device: WebGPUDevice): DeviceCapabilityReport {
  const featureList = collectFeatures(device.features);
  const limits = device.limits;
  const requiredLimits: WebGPURequiredLimits = {
    maxColorAttachmentBytesPerSample: limits.maxColorAttachmentBytesPerSample,
    maxBufferSize: limits.maxBufferSize,
    maxStorageBufferBindingSize: limits.maxStorageBufferBindingSize,
    maxComputeWorkgroupSizeX: limits.maxComputeWorkgroupSizeX,
    maxComputeInvocationsPerWorkgroup: limits.maxComputeInvocationsPerWorkgroup
  };

  return {
    adapterName: adapter.name ?? 'unknown-adapter',
    supportsTimestampQueries: featureList.includes('timestamp-query'),
    features: featureList,
    requiredLimits
  };
}
