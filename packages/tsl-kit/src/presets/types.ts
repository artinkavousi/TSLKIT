import type { ComputePreset } from '../compute';
import type { MaterialPreset } from '../materials/presets/catalog';
import type { PostProcessingChain } from '../post';

export interface ScenePreset {
  id: string;
  label: string;
  summary: string;
  material: MaterialPreset | MaterialPreset[];
  compute?: ComputePreset | ComputePreset[];
  post?: PostProcessingChain | PostProcessingChain[];
  tags: string[];
}

export interface PresetRegistry {
  presets: ScenePreset[];
  findById(id: string): ScenePreset | undefined;
}

export function createPresetRegistry(presets: ScenePreset[]): PresetRegistry {
  const map = new Map(presets.map((preset) => [preset.id, preset]));
  return {
    presets,
    findById(id: string) {
      return map.get(id);
    }
  };
}
