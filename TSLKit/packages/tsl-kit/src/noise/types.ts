export type NoiseType =
  | 'simplex'
  | 'simplex2d'
  | 'simplex4d'
  | 'curl'
  | 'curl4d'
  | 'fbm'
  | 'perlin'
  | 'voronoi'
  | 'turbulence'
  | 'domainWarp';

export interface NoiseSpec {
  type: NoiseType;
  frequency?: number;
  amplitude?: number;
  seed?: number;
  octaves?: number;
  warp?: number;
}

export interface NoiseParameterDescriptor {
  readonly name: keyof Required<Omit<NoiseSpec, 'type'>>;
  readonly label: string;
  readonly description: string;
  readonly type: 'number';
  readonly min: number;
  readonly max: number;
  readonly step: number;
  readonly defaultValue: number;
  readonly unit?: string;
}

export interface NoiseMetadata {
  readonly id: string;
  readonly label: string;
  readonly description: string;
  readonly parameters: readonly NoiseParameterDescriptor[];
  readonly tags: readonly string[];
}

export interface NormalizedNoiseSpec {
  readonly type: NoiseType;
  readonly frequency: number;
  readonly amplitude: number;
  readonly seed: number;
  readonly octaves: number;
  readonly warp: number;
}

export interface NoiseRuntimeNode {
  readonly kind: 'tsl.noise';
  readonly type: NoiseType;
  readonly spec: NormalizedNoiseSpec;
}

export interface NoiseNodeFactoryResult {
  readonly node: NoiseRuntimeNode;
  readonly metadata: NoiseMetadata;
}

export interface NoiseNodeBuilderContext {
  normalize(spec: NoiseSpec): NormalizedNoiseSpec;
}

export interface NoiseNodeDefinition {
  readonly type: NoiseType;
  readonly metadata: NoiseMetadata;
  build(context: NoiseNodeBuilderContext, spec: NoiseSpec): NoiseRuntimeNode;
}
