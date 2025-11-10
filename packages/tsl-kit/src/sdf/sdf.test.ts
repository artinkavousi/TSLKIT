import { describe, expect, it } from 'vitest';
import { float, mat3, vec2, vec3 } from 'three/tsl';

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
import { smoothSubtraction, smoothUnion } from './operations.js';

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
  });
});
