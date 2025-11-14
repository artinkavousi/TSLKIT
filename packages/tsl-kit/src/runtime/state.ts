import { createStore } from 'zustand/vanilla';
import type { PerspectiveCamera, Scene, WebGPURenderer } from 'three';

import type { DeviceCapabilityReport } from './deviceCapabilities';
import type { TelemetryStats } from './telemetry';

export interface EngineState {
  scene: Scene;
  camera: PerspectiveCamera;
  renderer: WebGPURenderer;
  delta: number;
  elapsed: number;
  capabilities?: DeviceCapabilityReport;
  telemetry?: TelemetryStats;
}

export interface EngineStateConfig {
  scene: Scene;
  camera: PerspectiveCamera;
  renderer: WebGPURenderer;
  clock: { getDelta(): number; readonly elapsedTime: number };
  capabilities?: DeviceCapabilityReport;
  telemetry?: TelemetryStats;
}

export function createEngineState(config: EngineStateConfig): EngineState {
  return {
    scene: config.scene,
    camera: config.camera,
    renderer: config.renderer,
    delta: 0,
    elapsed: 0,
    capabilities: config.capabilities,
    telemetry: config.telemetry
  };
}

export function createEngineStore(initial: EngineState) {
  return createStore(() => initial);
}
