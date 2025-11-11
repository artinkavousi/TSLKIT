/**
 * Simplex Noise 2D
 * 
 * 2D simplex noise implementation providing smooth, natural-looking noise patterns.
 * Faster than Perlin noise and has better visual characteristics with no directional artifacts.
 * 
 * @module noise/simplexNoise2d
 * @category Noise
 * @source portfolio-main (Maxime Heckel)
 * @author Maxime Heckel
 * @license MIT
 * @version r170 → r181
 */

import { Fn, abs, dot, floor, fract, max, mod, mul, select, sub, vec2, vec3, vec4, ShaderNodeObject, Node } from 'three/tsl';

/**
 * Permutation helper for noise generation
 * @internal
 */
export const permute2d = /*#__PURE__*/ Fn(([x_immutable]) => {
    const x = vec3(x_immutable).toVar();
    return mod(x.mul(34.0).add(1.0).mul(x), 289.0);
}).setLayout({
    name: 'permute2d',
    type: 'vec3',
    inputs: [{ name: 'x', type: 'vec3' }],
});

/**
 * 2D Simplex Noise
 * 
 * Generates coherent noise values in the range [-1, 1] based on 2D input coordinates.
 * 
 * @param v - 2D input position (vec2)
 * @returns Noise value in range [-1, 1] (float)
 * 
 * @example
 * ```typescript
 * import { simplexNoise2d } from '@tslstudio/tsl-kit/noise';
 * import { uv } from 'three/tsl';
 * 
 * // Basic usage
 * const noise = simplexNoise2d(uv().mul(5.0));
 * 
 * // Animated noise
 * const animatedNoise = simplexNoise2d(uv().mul(scale).add(time));
 * ```
 */
export const simplexNoise2d = /*#__PURE__*/ Fn<[ShaderNodeObject<Node>]>(([v_immutable]) => {
    const v = vec2(v_immutable).toVar();
    const C = vec4(0.211324865405187, 0.366025403784439, -0.577350269189626, 0.024390243902439);
    const i = vec2(floor(v.add(dot(v, C.yy)))).toVar();
    const x0 = vec2(v.sub(i).add(dot(i, C.xx))).toVar();
    const i1 = select(x0.x.greaterThan(x0.y), vec2(1.0, 0.0), vec2(0.0, 1.0)).toVar();
    const x12 = vec4(x0.xyxy.add(C.xxzz)).toVar();
    const x12_xy = x12.xy.sub(i1).toVar();
    const x12_zw = x12.zw.toVar();
    i.assign(mod(i, 289.0));
    const p = vec3(
        permute2d(
            permute2d(i.y.add(vec3(0.0, i1.y, 1.0)))
                .add(i.x)
                .add(vec3(0.0, i1.x, 1.0)),
        ),
    ).toVar();
    let m = vec3(max(sub(0.5, vec3(dot(x0, x0), dot(x12_xy, x12_xy), dot(x12_zw, x12_zw))), 0.0)).toVar();
    m = m.mul(m).toVar();
    m = m.mul(m).toVar();
    const x = vec3(mul(2.0, fract(p.mul(C.www))).sub(1.0)).toVar();
    const h = vec3(abs(x).sub(0.5)).toVar();
    const ox = vec3(floor(x.add(0.5))).toVar();
    const a0 = vec3(x.sub(ox)).toVar();
    m = m.mul(sub(1.79284291400159, mul(0.85373472095314, a0.mul(a0).add(h.mul(h))))).toVar();
    const g_x = a0.x.mul(x0.x).add(h.x.mul(x0.y)).toVar();
    const g_yz = a0.yz.mul(x12_xy).add(h.yz.mul(x12_zw)).toVar();
    const g = vec3(g_x, g_yz.x, g_yz.y).toVar();

    return mul(130.0, dot(m, g));
}).setLayout({
    name: 'simplexNoise2d',
    type: 'float',
    inputs: [{ name: 'v', type: 'vec2' }],
});

