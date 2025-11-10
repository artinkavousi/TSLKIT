/**
 * 2D Simplex Noise
 * 
 * @module tsl/noise/simplexNoise2d
 */

import {
  Fn,
  vec2,
  vec3,
  vec4,
  float,
  floor,
  dot,
  mul,
  sub,
  max,
  fract,
} from 'three/tsl'
import { permute, mod289 } from './common.js'

/**
 * 2D Simplex Noise Function
 * 
 * @param v - 2D position vector
 * @returns Noise value in range approximately [-1, 1]
 */
export const simplexNoise2d = /*#__PURE__*/ Fn(
  ([v_immutable]) => {
    const v = vec2(v_immutable).toVar()
    
    const C = vec4(
      0.211324865405187,  // (3.0-sqrt(3.0))/6.0
      0.366025403784439,  // 0.5*(sqrt(3.0)-1.0)
      -0.577350269189626, // -1.0 + 2.0 * C.x
      0.024390243902439   // 1.0 / 41.0
    )

    // First corner
    const i = floor(v.add(dot(v, C.yy)))
    const x0 = v.sub(i).add(dot(i, C.xx))

    // Other corners
    const i1 = x0.x.greaterThan(x0.y).select(vec2(1.0, 0.0), vec2(0.0, 1.0))
    const x12 = x0.xyxy.add(C.xxzz)
    x12.xy.subAssign(i1)

    // Permutations
    i.assign(mod289(i))
    
    const p = permute(
      permute(i.y.add(vec3(0.0, i1.y, 1.0)))
        .add(i.x)
        .add(vec3(0.0, i1.x, 1.0))
    )

    const m = max(
      sub(0.5, vec3(dot(x0, x0), dot(x12.xy, x12.xy), dot(x12.zw, x12.zw))),
      0.0
    )
    m.assign(m.mul(m))
    m.assign(m.mul(m))

    // Gradients
    const x = mul(2.0, fract(p.mul(C.www))).sub(1.0)
    const h = x.abs().sub(0.5)
    const ox = floor(x.add(0.5))
    const a0 = x.sub(ox)

    // Normalize gradients
    m.mulAssign(float(1.79284291400159).sub(mul(0.85373472095314, a0.mul(a0).add(h.mul(h)))))

    // Compute noise value
    const g = vec3(
      a0.x.mul(x0.x).add(h.x.mul(x0.y)),
      a0.yz.mul(x12.xz).add(h.yz.mul(x12.yw))
    )
    
    return mul(130.0, dot(m, g))
  }
).setLayout({
  name: 'simplexNoise2d',
  type: 'float',
  inputs: [{ name: 'v', type: 'vec2' }],
})
