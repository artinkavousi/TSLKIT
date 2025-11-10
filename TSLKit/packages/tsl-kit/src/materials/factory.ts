import { MeshPhysicalNodeMaterial } from 'three/webgpu';
import { float, vec3 } from 'three/tsl';

import type {
  ColorRGB,
  NormalizedPhysicalMaterialSpec,
  PhysicalMaterialEvaluation,
  PhysicalMaterialLayerSpec,
  PhysicalMaterialSpec
} from './types.js';

const DEFAULT_COLOR: ColorRGB = [1, 1, 1];
function clamp01(value: number): number {
  return Math.min(1, Math.max(0, value));
}

function normalizeColor(color: ColorRGB | undefined, fallback: ColorRGB): ColorRGB {
  if (!color) {
    return fallback;
  }

  return [clamp01(color[0]), clamp01(color[1]), clamp01(color[2])];
}

function addWeightedColor(target: ColorRGB, color: ColorRGB, weight: number): void {
  target[0] += color[0] * weight;
  target[1] += color[1] * weight;
  target[2] += color[2] * weight;
}

function divideColor(target: ColorRGB, weight: number, fallback: ColorRGB): ColorRGB {
  if (weight <= 0) {
    return [...fallback] as ColorRGB;
  }

  return [target[0] / weight, target[1] / weight, target[2] / weight];
}

function normalizeSpec(spec: PhysicalMaterialSpec): NormalizedPhysicalMaterialSpec {
  return {
    ...spec,
    layers: spec.layers ?? [],
    opacity: spec.opacity ?? 1,
    ior: spec.ior ?? 1.5
  };
}

export function evaluatePhysicalMaterial(spec: PhysicalMaterialSpec): PhysicalMaterialEvaluation {
  const normalized = normalizeSpec(spec);

  const diffuseColor: ColorRGB = [0, 0, 0];
  let diffuseWeight = 0;

  const specularColor: ColorRGB = [0, 0, 0];
  let specularWeight = 0;
  let specularRoughness = 0;
  let specularRoughnessWeight = 0;
  let specularMetalness = 0;
  let specularMetalnessWeight = 0;
  let specularIntensity = 0;
  let specularIntensityWeight = 0;

  let clearcoat = 0;
  let clearcoatWeight = 0;
  let clearcoatRoughness = 0;
  let clearcoatRoughnessWeight = 0;
  const clearcoatColor: ColorRGB = [0, 0, 0];
  let clearcoatColorWeight = 0;

  let sheen = 0;
  let sheenWeight = 0;
  let sheenRoughness = 0;
  let sheenRoughnessWeight = 0;
  const sheenColor: ColorRGB = [0, 0, 0];
  let sheenColorWeight = 0;

  let transmission = 0;
  let transmissionWeight = 0;
  const transmissionColor: ColorRGB = [0, 0, 0];
  let transmissionColorWeight = 0;
  let thickness = 0;
  let thicknessWeight = 0;
  const attenuationColor: ColorRGB = [0, 0, 0];
  let attenuationColorWeight = 0;
  let attenuationDistance = 0;
  let attenuationDistanceWeight = 0;

  function applyLayer(layer: PhysicalMaterialLayerSpec): void {
    switch (layer.kind) {
      case 'diffuse': {
        const weight = layer.weight ?? 1;
        addWeightedColor(diffuseColor, normalizeColor(layer.color, DEFAULT_COLOR), weight);
        diffuseWeight += weight;
        break;
      }
      case 'specular': {
        const weight = layer.weight ?? 1;
        const intensity = layer.intensity ?? 1;

        const effectiveWeight = weight * intensity;
        addWeightedColor(specularColor, normalizeColor(layer.color, DEFAULT_COLOR), effectiveWeight);
        specularWeight += effectiveWeight;

        if (layer.roughness !== undefined) {
          specularRoughness += clamp01(layer.roughness) * effectiveWeight;
          specularRoughnessWeight += effectiveWeight;
        }

        if (layer.metalness !== undefined) {
          specularMetalness += clamp01(layer.metalness) * effectiveWeight;
          specularMetalnessWeight += effectiveWeight;
        }

        specularIntensity += clamp01(intensity) * weight;
        specularIntensityWeight += weight;

        break;
      }
      case 'clearcoat': {
        const weight = layer.intensity ?? layer.weight ?? 1;
        clearcoat += clamp01(layer.intensity ?? 1) * weight;
        clearcoatWeight += weight;

        if (layer.roughness !== undefined) {
          clearcoatRoughness += clamp01(layer.roughness) * weight;
          clearcoatRoughnessWeight += weight;
        }

        if (layer.color) {
          addWeightedColor(clearcoatColor, normalizeColor(layer.color, DEFAULT_COLOR), weight);
          clearcoatColorWeight += weight;
        }

        break;
      }
      case 'sheen': {
        const weight = layer.intensity ?? layer.weight ?? 1;
        sheen += clamp01(layer.intensity ?? 1) * weight;
        sheenWeight += weight;

        if (layer.roughness !== undefined) {
          sheenRoughness += clamp01(layer.roughness) * weight;
          sheenRoughnessWeight += weight;
        }

        if (layer.color) {
          addWeightedColor(sheenColor, normalizeColor(layer.color, DEFAULT_COLOR), weight);
          sheenColorWeight += weight;
        }

        break;
      }
      case 'transmission': {
        const weight = layer.intensity ?? layer.weight ?? 1;
        transmission += clamp01(layer.intensity ?? 1) * weight;
        transmissionWeight += weight;

        if (layer.color) {
          addWeightedColor(transmissionColor, normalizeColor(layer.color, DEFAULT_COLOR), weight);
          transmissionColorWeight += weight;
        }

        if (layer.thickness !== undefined) {
          thickness += Math.max(0, layer.thickness) * weight;
          thicknessWeight += weight;
        }

        if (layer.attenuationColor) {
          addWeightedColor(attenuationColor, normalizeColor(layer.attenuationColor, DEFAULT_COLOR), weight);
          attenuationColorWeight += weight;
        }

        if (layer.attenuationDistance !== undefined) {
          attenuationDistance += Math.max(0, layer.attenuationDistance) * weight;
          attenuationDistanceWeight += weight;
        }

        break;
      }
      default:
        break;
    }
  }

  normalized.layers.forEach(applyLayer);

  const evaluation: PhysicalMaterialEvaluation = {
    color: divideColor(diffuseColor, diffuseWeight, DEFAULT_COLOR),
    opacity: clamp01(normalized.opacity),
    metalness:
      specularMetalnessWeight > 0 ? specularMetalness / specularMetalnessWeight : clamp01(specularWeight > 0 ? specularWeight / (specularWeight + diffuseWeight || 1) : 0),
    roughness:
      specularRoughnessWeight > 0 ? specularRoughness / specularRoughnessWeight : 0.5,
    specularColor: divideColor(specularColor, specularWeight || 1, DEFAULT_COLOR),
    specularIntensity: specularIntensityWeight > 0 ? clamp01(specularIntensity / specularIntensityWeight) : 1,
    clearcoat: clearcoatWeight > 0 ? clamp01(clearcoat / clearcoatWeight) : 0,
    clearcoatRoughness: clearcoatRoughnessWeight > 0 ? clamp01(clearcoatRoughness / clearcoatRoughnessWeight) : 0,
    clearcoatColor: clearcoatColorWeight > 0 ? divideColor(clearcoatColor, clearcoatColorWeight, DEFAULT_COLOR) : DEFAULT_COLOR,
    sheen: sheenWeight > 0 ? clamp01(sheen / sheenWeight) : 0,
    sheenColor: sheenColorWeight > 0 ? divideColor(sheenColor, sheenColorWeight, DEFAULT_COLOR) : DEFAULT_COLOR,
    sheenRoughness: sheenRoughnessWeight > 0 ? clamp01(sheenRoughness / sheenRoughnessWeight) : 0.5,
    transmission: transmissionWeight > 0 ? clamp01(transmission / transmissionWeight) : 0,
    transmissionColor: transmissionColorWeight > 0 ? divideColor(transmissionColor, transmissionColorWeight, DEFAULT_COLOR) : DEFAULT_COLOR,
    thickness: thicknessWeight > 0 ? thickness / thicknessWeight : 0,
    attenuationColor: attenuationColorWeight > 0 ? divideColor(attenuationColor, attenuationColorWeight, DEFAULT_COLOR) : DEFAULT_COLOR,
    attenuationDistance: attenuationDistanceWeight > 0 ? attenuationDistance / attenuationDistanceWeight : 0,
    ior: normalized.ior
  };

  return evaluation;
}

