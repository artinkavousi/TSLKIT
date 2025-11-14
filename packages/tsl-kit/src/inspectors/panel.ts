import { createStore } from 'zustand/vanilla';

import type { EngineState } from '../runtime/state';

export interface InspectorState {
  fps: number;
  lastFrame: number;
  gpuVendor?: string;
  presetId?: string;
  tags?: string[];
}

export function createInspectorStore() {
  return createStore<InspectorState>(() => ({ fps: 0, lastFrame: performance.now() }));
}

export function updateInspector(state: InspectorState, engine: EngineState) {
  const now = performance.now();
  const delta = now - state.lastFrame;
  const fps = delta > 0 ? 1000 / delta : state.fps;
  state.fps = fps;
  state.lastFrame = now;
  state.gpuVendor ??= engine.renderer.info.getParameter?.('GPUVendor');
  if (engine.capabilities?.adapterName) {
    state.gpuVendor = engine.capabilities.adapterName;
  }
}
