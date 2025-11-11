import { Fn, clamp, div, exp, float, mix, pow, smoothstep, vec3 } from 'three/tsl';
import type { ShaderNodeObject } from 'three/tsl';

import type {
  NormalizedTonemapAcesSpec,
  NormalizedTonemapReinhardSpec,
  NormalizedTonemapUncharted2Spec
} from '../types.js';

const reinhardFn = Fn(([color]) => {
  return color.div(color.add(1.0));
});

const acesFn = Fn(([color]) => {
  const a = float(2.51);
  const b = float(0.03);
  const c = float(2.43);
  const d = float(0.59);
  const e = float(0.14);
  return color.mul(a).add(b).div(color.mul(c).add(color.mul(d)).add(e)).clamp(0.0, 1.0);
});

const unchartedFn = Fn(([color]) => {
  const A = float(0.15);
  const B = float(0.5);
  const C = float(0.1);
  const D = float(0.2);
  const E = float(0.02);
  const F = float(0.3);
  return color
    .mul(A)
    .add(color.mul(color).mul(B))
    .div(color.mul(color).mul(C).add(color.mul(D)).add(E))
    .sub(F.div(E));
});

export function createReinhardTonemapPass(
  input: ShaderNodeObject<any>,
  spec: NormalizedTonemapReinhardSpec
): ShaderNodeObject<any> {
  const exposure = float(spec.exposure);
  const mapped = reinhardFn([input.mul(exposure)]);
  return clamp(mapped, float(0.0), float(1.0));
}

export function createAcesTonemapPass(
  input: ShaderNodeObject<any>,
  spec: NormalizedTonemapAcesSpec
): ShaderNodeObject<any> {
  const exposure = float(spec.exposure);
  const mapped = acesFn([input.mul(exposure)]);
  return clamp(mapped, float(0.0), float(1.0));
}

export function createUncharted2TonemapPass(
  input: ShaderNodeObject<any>,
  spec: NormalizedTonemapUncharted2Spec
): ShaderNodeObject<any> {
  const exposure = float(spec.exposure);
  const mapped = unchartedFn([input.mul(exposure)]);
  const w = vec3(11.2, 11.2, 11.2);
  const whiteScale = unchartedFn([w]);
  return clamp(mapped.div(whiteScale), float(0.0), float(1.0));
}

export function createFilmCurvePass(input: ShaderNodeObject<any>): ShaderNodeObject<any> {
  const lifted = smoothstep(float(0.0), float(1.0), input.mul(1.1));
  return mix(input, lifted, float(0.25));
}
