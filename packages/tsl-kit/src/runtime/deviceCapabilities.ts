import type { WebGPUFeatureName } from 'three';

export interface DeviceCapabilityReport {
  supported: boolean;
  adapterName?: string;
  limits?: GPUDeviceLimits;
  missingFeatures: WebGPUFeatureName[];
  enabledFeatures: WebGPUFeatureName[];
}

const REQUIRED_FEATURES: WebGPUFeatureName[] = [
  'textureCompressionBC',
  'timestampQuery',
  'indirect-first-instance'
];

const OPTIONAL_FEATURES: WebGPUFeatureName[] = ['depth-clip-control', 'bgra8unorm-storage'];

export async function detectDeviceCapabilities(): Promise<DeviceCapabilityReport> {
  if (!('gpu' in navigator)) {
    return { supported: false, missingFeatures: REQUIRED_FEATURES, enabledFeatures: [] };
  }

  const adapter = await navigator.gpu.requestAdapter();
  if (!adapter) {
    return { supported: false, missingFeatures: REQUIRED_FEATURES, enabledFeatures: [] };
  }

  const missingFeatures = REQUIRED_FEATURES.filter((feature) => !adapter.features.has(feature));
  const enabledFeatures = [...adapter.features].filter((feature) =>
    [...REQUIRED_FEATURES, ...OPTIONAL_FEATURES].includes(feature as WebGPUFeatureName)
  ) as WebGPUFeatureName[];

  const report: DeviceCapabilityReport = {
    supported: missingFeatures.length === 0,
    adapterName: adapter.name,
    missingFeatures,
    enabledFeatures
  };

  if (adapter.limits) {
    report.limits = adapter.limits;
  }

  return report;
}
