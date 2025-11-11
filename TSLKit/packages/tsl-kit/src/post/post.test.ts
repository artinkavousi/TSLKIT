import { describe, expect, it } from 'vitest';
import { vec3 } from 'three/tsl';

import { buildPostPass, getPostMetadata, listPostPassMetadata } from './index.js';
import type { PostEffectSpec } from './index.js';

import { postEffectSpecSchema } from '../schemas/post.js';

describe('post-processing registry', () => {
  it('builds a bloom stack with defaults applied', () => {
    const color = vec3(1.0, 0.8, 0.6);
    const spec: PostEffectSpec = { type: 'bloom.standard', intensity: 1.4 };
    const result = buildPostPass(color, spec);

    expect(result.node).toBeDefined();
    expect(result.metadata.id).toBe('tsl.post.bloom.standard');
    expect(result.spec.radius).toBeCloseTo(0.65, 2);
  });

  it('parses post effect specs via zod schema', () => {
    const parsed = postEffectSpecSchema.parse({ type: 'aa.taa', blendFactor: 0.7 });
    expect(parsed).toEqual({ type: 'aa.taa', blendFactor: 0.7, jitterSpread: 0.25 });
  });

  it('returns metadata for all passes', () => {
    const metadata = getPostMetadata();
    expect(Array.isArray(metadata)).toBe(true);
    expect((metadata as ReturnType<typeof getPostMetadata> & any)[0].id).toContain('tsl.post');
    expect(listPostPassMetadata()).toHaveLength((metadata as any[]).length);
  });
});
