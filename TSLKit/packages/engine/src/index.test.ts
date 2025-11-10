import { describe, expect, it, vi } from 'vitest';

const { modernSpecifier, legacySpecifier } = vi.hoisted(() => ({
  modernSpecifier: 'three/webgpu',
  legacySpecifier: 'three/examples/jsm/renderers/webgpu/WebGPURenderer.js',
}));

vi.mock(modernSpecifier, () => ({ WebGPURenderer: class ModernRenderer {} }));
vi.mock(legacySpecifier, () => ({ WebGPURenderer: class LegacyRenderer {} }));

describe('engine public API', () => {
  it('exposes core modules', async () => {
    const Engine = await import('./index.js');

    expect(typeof Engine.FrameBudgetTracker).toBe('function');
    expect(typeof Engine.AdaptivePostChain).toBe('function');
    expect(typeof Engine.getDeviceCapabilities).toBe('function');
    expect(typeof Engine.createRenderer).toBe('function');
    expect(typeof Engine.ComputeRunner).toBe('function');
  });
});
