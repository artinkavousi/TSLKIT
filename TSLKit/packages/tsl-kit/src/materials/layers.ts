import type {
  ClearcoatLayerSpec,
  ColorRGB,
  DiffuseLayerSpec,
  PhysicalMaterialLayerSpec,
  SheenLayerSpec,
  SpecularLayerSpec,
  TransmissionLayerSpec
} from './types.js';

function clamp01(value: number): number {
  return Math.min(1, Math.max(0, value));
}

function normalizeColor(color: ColorRGB): ColorRGB {
  return [clamp01(color[0]), clamp01(color[1]), clamp01(color[2])];
}

export function diffuseLayer(params: {
  color: ColorRGB;
  weight?: number;
}): DiffuseLayerSpec {
  return {
    kind: 'diffuse',
    color: normalizeColor(params.color),
    weight: params.weight
  };
}

export function specularLayer(params: {
  color?: ColorRGB;
  weight?: number;
  roughness?: number;
  metalness?: number;
  intensity?: number;
}): SpecularLayerSpec {
  return {
    kind: 'specular',
    color: params.color ? normalizeColor(params.color) : undefined,
    weight: params.weight,
    roughness: params.roughness,
    metalness: params.metalness,
    intensity: params.intensity
  };
}

export function clearcoatLayer(params: {
  color?: ColorRGB;
  intensity?: number;
  roughness?: number;
}): ClearcoatLayerSpec {
  return {
    kind: 'clearcoat',
    color: params.color ? normalizeColor(params.color) : undefined,
    intensity: params.intensity,
    roughness: params.roughness
  };
}

export function sheenLayer(params: {
  color?: ColorRGB;
  intensity?: number;
  roughness?: number;
}): SheenLayerSpec {
  return {
    kind: 'sheen',
    color: params.color ? normalizeColor(params.color) : undefined,
    intensity: params.intensity,
    roughness: params.roughness
  };
}

export function transmissionLayer(params: {
  color?: ColorRGB;
  intensity?: number;
  thickness?: number;
  attenuationColor?: ColorRGB;
  attenuationDistance?: number;
}): TransmissionLayerSpec {
  return {
    kind: 'transmission',
    color: params.color ? normalizeColor(params.color) : undefined,
    intensity: params.intensity,
    thickness: params.thickness,
    attenuationColor: params.attenuationColor ? normalizeColor(params.attenuationColor) : undefined,
    attenuationDistance: params.attenuationDistance
  };
}

export function combineLayers(layers: PhysicalMaterialLayerSpec[]): PhysicalMaterialLayerSpec[] {
  return layers.filter(Boolean);
}
