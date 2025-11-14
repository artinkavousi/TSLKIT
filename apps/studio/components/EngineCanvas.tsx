'use client';

import React, { useEffect, useMemo, useRef, useState, useSyncExternalStore } from 'react';

import {
  LAB_PRESET_REGISTRY,
  type ScenePreset,
  createSceneFromPreset,
  createInspectorStore,
  initWebGPUScene
} from '@tsl/kit';

export interface EngineCanvasProps {
  presetId?: string;
}

export function EngineCanvas({ presetId = 'aurora-lab' }: EngineCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [error, setError] = useState<string | null>(null);
  const inspector = useRef(createInspectorStore());
  const [capabilities, setCapabilities] = useState<string>('');
  const preset = useMemo<ScenePreset>(() => {
    return LAB_PRESET_REGISTRY.findById(presetId) ?? LAB_PRESET_REGISTRY.presets[0];
  }, [presetId]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) {
      return;
    }

    let teardown: (() => void) | null = null;

    initWebGPUScene({
      canvas,
      sceneFactory: () => createSceneFromPreset(preset),
      onCapabilities: (report) => {
        setCapabilities(
          report.supported
            ? `Adapter: ${report.adapterName ?? 'unknown'} · Features: ${report.enabledFeatures.join(', ')}`
            : 'WebGPU unavailable'
        );
      },
      onBeforeRender: (engine) => {
        inspector.current.setState((state) => ({ ...state, presetId: preset.id, tags: preset.tags }));
      },
      onAfterRender: (engine) => {
        inspector.current.setState((state) => {
          const now = performance.now();
          const delta = now - state.lastFrame;
          const fps = delta > 0 ? 1000 / delta : state.fps;
          return {
            ...state,
            lastFrame: now,
            fps,
            gpuVendor: state.gpuVendor ?? engine.capabilities?.adapterName ?? 'Unknown GPU'
          };
        });
      }
    })
      .then((result) => {
        teardown = result.destroy;
      })
      .catch((err) => {
        setError(err instanceof Error ? err.message : String(err));
      });

    return () => {
      teardown?.();
    };
  }, [preset]);

  const inspectorState = useSyncExternalStore(
    inspector.current.subscribe,
    inspector.current.getState,
    inspector.current.getState
  );

  return (
    <div className="relative h-full w-full">
      <canvas ref={canvasRef} className="h-full w-full" />
      <div className="pointer-events-none absolute bottom-3 left-3 flex flex-col gap-1 rounded bg-slate-900/70 px-3 py-2 text-xs text-slate-200">
        {error ? <span className="text-rose-400">{error}</span> : null}
        <span>{inspectorState.fps.toFixed(1)} fps · {inspectorState.gpuVendor ?? 'WebGPU ready'}</span>
        <span className="text-[10px] uppercase tracking-[0.2em] text-slate-400">{capabilities}</span>
      </div>
    </div>
  );
}
