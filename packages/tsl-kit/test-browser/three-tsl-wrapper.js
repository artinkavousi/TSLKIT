/**
 * TSL Wrapper Module for Browser
 * 
 * Re-exports all TSL functions from THREE.TSL as named exports
 * so that `import { Fn, vec3 } from 'three/tsl'` works in browser
 */
import { TSL } from './three/three.webgpu.js';

// Re-export everything from TSL as named exports
export const {
  // Core TSL functions
  Fn,
  vec2,
  vec3,
  vec4,
  float,
  int,
  uint,
  bool,
  color,
  mat2,
  mat3,
  mat4,
  
  // Math operations
  add,
  sub,
  mul,
  div,
  mod,
  abs,
  floor,
  ceil,
  round,
  fract,
  sqrt,
  pow,
  exp,
  log,
  min,
  max,
  clamp,
  mix,
  step,
  smoothstep,
  sign,
  
  // Vector/Matrix operations
  dot,
  cross,
  length,
  normalize,
  distance,
  reflect,
  refract,
  faceforward,
  
  // Comparison
  lessThan,
  lessThanEqual,
  greaterThan,
  greaterThanEqual,
  equal,
  notEqual,
  
  // Logical
  and,
  or,
  xor,
  not,
  
  // Flow control
  If,
  Loop,
  Break,
  Continue,
  Return,
  
  // Trigonometry
  sin,
  cos,
  tan,
  asin,
  acos,
  atan,
  sinh,
  cosh,
  tanh,
  asinh,
  acosh,
  atanh,
  degrees,
  radians,
  
  // Utilities
  select,
  cond,
  assign,
  negate,
  invert,
  transpose,
  inverse,
  determinant,
  
  // Constants
  PI,
  PI2,
  HALF_PI,
  EPSILON,
  INFINITY,
  
  // Overloading
  overloadingFn,
  overloadingBaseFn,
  
  // Node utilities (for advanced usage)
  NodeAccess,
  NodeShaderStage,
  NodeType,
  NodeUpdateType,
  
  // Additional utilities that might be needed
  convertToTexture,
  texture,
  textureStore,
  nodeObject,
  uniform,
  uv,
  passTexture,
  premultiplyAlpha,
  unpremultiplyAlpha,
} = TSL;

// Export everything else dynamically
export default TSL;

