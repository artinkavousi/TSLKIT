import { snapshotFromMaterial } from './presetUtils.js';
import type { GLTFPresetAsset, GLTFPresetOptions } from './types.js';

function createAbortError(): Error {
  if (typeof DOMException === 'function') {
    return new DOMException('Aborted', 'AbortError');
  }

  const error = new Error('Aborted');
  error.name = 'AbortError';
  return error;
}

async function importGLTFLoader() {
  return import('three/examples/jsm/loaders/GLTFLoader.js');
}

export async function loadGLTFPreset(url: string, options: GLTFPresetOptions = {}): Promise<GLTFPresetAsset> {
  const { GLTFLoader } = await importGLTFLoader();

  const loader = new GLTFLoader();

  const gltf = await new Promise<import('three/examples/jsm/loaders/GLTFLoader.js').GLTF>((resolve, reject) => {
    if (options.signal?.aborted) {
      reject(createAbortError());
      return;
    }

    const onAbort = () => {
      reject(createAbortError());
    };

    options.signal?.addEventListener('abort', onAbort, { once: true });

    loader.load(
      url,
      (loaded) => {
        options.signal?.removeEventListener('abort', onAbort);
        resolve(loaded);
      },
      options.onProgress,
      (error) => {
        options.signal?.removeEventListener('abort', onAbort);
        reject(error);
      }
    );
  });

  const materials: GLTFPresetAsset['materials'] = [];

  if (Array.isArray(gltf.materials)) {
    gltf.materials.forEach((material, index) => {
      if (!material) {
        return;
      }

      const preset = snapshotFromMaterial(material, {
        idPrefix: 'gltf',
        source: `${url}#material-${index}`,
        overrides: options.overrides
      });

      materials.push({ material, preset });
    });
  }

  return {
    scene: gltf.scene,
    materials
  };
}
