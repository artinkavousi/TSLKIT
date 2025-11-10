export type PresetKind = 'material' | 'post';

export type PresetParameterType = 'number' | 'color' | 'boolean';

export interface PresetParameter {
  name: string;
  label: string;
  type: PresetParameterType;
  description?: string;
  defaultValue: number | string | boolean;
  min?: number;
  max?: number;
  step?: number;
}

export interface Preset {
  id: string;
  name: string;
  kind: PresetKind;
  description: string;
  tags: string[];
  previewColor: string;
  parameters: PresetParameter[];
  noiseSpec?: {
    type: 'simplex' | 'curl' | 'fbm' | 'voronoi' | 'domainWarp';
    frequency?: number;
    amplitude?: number;
    seed?: number;
    octaves?: number;
    warp?: number;
  };
  postStack?: {
    stages: string[];
  };
  documentation?: string;
}

export interface Tutorial {
  id: string;
  title: string;
  excerpt: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  presetId: string;
  durationMinutes: number;
}
