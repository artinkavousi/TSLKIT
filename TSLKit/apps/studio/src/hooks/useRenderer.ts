import { useCallback, useEffect, useRef, useState } from 'react';
import {
  AmbientLight,
  BoxGeometry,
  Color,
  DirectionalLight,
  Mesh,
  MeshStandardMaterial,
  PerspectiveCamera,
  Scene,
  WebGLRenderer
} from 'three';

import { createRenderer } from '@tslstudio/engine';
import type { RendererFactoryResult } from '@tslstudio/engine/renderer';

import type { Preset } from '../types/presets.js';

interface RendererState {
  snapshot: string | null;
  isWebGPU: boolean;
  error: string | null;
}

interface UseRendererResult extends RendererState {
  canvasRef: React.RefObject<HTMLCanvasElement>;
  captureSnapshot: () => void;
  updateMaterial: (preset: Preset, overrides: Record<string, unknown>) => void;
}

function applyOverrides(material: MeshStandardMaterial, preset: Preset, overrides: Record<string, unknown>): void {
  preset.parameters.forEach((parameter) => {
    const value = overrides[parameter.name] ?? parameter.defaultValue;
    if (parameter.type === 'color') {
      material.color = new Color(value as string);
    } else if (parameter.type === 'number' || parameter.type === 'boolean') {
      if (parameter.name in material) {
        (material as unknown as Record<string, unknown>)[parameter.name] = value;
      }
    }
  });
}

export function useRenderer(initialPreset: Preset | null): UseRendererResult {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const materialRef = useRef<MeshStandardMaterial | null>(null);
  const rendererRef = useRef<RendererFactoryResult['renderer'] | null>(null);
  const [state, setState] = useState<RendererState>({ snapshot: null, isWebGPU: false, error: null });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || typeof window === 'undefined') {
      return undefined;
    }

    let disposed = false;

    (async () => {
      try {
        const { renderer, isWebGPU } = await createRenderer({
          canvas,
          onFallback(message) {
            setState((previous) => ({ ...previous, error: message }));
          }
        });

        if (disposed) {
          if ('dispose' in renderer && typeof renderer.dispose === 'function') {
            renderer.dispose();
          }
          return;
        }

        setState((previous) => ({ ...previous, isWebGPU, error: null }));

        const scene = new Scene();
        const camera = new PerspectiveCamera(45, canvas.clientWidth / canvas.clientHeight, 0.1, 100);
        camera.position.set(2.5, 2.2, 3.5);
        camera.lookAt(0, 0, 0);

        const geometry = new BoxGeometry(1.2, 1.2, 1.2);
        const material = new MeshStandardMaterial({ color: '#ffffff', roughness: 0.5, metalness: 0.4 });
        const mesh = new Mesh(geometry, material);
        materialRef.current = material;

        const ambientLight = new AmbientLight(0xffffff, 0.6);
        const keyLight = new DirectionalLight(0xffffff, 1.2);
        keyLight.position.set(5, 5, 5);
        scene.add(ambientLight, keyLight, mesh);

        let animationFrame = 0;

        const renderLoop = () => {
          animationFrame = requestAnimationFrame(renderLoop);
          mesh.rotation.y += 0.01;
          mesh.rotation.x += 0.005;
          renderer.render(scene, camera);
        };

        renderLoop();

        rendererRef.current = renderer;

        if (initialPreset) {
          applyOverrides(material, initialPreset, {});
        }

        const handleResize = () => {
          const { clientWidth, clientHeight } = canvas;
          renderer.setSize(clientWidth, clientHeight, false);
          camera.aspect = clientWidth / Math.max(clientHeight, 1);
          camera.updateProjectionMatrix();
        };

        handleResize();
        window.addEventListener('resize', handleResize);

        return () => {
          window.removeEventListener('resize', handleResize);
          cancelAnimationFrame(animationFrame);
          geometry.dispose();
          material.dispose();
          renderer.dispose();
        };
      } catch (error) {
        console.warn('Unable to initialize renderer preview', error);
        setState((previous) => ({ ...previous, error: 'Renderer unavailable in this environment.' }));
      }
    })();

    return () => {
      disposed = true;
    };
  }, [initialPreset]);

  const captureSnapshot = useCallback(() => {
    const renderer = rendererRef.current as WebGLRenderer | null;
    if (!renderer) {
      return;
    }

    try {
      const dataUrl = renderer.domElement.toDataURL('image/png');
      setState((previous) => ({ ...previous, snapshot: dataUrl }));
    } catch (error) {
      console.warn('Snapshot capture failed', error);
      setState((previous) => ({ ...previous, error: 'Snapshot capture failed. Try again after rendering.' }));
    }
  }, []);

  const updateMaterial = useCallback((preset: Preset, overrides: Record<string, unknown>) => {
    const material = materialRef.current;
    if (!material) {
      return;
    }

    applyOverrides(material, preset, overrides);
  }, []);

  return {
    canvasRef,
    captureSnapshot,
    updateMaterial,
    ...state
  };
}
