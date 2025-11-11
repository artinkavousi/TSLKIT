/**
 * SDF Primitive Shapes
 *
 * @author Maxime Heckel
 * @source https://github.com/MaximeHeckel/fragments-boilerplate
 * @license MIT
 * @version Ported to Three.js r181+
 *
 * Signed Distance Field functions for various 2D and 3D primitive shapes.
 * Based on Inigo Quilez's SDF library: https://iquilezles.org/articles/distfunctions/
 *
 * All functions return signed distance where:
 * - Negative values = inside shape
 * - Positive values = outside shape
 * - Zero = on surface
 */
import { Fn, length, min, max, abs, vec2, sqrt, sign, float, dot, vec3, If, clamp, select, mul, sub, add, } from 'three/tsl';
/**
 * Sphere SDF (2D circle or 3D sphere)
 * @param _uv - Position (vec2 or vec3)
 * @param r - Radius (float, default: 0.0)
 * @returns Signed distance (float)
 */
export const sdSphere = /*#__PURE__*/ Fn(([_uv, r = float(0.0)]) => {
    const _r = float(r);
    return length(_uv).sub(_r);
});
/**
 * 2D Box SDF (square or rectangle)
 * @param _uv - Position (vec2)
 * @param _size - Half-size (extent) along each axis (float, default: 0.0)
 * @returns Signed distance (float)
 */
export const sdBox2d = /*#__PURE__*/ Fn(([_uv, _size = float(0.0)]) => {
    return max(abs(_uv.x), abs(_uv.y)).sub(_size);
});
/**
 * 3D Box SDF (cube or box)
 * @param p - Position (vec3)
 * @param b - Half-extents (vec3)
 * @returns Signed distance (float)
 */
export const sdBox3d = /*#__PURE__*/ Fn(([p, b]) => {
    const q = abs(p).sub(b);
    return length(max(q, 0.0)).add(min(max(q.x, max(q.y, q.z)), 0.0));
});
/**
 * Diamond SDF (rotated square)
 * @param _uv - Position (vec2)
 * @param r - Radius (float, default: 0.0)
 * @returns Signed distance (float)
 */
export const sdDiamond = /*#__PURE__*/ Fn(([_uv, r = 0.0]) => {
    return abs(_uv.x).add(abs(_uv.y)).sub(r);
});
/**
 * Regular Hexagon SDF
 * @param p - Position (vec2, default: vec2(0))
 * @param _r - Radius (float, default: 0.5)
 * @returns Signed distance (float)
 */
export const sdHexagon = /*#__PURE__*/ Fn(([p = vec2(0), _r = 0.5]) => {
    const r = float(_r);
    const k = vec3(-0.866025404, 0.5, 0.577350269);
    const _p = abs(p).toVar();
    _p.subAssign(float(2.0).mul(min(dot(k.xy, _p), 0.0).mul(k.xy)));
    _p.subAssign(vec2(clamp(_p.x, k.z.negate().mul(r), k.z.mul(r)), r));
    return length(_p).mul(sign(_p.y));
});
/**
 * Equilateral Triangle SDF
 * @param p - Position (vec2, default: vec2(0))
 * @param _r - Radius (float, default: 0.1)
 * @returns Signed distance (float)
 */
export const sdEquilateralTriangle = /*#__PURE__*/ Fn(([p = vec2(0), _r = float(0.1)]) => {
    const r = float(_r);
    const k = sqrt(3.0);
    const _p = p.toVar();
    _p.x = abs(_p.x).sub(r).toVar();
    _p.y = _p.y.add(r.div(k)).toVar();
    If(_p.x.add(k.mul(_p.y)).greaterThan(0), () => {
        _p.assign(vec2(_p.x.sub(k.mul(_p.y)), k.negate().mul(_p.x).sub(_p.y)).div(2));
    });
    _p.x.subAssign(clamp(_p.x, r.mul(-2), 0.0));
    return length(_p).negate().mul(sign(_p.y));
});
/**
 * Line SDF (distance to vertical line at x=0)
 * @param p - Position coordinate (float)
 * @returns Signed distance (float)
 */
export const sdLine = /*#__PURE__*/ Fn(([p]) => {
    return abs(p);
});
/**
 * Ring SDF (annulus/hollow circle)
 * @param _uv - Position (vec2)
 * @param s - Radius (float, default: 0.4)
 * @returns Signed distance (float)
 */
export const sdRing = /*#__PURE__*/ Fn(([_uv, s = 0.4]) => {
    return abs(length(_uv).sub(s)).toVar();
});
/**
 * Parallelogram SDF
 * @param _p - Position (vec2)
 * @param wi - Width (float)
 * @param he - Height (float)
 * @param sk - Skew (float)
 * @returns Signed distance (float)
 */
export const sdParallelogram = /*#__PURE__*/ Fn(([_p, wi, he, sk]) => {
    const p = _p.toVar();
    const e = vec2(sk, he);
    p.assign(select(p.y.lessThan(0.0), p.negate(), p));
    const w = p.sub(e);
    w.x.subAssign(clamp(w.x, wi.negate(), wi));
    const d = vec2(dot(w, w), w.y.negate()).toVar();
    const s = p.x.mul(e.y).sub(p.y.mul(e.x));
    p.assign(select(s.lessThan(0.0), p.negate(), p));
    const v = p.sub(vec2(wi, 0)).toVar();
    v.subAssign(e.mul(clamp(dot(v, e).div(dot(e, e)), -1.0, 1.0)));
    d.assign(min(d, vec2(dot(v, v), wi.mul(he).sub(abs(s)))));
    return sqrt(d.x).mul(sign(d.y.negate()));
});
/**
 * Helper function for rhombus: negative dot product
 */
const ndot = /*#__PURE__*/ Fn(([a, b]) => {
    return a.x.mul(b.x).sub(a.y.mul(b.y));
});
/**
 * Rhombus SDF
 * @param _p - Position (vec2)
 * @param b - Size (vec2)
 * @returns Signed distance (float)
 */
export const sdRhombus = /*#__PURE__*/ Fn(([_p, b]) => {
    const p = _p.toVar();
    p.assign(abs(p));
    const h = clamp(ndot(b.sub(mul(2.0, p)), b).div(dot(b, b)), -1.0, 1.0);
    const d = length(p.sub(mul(0.5, b).mul(vec2(sub(1.0, h), add(1.0, h)))));
    return d.mul(sign(p.x.mul(b.y).add(p.y.mul(b.x).sub(b.x.mul(b.y)))));
});
/**
 * Triangle SDF (general)
 * @param _p - Position (vec2)
 * @param size - Size multiplier (float)
 * @returns Signed distance (float)
 */
export const sdTriangle = /*#__PURE__*/ Fn(([_p, size]) => {
    const t = max(abs(_p.x.mul(size)).add(_p.y), abs(_p.y.mul(size).sub(0.5)).sub(0.5));
    return t;
});
//# sourceMappingURL=shapes.js.map