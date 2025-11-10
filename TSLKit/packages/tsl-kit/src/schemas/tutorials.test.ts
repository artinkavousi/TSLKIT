import { describe, expect, it } from 'vitest';

import { tutorialCollectionSchema, tutorialSchema } from './tutorials.js';

describe('tutorialSchema', () => {
  it('parses tutorials with supplemental metadata', () => {
    const parsed = tutorialSchema.parse({
      id: 'tutorial.example',
      title: 'Example Tutorial',
      excerpt: 'Covers schema usage.',
      difficulty: 'intermediate',
      presetId: 'material.example',
      durationMinutes: 15,
      topics: ['schemas'],
      focus: 'materials',
      steps: [
        { title: 'Setup', summary: 'Install dependencies.' },
        { title: 'Author Schema', summary: 'Define Zod objects.' }
      ],
      resources: [
        { label: 'Docs', url: 'https://docs.tsl.studio/schemas' }
      ],
      schema: {
        module: 'materials',
        name: 'materialPreset',
        version: '1.0.0'
      }
    });

    expect(parsed.focus).toBe('materials');
    expect(parsed.steps).toHaveLength(2);
  });

  it('parses tutorial collections', () => {
    const result = tutorialCollectionSchema.safeParse([]);
    expect(result.success).toBe(true);
  });
});
