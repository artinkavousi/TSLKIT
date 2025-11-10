import {
  Fn,
  Node,
  ShaderNodeObject,
  abs,
  cos,
  float,
  floor,
  mat2,
  max,
  min,
  sin,
  vec2,
  vec3
} from 'three/tsl';

type FloatNode = ShaderNodeObject<Node>;
type Vec3Node = ShaderNodeObject<Node>;

export const smoothUnion = /*#__PURE__*/ Fn(([a, b, factor]: [FloatNode, FloatNode, FloatNode]) => {
  const h = max(factor.sub(abs(a.sub(b))), 0.0).div(factor);
  return min(a, b).sub(h.mul(h).mul(factor).mul(0.25));
}).setLayout({
  name: 'smoothUnion',
  type: 'float',
  inputs: [
    { name: 'a', type: 'float' },
    { name: 'b', type: 'float' },
    { name: 'factor', type: 'float' }
  ]
});

export const smoothSubtraction = /*#__PURE__*/ Fn(([a, b, factor]: [FloatNode, FloatNode, FloatNode]) => {
  return smoothUnion(a, b, factor.negate());
}).setLayout({
  name: 'smoothSubtraction',
  type: 'float',
  inputs: [
    { name: 'a', type: 'float' },
    { name: 'b', type: 'float' },
    { name: 'factor', type: 'float' }
  ]
});

export const smoothIntersection = /*#__PURE__*/ Fn(([a, b, factor]: [FloatNode, FloatNode, FloatNode]) => {
  return smoothUnion(a.negate(), b.negate(), factor).negate();
}).setLayout({
  name: 'smoothIntersection',
  type: 'float',
  inputs: [
    { name: 'a', type: 'float' },
    { name: 'b', type: 'float' },
    { name: 'factor', type: 'float' }
  ]
});

export const distanceUnion = /*#__PURE__*/ Fn(([a, b]: [FloatNode, FloatNode]) => {
  return min(a, b);
}).setLayout({
  name: 'distanceUnion',
  type: 'float',
  inputs: [
    { name: 'a', type: 'float' },
    { name: 'b', type: 'float' }
  ]
});

export const distanceIntersection = /*#__PURE__*/ Fn(([a, b]: [FloatNode, FloatNode]) => {
  return max(a, b);
}).setLayout({
  name: 'distanceIntersection',
  type: 'float',
  inputs: [
    { name: 'a', type: 'float' },
    { name: 'b', type: 'float' }
  ]
});

export const distanceDifference = /*#__PURE__*/ Fn(([a, b]: [FloatNode, FloatNode]) => {
  return max(a, b.negate());
}).setLayout({
  name: 'distanceDifference',
  type: 'float',
  inputs: [
    { name: 'a', type: 'float' },
    { name: 'b', type: 'float' }
  ]
});

export const repeat = /*#__PURE__*/ Fn(([pInput, cellInput]: [Vec3Node, Vec3Node]) => {
  const p = vec3(pInput).toVar();
  const cell = vec3(cellInput).toVar();
  const wrapped = vec3(p.sub(cell.mul(floor(p.div(cell).add(0.5))))).toVar();

  return wrapped;
}).setLayout({
  name: 'repeat',
  type: 'vec3',
  inputs: [
    { name: 'p', type: 'vec3' },
    { name: 'cell', type: 'vec3' }
  ]
});

export const twist = /*#__PURE__*/ Fn(([pInput, strengthInput]: [Vec3Node, FloatNode]) => {
  const p = vec3(pInput).toVar();
  const strength = float(strengthInput).toVar();
  const angle = strength.mul(p.y);
  const c = cos(angle);
  const s = sin(angle);
  const rotation = mat2(c, s.negate(), s, c);
  const xz = vec2(p.x, p.z).toVar();
  const rotated = vec2(rotation.mul(xz)).toVar();

  p.x.assign(rotated.x);
  p.z.assign(rotated.y);

  return p;
}).setLayout({
  name: 'twist',
  type: 'vec3',
  inputs: [
    { name: 'p', type: 'vec3' },
    { name: 'strength', type: 'float' }
  ]
});

export const bend = /*#__PURE__*/ Fn(([pInput, radiusInput]: [Vec3Node, FloatNode]) => {
  const p = vec3(pInput).toVar();
  const radius = float(radiusInput).toVar();
  const theta = p.x.div(radius);
  const c = cos(theta);
  const s = sin(theta);
  const rotation = mat2(c, s.negate(), s, c);
  const yz = vec2(p.y, p.z.add(radius)).toVar();
  const bent = vec2(rotation.mul(yz)).toVar();

  p.y.assign(bent.x);
  p.z.assign(bent.y.sub(radius));

  return p;
}).setLayout({
  name: 'bend',
  type: 'vec3',
  inputs: [
    { name: 'p', type: 'vec3' },
    { name: 'radius', type: 'float' }
  ]
});
