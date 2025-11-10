import { describe, expect, it } from 'vitest';

import { noiseSpecSchema } from './noise.js';

describe('noiseSpecSchema', () => {
  it('fills defaults when fields are missing', () => {
    const parsed = noiseSpecSchema.parse({ type: 'simplex' });

    expect(parsed).toEqual({
      type: 'simplex',
      frequency: 1,
      amplitude: 1,
      seed: 0,
      octaves: 1,
      warp: 0
    });
  });

  it('validates ranges for numeric values', () => {
    expect(() => noiseSpecSchema.parse({ type: 'curl', frequency: -1 })).toThrowError();
    expect(() => noiseSpecSchema.parse({ type: 'fbm', octaves: 9 })).toThrowError();
  });
});
