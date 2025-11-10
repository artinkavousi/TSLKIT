import { readFileSync } from 'node:fs';
import { afterEach, beforeEach, vi } from 'vitest';
import '@testing-library/jest-dom/vitest';

const materialPresets = JSON.parse(
  readFileSync(new URL('./public/data/material-presets.json', import.meta.url), 'utf-8')
);

beforeEach(() => {
  vi.stubGlobal('fetch', vi.fn(async (input: RequestInfo | URL) => {
    const path = typeof input === 'string' ? input : input.toString();
    if (path.includes('material-presets')) {
      return new Response(JSON.stringify(materialPresets), { status: 200 });
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
