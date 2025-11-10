import { clamp } from '../utils/math.js';
import type {
  FramegraphController,
  FramegraphHistoryFactory,
  FramegraphHistoryHandle,
  FramegraphOptions,
  FramegraphPass,
  FramegraphPassContext,
  FramegraphSize
} from './types.js';

interface HistoryEntry {
  resource: unknown;
  size: FramegraphSize;
  factory: FramegraphHistoryFactory;
}

function calculateSize(canvas: HTMLCanvasElement, scale: number): FramegraphSize {
  const width = Math.max(1, Math.floor(canvas.clientWidth * scale));
  const height = Math.max(1, Math.floor(canvas.clientHeight * scale));
  const pixelRatio = (globalThis.devicePixelRatio ?? 1) * scale;

  return { width, height, pixelRatio, scale };
}

function orderPasses(passes: FramegraphPass[]): FramegraphPass[] {
  const ordered = [...passes];

  for (const pass of passes) {
    const currentIndex = ordered.findIndex((candidate) => candidate.id === pass.id);

    if (pass.before) {
      const beforeIndex = ordered.findIndex((candidate) => candidate.id === pass.before);
      if (beforeIndex >= 0 && currentIndex > beforeIndex) {
        ordered.splice(currentIndex, 1);
        ordered.splice(beforeIndex, 0, pass);
        continue;
      }
    }

    if (pass.after) {
      const afterIndex = ordered.findIndex((candidate) => candidate.id === pass.after);
      if (afterIndex >= 0 && currentIndex < afterIndex) {
        ordered.splice(currentIndex, 1);
        ordered.splice(afterIndex, 0, pass);
      }
    }
  }

  return ordered.filter((pass, index, array) => array.findIndex((candidate) => candidate.id === pass.id) === index);
}

export function createFramegraph(options: FramegraphOptions): FramegraphController {
  const passes = new Map<string, FramegraphPass>();
  const history = new Map<string, HistoryEntry>();
  let qualityScale = clamp(options.initialScale ?? 1, 0.25, 1);
  let size = calculateSize(options.canvas, qualityScale);

  const context: FramegraphPassContext = {
    renderer: options.renderer,
    get size() {
      return size;
    },
    getHistoryTexture<TResource>(key: string, factory: FramegraphHistoryFactory<TResource>): TResource {
      const existing = history.get(key);

      if (!existing) {
        const resource = factory(size);
        history.set(key, { resource, size, factory });
        return resource as TResource;
      }

      if (existing.size.width !== size.width || existing.size.height !== size.height) {
        if (typeof (existing.resource as { dispose?: () => void }).dispose === 'function') {
          (existing.resource as { dispose: () => void }).dispose();
        }

        const resource = factory(size);
        history.set(key, { resource, size, factory });
        return resource as TResource;
      }

      return existing.resource as TResource;
    }
  };

  function resizeRenderer(): void {
    size = calculateSize(options.canvas, qualityScale);
    options.renderer.setPixelRatio(size.pixelRatio);
    options.renderer.setSize(size.width, size.height, false);

    for (const [key, entry] of history) {
      if (typeof (entry.resource as { dispose?: () => void }).dispose === 'function') {
        (entry.resource as { dispose: () => void }).dispose();
      }

      const resource = entry.factory(size);
      history.set(key, { resource, size, factory: entry.factory });
    }
  }

  resizeRenderer();

  return {
    addPass(pass: FramegraphPass) {
      passes.set(pass.id, pass);
      return () => {
        passes.delete(pass.id);
      };
    },
    setQualityScale(scale: number) {
      const clamped = clamp(scale, 0.25, 1);
      if (clamped === qualityScale) {
        return;
      }

      qualityScale = clamped;
      resizeRenderer();
    },
    getQualityScale() {
      return qualityScale;
    },
    getSize() {
      return size;
    },
    getHistoryHandle<TResource>(
      key: string,
      factory: FramegraphHistoryFactory<TResource>
    ): FramegraphHistoryHandle<TResource> {
      return {
        key,
        get: () => {
          const resource = context.getHistoryTexture(key, factory);
          return { key, resource, size };
        },
        updateFactory(newFactory: FramegraphHistoryFactory<TResource>) {
          history.set(key, {
            resource: newFactory(size),
            size,
            factory: newFactory
          });
        },
        dispose() {
          const entry = history.get(key);
          if (!entry) {
            return;
          }

          if (typeof (entry.resource as { dispose?: () => void }).dispose === 'function') {
            (entry.resource as { dispose: () => void }).dispose();
          }

          history.delete(key);
        }
      };
    },
    invalidateHistory() {
      for (const [key, entry] of history) {
        if (typeof (entry.resource as { dispose?: () => void }).dispose === 'function') {
          (entry.resource as { dispose: () => void }).dispose();
        }
        history.delete(key);
      }
    },
    refresh() {
      resizeRenderer();
    },
    async tick() {
      const ordered = orderPasses(Array.from(passes.values()).filter((pass) => pass.enabled !== false));
      for (const pass of ordered) {
        await pass.execute(context);
      }
    }
  } satisfies FramegraphController;
}
