import { describe, expect, it, vi } from 'vitest';

const loadCallbacks: {
  onLoad?: (material: unknown) => void;
  onProgress?: (event: ProgressEvent<EventTarget>) => void;
  onError?: (error: unknown) => void;
} = {};

class MaterialXLoaderMock {
  public setMaterialXLibraryPath = vi.fn();
  public load = vi.fn(
    (
      _url: string,
      onLoad: (material: unknown) => void,
      onProgress?: (event: ProgressEvent<EventTarget>) => void,
      onError?: (error: unknown) => void
    ) => {
      loadCallbacks.onLoad = onLoad;
      loadCallbacks.onProgress = onProgress;
      loadCallbacks.onError = onError;
    }
  );
}

class MeshPhysicalNodeMaterialMock {
  public name = 'MockMaterial';
  public color = { getHexString: () => 'abcdef' };
  public roughness = 0.5;
  public metalness = 0.2;
}

vi.mock('three/examples/jsm/loaders/MaterialXLoader.js', () => ({
  MaterialXLoader: MaterialXLoaderMock
}));

vi.mock('three/webgpu', () => ({
  MeshPhysicalNodeMaterial: MeshPhysicalNodeMaterialMock
}));

const { loadMaterialXAsset } = await import('./materialxLoader.js');

describe('loadMaterialXAsset', () => {
  it('loads a material and generates a preset snapshot', async () => {
    const promise = loadMaterialXAsset('asset.mx');

    await new Promise((resolve) => setTimeout(resolve, 0));
    loadCallbacks.onLoad?.(new MeshPhysicalNodeMaterialMock());

    const asset = await promise;

    expect(asset.preset.id).toContain('materialx:');
    expect(asset.preset.parameters.color.default).toBe('#abcdef');
  });
});
