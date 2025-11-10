import { beforeEach, describe, expect, it, vi } from 'vitest';

import { createFramegraph } from './framegraph.js';
import type { FramegraphController } from './types.js';

class RendererMock {
  public setPixelRatio = vi.fn();
  public setSize = vi.fn();
}

describe('createFramegraph', () => {
  let canvas: HTMLCanvasElement;
  let framegraph: FramegraphController;

  beforeEach(() => {
    canvas = document.createElement('canvas');
    Object.defineProperty(canvas, 'clientWidth', { value: 800, configurable: true });
    Object.defineProperty(canvas, 'clientHeight', { value: 600, configurable: true });

    framegraph = createFramegraph({
      renderer: new RendererMock() as unknown as RendererMock,
      canvas
    });
  });

  it('registers and executes passes in order', async () => {
    const execution: string[] = [];

    framegraph.addPass({
      id: 'a',
      execute: () => {
        execution.push('a');
      }
    });

    framegraph.addPass({
      id: 'b',
      before: 'a',
      execute: () => {
        execution.push('b');
      }
    });

    await framegraph.tick();
    expect(execution).toEqual(['b', 'a']);
  });

  it('recreates history textures when the size changes', async () => {
    const factory = vi.fn(() => ({ dispose: vi.fn() }));
    const handle = framegraph.getHistoryHandle('history', factory);

    const first = handle.get();
    expect(first.resource).toBeDefined();

    framegraph.setQualityScale(0.5);

    const second = handle.get();
    expect(second.resource).not.toBe(first.resource);
    expect(factory).toHaveBeenCalledTimes(2);
  });
});
