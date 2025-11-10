import type { WebGLRenderer } from 'three';
import type { WebGPURenderer } from 'three/webgpu';

export interface FramegraphSize {
  readonly width: number;
  readonly height: number;
  readonly pixelRatio: number;
  readonly scale: number;
}

export interface FramegraphHistoryResource<TResource = unknown> {
  readonly key: string;
  readonly resource: TResource;
  readonly size: FramegraphSize;
}

export type FramegraphHistoryFactory<TResource = unknown> = (
  size: FramegraphSize
) => TResource;

export interface FramegraphHistoryHandle<TResource = unknown> {
  readonly key: string;
  readonly get: () => FramegraphHistoryResource<TResource>;
  readonly updateFactory: (factory: FramegraphHistoryFactory<TResource>) => void;
  readonly dispose: () => void;
}

export interface FramegraphPassContext {
  readonly renderer: WebGPURenderer | WebGLRenderer;
  readonly size: FramegraphSize;
  getHistoryTexture<TResource>(key: string, factory: FramegraphHistoryFactory<TResource>): TResource;
}

export interface FramegraphPass {
  readonly id: string;
  readonly enabled?: boolean;
  readonly before?: string;
  readonly after?: string;
  readonly execute: (context: FramegraphPassContext) => void | Promise<void>;
}

export interface FramegraphController {
  readonly addPass: (pass: FramegraphPass) => () => void;
  readonly setQualityScale: (scale: number) => void;
  readonly getQualityScale: () => number;
  readonly getSize: () => FramegraphSize;
  readonly getHistoryHandle: <TResource>(
    key: string,
    factory: FramegraphHistoryFactory<TResource>
  ) => FramegraphHistoryHandle<TResource>;
  readonly invalidateHistory: () => void;
  readonly refresh: () => void;
  readonly tick: () => Promise<void>;
}

export interface FramegraphOptions {
  readonly renderer: WebGPURenderer | WebGLRenderer;
  readonly canvas: HTMLCanvasElement;
  readonly initialScale?: number;
}
