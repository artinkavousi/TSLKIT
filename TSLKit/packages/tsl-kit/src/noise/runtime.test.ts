import { describe, expect, it } from 'vitest';
import { vec2, vec3, vec4 } from 'three/tsl';

import {
  curlNoise3d,
  curlNoise4d,
  domainWarpedFbm,
  evaluateNoiseSpec,
  fbm,
  perlinNoise3d,
  simplexNoise3d,
  simplexNoise2d,
  simplexNoise4d,
  turbulence,
  voronoiDistance
} from './index.js';

const origin = vec3(0.0, 0.0, 0.0);
const uv = vec2(0.0, 0.0);
const sample4d = vec4(0.0, 0.0, 0.0, 0.25);

describe('noise nodes', () => {
  it('creates simplex noise shader nodes', () => {
    expect(simplexNoise3d(origin)).toBeDefined();
  });

  it('creates simplex 2d noise shader nodes', () => {
    expect(simplexNoise2d(uv)).toBeDefined();
  });

  it('creates simplex 4d noise shader nodes', () => {
    expect(simplexNoise4d(sample4d)).toBeDefined();
  });

  it('creates curl noise shader nodes', () => {
    expect(curlNoise3d(origin)).toBeDefined();
  });

  it('creates curl 4d noise shader nodes', () => {
    expect(curlNoise4d(sample4d)).toBeDefined();
  });

  it('creates fbm shader nodes', () => {
    expect(fbm(origin)).toBeDefined();
  });

  it('creates domain warped fbm shader nodes', () => {
    expect(domainWarpedFbm(origin)).toBeDefined();
  });

  it('creates perlin shader nodes', () => {
    expect(perlinNoise3d(origin)).toBeDefined();
  });

  it('creates voronoi distance nodes', () => {
    expect(voronoiDistance(origin)).toBeDefined();
  });

  it('creates turbulence nodes', () => {
    expect(turbulence(vec2(0.1, 0.2), 0.0)).toBeDefined();
  });
});

describe('noise runtime evaluation', () => {
  it('evaluates simplex spec', () => {
    const node = evaluateNoiseSpec({ type: 'simplex', amplitude: 0.5, frequency: 2 }, origin);
    expect(node).toBeDefined();
  });

  it('evaluates curl spec', () => {
    const node = evaluateNoiseSpec({ type: 'curl', amplitude: 1.25 }, origin);
    expect(node).toBeDefined();
  });

  it('evaluates curl4d spec', () => {
    const node = evaluateNoiseSpec({ type: 'curl4d', seed: 2 }, origin);
    expect(node).toBeDefined();
  });

  it('evaluates voronoi spec', () => {
    const node = evaluateNoiseSpec({ type: 'voronoi', seed: 42 }, origin);
    expect(node).toBeDefined();
  });

  it('evaluates perlin spec', () => {
    const node = evaluateNoiseSpec({ type: 'perlin', frequency: 2.5 }, origin);
    expect(node).toBeDefined();
  });

  it('evaluates simplex4d spec', () => {
    const node = evaluateNoiseSpec({ type: 'simplex4d', seed: 12, warp: 0.35 }, origin);
    expect(node).toBeDefined();
  });

  it('evaluates turbulence spec', () => {
    const node = evaluateNoiseSpec({ type: 'turbulence', warp: 0.4, octaves: 5 }, origin);
    expect(node).toBeDefined();
  });
});
