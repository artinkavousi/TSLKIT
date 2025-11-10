import type { Preset, PresetKind, Tutorial } from '../types/presets.js';

const DATA_ENDPOINTS: Record<PresetKind | 'tutorial', string> = {
  material: './data/material-presets.json',
  post: './data/post-presets.json',
  tutorial: './data/tutorials.json'
};

async function fetchJson<T>(path: string): Promise<T> {
  const response = await fetch(path);

  if (!response.ok) {
    throw new Error(`Failed to fetch ${path}: ${response.status} ${response.statusText}`);
  }

  return (await response.json()) as T;
}

export class AgentClient {
  private readonly presetCache = new Map<PresetKind, Promise<Preset[]>>();
  private tutorialsPromise: Promise<Tutorial[]> | null = null;

  async getPresets(kind: PresetKind): Promise<Preset[]> {
    if (!this.presetCache.has(kind)) {
      const promise = fetchJson<Preset[]>(DATA_ENDPOINTS[kind]).catch((error) => {
        console.error('Failed to load presets from agent API', error);
        return [] as Preset[];
      });
      this.presetCache.set(kind, promise);
    }

    return this.presetCache.get(kind) ?? Promise.resolve([]);
  }

  async getTutorials(): Promise<Tutorial[]> {
    if (!this.tutorialsPromise) {
      this.tutorialsPromise = fetchJson<Tutorial[]>(DATA_ENDPOINTS.tutorial).catch((error) => {
        console.error('Failed to load tutorials from agent API', error);
        return [] as Tutorial[];
      });
    }

    return this.tutorialsPromise;
  }
}
