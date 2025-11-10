/**
 * Common utility functions for noise generation
 * 
 * @module tsl/noise/common
 */

import {
  Fn,
  vec3,
  vec4,
  float,
  sub,
  mul,
  overloadingFn,
} from 'three/tsl'

/**
 * Modulo 289 for vec3 (used in noise permutation)
 */
const mod289Vec3 = /*#__PURE__*/ Fn(([x_immutable]) => {
  const x = vec3(x_immutable).toVar()
  return x.sub(x.mul(1.0 / 289.0).floor().mul(289.0))
}).setLayout({
  name: 'mod289Vec3',
  type: 'vec3',
  inputs: [{ name: 'x', type: 'vec3' }]
})

/**
 * Modulo 289 for vec4 (used in noise permutation)
 */
const mod289Vec4 = /*#__PURE__*/ Fn(([x_immutable]) => {
  const x = vec4(x_immutable).toVar()
  return x.sub(x.mul(1.0 / 289.0).floor().mul(289.0))
}).setLayout({
  name: 'mod289Vec4',
  type: 'vec4',
  inputs: [{ name: 'x', type: 'vec4' }]
})

/**
 * Modulo 289 operation
 * Overloaded for vec3 and vec4
 */
export const mod289 = /*#__PURE__*/ overloadingFn([mod289Vec3, mod289Vec4])

/**
 * Fade function for smooth interpolation
 * Implements: t * t * t * (t * (t * 6 - 15) + 10)
 */
export const fade = /*#__PURE__*/ Fn(([t_immutable]) => {
  const t = vec3(t_immutable).toVar()
  return t.mul(t).mul(t).mul(t.mul(t.mul(6.0).sub(15.0)).add(10.0))
}).setLayout({
  name: 'fade',
  type: 'vec3',
  inputs: [{ name: 't', type: 'vec3' }]
})

/**
 * Permutation function for vec4
 */
const permuteVec4 = /*#__PURE__*/ Fn(([x_immutable]) => {
  const x = vec4(x_immutable).toVar()
  return mod289Vec4(x.mul(34.0).add(1.0).mul(x))
}).setLayout({
  name: 'permuteVec4',
  type: 'vec4',
  inputs: [{ name: 'x', type: 'vec4' }]
})

/**
 * Permutation function for float
 */
const permuteFloat = /*#__PURE__*/ Fn(([x_immutable]) => {
  const x = float(x_immutable).toVar()
  return mod289Vec4(vec4(x).mul(34.0).add(1.0).mul(vec4(x))).x
}).setLayout({
  name: 'permuteFloat',
  type: 'float',
  inputs: [{ name: 'x', type: 'float' }]
})

/**
 * Permutation function
 * Overloaded for vec4 and float
 */
export const permute = /*#__PURE__*/ overloadingFn([permuteVec4, permuteFloat])

/**
 * Taylor inverse square root for vec4
 */
const taylorInvSqrtVec4 = /*#__PURE__*/ Fn(([r_immutable]) => {
  const r = vec4(r_immutable).toVar()
  return sub(1.79284291400159, mul(0.85373472095314, r))
}).setLayout({
  name: 'taylorInvSqrtVec4',
  type: 'vec4',
  inputs: [{ name: 'r', type: 'vec4' }]
})

/**
 * Taylor inverse square root for float
 */
const taylorInvSqrtFloat = /*#__PURE__*/ Fn(([r_immutable]) => {
  const r = float(r_immutable).toVar()
  return sub(1.79284291400159, mul(0.85373472095314, r))
}).setLayout({
  name: 'taylorInvSqrtFloat',
  type: 'float',
  inputs: [{ name: 'r', type: 'float' }]
})

/**
 * Taylor inverse square root approximation
 * Overloaded for vec4 and float
 */
export const taylorInvSqrt = /*#__PURE__*/ overloadingFn([
  taylorInvSqrtVec4,
  taylorInvSqrtFloat,
])

/**
 * 4D gradient function
 */
export const grad4 = /*#__PURE__*/ Fn(([j_immutable, ip_immutable]) => {
  const j = float(j_immutable).toVar()
  const ip = vec4(ip_immutable).toVar()
  
  const ones = vec4(1.0, 1.0, 1.0, -1.0).toVar()
  const pxyz = vec3(j.mul(ip.x).floor().mul(ip.x), j.mul(ip.y).floor().mul(ip.y), j.mul(ip.z).floor().mul(ip.z)).toVar()
  pxyz.assign(pxyz.fract().mul(2.0).sub(1.0))
  
  const pw = float(1.5).sub(dot(pxyz.abs(), vec3(1, 1, 1))).toVar()
  const p = vec4(pxyz, pw).toVar()
  
  const s = vec4(p.lessThan(0.0)).toVar()
  p.xyz.assign(p.xyz.add(s.xyz.mul(2.0).sub(1.0).mul(s.w)))
  
  return p
})
