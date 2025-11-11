// TSL Wrapper for Vite - exposes Three.js TSL as named exports
import * as THREE from 'three/webgpu';

const TSL = THREE.TSL;

// Export all TSL functions and types as named exports
export const {
  // Core
  Node,
  Fn,
  overloadingFn,
  overloadingBaseFn,

  // Types
  float,
  int,
  bool,
  vec2,
  vec3,
  vec4,
  mat2,
  mat3,
  mat4,
  color,

  // Constants
  PI,
  PI2,
  HALF_PI,
  EPSILON,
  INFINITY,

  // Math functions
  abs,
  acos,
  add,
  all,
  any,
  atan,
  atan2,
  ceil,
  clamp,
  cos,
  cross,
  degrees,
  distance,
  div,
  dot,
  dFdx,
  dFdy,
  equals,
  exp,
  exp2,
  faceforward,
  floor,
  fract,
  fwidth,
  greaterThan,
  greaterThanEqual,
  inversesqrt,
  length,
  lessThan,
  lessThanEqual,
  log,
  log2,
  max,
  min,
  mix,
  mod,
  mul,
  negate,
  normalize,
  not,
  notEqual,
  pow,
  radians,
  reflect,
  refract,
  round,
  saturate,
  sign,
  sin,
  smoothstep,
  sqrt,
  step,
  sub,
  tan,
  trunc,
  
  // Control flow
  If,
  Loop,
  Break,
  Continue,
  Discard,
  Return,

  // Variables
  uniform,
  attribute,
  varying,
  property,
  varyingProperty,
  
  // Texture & Sampling
  texture,
  textureStore,
  textureBicubic,
  textureLoad,
  textureSize,
  sampler,
  convertToTexture,
  
  // UV & Coordinates
  uv,
  uvec2,
  uvec3,
  uvec4,
  viewportSize,
  screenSize,
  screenCoordinate,
  screenUV,
  viewportCoordinate,
  viewportUV,
  
  // Materials & Lighting
  positionWorld,
  positionLocal,
  normalWorld,
  normalLocal,
  normalView,
  transformedNormalView,
  transformedNormalWorld,
  viewPosition,
  cameraPosition,
  modelViewMatrix,
  cameraProjectionMatrix,
  modelWorldMatrix,
  MeshBasicNodeMaterial,
  
  // Node utilities
  nodeObject,
  nodeProxy,
  nodeImmutable,
  Swizzable,
  
  // Pass & Post-processing
  pass,
  passTexture,
  depthTexture,
  
  // Color operations
  premultiplyAlpha,
  unpremultiplyAlpha,
  
  // Storage
  storage,
  storageObject,
  
  // Compute
  workgroupArray,
  workgroupBarrier,
  instancedArray,
  instanceIndex,
  hash,
  
  // Node types
  NodeShaderStage,
  NodeUpdateType,
  NodeType,
  NodeAccess,
  
  // Conditionals
  select,
  
  // Time
  timerLocal,
  timerGlobal,
  timerDelta,
  frameId,
  time,
  
} = TSL;

// Re-export THREE for convenience
export { THREE };

// Export TSL object itself as default
export default TSL;

