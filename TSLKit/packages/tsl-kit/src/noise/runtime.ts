import { Node, ShaderNodeObject, add, float, mul, vec2, vec3, vec4 } from 'three/tsl';

import {
  curlNoise3d,
  curlNoise4d,
  domainWarpedFbm,
  fbm,
  perlinNoise3d,
  simplexNoise2d,
  simplexNoise3d,
  simplexNoise4d,
  turbulence,
  voronoiDistance
} from './nodes/index.js';
import { buildNoiseNode } from './registry.js';
import type { NoiseRuntimeNode, NoiseSpec, NormalizedNoiseSpec } from './types.js';

type Vec3Node = ShaderNodeObject<Node>;

function toVec3(position: Vec3Node, spec: NormalizedNoiseSpec): ReturnType<typeof vec3> {
  const basePosition = vec3(position);
  const frequencyAdjusted = spec.frequency !== 1 ? basePosition.mul(spec.frequency) : basePosition;

  if (spec.seed === 0) {
    return frequencyAdjusted;
  }

  const seedOffset = vec3(float(spec.seed / 997));

  return add(frequencyAdjusted, seedOffset);
}

function evaluateNormalizedSpec(spec: NormalizedNoiseSpec, position: Vec3Node): ShaderNodeObject<Node> {
  const scaledPosition = toVec3(position, spec);
  const amplitude = float(spec.amplitude);

  switch (spec.type) {
    case 'simplex':
      return mul(simplexNoise3d(scaledPosition), amplitude);
    case 'simplex2d':
      return mul(simplexNoise2d(vec2(scaledPosition.xy)), amplitude);
    case 'simplex4d': {
      const w = float(spec.seed * 0.01);
      return mul(simplexNoise4d(vec4(scaledPosition, w)), amplitude);
    }
    case 'curl':
      return mul(curlNoise3d(scaledPosition), amplitude);
    case 'curl4d': {
      const w = float(spec.seed * 0.01);
      return curlNoise4d(vec4(scaledPosition, w)).mul(amplitude);
    }
    case 'fbm':
      return fbm(scaledPosition, spec.octaves, 1.0, spec.amplitude);
    case 'perlin':
      return mul(perlinNoise3d(scaledPosition), amplitude);
    case 'voronoi':
      return mul(voronoiDistance(add(scaledPosition, vec3(spec.seed * 0.01))), amplitude);
    case 'turbulence': {
      const time = float(spec.seed * 0.01);
      const turbulenceOffset = turbulence(
        vec2(scaledPosition.xy),
        time,
        float(spec.octaves),
        float(0.7),
        float(spec.warp),
        float(spec.frequency),
        float(1.4)
      );
      return vec3(turbulenceOffset, 0.0).mul(amplitude);
    }
    case 'domainWarp':
      return domainWarpedFbm(scaledPosition, spec.octaves, 1.0, spec.amplitude, 2.0, 0.5, spec.warp);
    default:
      throw new Error(`Unsupported noise type ${(spec as NormalizedNoiseSpec).type}`);
  }
}

export function evaluateNoiseNode(node: NoiseRuntimeNode, position: Vec3Node): ShaderNodeObject<Node> {
  return evaluateNormalizedSpec(node.spec, position);
}

export function evaluateNoiseSpec(spec: NoiseSpec, position: Vec3Node): ShaderNodeObject<Node> {
  const { node } = buildNoiseNode(spec);

  return evaluateNoiseNode(node, position);
}
