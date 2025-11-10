import type {
  MaterialPreset,
  PostStackPreset,
  PresetParameter,
  SchemaReference,
  TutorialEntry
} from '@tslstudio/tsl-kit/schemas';

export type PresetKind = MaterialPreset['kind'] | PostStackPreset['kind'];

export type { PresetParameter, SchemaReference };

export type Preset = MaterialPreset | PostStackPreset;

export type Tutorial = TutorialEntry;
