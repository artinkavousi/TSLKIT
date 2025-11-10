import { afterEach, beforeEach, vi } from 'vitest';
import '@testing-library/jest-dom/vitest';

beforeEach(() => {
  vi.stubGlobal('fetch', vi.fn(async (input: RequestInfo | URL) => {
    const path = typeof input === 'string' ? input : input.toString();
    if (path.includes('material-presets')) {
      return new Response(JSON.stringify([]), { status: 200 });
    }
    if (path.includes('post-presets')) {
      return new Response(JSON.stringify([]), { status: 200 });
    }
    if (path.includes('tutorials')) {
      return new Response(JSON.stringify([]), { status: 200 });
    }

    return new Response('Not found', { status: 404 });
  }));
});

afterEach(() => {
  vi.unstubAllGlobals();
});
