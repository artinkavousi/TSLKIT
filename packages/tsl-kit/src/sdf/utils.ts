import {
  Fn,
  Node,
  ShaderNodeObject,
  PI,
  add,
  clamp,
  div,
  float,
  int,
  mat3,
  mat4,
  max,
  min,
  mul,
  sin,
  cos,
  atan,
  pow,
  vec2,
  vec3
} from 'three/tsl';

type Vec3Node = ShaderNodeObject<Node>;
type Vec2Node = ShaderNodeObject<Node>;
type FloatNode = ShaderNodeObject<Node>;
type Mat3Node = ShaderNodeObject<Node>;

export const composeMatrix = /*#__PURE__*/ Fn(
  ([translationInput, rotationMatrixInput, scaleInput]: [Vec3Node, Mat3Node, Vec3Node]) => {
    const translation = vec3(translationInput).toVar();
    const rotation = mat3(rotationMatrixInput).toVar();
    const scale = vec3(scaleInput).toVar();

    const column = (row: number, columnIndex: number, scaleAxis: keyof typeof scale) =>
      rotation
        .element(int(row))
        .element(int(columnIndex))
        .mul(scale[scaleAxis]);

    return mat4(
      column(0, 0, 'x'),
      column(0, 1, 'x'),
      column(0, 2, 'x'),
      0.0,
      column(1, 0, 'y'),
      column(1, 1, 'y'),
      column(1, 2, 'y'),
      0.0,
      column(2, 0, 'z'),
      column(2, 1, 'z'),
      column(2, 2, 'z'),
      0.0,
      translation.x,
      translation.y,
      translation.z,
      1.0
    );
  }
).setLayout({
  name: 'composeMatrix',
  type: 'mat4',
  inputs: [
    { name: 'translation', type: 'vec3' },
    { name: 'rotationMatrix', type: 'mat3' },
    { name: 'scale', type: 'vec3' }
  ]
});

export const remap = /*#__PURE__*/ Fn(
  ([value, inMin, inMax, outMin, outMax]: [FloatNode, FloatNode, FloatNode, FloatNode, FloatNode]) => {
    const numerator = value.sub(inMin).mul(outMax.sub(outMin));
    const denominator = inMax.sub(inMin);

    const mapped = numerator.div(denominator).add(outMin);
    return clamp(mapped, outMin, outMax);
  }
).setLayout({
  name: 'remap',
  type: 'float',
  inputs: [
    { name: 'value', type: 'float' },
    { name: 'inMin', type: 'float' },
    { name: 'inMax', type: 'float' },
    { name: 'outMin', type: 'float' },
    { name: 'outMax', type: 'float' }
  ]
});

export const smoothMin = /*#__PURE__*/ Fn(([a, b, k]: [FloatNode, FloatNode, FloatNode]) => {
  const h = max(k.sub(a.sub(b).abs()), 0.0).div(k);
  return min(a, b).sub(h.mul(h).mul(k).mul(0.25));
}).setLayout({
  name: 'smoothMin',
  type: 'float',
  inputs: [
    { name: 'a', type: 'float' },
    { name: 'b', type: 'float' },
    { name: 'k', type: 'float' }
  ]
});

export const smoothMod = /*#__PURE__*/ Fn(
  ([axisInput, amplitudeInput, radiusInput]: [FloatNode, FloatNode, FloatNode]) => {
    const axis = axisInput.toVar();
    const amplitude = amplitudeInput.toVar();
    const radius = radiusInput.toVar();

    const angle = PI.mul(axis.div(amplitude));
    const numerator = cos(angle).mul(sin(angle));
    const denominator = pow(sin(angle), 2).add(pow(radius, 2));
    const arctangent = atan(numerator.div(denominator));

    return amplitude.mul(0.5).sub(float(1).div(PI).mul(arctangent));
  }
).setLayout({
  name: 'smoothMod',
  type: 'float',
  inputs: [
    { name: 'axis', type: 'float' },
    { name: 'amplitude', type: 'float' },
    { name: 'radius', type: 'float' }
  ]
});
