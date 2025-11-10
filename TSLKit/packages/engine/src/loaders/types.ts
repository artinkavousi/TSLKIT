import type { Material } from 'three';
import type { MeshPhysicalNodeMaterial } from 'three/webgpu';

import type { MaterialPresetSnapshot } from '@tslstudio/tsl-kit/materials';

export interface MaterialXLoadOptions {
  readonly libraryPath?: string;
  readonly signal?: AbortSignal;
  readonly onProgress?: (event: ProgressEvent<EventTarget>) => void;
  readonly overrides?: Partial<MaterialPresetSnapshot>;
}

export interface MaterialXAsset {
  readonly material: MeshPhysicalNodeMaterial;
  readonly preset: MaterialPresetSnapshot;
}

export interface GLTFPresetOptions {
  readonly signal?: AbortSignal;
  readonly onProgress?: (event: ProgressEvent<EventTarget>) => void;
  readonly overrides?: Partial<MaterialPresetSnapshot>;
}

export interface GLTFPresetAsset {
  readonly scene: unknown;
  readonly materials: Array<{ material: Material; preset: MaterialPresetSnapshot }>;
}
