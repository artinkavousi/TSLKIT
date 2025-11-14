import { Color, WebGPUFramebuffer, WebGPURenderer } from 'three';

import type { WebGPUFeatureName } from 'three';

export interface RendererOptions {
  canvas: HTMLCanvasElement;
  antialias?: boolean;
  clearColor?: Color | string | number;
  requiredFeatures?: WebGPUFeatureName[];
  requiredLimits?: Partial<GPUDeviceDescriptor['requiredLimits']>;
}

export interface RendererHandle {
  renderer: WebGPURenderer;
  framebuffer: WebGPUFramebuffer;
  dispose(): void;
}

export async function createWebGPURenderer(options: RendererOptions): Promise<RendererHandle> {
  const { canvas, antialias = true, clearColor = 0x000000, requiredFeatures, requiredLimits } = options;

  const renderer = new WebGPURenderer({ canvas, antialias, requiredFeatures, requiredLimits });
  renderer.setClearColor(clearColor);
  renderer.outputColorSpace = 'srgb-linear';

  await renderer.init();

  const framebuffer = renderer.getContext().getCurrentFramebuffer();

  return {
    renderer,
    framebuffer,
    dispose() {
      renderer.forceContextLoss();
      renderer.dispose();
    }
  };
}
