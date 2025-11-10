import {
  Fn,
  If,
  Node,
  ShaderNodeObject,
  abs,
  add,
  clamp,
  dot,
  float,
  length,
  max,
  min,
  mul,
  select,
  sign,
  sqrt,
  vec2,
  vec3
} from 'three/tsl';

type Vec2Node = ShaderNodeObject<Node>;
type Vec3Node = ShaderNodeObject<Node>;
type FloatNode = ShaderNodeObject<Node>;

export const sdSphere = /*#__PURE__*/ Fn(([point, radius = 0.0]: [Vec3Node, number | FloatNode]) => {
  const r = float(radius);
  return length(point).sub(r);
}).setLayout({
  name: 'sdSphere',
  type: 'float',
  inputs: [
    { name: 'point', type: 'vec3' },
    { name: 'radius', type: 'float' }
  ]
});

export const sdBox2d = /*#__PURE__*/ Fn(([point, halfExtent = float(0.0)]: [Vec2Node, FloatNode]) => {
  return max(abs(point.x), abs(point.y)).sub(halfExtent);
}).setLayout({
  name: 'sdBox2d',
  type: 'float',
  inputs: [
    { name: 'point', type: 'vec2' },
    { name: 'halfExtent', type: 'float' }
  ]
});

export const sdBox3d = /*#__PURE__*/ Fn(([point, bounds]: [Vec3Node, Vec3Node]) => {
  const q = abs(point).sub(bounds);
  return length(max(q, 0.0)).add(min(max(q.x, max(q.y, q.z)), 0.0));
}).setLayout({
  name: 'sdBox3d',
  type: 'float',
  inputs: [
    { name: 'point', type: 'vec3' },
    { name: 'bounds', type: 'vec3' }
  ]
});

export const sdDiamond = /*#__PURE__*/ Fn(([point, radius = 0.0]: [Vec2Node, number | FloatNode]) => {
  const r = float(radius);
  return abs(point.x).add(abs(point.y)).sub(r);
}).setLayout({
  name: 'sdDiamond',
  type: 'float',
  inputs: [
    { name: 'point', type: 'vec2' },
    { name: 'radius', type: 'float' }
  ]
});

export const sdHexagon = /*#__PURE__*/ Fn(([point = vec2(0.0), radius = 0.5]: [Vec2Node, number | FloatNode]) => {
  const r = float(radius);
  const k = vec3(-0.866025404, 0.5, 0.577350269);
  const localPoint = abs(point).toVar();
  localPoint.subAssign(float(2.0).mul(min(dot(k.xy, localPoint), 0.0).mul(k.xy)));
  localPoint.subAssign(vec2(clamp(localPoint.x, k.z.negate().mul(r), k.z.mul(r)), r));
  return length(localPoint).mul(sign(localPoint.y));
}).setLayout({
  name: 'sdHexagon',
  type: 'float',
  inputs: [
    { name: 'point', type: 'vec2' },
    { name: 'radius', type: 'float' }
  ]
});

export const sdEquilateralTriangle = /*#__PURE__*/ Fn(
  ([point = vec2(0.0), radius = float(0.1)]: [Vec2Node, FloatNode]) => {
    const k = sqrt(3.0);
    const result = point.toVar();
    result.x = abs(result.x).sub(radius).toVar();
    result.y = result.y.add(radius.div(k)).toVar();

    If(result.x.add(k.mul(result.y)).greaterThan(0.0), () => {
      result.assign(vec2(result.x.sub(k.mul(result.y)), k.negate().mul(result.x).sub(result.y)).div(2.0));
    });

    result.x.subAssign(clamp(result.x, radius.mul(-2.0), 0.0));

    return length(result).negate().mul(sign(result.y));
  }
).setLayout({
  name: 'sdEquilateralTriangle',
  type: 'float',
  inputs: [
    { name: 'point', type: 'vec2' },
    { name: 'radius', type: 'float' }
  ]
});

export const sdLine = /*#__PURE__*/ Fn(([value]: [FloatNode]) => abs(value)).setLayout({
  name: 'sdLine',
  type: 'float',
  inputs: [{ name: 'value', type: 'float' }]
});

export const sdRing = /*#__PURE__*/ Fn(([point, radius = 0.4]: [Vec2Node, number]) => {
  return abs(length(point).sub(radius));
}).setLayout({
  name: 'sdRing',
  type: 'float',
  inputs: [
    { name: 'point', type: 'vec2' },
    { name: 'radius', type: 'float' }
  ]
});

export const sdParallelogram = /*#__PURE__*/ Fn(
  ([pointInput, width, height, skew]: [Vec2Node, FloatNode, FloatNode, FloatNode]) => {
    const point = pointInput.toVar();
    const edge = vec2(skew, height);
    point.assign(select(point.y.lessThan(0.0), point.negate(), point));
    const w = point.sub(edge).toVar();
    w.x.subAssign(clamp(w.x, width.negate(), width));

    const distanceVec = vec2(dot(w, w), w.y.negate()).toVar();
    const signed = point.x.mul(edge.y).sub(point.y.mul(edge.x));

    point.assign(select(signed.lessThan(0.0), point.negate(), point));

    const v = point.sub(vec2(width, 0.0)).toVar();
    v.subAssign(edge.mul(clamp(dot(v, edge).div(dot(edge, edge)), -1.0, 1.0)));
    distanceVec.assign(min(distanceVec, vec2(dot(v, v), width.mul(height).sub(abs(signed)))));

    return sqrt(distanceVec.x).mul(sign(distanceVec.y.negate()));
  }
).setLayout({
  name: 'sdParallelogram',
  type: 'float',
  inputs: [
    { name: 'point', type: 'vec2' },
    { name: 'width', type: 'float' },
    { name: 'height', type: 'float' },
    { name: 'skew', type: 'float' }
  ]
});

const ndot = /*#__PURE__*/ Fn(([a, b]: [Vec2Node, Vec2Node]) => {
  return a.x.mul(b.x).sub(a.y.mul(b.y));
});

export const sdRhombus = /*#__PURE__*/ Fn(([pointInput, size]: [Vec2Node, Vec2Node]) => {
  const point = abs(pointInput).toVar();
  const h = clamp(ndot(size.sub(mul(2.0, point)), size).div(dot(size, size)), -1.0, 1.0);
  const d = length(point.sub(mul(0.5, size).mul(vec2(add(1.0, h.negate()), add(1.0, h)))));

  return d.mul(sign(point.x.mul(size.y).add(point.y.mul(size.x).sub(size.x.mul(size.y)))));
}).setLayout({
  name: 'sdRhombus',
  type: 'float',
  inputs: [
    { name: 'point', type: 'vec2' },
    { name: 'size', type: 'vec2' }
  ]
});

export const sdTriangle = /*#__PURE__*/ Fn(([point, scale]: [Vec2Node, FloatNode]) => {
  const t = max(abs(point.x.mul(scale)).add(point.y), abs(point.y.mul(scale).sub(0.5)).sub(0.5));
  return t;
}).setLayout({
  name: 'sdTriangle',
  type: 'float',
  inputs: [
    { name: 'point', type: 'vec2' },
    { name: 'scale', type: 'float' }
  ]
});
