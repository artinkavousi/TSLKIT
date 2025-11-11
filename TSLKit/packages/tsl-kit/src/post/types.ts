import type { ShaderNodeObject } from 'three/tsl';

export type PostEffectType =
  | 'bloom.standard'
  | 'bloom.anamorphic'
  | 'bloom.luma'
  | 'dof.circle'
  | 'tonemap.reinhard'
  | 'tonemap.aces'
  | 'tonemap.uncharted2'
  | 'aa.fxaa'
  | 'aa.taa'
  | 'motion.blur'
  | 'gi.ssr'
  | 'gi.gtao'
  | 'gi.ssgi';

export interface BloomStandardSpec {
  type: 'bloom.standard';
  intensity?: number;
  radius?: number;
  threshold?: number;
}

export interface BloomAnamorphicSpec {
  type: 'bloom.anamorphic';
  intensity?: number;
  threshold?: number;
  anamorphicRatio?: number;
}

export interface BloomLumaSpec {
  type: 'bloom.luma';
  intensity?: number;
  radius?: number;
  threshold?: number;
}

export interface DepthOfFieldSpec {
  type: 'dof.circle';
  focusDistance?: number;
  focusRange?: number;
  bokehScale?: number;
}

export interface TonemapReinhardSpec {
  type: 'tonemap.reinhard';
  exposure?: number;
}

export interface TonemapAcesSpec {
  type: 'tonemap.aces';
  exposure?: number;
}

export interface TonemapUncharted2Spec {
  type: 'tonemap.uncharted2';
  exposure?: number;
}

export interface FXAASpec {
  type: 'aa.fxaa';
  spanMax?: number;
  reduceMin?: number;
}

export interface TAASpec {
  type: 'aa.taa';
  blendFactor?: number;
  jitterSpread?: number;
}

export interface MotionBlurSpec {
  type: 'motion.blur';
  intensity?: number;
  samples?: number;
}

export interface SSRSpec {
  type: 'gi.ssr';
  intensity?: number;
  maxDistance?: number;
  thickness?: number;
}

export interface GTAOSpec {
  type: 'gi.gtao';
  intensity?: number;
  radius?: number;
  falloff?: number;
}

export interface SSGISpec {
  type: 'gi.ssgi';
  intensity?: number;
  radius?: number;
  temporalBlend?: number;
}

export type PostEffectSpec =
  | BloomStandardSpec
  | BloomAnamorphicSpec
  | BloomLumaSpec
  | DepthOfFieldSpec
  | TonemapReinhardSpec
  | TonemapAcesSpec
  | TonemapUncharted2Spec
  | FXAASpec
  | TAASpec
  | MotionBlurSpec
  | SSRSpec
  | GTAOSpec
  | SSGISpec;

export interface NormalizedBloomStandardSpec extends BloomStandardSpec {
  intensity: number;
  radius: number;
  threshold: number;
}

export interface NormalizedBloomAnamorphicSpec extends BloomAnamorphicSpec {
  intensity: number;
  threshold: number;
  anamorphicRatio: number;
}

export interface NormalizedBloomLumaSpec extends BloomLumaSpec {
  intensity: number;
  radius: number;
  threshold: number;
}

export interface NormalizedDepthOfFieldSpec extends DepthOfFieldSpec {
  focusDistance: number;
  focusRange: number;
  bokehScale: number;
}

export interface NormalizedTonemapReinhardSpec extends TonemapReinhardSpec {
  exposure: number;
}

export interface NormalizedTonemapAcesSpec extends TonemapAcesSpec {
  exposure: number;
}

export interface NormalizedTonemapUncharted2Spec extends TonemapUncharted2Spec {
  exposure: number;
}

export interface NormalizedFXAASpec extends FXAASpec {
  spanMax: number;
  reduceMin: number;
}

export interface NormalizedTAASpec extends TAASpec {
  blendFactor: number;
  jitterSpread: number;
}

export interface NormalizedMotionBlurSpec extends MotionBlurSpec {
  intensity: number;
  samples: number;
}

export interface NormalizedSSRSpec extends SSRSpec {
  intensity: number;
  maxDistance: number;
  thickness: number;
}

export interface NormalizedGTAOSpec extends GTAOSpec {
  intensity: number;
  radius: number;
  falloff: number;
}

export interface NormalizedSSGISpec extends SSGISpec {
  intensity: number;
  radius: number;
  temporalBlend: number;
}

export type NormalizedPostEffectSpec =
  | NormalizedBloomStandardSpec
  | NormalizedBloomAnamorphicSpec
  | NormalizedBloomLumaSpec
  | NormalizedDepthOfFieldSpec
  | NormalizedTonemapReinhardSpec
  | NormalizedTonemapAcesSpec
  | NormalizedTonemapUncharted2Spec
  | NormalizedFXAASpec
  | NormalizedTAASpec
  | NormalizedMotionBlurSpec
  | NormalizedSSRSpec
  | NormalizedGTAOSpec
  | NormalizedSSGISpec;

export type NormalizedPostEffectSpecOf<TType extends PostEffectType> = Extract<
  NormalizedPostEffectSpec,
  { type: TType }
>;

export interface PostParameterDescriptor {
  readonly name: string;
  readonly label: string;
  readonly description: string;
  readonly type: 'number' | 'boolean';
  readonly min?: number;
  readonly max?: number;
  readonly step?: number;
  readonly defaultValue: number | boolean;
}

export interface PostEffectMetadata {
  readonly id: string;
  readonly label: string;
  readonly description: string;
  readonly parameters: readonly PostParameterDescriptor[];
  readonly tags: readonly string[];
}

export interface PostPassFactoryContext {
  readonly depth?: ShaderNodeObject<any>;
  readonly velocity?: ShaderNodeObject<any>;
  readonly previousColor?: ShaderNodeObject<any>;
}

export interface PostPassContextNodes {
  readonly depth: ShaderNodeObject<any>;
  readonly velocity: ShaderNodeObject<any>;
  readonly previousColor: ShaderNodeObject<any>;
}

export interface PostPassDefinition<TType extends PostEffectType, TSpec extends PostEffectSpec> {
  readonly type: TType;
  readonly metadata: PostEffectMetadata;
  normalize(spec: TSpec): NormalizedPostEffectSpecOf<TType>;
  build(
    input: ShaderNodeObject<any>,
    spec: NormalizedPostEffectSpecOf<TType>,
    context: PostPassContextNodes
  ): ShaderNodeObject<any>;
}

export interface PostPassBuildResult<TType extends PostEffectType> {
  readonly type: TType;
  readonly spec: NormalizedPostEffectSpecOf<TType>;
  readonly metadata: PostEffectMetadata;
  readonly node: ShaderNodeObject<any>;
}
