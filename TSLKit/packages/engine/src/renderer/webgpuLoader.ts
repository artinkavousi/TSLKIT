export type WebGPURendererConstructor = new (parameters: {
  canvas: HTMLCanvasElement;
  antialias?: boolean;
  alpha?: boolean;
  powerPreference?: WebGLPowerPreference;
}) => {
  setPixelRatio(value: number): void;
  setSize(width: number, height: number, updateStyle?: boolean): void;
  init?: () => Promise<void> | void;
  dispose?: () => void;
};

type LegacyModule = typeof import('three/examples/jsm/renderers/webgpu/WebGPURenderer.js');

type ModernModule = { WebGPURenderer?: WebGPURendererConstructor };

/**
 * Attempts to resolve the WebGPURenderer constructor using the modern r181 specifier first
 * (`three/webgpu`). If that fails (older builds or missing export maps), we fall back to the
 * legacy examples path used in earlier releases.
 */
export async function loadWebGPURenderer(): Promise<WebGPURendererConstructor> {
  const modernSpecifier = 'three/' + 'webgpu';

  try {
    const modernModule = (await import(modernSpecifier)) as ModernModule;
    if (modernModule.WebGPURenderer) {
      return modernModule.WebGPURenderer;
    }

    throw new Error('three/webgpu module did not expose WebGPURenderer.');
  } catch (modernError) {
    try {
      const legacyModule = (await import(
        'three/examples/jsm/renderers/webgpu/WebGPURenderer.js'
      )) as LegacyModule;

      if (!legacyModule.WebGPURenderer) {
        throw new Error('Legacy WebGPURenderer export missing.');
      }

      return legacyModule.WebGPURenderer as WebGPURendererConstructor;
    } catch (legacyError) {
      throw modernError instanceof Error ? modernError : new Error(String(modernError ?? legacyError));
    }
  }
}
