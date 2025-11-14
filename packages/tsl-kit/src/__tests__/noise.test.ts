import { describe, expect, it } from 'vitest';

import { fbm3d } from '../materials/noise/fbm';
import { perlinNoise3d } from '../materials/noise/perlin3d';
import { simplexNoise3d } from '../materials/noise/simplexNoise3d';

const SAMPLE_POINT: [number, number, number] = [0.42, 1.2, -0.77];

describe('noise library', () => {
  it('produces deterministic simplex noise', () => {
    const value = simplexNoise3d(SAMPLE_POINT);
    expect(value).toBeCloseTo(0.71137, 3);
    expect(simplexNoise3d(SAMPLE_POINT)).toBeCloseTo(value, 6);
  });

  it('produces deterministic perlin noise', () => {
    const value = perlinNoise3d(SAMPLE_POINT);
    expect(value).toBeCloseTo(0.19139, 3);
    expect(perlinNoise3d(SAMPLE_POINT)).toBeCloseTo(value, 6);
  });

  it('computes fbm values in range', () => {
    const result = fbm3d(SAMPLE_POINT);
    expect(result).toBeGreaterThanOrEqual(-1);
    expect(result).toBeLessThanOrEqual(1);
  });
});
