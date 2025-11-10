import { isWebGPUSupported } from './isWebGPUSupported.js';

export interface DeviceCapabilities {
  webgpu: boolean;
  webgl: boolean;
}

function detectWebGLSupport(): boolean {
  if (typeof document === 'undefined' || typeof document.createElement !== 'function') {
    return false;
  }

  try {
    const canvas = document.createElement('canvas');
    const contextGetter = canvas.getContext?.bind(canvas);

    if (typeof contextGetter !== 'function') {
      return false;
    }

    return Boolean(contextGetter('webgl2') ?? contextGetter('webgl') ?? contextGetter('experimental-webgl'));
  } catch {
    return false;
  }
}

export function getDeviceCapabilities(): DeviceCapabilities {
  return {
    webgpu: isWebGPUSupported(),
    webgl: detectWebGLSupport(),
  };
}
