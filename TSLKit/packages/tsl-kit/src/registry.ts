import { z } from 'zod';
import {
  computeSpecSchema,
  materialSpecSchema,
  postChainSpecSchema,
  presetSchema,
  type ComputeSpecInput,
  type ComputeSpecOutput,
  type MaterialSpecInput,
  type MaterialSpecOutput,
  type PostChainSpecInput,
  type PostChainSpecOutput,
  type PresetSpecInput,
  type PresetSpecOutput,
  type MaterialPresetOutput,
  type PostPresetOutput,
  type ComputePresetOutput
} from './schemas/index.js';

interface RegistryState {
  materials: Map<string, MaterialHandle>;
  posts: Map<string, PostChainHandle>;
  computes: Map<string, ComputeHandle>;
  presets: Map<string, PresetSpecOutput>;
}

const cloneValue: <T>(value: T) => T = typeof structuredClone === 'function'
  ? structuredClone
  : <T>(value: T) => JSON.parse(JSON.stringify(value));

const registryState: RegistryState = {
  materials: new Map(),
  posts: new Map(),
  computes: new Map(),
  presets: new Map()
};

let materialCounter = 0;
let postCounter = 0;
let computeCounter = 0;

export interface MaterialHandle {
  kind: 'material';
  id: string;
  spec: MaterialSpecOutput;
  summary: string;
}

export interface PostChainHandle {
  kind: 'post';
  id: string;
  spec: PostChainSpecOutput;
  summary: string;
}

export interface ComputeHandle {
  kind: 'compute';
  id: string;
  spec: ComputeSpecOutput;
  workgroupSize: { x: number; y: number; z: number };
  dispatch: { x: number; y: number; z: number };
  status: 'queued' | 'completed';
  submittedAt: Date;
}

export type PresetApplicationResult =
  | { preset: MaterialPresetOutput; handle: MaterialHandle }
  | { preset: PostPresetOutput; handle: PostChainHandle }
  | { preset: ComputePresetOutput; handle: ComputeHandle };

const materialOverrideSchema = materialSpecSchema.partial({ deep: true });
const postOverrideSchema = postChainSpecSchema.partial({ deep: true });
const computeOverrideSchema = computeSpecSchema.partial({ deep: true });

type MaterialOverrides = z.infer<typeof materialOverrideSchema>;
type PostOverrides = z.infer<typeof postOverrideSchema>;
type ComputeOverrides = z.infer<typeof computeOverrideSchema>;

type PresetOverrides = MaterialOverrides | PostOverrides | ComputeOverrides | undefined;

function nextId(prefix: string, provided?: string): string {
  if (provided) {
    return provided;
  }

  switch (prefix) {
    case 'material':
      return `material-${++materialCounter}`;
    case 'post':
      return `post-${++postCounter}`;
    case 'compute':
      return `compute-${++computeCounter}`;
    default:
      return `${prefix}-${Date.now()}`;
  }
}

function materialSummary(spec: MaterialSpecOutput): string {
  return `${spec.name} (${spec.model}) · ${spec.layers.length} layer${spec.layers.length === 1 ? '' : 's'}`;
}

function postSummary(spec: PostChainSpecOutput): string {
  return `${spec.name} · ${spec.passes.length} pass${spec.passes.length === 1 ? '' : 'es'}`;
}

function deepMerge<T>(base: T, overrides: unknown): T {
  if (overrides === undefined || overrides === null) {
    return cloneValue(base);
  }

  if (Array.isArray(overrides)) {
    return overrides as T;
  }

  if (typeof overrides === 'object') {
    if (typeof base !== 'object' || base === null) {
      return overrides as T;
    }

    const result: Record<string, unknown> = {};
    const baseRecord = base as Record<string, unknown>;

    for (const key of Object.keys(baseRecord)) {
      result[key] = baseRecord[key];
    }

    for (const [key, value] of Object.entries(overrides)) {
      result[key] = deepMerge(result[key], value);
    }

    return result as T;
  }

  return overrides as T;
}

function registerHandle<T extends MaterialHandle | PostChainHandle | ComputeHandle>(
  map: Map<string, T>,
  handle: T
): T {
  map.set(handle.id, handle);
  return handle;
}

export function makeMaterial(input: MaterialSpecInput): MaterialHandle {
  const parsed = materialSpecSchema.parse(input);
  const id = nextId('material', parsed.id);
  const spec: MaterialSpecOutput = { ...parsed, id };
  const handle: MaterialHandle = {
    kind: 'material',
    id,
    spec,
    summary: materialSummary(spec)
  };
  return registerHandle(registryState.materials, handle);
}

