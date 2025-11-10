import { snapshotFromMaterial } from './presetUtils.js';
import type { MaterialXAsset, MaterialXLoadOptions } from './types.js';

function createAbortError(): Error {
  if (typeof DOMException === 'function') {
    return new DOMException('Aborted', 'AbortError');
  }

  const error = new Error('Aborted');
  error.name = 'AbortError';
  return error;
}

async function importMaterialXLoader() {
  return import('three/examples/jsm/loaders/MaterialXLoader.js');
}

export async function loadMaterialXAsset(url: string, options: MaterialXLoadOptions = {}): Promise<MaterialXAsset> {
  const [{ MaterialXLoader }, { MeshPhysicalNodeMaterial }] = await Promise.all([
    importMaterialXLoader(),
    import('three/webgpu')
  ]);

  const loader = new MaterialXLoader();
  if (options.libraryPath) {
    loader.setMaterialXLibraryPath(options.libraryPath);
  }

  const material = await new Promise<MeshPhysicalNodeMaterial>((resolve, reject) => {
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
        resolve(loaded as MeshPhysicalNodeMaterial);
      },
      options.onProgress,
      (error) => {
        options.signal?.removeEventListener('abort', onAbort);
        reject(error);
      }
    );
  });

  const preset = snapshotFromMaterial(material, {
    idPrefix: 'materialx',
    source: url,
    overrides: options.overrides
  });

  return { material, preset };
}
