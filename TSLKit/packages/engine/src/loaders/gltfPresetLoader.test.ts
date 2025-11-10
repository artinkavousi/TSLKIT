import { describe, expect, it, vi } from 'vitest';

const loadCallbacks: {
  onLoad?: (gltf: unknown) => void;
} = {};

class GLTFLoaderMock {
  public load = vi.fn(
    (
      _url: string,
      onLoad: (gltf: unknown) => void,
      _onProgress?: (event: ProgressEvent<EventTarget>) => void,
      _onError?: (error: unknown) => void
    ) => {
      loadCallbacks.onLoad = onLoad;
    }
  );
}

class MaterialMock {
  public constructor(public readonly name: string) {}
  public color = { getHexString: () => '010101' };
  public roughness = 0.3;
}

vi.mock('three/examples/jsm/loaders/GLTFLoader.js', () => ({
  GLTFLoader: GLTFLoaderMock
}));

const { loadGLTFPreset } = await import('./gltfPresetLoader.js');

describe('loadGLTFPreset', () => {
  it('returns preset metadata for GLTF materials', async () => {
    const promise = loadGLTFPreset('scene.gltf');

    await new Promise((resolve) => setTimeout(resolve, 0));
    loadCallbacks.onLoad?.({
      scene: { name: 'MockScene' },
      materials: [new MaterialMock('Material A')]
    });

    const asset = await promise;

    expect(asset.scene).toEqual({ name: 'MockScene' });
    expect(asset.materials[0].preset.id).toContain('gltf:');
  });
});
