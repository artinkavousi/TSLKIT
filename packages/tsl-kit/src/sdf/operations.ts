import { Fn, Node, ShaderNodeObject, abs, float, max, min } from 'three/tsl';

type FloatNode = ShaderNodeObject<Node>;

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
