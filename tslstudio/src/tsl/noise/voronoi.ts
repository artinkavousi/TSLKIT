/**
 * Voronoi Noise
 * 
 * Cellular noise pattern based on distance to nearest random point
 * 
 * @module tsl/noise/voronoi
 */

import {
  Fn,
  If,
  Loop,
  add,
  dot,
  float,
  floor,
  fract,
  int,
  length,
  mul,
  overloadingFn,
  sin,
  vec2,
  vec3,
  vec4,
} from 'three/tsl'

const TAU = 6.283185307179586476925286766559
const RANDOM_SCALE = vec4(0.1031, 0.103, 0.0973, 0.1099)

/**
 * Generate 2D random vector from 2D input
 */
const random2 = /*#__PURE__*/ Fn(
  ([p_immutable]) => {
    const p = vec2(p_immutable).toVar()
    const p3 = vec3(fract(p.xyx.mul(RANDOM_SCALE.xyz))).toVar()
    p3.addAssign(dot(p3, p3.yzx.add(19.19)))
    
    return fract(p3.xx.add(p3.yz).mul(p3.zy))
  }
).setLayout({
  name: 'random2',
  type: 'vec2',
  inputs: [{ name: 'p', type: 'vec2' }],
})

/**
 * Voronoi random function with time
 */
const voronoiRandomFnc = /*#__PURE__*/ Fn(
  ([UV_immutable, time_immutable]) => {
    const UV = vec2(UV_immutable).toVar()
    const time = float(time_immutable).toVar()
    
    return add(0.5, mul(0.5, sin(time.add(mul(TAU, random2(UV))))))
  }
).setLayout({
  name: 'voronoiRandomFnc',
  type: 'vec2',
  inputs: [
    { name: 'UV', type: 'vec2' },
    { name: 'time', type: 'float' },
  ],
})

/**
 * Core Voronoi implementation with time parameter
 */
const voronoi0 = /*#__PURE__*/ Fn(
  ([uv_immutable, time_immutable]) => {
    const time = float(time_immutable).toVar()
    const uv = vec2(uv_immutable).toVar()
    const i_uv = vec2(floor(uv)).toVar()
    const f_uv = vec2(fract(uv)).toVar()
    const rta = vec3(0.0, 0.0, 10.0).toVar()
    
    Loop({ start: int(-1), end: int(1), name: 'j', condition: '<=' }, ({ i: loopVars }) => {
      const j = loopVars
      Loop({ start: int(-1), end: int(1), condition: '<=' }, ({ i }) => {
        const neighbor = vec2(float(i), float(j)).toVar()
        const point = vec2(voronoiRandomFnc(i_uv.add(neighbor), time)).toVar()
        point.assign(vec2(add(0.5, mul(0.5, sin(time.add(mul(TAU, point)))))))
        const diff = vec2(neighbor.add(point.sub(f_uv))).toVar()
        const dist = float(length(diff)).toVar()
        
        If(dist.lessThan(rta.z), () => {
          rta.xy.assign(point)
          rta.z.assign(dist)
        })
      })
    })
    
    return rta
  }
).setLayout({
  name: 'voronoi0',
  type: 'vec3',
  inputs: [
    { name: 'uv', type: 'vec2' },
    { name: 'time', type: 'float' },
  ],
})

/**
 * Voronoi noise (2D, static)
 * 
 * @param p - 2D position
 * @returns vec3(point.xy, distance)
 */
const voronoi1 = /*#__PURE__*/ Fn(
  ([p_immutable]) => {
    const p = vec2(p_immutable).toVar()
    return voronoi0(p, 0.0)
  }
).setLayout({
  name: 'voronoi1',
  type: 'vec3',
  inputs: [{ name: 'p', type: 'vec2' }],
})

/**
 * Voronoi noise (3D with time parameter)
 * 
 * @param p - vec3(uv.xy, time)
 * @returns vec3(point.xy, distance)
 */
const voronoi2 = /*#__PURE__*/ Fn(
  ([p_immutable]) => {
    const p = vec3(p_immutable).toVar()
    return voronoi0(p.xy, p.z)
  }
).setLayout({
  name: 'voronoi2',
  type: 'vec3',
  inputs: [{ name: 'p', type: 'vec3' }],
})

/**
 * Voronoi Noise
 * 
 * Cellular/Worley noise pattern
 * Returns nearest feature point and distance
 * 
 * @overload
 * @param p - 2D position (vec2)
 * @returns vec3(point.xy, distance) - nearest point and distance to it
 * 
 * @overload
 * @param p - 3D position (vec3) where z = time
 * @returns vec3(point.xy, distance) - animated nearest point and distance
 * 
 * @example
 * ```typescript
 * // Static voronoi
 * const result = voronoi(uv)
 * const distance = result.z
 * 
 * // Animated voronoi
 * const animated = voronoi(vec3(uv, time))
 * ```
 */
export const voronoi = /*#__PURE__*/ overloadingFn([voronoi1, voronoi2])
