import { describe, expect, it } from 'vitest';

import { postStackPresetSchema, postStackSpecSchema } from './post.js';

describe('postStack schemas', () => {
  it('parses a preset with defaults', () => {
    const parsed = postStackPresetSchema.parse({
      id: 'post.example',
      kind: 'post',
      name: 'Example Stack',
      version: '1.0.0',
      description: 'Test stack for validation.',
      tags: ['bloom'],
      previewColor: '#000000',
      parameters: [],
      postStack: {
        stages: ['bloom', 'tonemap']
      },
      schema: {
        module: 'post',
        name: 'postStackPreset',
        version: '1.0.0'
      }
    });

    expect(parsed.postStack.renderScale).toBe(1);
    expect(parsed.postStack.supportsRealtime).toBe(true);
  });

  it('requires at least one stage in the stack', () => {
    expect(() =>
      postStackSpecSchema.parse({
        stages: [],
        supportsRealtime: true,
        supportsDeferred: false,
        hasAsyncPasses: false,
        renderScale: 1,
        outputs: []
      })
    ).toThrowError();
  });
});
