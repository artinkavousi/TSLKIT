import {
  floor,
  Fn,
  vec3,
  sub,
  vec4,
  mul,
  overloadingFn,
  fract,
  abs,
  dot,
  lessThan,
  float,
  mod,
} from 'three/tsl';

export const mod289Vec3 = /*#__PURE__*/ Fn(([x_immutable]: [unknown]) => {
  const x = vec3(x_immutable).toVar();

  return x.sub(floor(x.mul(1.0 / 289.0)).mul(289.0));
}).setLayout({
  name: 'mod289Vec3',
  type: 'vec3',
  inputs: [{ name: 'x', type: 'vec3' }],
});

export const mod289Vec4 = /*#__PURE__*/ Fn(([x_immutable]: [unknown]) => {
  const x = vec4(x_immutable).toVar();

  return x.sub(floor(x.mul(1.0 / 289.0)).mul(289.0));
}).setLayout({
  name: 'mod289Vec4',
  type: 'vec4',
  inputs: [{ name: 'x', type: 'vec4' }],
});

// @ts-ignore - union overload helper provided by TSL runtime
export const mod289 = /*#__PURE__*/ overloadingFn([mod289Vec3, mod289Vec4]);

export const fade = /*#__PURE__*/ Fn(([t_immutable]: [unknown]) => {
  const t = vec3(t_immutable).toVar();

  return t
    .mul(t)
    .mul(t)
    .mul(t.mul(t.mul(6.0).sub(15.0)).add(10.0));
}).setLayout({
  name: 'fade',
  type: 'vec3',
  inputs: [{ name: 't', type: 'vec3' }],
});

export const permuteVec4 = /*#__PURE__*/ Fn(([x_immutable]: [unknown]) => {
  const x = vec4(x_immutable).toVar();

  return mod(x.mul(34.0).add(1.0).mul(x), 289.0);
}).setLayout({
  name: 'permuteVec4',
  type: 'vec4',
  inputs: [{ name: 'x', type: 'vec4' }],
});

export const permuteFloat = /*#__PURE__*/ Fn(([x_immutable]: [unknown]) => {
  const x = float(x_immutable).toVar();

  return floor(mod(x.mul(34.0).add(1.0).mul(x), 289.0));
}).setLayout({
  name: 'permuteFloat',
  type: 'float',
  inputs: [{ name: 'x', type: 'float' }],
});

// @ts-ignore - union overload helper provided by TSL runtime
export const permute = /*#__PURE__*/ overloadingFn([permuteVec4, permuteFloat]);

export const taylorInvSqrtVec4 = /*#__PURE__*/ Fn(([r_immutable]: [unknown]) => {
  const r = vec4(r_immutable).toVar();

  return sub(1.79284291400159, mul(0.85373472095314, r));
}).setLayout({
  name: 'taylorInvSqrtVec4',
  type: 'vec4',
  inputs: [{ name: 'r', type: 'vec4' }],
});

export const taylorInvSqrtFloat = /*#__PURE__*/ Fn(([r_immutable]: [unknown]) => {
  const r = float(r_immutable).toVar();

  return sub(1.79284291400159, mul(0.85373472095314, r));
}).setLayout({
  name: 'taylorInvSqrtFloat',
  type: 'float',
  inputs: [{ name: 'r', type: 'float' }],
});

// @ts-ignore - union overload helper provided by TSL runtime
export const taylorInvSqrt = /*#__PURE__*/ overloadingFn([taylorInvSqrtVec4, taylorInvSqrtFloat]);

export const grad4 = /*#__PURE__*/ Fn(([j_immutable, ip_immutable]: [unknown, unknown]) => {
  const ip = vec4(ip_immutable).toVar();
  const j = float(j_immutable).toVar();
  const ones = vec4(1.0, 1.0, 1.0, -1.0);
  const p = vec4().toVar();
  const s = vec4().toVar();

  p.xyz.assign(
    floor(fract(vec3(j).mul(ip.xyz)).mul(7.0))
      .mul(ip.z)
      .sub(1.0),
  );
  p.w.assign(sub(1.5, dot(abs(p.xyz), ones.xyz)));
  s.assign(vec4(lessThan(p, vec4(0.0))));
  p.xyz.assign(p.xyz.add(s.xyz.mul(2.0).sub(1.0).mul(s.www)));

  return p;
}).setLayout({
  name: 'grad4',
  type: 'vec4',
  inputs: [
    { name: 'j', type: 'float' },
    { name: 'ip', type: 'vec4' },
  ],
});
