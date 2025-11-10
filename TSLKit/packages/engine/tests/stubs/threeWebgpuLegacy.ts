const state = (globalThis as unknown as {
  __tslLegacyWebgpu?: { renderer: unknown };
}).__tslLegacyWebgpu ??= {
  renderer: class StubLegacyWebGPURenderer {
    setPixelRatio(): void {}
    setSize(): void {}
  },
};

export let WebGPURenderer = state.renderer;

export function __setLegacyRenderer(renderer: unknown): void {
  state.renderer = renderer;
  WebGPURenderer = renderer;
}
