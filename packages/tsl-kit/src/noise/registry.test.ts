import { describe, expect, it } from 'vitest';

import { buildNoiseNode, getNoiseMetadata } from './registry.js';

describe('buildNoiseNode', () => {
  it('applies defaults for missing parameters', () => {
    const { node } = buildNoiseNode({ type: 'simplex' });

    expect(node.spec).toEqual({
      type: 'simplex',
      frequency: 1,
      amplitude: 1,
      seed: 0,
      octaves: 1,
      warp: 0
    });
  });

  it('merges overrides correctly', () => {
    const { node } = buildNoiseNode({
      type: 'fbm',
      frequency: 2,
      octaves: 6,
      warp: 1.25
    });

    expect(node.spec).toEqual({
      type: 'fbm',
      frequency: 2,
      amplitude: 1,
      seed: 0,
      octaves: 6,
      warp: 1.25
    });
  });
});

describe('getNoiseMetadata', () => {
  it('lists all registered metadata when type is omitted', () => {
    const metadata = getNoiseMetadata();

    expect(Array.isArray(metadata)).toBe(true);
    expect((metadata as unknown[]).length).toBeGreaterThanOrEqual(5);
  });

  it('returns metadata for a specific type', () => {
    const metadata = getNoiseMetadata('curl');

    expect(metadata.id).toBe('tsl.noise.curl');
    expect(metadata.tags).toContain('flow');
  });
});
