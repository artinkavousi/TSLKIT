/**
 * 3D Perlin Noise
 *
 * @author Maxime Heckel (original), Ken Perlin (algorithm)
 * @source https://github.com/MaximeHeckel/fragments-boilerplate
 * @license MIT
 * @version Ported to Three.js r181+
 *
 * Classic Perlin noise implementation in 3D.
 * Provides smooth, continuous noise with good spectral characteristics.
 *
 * @param P - 3D input coordinate (vec3)
 * @returns Noise value in range [-1, 1] (float)
 *
 * @example
 * ```typescript
 * import { perlinNoise3d } from '@tslstudio/tsl-kit/noise'
 * import { vec3, uv } from 'three/tsl'
 *
 * const noise = perlinNoise3d(vec3(uv().mul(5.0), time))
 * material.roughnessNode = noise.add(1.0).mul(0.5) // Remap to [0,1]
 * ```
 */
import { vec3, floor, Fn, vec4, mul, fract, abs, step, dot, float, mix, vec2 } from 'three/tsl';
import { mod289, permute, taylorInvSqrt, fade } from './common';
export const perlinNoise3d = /*#__PURE__*/ Fn(([P_immutable]) => {
    const P = vec3(P_immutable).toVar();
    const Pi0 = vec3(floor(P)).toVar();
    const Pi1 = vec3(Pi0.add(vec3(1.0))).toVar();
    Pi0.assign(mod289(Pi0));
    Pi1.assign(mod289(Pi1));
    const Pf0 = vec3(fract(P)).toVar();
    const Pf1 = vec3(Pf0.sub(vec3(1.0))).toVar();
    const ix = vec4(Pi0.x, Pi1.x, Pi0.x, Pi1.x).toVar();
    const iy = vec4(Pi0.yy, Pi1.yy).toVar();
    const iz0 = vec4(Pi0.zzzz).toVar();
    const iz1 = vec4(Pi1.zzzz).toVar();
    const ixy = vec4(permute(permute(ix).add(iy))).toVar();
    const ixy0 = vec4(permute(ixy.add(iz0))).toVar();
    const ixy1 = vec4(permute(ixy.add(iz1))).toVar();
    let gx0 = vec4(ixy0.mul(1.0 / 7.0)).toVar();
    let gy0 = vec4(fract(floor(gx0).mul(1.0 / 7.0)).sub(0.5)).toVar();
    gx0 = fract(gx0).toVar();
    const gz0 = vec4(vec4(0.5).sub(abs(gx0)).sub(abs(gy0))).toVar();
    const sz0 = vec4(step(gz0, vec4(0.0))).toVar();
    gx0 = gx0.sub(sz0.mul(step(0.0, gx0).sub(0.5))).toVar();
    gy0 = gy0.sub(sz0.mul(step(0.0, gy0).sub(0.5))).toVar();
    let gx1 = vec4(ixy1.mul(1.0 / 7.0)).toVar();
    let gy1 = vec4(fract(floor(gx1).mul(1.0 / 7.0)).sub(0.5)).toVar();
    gx1 = fract(gx1).toVar();
    const gz1 = vec4(vec4(0.5).sub(abs(gx1)).sub(abs(gy1))).toVar();
    const sz1 = vec4(step(gz1, vec4(0.0))).toVar();
    gx1 = gx1.sub(sz1.mul(step(0.0, gx1).sub(0.5))).toVar();
    gy1 = gy1.sub(sz1.mul(step(0.0, gy1).sub(0.5))).toVar();
    let g000 = vec3(gx0.x, gy0.x, gz0.x).toVar();
    let g100 = vec3(gx0.y, gy0.y, gz0.y).toVar();
    let g010 = vec3(gx0.z, gy0.z, gz0.z).toVar();
    let g110 = vec3(gx0.w, gy0.w, gz0.w).toVar();
    let g001 = vec3(gx1.x, gy1.x, gz1.x).toVar();
    let g101 = vec3(gx1.y, gy1.y, gz1.y).toVar();
    let g011 = vec3(gx1.z, gy1.z, gz1.z).toVar();
    let g111 = vec3(gx1.w, gy1.w, gz1.w).toVar();
    const norm0 = vec4(taylorInvSqrt(vec4(dot(g000, g000), dot(g010, g010), dot(g100, g100), dot(g110, g110)))).toVar();
    g000 = g000.mul(norm0.x).toVar();
    g010 = g010.mul(norm0.y).toVar();
    g100 = g100.mul(norm0.z).toVar();
    g110 = g110.mul(norm0.w).toVar();
    const norm1 = vec4(taylorInvSqrt(vec4(dot(g001, g001), dot(g011, g011), dot(g101, g101), dot(g111, g111)))).toVar();
    g001 = g001.mul(norm1.x).toVar();
    g011 = g011.mul(norm1.y).toVar();
    g101 = g101.mul(norm1.z).toVar();
    g111 = g111.mul(norm1.w).toVar();
    const n000 = float(dot(g000, Pf0)).toVar();
    const n100 = float(dot(g100, vec3(Pf1.x, Pf0.yz))).toVar();
    const n010 = float(dot(g010, vec3(Pf0.x, Pf1.y, Pf0.z))).toVar();
    const n110 = float(dot(g110, vec3(Pf1.xy, Pf0.z))).toVar();
    const n001 = float(dot(g001, vec3(Pf0.xy, Pf1.z))).toVar();
    const n101 = float(dot(g101, vec3(Pf1.x, Pf0.y, Pf1.z))).toVar();
    const n011 = float(dot(g011, vec3(Pf0.x, Pf1.yz))).toVar();
    const n111 = float(dot(g111, Pf1)).toVar();
    const fade_xyz = vec3(fade(Pf0)).toVar();
    const n_z = vec4(mix(vec4(n000, n100, n010, n110), vec4(n001, n101, n011, n111), fade_xyz.z)).toVar();
    const n_yz = vec2(mix(n_z.xy, n_z.zw, fade_xyz.y)).toVar();
    const n_xyz = float(mix(n_yz.x, n_yz.y, fade_xyz.x)).toVar();
    return mul(2.2, n_xyz);
}).setLayout({
    name: 'perlinNoise3d',
    type: 'float',
    inputs: [{ name: 'P', type: 'vec3' }],
});
//# sourceMappingURL=perlinNoise3d.js.map