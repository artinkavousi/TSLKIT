import {
  Fn,
  If,
  Loop,
  Node,
  ShaderNodeObject,
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
  vec4
} from 'three/tsl';

import { TWO_PI } from './common.js';

const RANDOM_SCALE = vec4(0.1031, 0.103, 0.0973, 0.1099);

const random2 = /*#__PURE__*/ Fn(([pInput]) => {
  const p = vec2(pInput).toVar();
  const p3 = vec3(fract(p.xyx.mul(RANDOM_SCALE.xyz))).toVar();
  p3.addAssign(dot(p3, p3.yzx.add(19.19)));

  return fract(p3.xx.add(p3.yz).mul(p3.zy));
}).setLayout({
  name: 'random2',
  type: 'vec2',
  inputs: [{ name: 'p', type: 'vec2' }]
});

const animatedHash = /*#__PURE__*/ Fn(([uvInput, timeInput]) => {
  const uv = vec2(uvInput).toVar();
  const time = float(timeInput).toVar();

  return add(0.5, mul(0.5, sin(time.add(TWO_PI.mul(random2(uv))))));
}).setLayout({
  name: 'voronoiRandom',
  type: 'vec2',
  inputs: [
    { name: 'uv', type: 'vec2' },
    { name: 'time', type: 'float' }
  ]
});

const voronoi2 = /*#__PURE__*/ Fn(([uvInput, timeInput]) => {
  const time = float(timeInput).toVar();
  const uv = vec2(uvInput).toVar();
  const cell = vec2(floor(uv)).toVar();
  const fractional = vec2(fract(uv)).toVar();
  const result = vec3(0.0, 0.0, 10.0).toVar();

  Loop({ start: int(-1), end: int(1), name: 'j', condition: '<=' }, ({ j }) => {
    Loop({ start: int(-1), end: int(1), condition: '<=' }, ({ i }) => {
      const neighbor = vec2(float(i), float(j)).toVar();
      const point = vec2(animatedHash(cell.add(neighbor), time)).toVar();
      point.assign(add(0.5, mul(0.5, sin(time.add(TWO_PI.mul(point))))));
      const diff = vec2(neighbor.add(point.sub(fractional))).toVar();
      const distance = float(length(diff)).toVar();

      If(distance.lessThan(result.z), () => {
        result.xy.assign(point);
        result.z.assign(distance);
      });
    });
  });

  return result;
}).setLayout({
  name: 'voronoiBase',
  type: 'vec3',
  inputs: [
    { name: 'uv', type: 'vec2' },
    { name: 'time', type: 'float' }
  ]
});

const voronoiFromVec2 = /*#__PURE__*/ Fn(([pInput]) => {
  return voronoi2(vec2(pInput), 0.0);
}).setLayout({
  name: 'voronoi2d',
  type: 'vec3',
  inputs: [{ name: 'p', type: 'vec2' }]
});

const voronoiFromVec3 = /*#__PURE__*/ Fn(([pInput]) => {
  const p = vec3(pInput).toVar();
  return voronoi2(p.xy, p.z);
}).setLayout({
  name: 'voronoi3d',
  type: 'vec3',
  inputs: [{ name: 'p', type: 'vec3' }]
});

export const voronoi = /*#__PURE__*/ overloadingFn([voronoiFromVec2, voronoiFromVec3]);

export const voronoiDistance = /*#__PURE__*/ Fn<ShaderNodeObject<Node>>(([pInput]) => {
  const p = vec3(pInput).toVar();
  return voronoi(p).z;
}).setLayout({
  name: 'voronoiDistance',
  type: 'float',
  inputs: [{ name: 'p', type: 'vec3' }]
});
