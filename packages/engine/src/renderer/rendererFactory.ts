import { WebGLRenderer } from 'three';

import { isWebGPUSupported } from '../capabilities/isWebGPUSupported.js';
import type { RendererFactoryOptions, RendererFactoryResult } from './types.js';
import { loadWebGPURenderer, type WebGPURendererConstructor } from './webgpuLoader.js';

type WebGPURendererInstance = InstanceType<WebGPURendererConstructor>;

function createWebGLFallback(options: RendererFactoryOptions): WebGLRenderer {
  const renderer = new WebGLRenderer({
    canvas: options.canvas,
    antialias: options.antialias ?? true,
    alpha: options.alpha ?? false,
    powerPreference: options.powerPreference ?? 'high-performance'
  });

  renderer.setPixelRatio(globalThis.devicePixelRatio ?? 1);
  renderer.setSize(options.canvas.clientWidth, options.canvas.clientHeight, false);

  return renderer;
}

async function initializeWebGPU(
  RendererCtor: WebGPURendererConstructor,
  options: RendererFactoryOptions
): Promise<WebGPURendererInstance> {
  const renderer = new RendererCtor({
    canvas: options.canvas,
    antialias: options.antialias ?? true,
    alpha: options.alpha ?? false,
    powerPreference: options.powerPreference ?? 'high-performance'
  });

  renderer.setPixelRatio(globalThis.devicePixelRatio ?? 1);
  renderer.setSize(options.canvas.clientWidth, options.canvas.clientHeight, false);

  const maybeInit = renderer.init;
  if (typeof maybeInit === 'function') {
    await maybeInit.call(renderer);
  }

  return renderer;
}

export async function createRenderer(options: RendererFactoryOptions): Promise<RendererFactoryResult> {
  if (isWebGPUSupported()) {
    try {
      const RendererCtor = await loadWebGPURenderer();
      const renderer = await initializeWebGPU(RendererCtor, options);

      return {
        renderer,
        isWebGPU: true
      };
    } catch (error) {
      options.onFallback?.(
        error instanceof Error ? error.message : 'Failed to initialize WebGPU renderer.'
      );
    }
  } else {
    options.onFallback?.('WebGPU is not available on this device. Falling back to WebGL.');
  }

  const webglRenderer = createWebGLFallback(options);

  return {
    renderer: webglRenderer,
    isWebGPU: false
  };
}
