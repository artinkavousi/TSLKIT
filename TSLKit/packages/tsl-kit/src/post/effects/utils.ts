import { float, mul } from 'three/tsl';
import type { ShaderNodeLike } from '../types.js';

type MultipliableNode = ShaderNodeLike & {
  mul?: (value: ShaderNodeLike | number) => ShaderNodeLike;
  multiply?: (value: ShaderNodeLike | number) => ShaderNodeLike;
};

export const scaleNode = (node: ShaderNodeLike, value: number): ShaderNodeLike => {
  const typed = node as MultipliableNode;

  if (typed.mul) {
    return typed.mul(float(value));
  }

  if (typed.multiply) {
    return typed.multiply(float(value));
  }

  return mul(node, float(value));
};
