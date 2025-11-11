/**
 * Voronoi (Cellular) Noise
 *
 * Voronoi/cellular noise implementation that creates cell-like patterns.
 * Useful for procedural textures like stone, water caustics, organic patterns, and Voronoi diagrams.
 *
 * @module noise/voronoi
 * @category Noise
 * @source portfolio-main (Maxime Heckel)
 * @author Maxime Heckel
 * @license MIT
 * @version r172 → r181
 */
import { Fn, If, Loop, add, dot, float, floor, fract, int, length, mul, overloadingFn, sin, vec2, vec3, vec4, } from 'three/tsl';
const TAU = 6.283185307179586476925286766559;
const RANDOM_SCALE = vec4(0.1031, 0.103, 0.0973, 0.1099);
/**
 * Random 2D vector generator
 * @internal
 */
export const random2 = /*#__PURE__*/ Fn(([p_immutable]) => {
    const p = vec2(p_immutable).toVar();
    const p3 = vec3(fract(p.xyx.mul(RANDOM_SCALE.xyz))).toVar();
    p3.addAssign(dot(p3, p3.yzx.add(19.19)));
    return fract(p3.xx.add(p3.yz).mul(p3.zy));
}).setLayout({
    name: 'random2',
    type: 'vec2',
    inputs: [{ name: 'p', type: 'vec2' }],
});
/**
 * Time-varying random function for animated Voronoi
 * @internal
 */
export const VORONOI_RANDOM_FNC = /*#__PURE__*/ Fn(([UV_immutable, time_immutable]) => {
    const UV = vec2(UV_immutable).toVar();
    const time = float(time_immutable).toVar();
    return add(0.5, mul(0.5, sin(time.add(float(TAU).mul(random2(UV))))));
}).setLayout({
    name: 'VORONOI_RANDOM_FNC',
    type: 'vec2',
    inputs: [
        { name: 'UV', type: 'vec2' },
        { name: 'time', type: 'float' },
    ],
});
/**
 * Core Voronoi implementation with time parameter
 * @internal
 */
export const voronoi_0 = /*#__PURE__*/ Fn(([uv_immutable, time_immutable]) => {
    const time = float(time_immutable).toVar();
    const uv = vec2(uv_immutable).toVar();
    const i_uv = vec2(floor(uv)).toVar();
    const f_uv = vec2(fract(uv)).toVar();
    const rta = vec3(0.0, 0.0, 10.0).toVar();
    Loop({ start: int(-1), end: int(1), name: 'j', condition: '<=' }, ({ j }) => {
        Loop({ start: int(-1), end: int(1), condition: '<=' }, ({ i }) => {
            const neighbor = vec2(float(i), float(j)).toVar();
            const point = vec2(VORONOI_RANDOM_FNC(i_uv.add(neighbor), time)).toVar();
            point.assign(vec2(add(0.5, mul(0.5, sin(time.add(float(TAU).mul(point)))))));
            const diff = vec2(neighbor.add(point.sub(f_uv))).toVar();
            const dist = float(length(diff)).toVar();
            If(dist.lessThan(rta.z), () => {
                rta.xy.assign(point);
                rta.z.assign(dist);
            });
        });
    });
    return rta;
}).setLayout({
    name: 'voronoi_0',
    type: 'vec3',
    inputs: [
        { name: 'uv', type: 'vec2' },
        { name: 'time', type: 'float' },
    ],
});
/**
 * Static Voronoi (2D input, no time)
 * @internal
 */
export const voronoi_1 = /*#__PURE__*/ Fn(([p_immutable]) => {
    const p = vec2(p_immutable).toVar();
    return voronoi_0(p, 0.0);
}).setLayout({
    name: 'voronoi_1',
    type: 'vec3',
    inputs: [{ name: 'p', type: 'vec2' }],
});
/**
 * Animated Voronoi (3D input: xy = position, z = time)
 * @internal
 */
export const voronoi_2 = /*#__PURE__*/ Fn(([p_immutable]) => {
    const p = vec3(p_immutable).toVar();
    return voronoi_0(p.xy, p.z);
}).setLayout({
    name: 'voronoi_2',
    type: 'vec3',
    inputs: [{ name: 'p', type: 'vec3' }],
});
/**
 * Voronoi (Cellular) Noise
 *
 * Creates cellular/Voronoi patterns by finding the closest random point in space.
 * Returns a vec3 containing (pointX, pointY, distance).
 *
 * **Overloads:**
 * - `voronoi(vec2)` - Static 2D Voronoi
 * - `voronoi(vec3)` - Animated Voronoi (xy = pos, z = time)
 *
 * @param p - Input position (vec2 for static, vec3 for animated with time)
 * @returns vec3(cellPointX, cellPointY, distanceToClosestPoint)
 *
 * @example
 * ```typescript
 * import { voronoi } from '@tslstudio/tsl-kit/noise';
 * import { uv, uniform } from 'three/tsl';
 *
 * // Static Voronoi pattern
 * const cell = voronoi(uv().mul(8.0));
 * const pattern = cell.z; // Distance field
 *
 * // Animated Voronoi
 * const time = uniform(0);
 * const animatedCell = voronoi(vec3(uv().mul(5.0), time));
 * const distanceField = animatedCell.z;
 *
 * // Cell coloring
 * const cellColor = vec3(cell.xy, 0.5);
 * ```
 */
export const voronoi = /*#__PURE__*/ overloadingFn([voronoi_1, voronoi_2]);
//# sourceMappingURL=voronoi.js.map