import { Clock, PerspectiveCamera, Scene } from 'three';

import type { CapabilityRequirement } from './capabilityGuards';
import { verifyCapabilities } from './capabilityGuards';
import { createWebGPURenderer } from './createWebGPURenderer';
import type { RendererHandle } from './createWebGPURenderer';
import { detectDeviceCapabilities } from './deviceCapabilities';
import { DisposalBin } from './disposal';
import type { EngineState } from './state';
import { createEngineState } from './state';
import { createTelemetry, pushTelemetrySample } from './telemetry';

export interface SceneBootstrapOptions {
  canvas: HTMLCanvasElement;
  sceneFactory?: () => Scene;
  cameraFactory?: (canvas: HTMLCanvasElement) => PerspectiveCamera;
  requiredFeatures?: CapabilityRequirement[];
  onCapabilities?: (report: Awaited<ReturnType<typeof detectDeviceCapabilities>>) => void;
  onBeforeRender?: (state: EngineState) => void;
  onAfterRender?: (state: EngineState) => void;
}

export interface SceneBootstrapResult {
  scene: Scene;
  camera: PerspectiveCamera;
  renderer: RendererHandle;
  state: EngineState;
  disposal: DisposalBin;
  destroy(): void;
}

function defaultSceneFactory() {
  return new Scene();
}

function defaultCameraFactory(canvas: HTMLCanvasElement) {
  const camera = new PerspectiveCamera(50, canvas.clientWidth / canvas.clientHeight, 0.1, 1000);
  camera.position.set(3, 3, 6);
  return camera;
}

export async function initWebGPUScene(options: SceneBootstrapOptions): Promise<SceneBootstrapResult> {
  const {
    canvas,
    sceneFactory = defaultSceneFactory,
    cameraFactory = defaultCameraFactory,
    requiredFeatures = [],
    onCapabilities,
    onBeforeRender,
    onAfterRender
  } = options;

  const capabilities = await detectDeviceCapabilities();

  onCapabilities?.(capabilities);

  verifyCapabilities(capabilities, requiredFeatures);

  const rendererHandle = await createWebGPURenderer({
    canvas,
    requiredFeatures: capabilities.enabledFeatures
  });

  const scene = sceneFactory();
  const camera = cameraFactory(canvas);

  const clock = new Clock();
  const telemetry = createTelemetry();
  const state = createEngineState({
    clock,
    scene,
    camera,
    renderer: rendererHandle.renderer,
    capabilities,
    telemetry
  });

  const disposal = new DisposalBin();
  disposal.track(rendererHandle);

  let animationFrame = 0;
  let lastFrameTime = performance.now();

  function loop() {
    animationFrame = requestAnimationFrame(loop);
    state.delta = clock.getDelta();
    state.elapsed = clock.elapsedTime;

    onBeforeRender?.(state);

    rendererHandle.renderer.render(scene, camera);

    onAfterRender?.(state);

    const now = performance.now();
    if (state.telemetry) {
      pushTelemetrySample(state.telemetry, now - lastFrameTime);
    }
    lastFrameTime = now;
  }

  loop();

  return {
    scene,
    camera,
    renderer: rendererHandle,
    state,
    disposal,
    destroy() {
      cancelAnimationFrame(animationFrame);
      disposal.flush();
    }
  };
}
