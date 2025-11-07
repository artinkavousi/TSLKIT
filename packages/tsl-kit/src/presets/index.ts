export interface PresetMetadata {
  readonly id: string;
  readonly title: string;
  readonly description: string;
  readonly phase: string;
  readonly tags: readonly string[];
  readonly provenance: readonly string[];
}

export const presetCatalog: PresetMetadata[] = [];

export function registerPreset(metadata: PresetMetadata): void {
  if (presetCatalog.some((preset) => preset.id === metadata.id)) {
    throw new Error(`Preset with id ${metadata.id} already registered`);
  }

  presetCatalog.push(metadata);
}
