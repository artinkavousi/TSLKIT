import { XMLParser } from 'fast-xml-parser';

import type { MeshPhysicalNodeMaterial } from 'three/webgpu';

import { createPhysicalMaterial } from './factory.js';
import { clearcoatLayer, diffuseLayer, sheenLayer, specularLayer, transmissionLayer } from './layers.js';
import type { ColorRGB, PhysicalMaterialSpec } from './types.js';

function toArray<T>(value: T | T[] | undefined): T[] {
  if (value === undefined) {
    return [];
  }

  return Array.isArray(value) ? value : [value];
}

function parseFloatValue(value: string | undefined): number | undefined {
  if (value === undefined) {
    return undefined;
  }

  const normalized = value.split(',')[0]?.trim();
  if (!normalized) {
    return undefined;
  }

  const parsed = Number.parseFloat(normalized);
  return Number.isFinite(parsed) ? parsed : undefined;
}

function parseColorValue(value: string | undefined): ColorRGB | undefined {
  if (!value) {
    return undefined;
  }

  const components = value
    .split(',')
    .map((component) => Number.parseFloat(component.trim()))
    .filter((component) => Number.isFinite(component));

  if (components.length === 3) {
    return [components[0], components[1], components[2]];
  }

  return undefined;
}

function buildStandardSurfaceSpec(surfaceNode: any): PhysicalMaterialSpec {
  const inputs = toArray(surfaceNode.input);

  const findInput = (name: string) => inputs.find((input: any) => input.name === name);

  const baseFactor = parseFloatValue(findInput('base')?.value) ?? 1;
  const baseColor = parseColorValue(findInput('base_color')?.value) ?? [1, 1, 1];

  const layers = [diffuseLayer({ color: baseColor, weight: baseFactor })];

  const specularIntensity = parseFloatValue(findInput('specular')?.value) ?? 1;
  const specularColor = parseColorValue(findInput('specular_color')?.value) ?? [1, 1, 1];
  const specularRoughness =
    parseFloatValue(findInput('roughness')?.value) ?? parseFloatValue(findInput('specular_roughness')?.value);
  const metalness = parseFloatValue(findInput('metalness')?.value);

  if (specularIntensity !== 0 || specularRoughness !== undefined || metalness !== undefined) {
    layers.push(
      specularLayer({
        color: specularColor,
        intensity: specularIntensity,
        roughness: specularRoughness,
        metalness
      })
    );
  }

  const clearcoatIntensity = parseFloatValue(findInput('coat')?.value) ?? 0;
  if (clearcoatIntensity > 0) {
    layers.push(
      clearcoatLayer({
        intensity: clearcoatIntensity,
        roughness: parseFloatValue(findInput('coat_roughness')?.value) ?? 0,
        color: parseColorValue(findInput('coat_color')?.value)
      })
    );
  }

  const sheenIntensity = parseFloatValue(findInput('sheen')?.value) ?? 0;
  if (sheenIntensity > 0) {
    layers.push(
      sheenLayer({
        intensity: sheenIntensity,
        roughness: parseFloatValue(findInput('sheen_roughness')?.value) ?? 0.5,
        color: parseColorValue(findInput('sheen_color')?.value)
      })
    );
  }

  const transmissionIntensity = parseFloatValue(findInput('transmission')?.value) ?? 0;
  if (transmissionIntensity > 0) {
    layers.push(
      transmissionLayer({
        intensity: transmissionIntensity,
        color: parseColorValue(findInput('transmission_color')?.value),
        thickness: parseFloatValue(findInput('thickness')?.value) ?? 0,
        attenuationColor: parseColorValue(findInput('attenuation_color')?.value),
        attenuationDistance: parseFloatValue(findInput('attenuation_distance')?.value)
      })
    );
  }

  const opacity = parseFloatValue(findInput('opacity')?.value) ?? 1;
  const ior = parseFloatValue(findInput('ior')?.value) ?? 1.5;

  return {
    name: surfaceNode.name,
    layers,
    opacity,
    ior
  };
}

export interface MaterialXMaterial {
  name: string;
  spec: PhysicalMaterialSpec;
  material: MeshPhysicalNodeMaterial;
}

export type MaterialXResult = Record<string, MaterialXMaterial>;

export class MaterialXLoader {
  private readonly parser = new XMLParser({ ignoreAttributes: false, attributeNamePrefix: '' });

  parse(text: string): MaterialXResult {
    const document = this.parser.parse(text);
    const materialX = document?.materialx;

    if (!materialX) {
      throw new Error('MaterialXLoader: invalid document.');
    }

    const surfaces = toArray(materialX.standard_surface ?? materialX.surfaceshader ?? []);
    const surfaceLookup = new Map<string, any>();
    surfaces.forEach((surface: any) => {
      if (surface?.name) {
        surfaceLookup.set(surface.name, surface);
      }
    });

    const results: MaterialXResult = {};

    const materials = toArray(materialX.surfacematerial);
    materials.forEach((materialNode: any) => {
      const inputs = toArray(materialNode.input);
      const surfaceInput = inputs.find((input: any) => input.name === 'surfaceshader');
      const targetName = surfaceInput?.nodename ?? surfaceInput?.nodegraph;
      const surfaceNode = targetName ? surfaceLookup.get(targetName) : undefined;

      if (!surfaceNode) {
        return;
      }

      const spec = buildStandardSurfaceSpec(surfaceNode);
      spec.name = materialNode.name ?? spec.name;

      results[materialNode.name ?? spec.name ?? 'Material'] = {
        name: materialNode.name ?? spec.name ?? 'Material',
        spec,
        material: createPhysicalMaterial(spec)
      };
    });

    return results;
  }
}
