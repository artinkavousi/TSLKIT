import type { WebGLRenderer } from 'three';
import type { WebGPURenderer } from 'three/webgpu';

export interface RendererFactoryOptions {
  readonly canvas: HTMLCanvasElement;
  readonly antialias?: boolean;
  readonly alpha?: boolean;
  readonly powerPreference?: WebGLPowerPreference;
  readonly onFallback?: (reason: string) => void;
}

export interface RendererFactoryResult {
  readonly renderer: WebGPURenderer | WebGLRenderer;
  readonly isWebGPU: boolean;
}
