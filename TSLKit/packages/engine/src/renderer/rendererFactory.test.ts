import { beforeEach, describe, expect, it, vi } from 'vitest';

class WebGLRendererMock {
  public readonly parameters: Record<string, unknown>;

  constructor(parameters: Record<string, unknown>) {
    this.parameters = parameters;
  }

  setPixelRatio() {}
  setSize() {}
}

class WebGPURendererMock {
  public readonly parameters: Record<string, unknown>;
  public init = vi.fn(async () => {
    if ((globalThis as typeof globalThis & { __webgpuShouldFail?: boolean }).__webgpuShouldFail) {
      throw new Error('Forced failure');
    }
  });

  constructor(parameters: Record<string, unknown>) {
    this.parameters = parameters;
  }

  setPixelRatio() {}
  setSize() {}
  dispose() {}
}

vi.mock('../capabilities/isWebGPUSupported.js', () => ({
  isWebGPUSupported: vi.fn(() => false)
}));

vi.mock('three', () => ({
  WebGLRenderer: WebGLRendererMock
}));

vi.mock('./webgpuLoader.js', () => ({
  loadWebGPURenderer: vi.fn(async () => WebGPURendererMock)
}));

const { isWebGPUSupported } = await import('../capabilities/isWebGPUSupported.js');
const { loadWebGPURenderer } = await import('./webgpuLoader.js');
const { createRenderer } = await import('./rendererFactory.js');

function resetFailureFlag(): void {
  delete (globalThis as typeof globalThis & { __webgpuShouldFail?: boolean }).__webgpuShouldFail;
}

describe('createRenderer', () => {
  beforeEach(() => {
    resetFailureFlag();
    (isWebGPUSupported as ReturnType<typeof vi.fn>).mockReturnValue(false);
  });

  it('falls back to WebGL when WebGPU is unavailable', async () => {
    const canvas = document.createElement('canvas');
    const fallbackSpy = vi.fn();

    const result = await createRenderer({ canvas, onFallback: fallbackSpy });

    expect(result.isWebGPU).toBe(false);
    expect(result.renderer).toBeInstanceOf(WebGLRendererMock);
    expect(fallbackSpy).toHaveBeenCalled();
    expect(result.framegraph.getQualityScale()).toBeCloseTo(1);
  });

  it('falls back to WebGL when WebGPU initialization fails', async () => {
    const canvas = document.createElement('canvas');
    const fallbackSpy = vi.fn();

    (isWebGPUSupported as ReturnType<typeof vi.fn>).mockReturnValue(true);
    (loadWebGPURenderer as ReturnType<typeof vi.fn>).mockResolvedValueOnce(WebGPURendererMock);
    (globalThis as typeof globalThis & { __webgpuShouldFail?: boolean }).__webgpuShouldFail = true;

    const result = await createRenderer({ canvas, onFallback: fallbackSpy });

    expect(result.isWebGPU).toBe(false);
    expect(fallbackSpy).toHaveBeenCalledWith('Forced failure');
    expect(result.framegraph.getQualityScale()).toBeCloseTo(1);
  });

  it('returns a WebGPU renderer when supported and initialization succeeds', async () => {
    const canvas = document.createElement('canvas');

    (isWebGPUSupported as ReturnType<typeof vi.fn>).mockReturnValue(true);
    const result = await createRenderer({ canvas });

    expect(result.isWebGPU).toBe(true);
    expect(result.renderer).toBeInstanceOf(WebGPURendererMock);
    expect(result.framegraph.getQualityScale()).toBeCloseTo(1);
  });
});
