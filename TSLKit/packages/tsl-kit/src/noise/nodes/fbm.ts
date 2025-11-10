import {
  Fn,
  Loop,
  Node,
  ShaderNodeObject,
  add,
  float,
  mul,
  vec3
} from 'three/tsl';

import { simplexNoise3d } from './simplexNoise3d.js';

type Vec3Node = ShaderNodeObject<Node>;

export const fbm = /*#__PURE__*/ Fn<ShaderNodeObject<Node>>(
  ([positionInput, octaves = 4.0, frequency = 1.0, amplitude = 1.0, lacunarity = 2.0, gain = 0.5]) => {
    const position = vec3(positionInput).toVar();
    const value = float(0.0).toVar();
    const currentAmplitude = float(amplitude).toVar();
    const currentFrequency = float(frequency).toVar();
    const maxValue = float(0.0).toVar();

    // @ts-ignore – Loop helper typing does not expose numeric ranges.
    Loop({ start: 0.0, end: octaves, type: 'float' }, () => {
      const noiseValue = simplexNoise3d(mul(position, currentFrequency));
      value.addAssign(noiseValue.mul(currentAmplitude));
      maxValue.addAssign(currentAmplitude);
      currentFrequency.mulAssign(lacunarity);
      currentAmplitude.mulAssign(gain);
    });

    return value.div(maxValue);
  }
).setLayout({
  name: 'fbm',
  type: 'float',
  inputs: [
    { name: 'p', type: 'vec3' },
    { name: 'octaves', type: 'float' },
    { name: 'frequency', type: 'float' },
    { name: 'amplitude', type: 'float' },
    { name: 'lacunarity', type: 'float' },
    { name: 'gain', type: 'float' }
  ]
});

export const ridgedFbm = /*#__PURE__*/ Fn<ShaderNodeObject<Node>>(
  ([positionInput, octaves = 4.0, frequency = 1.0, amplitude = 1.0, lacunarity = 2.0, gain = 0.5]) => {
    const position = vec3(positionInput).toVar();
    const value = float(0.0).toVar();
    const currentAmplitude = float(amplitude).toVar();
    const currentFrequency = float(frequency).toVar();
    const maxValue = float(0.0).toVar();

    // @ts-ignore – Loop helper typing does not expose numeric ranges.
    Loop({ start: 0.0, end: octaves, type: 'float' }, () => {
      const noiseValue = simplexNoise3d(mul(position, currentFrequency));
      const ridgedValue = float(1.0).sub(noiseValue.abs());
      const sharpRidges = ridgedValue.mul(ridgedValue);
      value.addAssign(sharpRidges.mul(currentAmplitude));
      maxValue.addAssign(currentAmplitude);
      currentFrequency.mulAssign(lacunarity);
      currentAmplitude.mulAssign(gain);
    });

    return value.div(maxValue);
  }
).setLayout({
  name: 'ridgedFbm',
  type: 'float',
  inputs: [
    { name: 'p', type: 'vec3' },
    { name: 'octaves', type: 'float' },
    { name: 'frequency', type: 'float' },
    { name: 'amplitude', type: 'float' },
    { name: 'lacunarity', type: 'float' },
    { name: 'gain', type: 'float' }
  ]
});

export const domainWarpedFbm = /*#__PURE__*/ Fn<ShaderNodeObject<Node>>(
  ([positionInput, octaves = 4.0, frequency = 1.0, amplitude = 1.0, lacunarity = 2.0, gain = 0.5, warpStrength = 0.1]) => {
    const position = vec3(positionInput).toVar();
    const warpOffset = vec3(
      fbm(position, octaves, frequency, amplitude, lacunarity, gain),
      fbm(add(position, vec3(100.0)), octaves, frequency, amplitude, lacunarity, gain),
      fbm(add(position, vec3(200.0)), octaves, frequency, amplitude, lacunarity, gain)
    );
    const warpedPosition = add(position, warpOffset.mul(warpStrength));

    return fbm(warpedPosition, octaves, frequency, amplitude, lacunarity, gain);
  }
).setLayout({
  name: 'domainWarpedFbm',
  type: 'float',
  inputs: [
    { name: 'p', type: 'vec3' },
    { name: 'octaves', type: 'float' },
    { name: 'frequency', type: 'float' },
    { name: 'amplitude', type: 'float' },
    { name: 'lacunarity', type: 'float' },
    { name: 'gain', type: 'float' },
    { name: 'warpStrength', type: 'float' }
  ]
});

export type FbmNode = ShaderNodeObject<Node>;
export type DomainWarpNode = ShaderNodeObject<Node>;

export function fbmNoise(position: Vec3Node): ShaderNodeObject<Node> {
  return fbm(position);
}

export function domainWarpNoise(position: Vec3Node, warpStrength = 0.5): ShaderNodeObject<Node> {
  return domainWarpedFbm(position, 4.0, 1.0, 1.0, 2.0, 0.5, warpStrength);
}