export function makePostChain(input: PostChainSpecInput): PostChainHandle {
  const parsed = postChainSpecSchema.parse(input);
  const id = nextId('post', parsed.id);
  const spec: PostChainSpecOutput = { ...parsed, id };
  const handle: PostChainHandle = {
    kind: 'post',
    id,
    spec,
    summary: postSummary(spec)
  };
  return registerHandle(registryState.posts, handle);
}

export function runCompute(input: ComputeSpecInput): ComputeHandle {
  const parsed = computeSpecSchema.parse(input);
  const id = nextId('compute', parsed.id);
  const spec: ComputeSpecOutput = { ...parsed, id };
  const handle: ComputeHandle = {
    kind: 'compute',
    id,
    spec,
    workgroupSize: spec.workgroupSize,
    dispatch: spec.dispatch,
    status: 'completed',
    submittedAt: new Date()
  };
  return registerHandle(registryState.computes, handle);
}

export function registerPreset(preset: PresetSpecInput): PresetSpecOutput {
  const parsed = presetSchema.parse(preset);
  registryState.presets.set(parsed.id, parsed);
  return parsed;
}

export function getPreset(id: string): PresetSpecOutput | undefined {
  return registryState.presets.get(id);
}

function normalizeOverrides(target: PresetSpecOutput['target'], overrides: PresetOverrides) {
  if (!overrides) {
    return undefined;
  }

  switch (target) {
    case 'material':
      return materialOverrideSchema.parse(overrides);
    case 'post':
      return postOverrideSchema.parse(overrides);
    case 'compute':
      return computeOverrideSchema.parse(overrides);
    default:
      return overrides;
  }
}

export function applyPreset(
  presetOrId: string | PresetSpecInput,
  overrides?: PresetOverrides
): PresetApplicationResult {
  const preset =
    typeof presetOrId === 'string'
      ? registryState.presets.get(presetOrId) ?? (() => {
          throw new Error(`Unknown preset: ${presetOrId}`);
        })()
      : registerPreset(presetOrId);

  const parsedOverrides = normalizeOverrides(preset.target, overrides);
  const mergedSpec = parsedOverrides ? deepMerge(preset.spec, parsedOverrides) : cloneValue(preset.spec);

  switch (preset.target) {
    case 'material': {
      const handle = makeMaterial(mergedSpec as MaterialSpecInput);
      return { preset: preset as MaterialPresetOutput, handle };
    }
    case 'post': {
      const handle = makePostChain(mergedSpec as PostChainSpecInput);
      return { preset: preset as PostPresetOutput, handle };
    }
    case 'compute': {
      const handle = runCompute(mergedSpec as ComputeSpecInput);
      return { preset: preset as ComputePresetOutput, handle };
    }
    default:
      throw new Error(`Unsupported preset target: ${(preset as PresetSpecOutput).target}`);
  }
}

export function listMaterials(): MaterialHandle[] {
  return Array.from(registryState.materials.values());
}

export function listPostChains(): PostChainHandle[] {
  return Array.from(registryState.posts.values());
}

export function listComputes(): ComputeHandle[] {
  return Array.from(registryState.computes.values());
}

export function listPresets(): PresetSpecOutput[] {
  return Array.from(registryState.presets.values());
}

export function clearRegistry(): void {
  registryState.materials.clear();
  registryState.posts.clear();
  registryState.computes.clear();
  registryState.presets.clear();
  materialCounter = 0;
  postCounter = 0;
  computeCounter = 0;
  defaultPresets.forEach(registerPreset);
}

const defaultPresets: PresetSpecInput[] = [
  {
    id: 'tsl.materials.matte',
    label: 'Matte Surface',
    target: 'material',
    spec: {
      name: 'Matte Surface',
      model: 'pbr',
      layers: [
        {
          id: 'albedo',
          type: 'baseColor',
          generator: { kind: 'texture', ref: 'albedo', params: {} },
          inputs: {}
        }
      ],
      uniforms: [],
      parameters: [],
      metadata: { tags: ['default'] }
    }
  },
  {
    id: 'tsl.post.cinematic',
    label: 'Cinematic Tone Mapping',
    target: 'post',
    spec: {
      name: 'Cinematic Tone Mapping',
      passes: [
        { id: 'grade', effect: 'colorGrade', inputs: { lut: 'filmic' } },
        { id: 'vignette', effect: 'vignette', priority: 1 }
      ],
      output: 'screen',
      sharedUniforms: {}
    }
  },
  {
    id: 'tsl.compute.integrate',
    label: 'Particle Integration',
    target: 'compute',
    spec: {
      name: 'Particle Integration',
      entry: 'integrate',
      workgroupSize: [8, 4, 1],
      dispatch: [32, 16, 1],
      resources: [
        { name: 'positions', binding: 0, kind: 'storage' },
        { name: 'velocities', binding: 1, kind: 'storage' }
      ],
      constants: {},
      parameters: [],
      outputs: []
    }
  }
];

defaultPresets.forEach(registerPreset);
