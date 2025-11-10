import type { Material } from 'three';
import type { MeshPhysicalNodeMaterial } from 'three/webgpu';

import {
  applyMaterialOverrides,
  createMaterialPresetSnapshot,
  type MaterialPresetSnapshot
} from '@tslstudio/tsl-kit/materials';

interface SnapshotOptions {
  readonly idPrefix: string;
  readonly source: string;
  readonly overrides?: Partial<MaterialPresetSnapshot>;
}

function extractColor(material: Material | MeshPhysicalNodeMaterial): string {
  const candidate = (material as { color?: { getHexString?: () => string } }).color;
  if (candidate && typeof candidate.getHexString === 'function') {
    return `#${candidate.getHexString()}`;
  }

  return '#ffffff';
}

function extractNumber(
  material: Material | MeshPhysicalNodeMaterial,
  key: 'roughness' | 'metalness' | 'transmission'
): number | undefined {
  const value = (material as Record<string, unknown>)[key];
  return typeof value === 'number' ? value : undefined;
}

export function snapshotFromMaterial(
  material: Material | MeshPhysicalNodeMaterial,
  options: SnapshotOptions
): MaterialPresetSnapshot {
  const label = material.name || options.source;
  const base = createMaterialPresetSnapshot({
    id: `${options.idPrefix}:${label.toLowerCase().replace(/\s+/g, '-')}`,
    label,
    description: `Preset generated from ${options.source}`,
    parameters: {
      color: {
        type: 'color',
        default: extractColor(material)
      },
      roughness: {
        type: 'number',
        min: 0,
        max: 1,
        default: extractNumber(material, 'roughness') ?? 0.5
      },
      metalness: {
        type: 'number',
        min: 0,
        max: 1,
        default: extractNumber(material, 'metalness') ?? 0
      },
      transmission: {
        type: 'number',
        min: 0,
        max: 1,
        default: extractNumber(material, 'transmission') ?? 0
      }
    }
  });

  return applyMaterialOverrides(base, options.overrides);
}
