import { describe, expect, it } from 'vitest';
import { Fn, float, mat3, vec2, vec3 } from 'three/tsl';

import { composeMatrix, remap, smoothMin, smoothMod } from './utils.js';
import {
  sdBox2d,
  sdBox3d,
  sdDiamond,
  sdEquilateralTriangle,
  sdHexagon,
  sdLine,
  sdParallelogram,
  sdRhombus,
  sdRing,
  sdSphere,
  sdTriangle
} from './shapes.js';
import {
  bend,
  distanceDifference,
  distanceIntersection,
  distanceUnion,
  repeat,
  smoothIntersection,
  smoothSubtraction,
  smoothUnion,
  twist
} from './operations.js';
import { raymarchScene, type RaymarchDistanceFunction } from './scene.js';

describe('sdf utils', () => {
  it('composes transform matrices', () => {
    expect(composeMatrix(vec3(0, 1, 0), mat3(), vec3(1, 1, 1))).toBeDefined();
  });

  it('remaps values', () => {
    expect(remap(float(0.5), float(0.0), float(1.0), float(-1.0), float(1.0))).toBeDefined();
  });

  it('computes smooth min and mod', () => {
    expect(smoothMin(float(0.2), float(0.4), float(0.1))).toBeDefined();
    expect(smoothMod(float(0.25), float(1.0), float(0.5))).toBeDefined();
  });
});

describe('sdf shapes', () => {
  const v2 = vec2(0.1, 0.2);
  const v3 = vec3(0.1, 0.2, 0.3);

  it('evaluates primitives', () => {
    expect(sdSphere(v3, 1.0)).toBeDefined();
    expect(sdBox2d(v2, float(0.5))).toBeDefined();
    expect(sdBox3d(v3, vec3(0.5, 0.5, 0.5))).toBeDefined();
    expect(sdDiamond(v2, 0.2)).toBeDefined();
    expect(sdHexagon(v2, 0.3)).toBeDefined();
    expect(sdEquilateralTriangle(v2, float(0.4))).toBeDefined();
    expect(sdLine(float(0.5))).toBeDefined();
    expect(sdRing(v2, 0.6)).toBeDefined();
    expect(sdParallelogram(v2, float(0.3), float(0.2), float(0.1))).toBeDefined();
    expect(sdRhombus(v2, vec2(0.3, 0.4))).toBeDefined();
    expect(sdTriangle(v2, float(0.8))).toBeDefined();
  });
});

describe('sdf operations', () => {
  it('combines distances smoothly', () => {
    expect(smoothUnion(float(0.3), float(0.5), float(0.1))).toBeDefined();
    expect(smoothSubtraction(float(0.5), float(0.3), float(0.1))).toBeDefined();
    expect(smoothIntersection(float(0.2), float(0.4), float(0.05))).toBeDefined();
  });

  it('evaluates distance compositors', () => {
    const a = float(0.2);
    const b = float(0.4);
    expect(distanceUnion(a, b)).toBeDefined();
    expect(distanceIntersection(a, b)).toBeDefined();
    expect(distanceDifference(a, b)).toBeDefined();
  });
});

describe('sdf transformations', () => {
  const samplePoint = vec3(0.1, 0.2, 0.3);

  it('repeats coordinates across a cell size', () => {
    expect(repeat(samplePoint, vec3(1.0, 2.0, 3.0))).toBeDefined();
  });

  it('twists coordinates around the Y axis', () => {
    expect(twist(samplePoint, float(0.5))).toBeDefined();
  });

  it('bends coordinates around a radius', () => {
    expect(bend(samplePoint, float(2.5))).toBeDefined();
  });
});

describe('raymarch scene helper', () => {
  it('builds a raymarch scene graph with shading', () => {
    const sdf = Fn(([pos]) => {
      const repeated = repeat(vec3(pos), vec3(1.5));
      const twisted = twist(repeated, float(0.25));
      return sdSphere(twisted, 0.45);
    }) as unknown as RaymarchDistanceFunction;

    const scene = raymarchScene({
      sdf,
      shading: ({ normal, hitMask }) => vec3(normal.abs()).mul(hitMask.add(0.1))
    });

    expect(scene.color).toBeDefined();
    expect(scene.normal).toBeDefined();
    expect(scene.position).toBeDefined();
  });
});
