/**
 * Coordinate System Utilities
 *
 * @author Maxime Heckel
 * @source https://github.com/MaximeHeckel/fragments-boilerplate
 * @license MIT
 * @version Ported to Three.js r181+
 *
 * Utilities for coordinate transformations and gradient computations.
 *
 * Includes:
 * - Bilinear gradient interpolation
 * - Cartesian ↔ Polar coordinate conversion
 */
import { vec4, float, vec2, length, If, Fn, mix, clamp, smoothstep, mul, sqrt, abs, atan, cos, sin } from 'three/tsl';
/**
 * Computes a bilinear gradient between four colors using barycentric coordinates
 *
 * @param _st - UV coordinates for the gradient (vec2)
 * @param color1 - First color (top-left) (vec3)
 * @param color2 - Second color (top-right) (vec3)
 * @param color3 - Third color (bottom-left) (vec3)
 * @param color4 - Fourth color (bottom-right) (vec3)
 * @returns Interpolated color based on the four corner colors (vec4)
 *
 * @example
 * ```typescript
 * import { grad } from '@tslstudio/tsl-kit/utils'
 * import { uv, vec3 } from 'three/tsl'
 *
 * const gradient = grad(
 *   uv(),
 *   vec3(1, 0, 0), // Red
 *   vec3(0, 1, 0), // Green
 *   vec3(0, 0, 1), // Blue
 *   vec3(1, 1, 0)  // Yellow
 * )
 * ```
 */
export const grad = /*#__PURE__*/ Fn(([_st, color1, color2, color3, color4]) => {
    // Compute a bilinear gradient between four colors
    const _uv = vec2(_st).toVar();
    const _color0 = vec4(color1, 1.0).toVar();
    const _color1 = vec4(color2, 1.0).toVar();
    const _color2 = vec4(color3, 1.0).toVar();
    const _color3 = vec4(color4, 1.0).toVar();
    const P0 = vec2(0.31, 0.3).toVar();
    const P1 = vec2(0.7, 0.32).toVar();
    const P2 = vec2(0.28, 0.71).toVar();
    const P3 = vec2(0.72, 0.75).toVar();
    const Q = vec2(P0.sub(P2)).toVar();
    const R = vec2(P1.sub(P0)).toVar();
    const S = vec2(R.add(P2.sub(P3))).toVar();
    const T = vec2(P0.sub(_uv)).toVar();
    const u = float().toVar();
    const t = float().toVar();
    If(Q.x.equal(0.0).and(S.x.equal(0.0)), () => {
        u.assign(T.x.negate().div(R.x));
        t.assign(T.y.add(u.mul(R.y)).div(Q.y.add(u.mul(S.y))));
    })
        .ElseIf(Q.y.equal(0.0).and(S.y.equal(0.0)), () => {
        u.assign(T.y.negate().div(R.y));
        t.assign(T.x.add(u.mul(R.x)).div(Q.x.add(u.mul(S.x))));
    })
        .Else(() => {
        const A = float(S.x.mul(R.y).sub(R.x.mul(S.y))).toVar();
        const B = float(S.x
            .mul(T.y)
            .sub(T.x.mul(S.y))
            .add(Q.x.mul(R.y).sub(R.x.mul(Q.y)))).toVar();
        const C = float(Q.x.mul(T.y).sub(T.x.mul(Q.y))).toVar();
        If(abs(A).lessThan(0.0001), () => {
            u.assign(C.negate().div(B));
        }).Else(() => {
            u.assign(B.negate()
                .add(sqrt(B.mul(B).sub(mul(4.0, A).mul(C))))
                .div(mul(2.0, A)));
        });
        t.assign(T.y.add(u.mul(R.y)).div(Q.y.add(u.mul(S.y))));
    });
    u.assign(clamp(u, 0.0, 1.0));
    t.assign(clamp(t, 0.0, 1.0));
    t.assign(smoothstep(0.0, 1.0, t));
    u.assign(smoothstep(0.0, 1.0, u));
    const colorA = vec4(mix(_color0, _color1, u)).toVar();
    const colorB = vec4(mix(_color2, _color3, u)).toVar();
    return mix(colorA, colorB, t);
});
/**
 * Converts Cartesian coordinates to polar coordinates
 *
 * @param _p - 2D Cartesian coordinates (x, y) (vec2)
 * @returns Polar coordinates (radius, angle) where angle is in radians (vec2)
 *
 * @example
 * ```typescript
 * import { cartesianToPolar } from '@tslstudio/tsl-kit/utils'
 * import { vec2, uv } from 'three/tsl'
 *
 * const centered = uv().sub(vec2(0.5))
 * const polar = cartesianToPolar(centered)
 * const radius = polar.x
 * const angle = polar.y
 * ```
 */
export const cartesianToPolar = /*#__PURE__*/ Fn(([_p]) => {
    const r = length(_p);
    const theta = atan(_p.y, _p.x);
    return vec2(r, theta);
});
/**
 * Converts polar coordinates to Cartesian coordinates
 *
 * @param _p - Polar coordinates (radius, angle) where angle is in radians (vec2)
 * @returns Cartesian coordinates (x, y) (vec2)
 *
 * @example
 * ```typescript
 * import { polarToCartesian } from '@tslstudio/tsl-kit/utils'
 * import { vec2, float } from 'three/tsl'
 *
 * const polar = vec2(1.0, angle) // Unit circle at angle
 * const cartesian = polarToCartesian(polar)
 * ```
 */
export const polarToCartesian = /*#__PURE__*/ Fn(([_p]) => {
    const polar = vec2(_p).toVar();
    const r = float(polar.x).toVar();
    const theta = float(polar.y).toVar();
    return vec2(r.mul(cos(theta)), r.mul(sin(theta)));
});
//# sourceMappingURL=coordinates.js.map