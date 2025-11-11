import { clamp, float, mix, vec3 } from 'three/tsl';
import type { ShaderNodeObject } from 'three/tsl';

import type {
  NormalizedGTAOSpec,
  NormalizedSSGISpec,
  NormalizedSSRSpec,
  PostPassContextNodes
} from '../types.js';

export function createSSRPass(
  input: ShaderNodeObject<any>,
  spec: NormalizedSSRSpec
): ShaderNodeObject<any> {
  const intensity = float(spec.intensity);
  const thickness = float(spec.thickness);
  const reflection = input.mul(intensity.mul(0.6)).add(thickness.mul(0.1));
  return clamp(input.add(reflection), float(0.0), float(1.0));
}

export function createGTAOPass(
  input: ShaderNodeObject<any>,
  spec: NormalizedGTAOSpec
): ShaderNodeObject<any> {
  const radius = float(spec.radius);
  const falloff = float(spec.falloff);
  const occlusion = float(1.0).sub(radius.mul(0.2)).mul(falloff);
  return input.mul(occlusion.clamp(0.5, 1.0));
}

export function createSSGIPass(
  input: ShaderNodeObject<any>,
  spec: NormalizedSSGISpec,
  context: PostPassContextNodes
): ShaderNodeObject<any> {
  const previous = context.previousColor ?? vec3(0.0, 0.0, 0.0);
  const blend = float(spec.temporalBlend);
  const bounced = input.mul(spec.intensity).mul(0.5);
  return mix(previous, input.add(bounced), blend.clamp(0.0, 1.0));
}
