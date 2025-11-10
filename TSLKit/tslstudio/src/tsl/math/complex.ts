/**
 * Complex Number Operations
 * 
 * @module tsl/math/complex
 */

import {
  Fn,
  PI,
  vec2,
  mul,
  add,
  atan,
  length,
  select,
  log,
  cos,
  sin,
  div,
  pow,
} from 'three/tsl'
import { cosh, sinh } from '../color/tonemapping.js'

/**
 * Convert complex number to polar form
 * 
 * @param z - Complex number (vec2: real, imaginary)
 * @returns Polar form (vec2: radius, angle)
 */
export const asPolar = /*#__PURE__*/ Fn(
  ([z]) => {
    return vec2(length(z), atan(z.y, z.x))
  }
)

/**
 * Complex multiplication
 * 
 * @param a - First complex number
 * @param b - Second complex number
 * @returns Product a * b
 * 
 * @example
 * ```typescript
 * const result = complexMul(vec2(1, 2), vec2(3, 4))
 * ```
 */
export const complexMul = /*#__PURE__*/ Fn(
  ([a, b]) => {
    return vec2(
      a.x.mul(b.x).sub(mul(a.y, b.y)),
      a.x.mul(b.y).add(mul(a.y, b.x))
    )
  }
)

/**
 * Complex division
 * 
 * @param a - Dividend
 * @param b - Divisor
 * @returns Quotient a / b
 */
export const complexDiv = /*#__PURE__*/ Fn(
  ([a, b]) => {
    const denom = add(b.x.mul(b.x), b.y.mul(b.y))
    return vec2(
      div(a.x.mul(b.x).add(mul(a.y, b.y)), denom),
      div(a.y.mul(b.x).sub(mul(a.x, b.y)), denom)
    )
  }
)

/**
 * Complex power
 * 
 * @param v - Base complex number
 * @param p - Real exponent
 * @returns v^p
 */
export const complexPow = /*#__PURE__*/ Fn(
  ([v, p]) => {
    const z = asPolar(v)
    return pow(z.x, p).mul(vec2(cos(z.y.mul(p)), sin(z.y.mul(p))))
  }
)

/**
 * Complex logarithm
 * 
 * @param a - Complex number
 * @returns log(a) in complex form
 */
export const complexLog = /*#__PURE__*/ Fn(
  ([a]) => {
    const polar = asPolar(a)
    const rPart = polar.x
    const iPart = polar.y.toVar()
    select(
      iPart.greaterThan(PI),
      iPart.assign(iPart.sub(mul(2.0, PI))),
      iPart.assign(polar.y)
    )
    
    return vec2(log(rPart), iPart)
  }
)

/**
 * Complex sine
 * 
 * @param a - Complex number
 * @returns sin(a) in complex form
 */
export const complexSin = /*#__PURE__*/ Fn(
  ([a]) => {
    return vec2(
      sin(a.x).mul(cosh(a.y)),
      cos(a.x).mul(sinh(a.y))
    )
  }
)

/**
 * Complex cosine
 * 
 * @param a - Complex number
 * @returns cos(a) in complex form
 */
export const complexCos = /*#__PURE__*/ Fn(
  ([a]) => {
    return vec2(
      cos(a.x).mul(cosh(a.y)),
      sin(a.x).mul(sinh(a.y)).negate()
    )
  }
)

/**
 * Complex tangent
 * 
 * @param a - Complex number
 * @returns tan(a) in complex form
 */
export const complexTan = /*#__PURE__*/ Fn(
  ([a]) => {
    return complexDiv(complexSin(a), complexCos(a))
  }
)
