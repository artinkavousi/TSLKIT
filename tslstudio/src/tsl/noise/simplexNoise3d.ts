/**
 * 3D Simplex Noise
 * 
 * High-quality procedural noise function
 * 
 * @module tsl/noise/simplexNoise3d
 */

import {
  Fn,
  vec2,
  vec3,
  vec4,
  float,
  dot,
  floor,
  sub,
  add,
  mul,
  max,
  fract,
  abs,
} from 'three/tsl'
import { permute, taylorInvSqrt } from './common.js'

/**
 * 3D Simplex Noise Function
 * 
 * @param v - 3D position vector
 * @returns Noise value in range approximately [-1, 1]
 */
export const simplexNoise3d = /*#__PURE__*/ Fn(
  ([v_immutable]) => {
    const v = vec3(v_immutable).toVar()
    
    const C = vec2(1.0 / 6.0, 1.0 / 3.0)
    const D = vec4(0.0, 0.5, 1.0, 2.0)
    
    // First corner
    const i = floor(v.add(dot(v, C.yyy)))
    const x0 = v.sub(i).add(dot(i, C.xxx))
    
    // Other corners
    const g = x0.yzx.greaterThanEqual(x0.xyz).select(vec3(1, 0, 0), vec3(0, 0, 0))
    const l = sub(1.0, g)
    const i1 = g.xyz.mul(l.zxy).add(g.zxy.mul(l.xyz)).greaterThan(0.0).select(vec3(1, 0, 0), vec3(0, 0, 0))
    const i2 = max(g.xyz, l.zxy)
    
    const x1 = x0.sub(i1).add(C.xxx)
    const x2 = x0.sub(i2).add(C.yyy)
    const x3 = x0.sub(D.yyy)
    
    // Permutations
    i.assign(i.sub(floor(i.mul(1.0 / 289.0)).mul(289.0)))
    const p = permute(permute(permute(i.z.add(vec4(0.0, i1.z, i2.z, 1.0))).add(i.y).add(vec4(0.0, i1.y, i2.y, 1.0))).add(i.x).add(vec4(0.0, i1.x, i2.x, 1.0)))
    
    // Gradients
    const ns = mul(1.0 / 7.0, D.wyz).sub(D.xzx)
    const j = p.sub(mul(49.0, floor(p.mul(ns.z).mul(ns.z))))
    const x_ = floor(j.mul(ns.z))
    const y_ = floor(j.sub(mul(7.0, x_)))
    const x = x_.mul(ns.x).add(ns.yyyy)
    const y = y_.mul(ns.x).add(ns.yyyy)
    const h = sub(1.0, abs(x)).sub(abs(y))
    const b0 = vec4(x.xy, y.xy)
    const b1 = vec4(x.zw, y.zw)
    const s0 = floor(b0).mul(2.0).add(1.0)
    const s1 = floor(b1).mul(2.0).add(1.0)
    const sh = h.lessThan(0.0).select(vec4(-1, -1, -1, -1), vec4(1, 1, 1, 1))
    const a0 = b0.xzyw.add(s0.xzyw.mul(sh.xxyy))
    const a1 = b1.xzyw.add(s1.xzyw.mul(sh.zzww))
    const p0 = vec3(a0.xy, h.x)
    const p1 = vec3(a0.zw, h.y)
    const p2 = vec3(a1.xy, h.z)
    const p3 = vec3(a1.zw, h.w)
    
    // Normalize gradients
    const norm = taylorInvSqrt(vec4(dot(p0, p0), dot(p1, p1), dot(p2, p2), dot(p3, p3)))
    p0.mulAssign(norm.x)
    p1.mulAssign(norm.y)
    p2.mulAssign(norm.z)
    p3.mulAssign(norm.w)
    
    // Mix final noise value
    const m = max(sub(0.6, vec4(dot(x0, x0), dot(x1, x1), dot(x2, x2), dot(x3, x3))), 0.0)
    m.assign(m.mul(m))
    
    return mul(42.0, dot(m.mul(m), vec4(dot(p0, x0), dot(p1, x1), dot(p2, x2), dot(p3, x3))))
  }
).setLayout({
  name: 'simplexNoise3d',
  type: 'float',
  inputs: [{ name: 'v', type: 'vec3' }],
})
