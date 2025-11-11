import { float, mix, vec3 } from 'three/tsl';
import type { ShaderNodeObject } from 'three/tsl';

import type { NormalizedFXAASpec, NormalizedTAASpec, PostPassContextNodes } from '../types.js';

export function createFXAAPass(
  input: ShaderNodeObject<any>,
  spec: NormalizedFXAASpec
): ShaderNodeObject<any> {
  const span = float(spec.spanMax);
  const reduce = float(spec.reduceMin);
  const softened = input.mul(span.mul(0.02)).add(reduce);
  return mix(input, softened, float(0.35));
}

export function createTAAPass(
  input: ShaderNodeObject<any>,
  spec: NormalizedTAASpec,
  context: PostPassContextNodes
): ShaderNodeObject<any> {
  const previous = context.previousColor ?? vec3(0.0, 0.0, 0.0);
  const blend = float(spec.blendFactor);
  return previous.mul(blend).add(input.mul(float(1.0).sub(blend)));
}