function toColorNode(color: ColorRGB) {
  return vec3(color[0], color[1], color[2]);
}

function toFloatNode(value: number) {
  return float(value);
}

export function createPhysicalMaterial(spec: PhysicalMaterialSpec): MeshPhysicalNodeMaterial {
  const evaluation = evaluatePhysicalMaterial(spec);

  const material = new MeshPhysicalNodeMaterial();
  material.name = spec.name ?? 'PhysicalMaterial';

  material.colorNode = toColorNode(evaluation.color);
  material.roughnessNode = toFloatNode(evaluation.roughness);
  material.metalnessNode = toFloatNode(evaluation.metalness);
  material.alphaNode = toFloatNode(evaluation.opacity);
  material.specularColorNode = toColorNode(evaluation.specularColor);
  material.specularIntensityNode = toFloatNode(evaluation.specularIntensity);
  material.clearcoatNode = toFloatNode(evaluation.clearcoat);
  material.clearcoatRoughnessNode = toFloatNode(evaluation.clearcoatRoughness);
  const sheenColor: ColorRGB = [
    evaluation.sheenColor[0] * evaluation.sheen,
    evaluation.sheenColor[1] * evaluation.sheen,
    evaluation.sheenColor[2] * evaluation.sheen
  ];
  material.sheenNode = toColorNode(sheenColor);
  material.sheenRoughnessNode = toFloatNode(evaluation.sheenRoughness);
  material.transmissionNode = toFloatNode(evaluation.transmission);
  material.thicknessNode = toFloatNode(evaluation.thickness);
  material.attenuationColorNode = toColorNode(evaluation.attenuationColor);
  material.attenuationDistanceNode = toFloatNode(evaluation.attenuationDistance);
  material.iorNode = toFloatNode(evaluation.ior);

  material.transparent = evaluation.opacity < 1 || evaluation.transmission > 0;

  return material;
}
