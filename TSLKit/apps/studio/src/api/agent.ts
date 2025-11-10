import {
  materialPresetCollectionSchema,
  postStackPresetCollectionSchema,
  tutorialCollectionSchema
} from '@tslstudio/tsl-kit/schemas';

import type { Preset, PresetKind, Tutorial } from '../types/presets.js';

const DATA_ENDPOINTS: Record<PresetKind | 'tutorial', string> = {
  material: './data/material-presets.json',
  post: './data/post-presets.json',
  tutorial: './data/tutorials.json'
};

async function fetchJson(path: string): Promise<unknown> {
  const response = await fetch(path);

  if (!response.ok) {
    throw new Error(`Failed to fetch ${path}: ${response.status} ${response.statusText}`);
  }

  return response.json();
}

export class AgentClient {
  private readonly presetCache = new Map<PresetKind, Promise<Preset[]>>();
  private tutorialsPromise: Promise<Tutorial[]> | null = null;

  async getPresets(kind: PresetKind): Promise<Preset[]> {
    if (!this.presetCache.has(kind)) {
      const promise = fetchJson(DATA_ENDPOINTS[kind])
        .then((payload) => {
          const schema =
            kind === 'material' ? materialPresetCollectionSchema : postStackPresetCollectionSchema;
          const parsed = schema.safeParse(payload);
          if (!parsed.success) {
            console.error('Invalid preset dataset received from agent API', parsed.error.format());
            return [] as Preset[];
          }

          return parsed.data as Preset[];
        })
        .catch((error) => {
          console.error('Failed to load presets from agent API', error);
          return [] as Preset[];
        });
      this.presetCache.set(kind, promise);
    }

    return this.presetCache.get(kind) ?? Promise.resolve([]);
  }

  async getTutorials(): Promise<Tutorial[]> {
    if (!this.tutorialsPromise) {
      this.tutorialsPromise = fetchJson(DATA_ENDPOINTS.tutorial)
        .then((payload) => {
          const parsed = tutorialCollectionSchema.safeParse(payload);
          if (!parsed.success) {
            console.error('Invalid tutorial dataset received from agent API', parsed.error.format());
            return [] as Tutorial[];
          }

          return parsed.data;
        })
        .catch((error) => {
          console.error('Failed to load tutorials from agent API', error);
          return [] as Tutorial[];
        });
    }

    return this.tutorialsPromise;
  }
}
