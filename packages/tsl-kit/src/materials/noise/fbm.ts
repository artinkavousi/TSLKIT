import { Fn, add, mul, vec3 } from 'three/examples/jsm/nodes/Nodes.js';

import { perlinNoise3dNode } from './perlin3d';
import type { Vector3Tuple } from '../../utils/types';
import { perlinNoise3d } from './perlin3d';

export const fbm3dNode = /*#__PURE__*/ Fn(([p]) => {
  const point = vec3(p).toVar();
  let amplitude = 0.5;
  let frequency = 1.0;
  let sum = perlinNoise3dNode(point.mul(frequency)).mul(amplitude);

  for (let octave = 1; octave < 4; octave += 1) {
    frequency *= 2.0;
    amplitude *= 0.5;
    sum = sum.add(perlinNoise3dNode(point.mul(frequency)).mul(amplitude));
  }

  return sum;
});

export function fbm3d(point: Vector3Tuple, octaves = 4, persistence = 0.5, lacunarity = 2) {
  let amplitude = 0.5;
  let frequency = 1;
  let total = 0;

  for (let i = 0; i < octaves; i += 1) {
    total += perlinNoise3d([point[0] * frequency, point[1] * frequency, point[2] * frequency]) * amplitude;
    amplitude *= persistence;
    frequency *= lacunarity;
  }

  return total;
}
