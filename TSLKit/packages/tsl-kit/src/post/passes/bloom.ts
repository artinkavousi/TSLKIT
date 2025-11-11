import { float, smoothstep, vec3 } from 'three/tsl';
import type { ShaderNodeObject } from 'three/tsl';

import type {
  NormalizedBloomAnamorphicSpec,
  NormalizedBloomLumaSpec,
  NormalizedBloomStandardSpec,
  PostPassContextNodes
} from '../types.js';

export function createStandardBloomPass(
  input: ShaderNodeObject<any>,
  spec: NormalizedBloomStandardSpec
): ShaderNodeObject<any> {
  const intensity = float(spec.intensity);
  const radius = float(spec.radius + 1.0);
  const threshold = float(spec.threshold);
  const highlights = input.sub(threshold).max(float(0.0));
  const softened = highlights.mul(radius);
  const result = input.add(softened.mul(intensity));
  return result;
}

export function createAnamorphicBloomPass(
  input: ShaderNodeObject<any>,
  spec: NormalizedBloomAnamorphicSpec
): ShaderNodeObject<any> {
  const intensity = float(spec.intensity);
  const threshold = float(spec.threshold);
  const ratio = float(spec.anamorphicRatio);
  const highlight = input.sub(threshold).max(float(0.0)).mul(intensity);
  const stretch = vec3(ratio, float(1.0).div(ratio), float(1.0));
  return input.add(highlight.mul(stretch));
}

export function createLumaBloomPass(
  input: ShaderNodeObject<any>,
  spec: NormalizedBloomLumaSpec,
  _context: PostPassContextNodes
): ShaderNodeObject<any> {
  const lumaWeights = vec3(0.2126, 0.7152, 0.0722);
  const luma = input.dot(lumaWeights);
  const threshold = float(spec.threshold);
  const lumaMask = smoothstep(threshold, float(1.0), luma);
  const glow = input.mul(float(spec.intensity)).mul(lumaMask.mul(spec.radius + 1.0));
  return input.add(glow);
}
