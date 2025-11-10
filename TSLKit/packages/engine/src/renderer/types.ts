import type { WebGLRenderer } from 'three';
import type { WebGPURenderer } from 'three/webgpu';

import type { FramegraphController } from '../framegraph/types.js';

export interface RendererFactoryOptions {
  readonly canvas: HTMLCanvasElement;
  readonly antialias?: boolean;
  readonly alpha?: boolean;
  readonly powerPreference?: WebGLPowerPreference;
  readonly onFallback?: (reason: string) => void;
  readonly qualityScale?: number;
}

export interface RendererFactoryResult {
  readonly renderer: WebGPURenderer | WebGLRenderer;
  readonly isWebGPU: boolean;
  readonly framegraph: FramegraphController;
}
