import type { ReactNode } from 'react';
import { useEffect, useMemo, useRef, useState } from 'react';
import { useFrame, useThree } from '@react-three/fiber';

import { createRenderer } from '../renderer/rendererFactory.js';
import type { RendererFactoryOptions, RendererFactoryResult } from '../renderer/types.js';
import { FramegraphContext, RendererResultContext, useFramegraph } from './context.js';
import type { FramegraphPass } from '../framegraph/types.js';

export interface FramegraphBridgeProps extends Omit<RendererFactoryOptions, 'canvas'> {
  readonly qualityScale?: number;
  readonly children?: ReactNode | ((result: RendererFactoryResult | null) => ReactNode);
}

export function FramegraphBridge({
  qualityScale,
  children,
  antialias,
  alpha,
  powerPreference,
  onFallback
}: FramegraphBridgeProps) {
  const { gl, size, set } = useThree();
  const [result, setResult] = useState<RendererFactoryResult | null>(null);
  const qualityRef = useRef<number>(qualityScale ?? 1);
  qualityRef.current = qualityScale ?? 1;

  useEffect(() => {
    let disposed = false;
    const canvas = gl.domElement as HTMLCanvasElement;

    void (async () => {
      try {
        const created = await createRenderer({
          canvas,
          antialias,
          alpha,
          powerPreference,
          onFallback,
          qualityScale: qualityRef.current
        });

        if (disposed) {
          created.framegraph.invalidateHistory();
          if ('dispose' in created.renderer && typeof created.renderer.dispose === 'function') {
            (created.renderer as unknown as { dispose: () => void }).dispose();
          }
          return;
        }

        set({ gl: created.renderer as typeof gl });
        setResult(created);
      } catch (error) {
        onFallback?.(error instanceof Error ? error.message : String(error));
      }
    })();

    return () => {
      disposed = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [gl, set, antialias, alpha, powerPreference, onFallback]);

  useEffect(() => {
    if (!result) {
      return;
    }

    result.framegraph.refresh();
    result.framegraph.invalidateHistory();
  }, [result, size.width, size.height]);

  useEffect(() => {
    if (!result || qualityScale === undefined) {
      return;
    }

    result.framegraph.setQualityScale(qualityScale);
  }, [result, qualityScale]);

  useEffect(() => {
    return () => {
      if (!result) {
        return;
      }

      result.framegraph.invalidateHistory();
      if ('dispose' in result.renderer && typeof result.renderer.dispose === 'function') {
        (result.renderer as unknown as { dispose: () => void }).dispose();
      }
    };
  }, [result]);

  useFrame(() => {
    if (result) {
      void result.framegraph.tick();
    }
  });

  const content = useMemo(() => {
    if (typeof children === 'function') {
      return children(result);
    }

    return children ?? null;
  }, [children, result]);

  return (
    <RendererResultContext.Provider value={result}>
      <FramegraphContext.Provider value={result?.framegraph ?? null}>{content}</FramegraphContext.Provider>
    </RendererResultContext.Provider>
  );
}

export interface UseFramegraphPassOptions {
  readonly enabled?: boolean;
  readonly before?: string;
  readonly after?: string;
}

export function useFramegraphPass(
  id: string,
  execute: FramegraphPass['execute'],
  options: UseFramegraphPassOptions = {}
): void {
  const framegraph = useFramegraph();
  const executeRef = useRef(execute);
  executeRef.current = execute;

  useEffect(() => {
    const pass: FramegraphPass = {
      id,
      enabled: options.enabled,
      before: options.before,
      after: options.after,
      execute: (context) => executeRef.current(context)
    };

    const dispose = framegraph.addPass(pass);
    return dispose;
  }, [framegraph, id, options.enabled, options.before, options.after]);
}
