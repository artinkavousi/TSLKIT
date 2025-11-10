import { isWebGPUSupported } from './isWebGPUSupported.js';

export interface DeviceCapabilities {
  hasWebGPU: boolean;
  adapterInfo?: GPUAdapterInfo;
  limits?: GPUSupportedLimits;
}

async function defaultRequestAdapter(): Promise<GPUAdapter | null> {
  if (!isWebGPUSupported()) {
    return null;
  }

  return navigator.gpu.requestAdapter();
}

export async function getDeviceCapabilities(
  requestAdapter: () => Promise<GPUAdapter | null> = defaultRequestAdapter,
): Promise<DeviceCapabilities> {
  if (!isWebGPUSupported()) {
    return { hasWebGPU: false };
  }

  const adapter = await requestAdapter();
  if (!adapter) {
    return { hasWebGPU: false };
  }

  const info = adapter.requestAdapterInfo
    ? await adapter.requestAdapterInfo().catch(() => undefined)
    : undefined;

  return {
    hasWebGPU: true,
    adapterInfo: info,
    limits: adapter.limits,
  };
}
