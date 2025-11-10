const state = (globalThis as unknown as {
  __tslModernWebgpu?: {
    renderer: unknown;
    error: Error | null;
  };
}).__tslModernWebgpu ??= {
  renderer: class StubModernWebGPURenderer {
    setPixelRatio(): void {}
    setSize(): void {}
  },
  error: null as Error | null,
};

if (state.error) {
  throw state.error;
}

export let WebGPURenderer = state.renderer;

export function __setModernRenderer(renderer: unknown): void {
  state.renderer = renderer;
  WebGPURenderer = renderer;
}

export function __setModernError(error: Error | null): void {
  state.error = error;
}
