export type ColorRGB = [number, number, number];

export interface DiffuseLayerSpec {
  kind: 'diffuse';
  color: ColorRGB;
  weight?: number;
}

export interface SpecularLayerSpec {
  kind: 'specular';
  color?: ColorRGB;
  weight?: number;
  roughness?: number;
  metalness?: number;
  intensity?: number;
}

export interface ClearcoatLayerSpec {
  kind: 'clearcoat';
  color?: ColorRGB;
  intensity?: number;
  roughness?: number;
}

export interface SheenLayerSpec {
  kind: 'sheen';
  color?: ColorRGB;
  intensity?: number;
  roughness?: number;
}

export interface TransmissionLayerSpec {
  kind: 'transmission';
  color?: ColorRGB;
  intensity?: number;
  thickness?: number;
  attenuationColor?: ColorRGB;
  attenuationDistance?: number;
}

export type PhysicalMaterialLayerSpec =
  | DiffuseLayerSpec
  | SpecularLayerSpec
  | ClearcoatLayerSpec
  | SheenLayerSpec
  | TransmissionLayerSpec;

export interface PhysicalMaterialSpec {
  name?: string;
  layers: PhysicalMaterialLayerSpec[];
  opacity?: number;
  ior?: number;
}

export interface NormalizedPhysicalMaterialSpec extends PhysicalMaterialSpec {
  opacity: number;
  ior: number;
}

export interface PhysicalMaterialEvaluation {
  color: ColorRGB;
  opacity: number;
  metalness: number;
  roughness: number;
  specularColor: ColorRGB;
  specularIntensity: number;
  clearcoat: number;
  clearcoatRoughness: number;
  clearcoatColor: ColorRGB;
  sheen: number;
  sheenColor: ColorRGB;
  sheenRoughness: number;
  transmission: number;
  transmissionColor: ColorRGB;
  thickness: number;
  attenuationColor: ColorRGB;
  attenuationDistance: number;
  ior: number;
}

export interface MaterialPresetMetadata {
  id: string;
  label: string;
  description: string;
  tags: string[];
  thumbnail: string;
  schema: Record<string, unknown>;
  source?: {
    type: 'materialx' | 'tsl-texture';
    reference: string;
  };
}

export interface MaterialPresetResult {
  input: Record<string, unknown>;
  spec: PhysicalMaterialSpec;
}
