import {
  Node,
  ShaderNodeObject,
  add,
  float,
  mul,
  vec3
} from 'three/tsl';

import { domainWarpedFbm, fbm, voronoiDistance, curlNoise3d, simplexNoise3d } from './nodes/index.js';
import { buildNoiseNode } from './registry.js';
import type { NoiseRuntimeNode, NoiseSpec, NormalizedNoiseSpec } from './types.js';

type Vec3Node = ShaderNodeObject<Node>;

function toVec3(position: Vec3Node, spec: NormalizedNoiseSpec): ReturnType<typeof vec3> {
  const prepared = vec3(position).toVar();
  if (spec.frequency !== 1) {
    prepared.mulAssign(spec.frequency);
  }

  if (spec.seed !== 0) {
    prepared.addAssign(spec.seed / 997);
  }

  return prepared;
}

function evaluateNormalizedSpec(spec: NormalizedNoiseSpec, position: Vec3Node): ShaderNodeObject<Node> {
  const scaledPosition = toVec3(position, spec);
  const amplitude = float(spec.amplitude);

  switch (spec.type) {
    case 'simplex':
      return mul(simplexNoise3d(scaledPosition), amplitude);
    case 'curl':
      return mul(curlNoise3d(scaledPosition), amplitude);
    case 'fbm':
      return fbm(scaledPosition, spec.octaves, 1.0, spec.amplitude);
    case 'voronoi':
      return mul(voronoiDistance(add(scaledPosition, vec3(spec.seed * 0.01))), amplitude);
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
