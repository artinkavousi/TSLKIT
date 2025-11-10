/**
 * Vitest setup file
 * Runs before all tests
 */

// Mock WebGPU if not available
if (typeof globalThis.GPU === 'undefined') {
  globalThis.GPU = {} as GPU
}

// Mock navigator.gpu for testing
if (typeof globalThis.navigator === 'undefined') {
  // @ts-expect-error - Mock for testing
  globalThis.navigator = {}
}

if (typeof globalThis.navigator.gpu === 'undefined') {
  // @ts-expect-error - Mock for testing
  globalThis.navigator.gpu = {
    requestAdapter: async () => null,
  }
}

// Setup canvas mock
if (typeof HTMLCanvasElement !== 'undefined') {
  HTMLCanvasElement.prototype.getContext = function (contextId: string) {
    if (contextId === 'webgpu') {
      return {
        canvas: this,
        configure: () => {},
        getCurrentTexture: () => ({}),
      }
    }
    return null
  }
}

export {}

