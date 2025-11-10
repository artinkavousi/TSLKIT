declare module 'three/webgpu' {
  import type { WebGLRendererParameters } from 'three';

  export class WebGPURenderer {
    constructor(parameters?: WebGLRendererParameters & { canvas?: HTMLCanvasElement });
    setPixelRatio(value: number): void;
    setSize(width: number, height: number, updateStyle?: boolean): void;
    init?: () => Promise<void> | void;
    dispose?: () => void;
  }
}

declare module 'three/examples/jsm/renderers/webgpu/WebGPURenderer.js' {
  export { WebGPURenderer } from 'three/webgpu';
}
