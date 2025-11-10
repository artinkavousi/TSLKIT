import {
  Fn,
  float,
  floor,
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

export const permute = /*#__PURE__*/ Fn(([xInput]) => {
  const x = vec4(xInput).toVar();

  return mod289(x.mul(34.0).add(1.0).mul(x));
}).setLayout({
  name: 'permute',
  type: 'vec4',
  inputs: [{ name: 'x', type: 'vec4' }]
});

export const taylorInvSqrt = /*#__PURE__*/ Fn(([rInput]) => {
  const r = vec4(rInput).toVar();

  return sub(1.79284291400159, mul(0.85373472095314, r));
}).setLayout({
  name: 'taylorInvSqrt',
  type: 'vec4',
  inputs: [{ name: 'r', type: 'vec4' }]
});

export const TWO_PI = float(6.283185307179586476925286766559);
