import { describe, expect, it } from 'vitest';
import { vec3 } from 'three/tsl';

import {
  curlNoise3d,
  domainWarpedFbm,
  evaluateNoiseSpec,
  fbm,
  simplexNoise3d,
  voronoiDistance
} from './index.js';

const origin = vec3(0.0, 0.0, 0.0);

describe('noise nodes', () => {
  it('creates simplex noise shader nodes', () => {
    expect(simplexNoise3d(origin)).toBeDefined();
  });

  it('creates curl noise shader nodes', () => {
    expect(curlNoise3d(origin)).toBeDefined();
  });

  it('creates fbm shader nodes', () => {
    expect(fbm(origin)).toBeDefined();
  });

  it('creates domain warped fbm shader nodes', () => {
    expect(domainWarpedFbm(origin)).toBeDefined();
  });

  it('creates voronoi distance nodes', () => {
    expect(voronoiDistance(origin)).toBeDefined();
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

  it('evaluates voronoi spec', () => {
    const node = evaluateNoiseSpec({ type: 'voronoi', seed: 42 }, origin);
    expect(node).toBeDefined();
  });
});
