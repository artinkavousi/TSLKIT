import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { __setModernError, __setModernRenderer } from 'three/webgpu';
import { __setLegacyRenderer } from 'three/examples/jsm/renderers/webgpu/WebGPURenderer.js';

const { defaultModernRenderer, defaultLegacyRenderer } = vi.hoisted(() => ({
  defaultModernRenderer: class DefaultModernRenderer {},
  defaultLegacyRenderer: class DefaultLegacyRenderer {},
}));

describe('loadWebGPURenderer', () => {
  beforeEach(() => {
    __setModernError(null);
    __setModernRenderer(defaultModernRenderer);
    __setLegacyRenderer(defaultLegacyRenderer);
  });

  afterEach(() => {
    __setModernError(null);
    __setModernRenderer(defaultModernRenderer);
    __setLegacyRenderer(defaultLegacyRenderer);
    vi.resetModules();
  });

  it('prefers the modern specifier when available', async () => {
    class ModernRenderer {}
    __setModernRenderer(ModernRenderer);

    const { loadWebGPURenderer } = await import('./webgpuLoader.js');
    const ctor = await loadWebGPURenderer();

    expect(ctor).toBe(ModernRenderer);
  });

  it('falls back when the modern module lacks the renderer export', async () => {
    class LegacyRenderer {}
    __setModernRenderer(undefined);
    __setLegacyRenderer(LegacyRenderer);

    const { loadWebGPURenderer } = await import('./webgpuLoader.js');
    const ctor = await loadWebGPURenderer();

    expect(ctor).toBe(LegacyRenderer);
  });

  it('falls back when the modern import throws', async () => {
    class LegacyRenderer {}
    const modernError = new Error('modern missing');
    __setModernError(modernError);
    __setLegacyRenderer(LegacyRenderer);

    const { loadWebGPURenderer } = await import('./webgpuLoader.js');
    const ctor = await loadWebGPURenderer();

    expect(ctor).toBe(LegacyRenderer);
  });

  it('re-throws the modern import error when neither module yields a renderer', async () => {
    const modernError = new Error('no renderer available');
    __setModernError(modernError);
    __setLegacyRenderer(undefined);

    const { loadWebGPURenderer } = await import('./webgpuLoader.js');

    await expect(loadWebGPURenderer()).rejects.toBe(modernError);
  });
});
