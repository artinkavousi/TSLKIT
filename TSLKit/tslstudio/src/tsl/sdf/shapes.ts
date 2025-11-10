/**
 * SDF Primitive Shapes
 * 
 * Signed Distance Field functions for various 2D and 3D geometric primitives
 * 
 * @module tsl/sdf/shapes
 */

import {
  Fn,
  length,
  min,
  max,
  abs,
  vec2,
  vec3,
  sqrt,
  sign,
  float,
  dot,
  If,
  clamp,
  select,
  mul,
  sub,
  add,
} from 'three/tsl'

/**
 * Sphere SDF
 * 
 * @param p - Point position (vec2 or vec3)
 * @param r - Radius (default: 0.0)
 * @returns Signed distance to sphere surface
 */
export const sdSphere = /*#__PURE__*/ Fn(
  ([_uv, r = float(0.0)]) => {
    const _r = float(r)
    return length(_uv).sub(_r)
  }
)

/**
 * 2D Box SDF
 * 
 * @param p - Point position (vec2)
 * @param size - Half-size of the box
 * @returns Signed distance to box surface
 */
export const sdBox2d = /*#__PURE__*/ Fn(
  ([_uv, _size = float(0.0)]) => {
    return max(abs(_uv.x), abs(_uv.y)).sub(_size)
  }
)

/**
 * 3D Box SDF
 * 
 * @param p - Point position (vec3)
 * @param b - Half-extents of the box (vec3)
 * @returns Signed distance to box surface
 */
export const sdBox3d = /*#__PURE__*/ Fn(
  ([p, b]) => {
    const q = abs(p).sub(b)
    return length(max(q, 0.0)).add(min(max(q.x, max(q.y, q.z)), 0.0))
  }
)

/**
 * Diamond SDF
 * 
 * @param p - Point position (vec2)
 * @param r - Radius
 * @returns Signed distance to diamond surface
 */
export const sdDiamond = /*#__PURE__*/ Fn(
  ([_uv, r = 0.0]) => {
    return abs(_uv.x).add(abs(_uv.y)).sub(r)
  }
)

/**
 * Regular Hexagon SDF
 * 
 * @param p - Point position (vec2)
 * @param r - Radius (default: 0.5)
 * @returns Signed distance to hexagon surface
 */
export const sdHexagon = /*#__PURE__*/ Fn(
  ([p = vec2(0), _r = 0.5]) => {
    const r = float(_r)
    const k = vec3(-0.866025404, 0.5, 0.577350269)
    
    const _p = abs(p).toVar()
    _p.subAssign(float(2.0).mul(min(dot(k.xy, _p), 0.0).mul(k.xy)))
    _p.subAssign(vec2(clamp(_p.x, k.z.negate().mul(r), k.z.mul(r)), r))
    
    return length(_p).mul(sign(_p.y))
  }
)

/**
 * Equilateral Triangle SDF
 * 
 * @param p - Point position (vec2)
 * @param r - Radius (default: 0.1)
 * @returns Signed distance to triangle surface
 */
export const sdEquilateralTriangle = /*#__PURE__*/ Fn(
  ([p = vec2(0), _r = float(0.1)]) => {
    const r = float(_r)
    const k = sqrt(3.0)
    const _p = p.toVar()
    
    _p.x = abs(_p.x).sub(r).toVar()
    _p.y = _p.y.add(r.div(k)).toVar()
    
    If(_p.x.add(k.mul(_p.y)).greaterThan(0), () => {
      _p.assign(vec2(_p.x.sub(k.mul(_p.y)), k.negate().mul(_p.x).sub(_p.y)).div(2))
    })
    
    _p.x.subAssign(clamp(_p.x, r.mul(-2), 0.0))
    return length(_p).negate().mul(sign(_p.y))
  }
)

/**
 * Line SDF
 * 
 * @param p - Coordinate (float)
 * @returns Signed distance to line
 */
export const sdLine = /*#__PURE__*/ Fn(
  ([p]) => {
    return abs(p)
  }
)

/**
 * Ring/Circle SDF
 * 
 * @param p - Point position (vec2)
 * @param s - Ring radius (default: 0.4)
 * @returns Signed distance to ring surface
 */
export const sdRing = /*#__PURE__*/ Fn(
  ([_uv, s = 0.4]) => {
    return abs(length(_uv).sub(s)).toVar()
  }
)

/**
 * Parallelogram SDF
 * 
 * @param p - Point position (vec2)
 * @param wi - Width
 * @param he - Height
 * @param sk - Skew
 * @returns Signed distance to parallelogram surface
 */
export const sdParallelogram = /*#__PURE__*/ Fn(
  ([_p, wi, he, sk]) => {
    const p = _p.toVar()
    const e = vec2(sk, he)
    
    p.assign(select(p.y.lessThan(0.0), p.negate(), p))
    
    const w = p.sub(e)
    w.x.subAssign(clamp(w.x, wi.negate(), wi))
    
    const d = vec2(dot(w, w), w.y.negate()).toVar()
    const s = p.x.mul(e.y).sub(p.y.mul(e.x))
    
    p.assign(select(s.lessThan(0.0), p.negate(), p))
    
    const v = p.sub(vec2(wi, 0)).toVar()
    
    v.subAssign(e.mul(clamp(dot(v, e).div(dot(e, e)), -1.0, 1.0)))
    d.assign(min(d, vec2(dot(v, v), wi.mul(he).sub(abs(s)))))
    
    return sqrt(d.x).mul(sign(d.y.negate()))
  }
)

/**
 * Helper for rhombus SDF calculation
 */
const ndot = /*#__PURE__*/ Fn(
  ([a, b]) => {
    return a.x.mul(b.x).sub(a.y.mul(b.y))
  }
)

/**
 * Rhombus SDF
 * 
 * @param p - Point position (vec2)
 * @param b - Size (vec2)
 * @returns Signed distance to rhombus surface
 */
export const sdRhombus = /*#__PURE__*/ Fn(
  ([_p, b]) => {
    const p = _p.toVar()
    p.assign(abs(p))
    const h = clamp(ndot(b.sub(mul(2.0, p)), b).div(dot(b, b)), -1.0, 1.0)
    const d = length(p.sub(mul(0.5, b).mul(vec2(sub(1.0, h), add(1.0, h)))))
    
    return d.mul(sign(p.x.mul(b.y).add(p.y.mul(b.x).sub(b.x.mul(b.y)))))
  }
)

/**
 * Triangle SDF
 * 
 * @param p - Point position (vec2)
 * @param size - Size of the triangle
 * @returns Signed distance to triangle surface
 */
export const sdTriangle = /*#__PURE__*/ Fn(
  ([_p, size]) => {
    const t = max(abs(_p.x.mul(size)).add(_p.y), abs(_p.y.mul(size).sub(0.5)).sub(0.5))
    return t
  }
)
