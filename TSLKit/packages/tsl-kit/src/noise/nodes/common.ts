import {
  Fn,
  abs,
  dot,
  float,
  floor,
  fract,
  lessThan,
  mul,
  overloadingFn,
  sub,
  vec3,
  vec4
} from 'three/tsl';

const INV_289 = 1 / 289;

const mod289Vec3 = /*#__PURE__*/ Fn(([xInput]) => {
  const x = vec3(xInput).toVar();

  return x.sub(floor(x.mul(INV_289)).mul(289.0));
}).setLayout({
  name: 'mod289_vec3',
  type: 'vec3',
  inputs: [{ name: 'x', type: 'vec3' }]
});

const mod289Vec4 = /*#__PURE__*/ Fn(([xInput]) => {
  const x = vec4(xInput).toVar();

  return x.sub(floor(x.mul(INV_289)).mul(289.0));
}).setLayout({
  name: 'mod289_vec4',
  type: 'vec4',
  inputs: [{ name: 'x', type: 'vec4' }]
});

export const mod289 = /*#__PURE__*/ overloadingFn([mod289Vec3, mod289Vec4]);

const permuteVec4 = /*#__PURE__*/ Fn(([xInput]) => {
  const x = vec4(xInput).toVar();

  return mod289(x.mul(34.0).add(1.0).mul(x));
}).setLayout({
  name: 'permute',
  type: 'vec4',
  inputs: [{ name: 'x', type: 'vec4' }]
});

const permuteVec3 = /*#__PURE__*/ Fn(([xInput]) => {
  const x = vec3(xInput).toVar();

  return mod289(x.mul(34.0).add(1.0).mul(x));
}).setLayout({
  name: 'permute_vec3',
  type: 'vec3',
  inputs: [{ name: 'x', type: 'vec3' }]
});

const permuteFloat = /*#__PURE__*/ Fn(([xInput]) => {
  const x = float(xInput).toVar();

  return floor(mod289(x.mul(34.0).add(1.0).mul(x)));
}).setLayout({
  name: 'permute_float',
  type: 'float',
  inputs: [{ name: 'x', type: 'float' }]
});

export const permute = /*#__PURE__*/ overloadingFn([permuteVec4, permuteVec3, permuteFloat]);

const taylorInvSqrtVec4 = /*#__PURE__*/ Fn(([rInput]) => {
  const r = vec4(rInput).toVar();

  return sub(1.79284291400159, mul(0.85373472095314, r));
}).setLayout({
  name: 'taylorInvSqrt',
  type: 'vec4',
  inputs: [{ name: 'r', type: 'vec4' }]
});

const taylorInvSqrtFloat = /*#__PURE__*/ Fn(([rInput]) => {
  const r = float(rInput).toVar();

  return sub(1.79284291400159, mul(0.85373472095314, r));
}).setLayout({
  name: 'taylorInvSqrt_float',
  type: 'float',
  inputs: [{ name: 'r', type: 'float' }]
});

export const taylorInvSqrt = /*#__PURE__*/ overloadingFn([taylorInvSqrtVec4, taylorInvSqrtFloat]);

export const fade = /*#__PURE__*/ Fn(([tInput]) => {
  const t = vec3(tInput).toVar();

  return t
    .mul(t)
    .mul(t)
    .mul(t.mul(t.mul(6.0).sub(15.0)).add(10.0));
}).setLayout({
  name: 'fade',
  type: 'vec3',
  inputs: [{ name: 't', type: 'vec3' }]
});

export const grad4 = /*#__PURE__*/ Fn(([jInput, ipInput]) => {
  const j = float(jInput).toVar();
  const ip = vec4(ipInput).toVar();
  const ones = vec4(1.0, 1.0, 1.0, -1.0);
  const p = vec4().toVar();
  const s = vec4().toVar();

  p.xyz.assign(floor(fract(vec3(j).mul(ip.xyz)).mul(7.0)).mul(ip.z).sub(1.0));
  p.w.assign(sub(1.5, dot(abs(p.xyz), ones.xyz)));

  s.assign(vec4(lessThan(p, vec4(0.0))));
  p.xyz.assign(p.xyz.add(s.xyz.mul(2.0).sub(1.0).mul(s.www)));

  return p;
}).setLayout({
  name: 'grad4',
  type: 'vec4',
  inputs: [
    { name: 'j', type: 'float' },
    { name: 'ip', type: 'vec4' }
  ]
});

export const TWO_PI = float(6.283185307179586476925286766559);
