import type { Camera } from 'three';
import type { Scene } from 'three';
import type { NodeRepresentation } from 'three/examples/jsm/nodes/Nodes.js';
import { nodeObject } from 'three/tsl';

/**
 * Minimal shader node representation used across the post-processing helpers.
 * The type is derived from the public `nodeObject` helper so callers can
 * provide plain values, existing nodes or raw textures interchangeably.
 */
export type ShaderNodeLike<T = unknown> = ReturnType<typeof nodeObject<T>>;

export type RendererKind = 'webgpu' | 'webgl';

export interface DeviceCapabilities {
  maxSamples: number;
  supportsHalfFloat: boolean;
  supportsHistoryBuffer: boolean;
}

export interface FramegraphInputs {
  color: ShaderNodeLike;
  depth?: ShaderNodeLike;
  viewZ?: ShaderNodeLike;
  normal?: ShaderNodeLike;
  metalness?: ShaderNodeLike;
  roughness?: ShaderNodeLike;
  velocity?: ShaderNodeLike;
  history?: ShaderNodeLike;
  emissive?: ShaderNodeLike;
}

export interface PostFramegraphOptions {
  renderer: RendererKind;
  camera: Camera;
  scene: Scene;
  capabilities: DeviceCapabilities;
}

export interface PostEffectContext extends PostFramegraphOptions {
  inputs: FramegraphInputs;
}

export type PostEffectQuality = 'native' | 'fallback';

export interface CapabilityHint {
  renderer: RendererKind;
  description: string;
}

export interface AppliedEffect<TOptions> {
  output: ShaderNodeLike;
  options: TOptions;
  quality: PostEffectQuality;
  notes?: string[];
  resources?: Partial<FramegraphInputs>;
}

export interface PostEffectDescriptor<TOptions> {
  name: string;
  schema: { parse(data: unknown): TOptions };
  presets: Record<string, Partial<TOptions>>;
  capabilityHints: CapabilityHint[];
  create(input: ShaderNodeLike, context: PostEffectContext, options: TOptions): AppliedEffect<TOptions>;
}

export interface PostPassRequest<TOptions> {
  effect: PostEffectDescriptor<TOptions>;
  /**
   * Named preset to seed the configuration from. When omitted the schema
   * defaults are used.
   */
  preset?: string;
  /**
   * Manual overrides applied after the preset. Values are validated via the
   * descriptor schema.
   */
  options?: Partial<TOptions>;
}

export interface PostPassPlanEntry<TOptions = unknown> {
  effect: string;
  renderer: RendererKind;
  quality: PostEffectQuality;
  options: TOptions;
  notes?: string[];
}

export interface PostFramegraphPlan {
  output: ShaderNodeLike;
  inputs: FramegraphInputs;
  passes: PostPassPlanEntry[];
}

export type NodeLike = NodeRepresentation | ShaderNodeLike;
