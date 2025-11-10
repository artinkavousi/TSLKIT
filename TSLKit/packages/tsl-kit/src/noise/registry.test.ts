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

  it('supports additional noise families', () => {
    const simplex4d = buildNoiseNode({ type: 'simplex4d', seed: 8 });
    expect(simplex4d.node.spec).toMatchObject({
      type: 'simplex4d',
      warp: 0.5
    });

    const turbulence = buildNoiseNode({ type: 'turbulence', warp: 0.4 });
    expect(turbulence.node.spec).toMatchObject({
      type: 'turbulence',
      octaves: 6,
      warp: 0.4
    });
  });
});

describe('getNoiseMetadata', () => {
  it('lists all registered metadata when type is omitted', () => {
    const metadata = getNoiseMetadata();

    expect(Array.isArray(metadata)).toBe(true);
    expect((metadata as unknown[]).length).toBeGreaterThanOrEqual(10);
  });

  it('returns metadata for a specific type', () => {
    const metadata = getNoiseMetadata('curl');

    expect(metadata.id).toBe('tsl.noise.curl');
    expect(metadata.tags).toContain('flow');
  });

  it('returns metadata for newly registered types', () => {
    const metadata = getNoiseMetadata('turbulence');

    expect(metadata.id).toBe('tsl.noise.turbulence');
    expect(metadata.tags).toContain('distortion');
  });
});
