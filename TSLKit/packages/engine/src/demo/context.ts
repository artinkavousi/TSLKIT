import { createContext, useContext } from 'react';

import type { FramegraphController } from '../framegraph/types.js';
import type { RendererFactoryResult } from '../renderer/types.js';

export const FramegraphContext = createContext<FramegraphController | null>(null);
export const RendererResultContext = createContext<RendererFactoryResult | null>(null);

export function useFramegraph(): FramegraphController {
  const framegraph = useContext(FramegraphContext);
  if (!framegraph) {
    throw new Error('Framegraph context is not available. Ensure FramegraphBridge is rendered.');
  }

  return framegraph;
}

export function useRendererResult(): RendererFactoryResult {
  const result = useContext(RendererResultContext);
  if (!result) {
    throw new Error('Renderer result is not available. Ensure FramegraphBridge is rendered.');
  }

  return result;
}

export function useOptionalFramegraph(): FramegraphController | null {
  return useContext(FramegraphContext);
}
