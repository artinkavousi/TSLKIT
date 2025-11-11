import { abs, clamp, float, smoothstep } from 'three/tsl';
import type { ShaderNodeObject } from 'three/tsl';

import type { NormalizedDepthOfFieldSpec, PostPassContextNodes } from '../types.js';

export function createDepthOfFieldPass(
  input: ShaderNodeObject<any>,
  spec: NormalizedDepthOfFieldSpec,
  context: PostPassContextNodes
): ShaderNodeObject<any> {
  const depth = context.depth ?? float(0.5);
  const focusDistance = float(spec.focusDistance);
  const focusRange = float(spec.focusRange);
  const bokehScale = float(spec.bokehScale);
  const coc = abs(depth.sub(focusDistance));
  const blurAmount = smoothstep(focusRange, float(1.0), coc).mul(bokehScale);
  const blurred = input.mul(float(1.0).sub(blurAmount)).add(input.mul(blurAmount).mul(0.75));
  return clamp(blurred, float(0.0), float(1.0));
}
