import { readFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { afterEach, beforeEach, vi } from 'vitest';
import '@testing-library/jest-dom/vitest';

const rootDir = dirname(fileURLToPath(import.meta.url));

function readJson(relativePath: string) {
  return JSON.parse(readFileSync(resolve(rootDir, relativePath), 'utf-8'));
}

const materialPresets = readJson('./public/data/material-presets.json');
const postPresets = readJson('./public/data/post-presets.json');

beforeEach(() => {
  vi.stubGlobal('fetch', vi.fn(async (input: RequestInfo | URL) => {
    const path = typeof input === 'string' ? input : input.toString();
    if (path.includes('material-presets')) {
      return new Response(JSON.stringify(materialPresets), { status: 200 });
    }
    if (path.includes('post-presets')) {
      return new Response(JSON.stringify(postPresets), { status: 200 });
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
