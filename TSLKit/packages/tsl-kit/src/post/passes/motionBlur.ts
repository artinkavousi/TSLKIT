import { float, mix, vec3 } from 'three/tsl';
import type { ShaderNodeObject } from 'three/tsl';

import type { NormalizedMotionBlurSpec, PostPassContextNodes } from '../types.js';

export function createMotionBlurPass(
  input: ShaderNodeObject<any>,
  spec: NormalizedMotionBlurSpec,
  context: PostPassContextNodes
): ShaderNodeObject<any> {
  const velocity = context.velocity ?? vec3(0.0, 0.0, 0.0);
  const previous = context.previousColor ?? input;
  const intensity = float(spec.intensity);
  const blurMix = velocity.length().mul(intensity).clamp(0.0, 1.0);
  return mix(previous, input, float(1.0).sub(blurMix.mul(0.5)));
}
