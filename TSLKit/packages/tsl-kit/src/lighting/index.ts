import {
  Fn,
  Node,
  ShaderNodeObject,
  add,
  clamp,
  dot,
  float,
  max,
  mix,
  normalize,
  pow,
  reflect
} from 'three/tsl';

type Vec3Node = ShaderNodeObject<Node>;
type FloatNode = ShaderNodeObject<Node>;

export const ambientLight = /*#__PURE__*/ Fn(([lightColor, intensity]: [Vec3Node, FloatNode]) => {
  return lightColor.mul(intensity);
}).setLayout({
  name: 'ambientLight',
  type: 'vec3',
  inputs: [
    { name: 'lightColor', type: 'vec3' },
    { name: 'intensity', type: 'float' }
  ]
});

export const diffuseLight = /*#__PURE__*/ Fn(
  ([lightColor, lightDirection, normal]: [Vec3Node, Vec3Node, Vec3Node]) => {
    const n = normalize(normal);
    const l = normalize(lightDirection);
    const lambert = max(0.0, dot(l, n));

    return lightColor.mul(lambert);
  }
).setLayout({
  name: 'diffuseLight',
  type: 'vec3',
  inputs: [
    { name: 'lightColor', type: 'vec3' },
    { name: 'lightDirection', type: 'vec3' },
    { name: 'normal', type: 'vec3' }
  ]
});

export const directionalLight = /*#__PURE__*/ Fn(
  ([
    lightColor,
    lightIntensity,
    normal,
    lightDirection,
    viewDirection,
    specularPower
  ]: [Vec3Node, FloatNode, Vec3Node, Vec3Node, Vec3Node, FloatNode]) => {
    const n = normalize(normal).toVar();
    const l = normalize(lightDirection).toVar();
    const v = normalize(viewDirection);
    const reflection = reflect(l.negate(), n);

    const diffuse = max(0.0, dot(n, l));
    const specular = max(0.0, dot(reflection, v)).pow(specularPower);
    const shaded = diffuse.add(specular);

    return lightColor.mul(lightIntensity).mul(shaded);
  }
).setLayout({
  name: 'directionalLight',
  type: 'vec3',
  inputs: [
    { name: 'lightColor', type: 'vec3' },
    { name: 'lightIntensity', type: 'float' },
    { name: 'normal', type: 'vec3' },
    { name: 'lightDirection', type: 'vec3' },
    { name: 'viewDirection', type: 'vec3' },
    { name: 'specularPower', type: 'float' }
  ]
});

export const hemisphereLight = /*#__PURE__*/ Fn(
  ([normal, groundColor, skyColor]: [Vec3Node, Vec3Node, Vec3Node]) => {
    const hemiMix = clamp(normalize(normal).y.mul(0.5).add(0.5), 0.0, 1.0);
    return mix(groundColor, skyColor, hemiMix);
  }
).setLayout({
  name: 'hemisphereLight',
  type: 'vec3',
  inputs: [
    { name: 'normal', type: 'vec3' },
    { name: 'groundColor', type: 'vec3' },
    { name: 'skyColor', type: 'vec3' }
  ]
});

export const fresnel = /*#__PURE__*/ Fn(
  ([viewDirection, normal, power]: [Vec3Node, Vec3Node, FloatNode | undefined]) => {
    const exponent = power ?? float(1);
    const v = normalize(viewDirection);
    const n = normalize(normal);
    const facing = float(1).sub(max(0.0, dot(v, n)));

    return pow(facing, exponent);
  }
).setLayout({
  name: 'fresnel',
  type: 'float',
  inputs: [
    { name: 'viewDirection', type: 'vec3' },
    { name: 'normal', type: 'vec3' },
    { name: 'power', type: 'float' }
  ]
});
