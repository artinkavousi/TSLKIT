import type { Camera, Scene } from 'three';
import { pass, depthPass } from 'three/src/nodes/display/PassNode.js';
import { nodeObject } from 'three/tsl';
import { merge } from '../utils/merge.js';
import type {
  FramegraphInputs,
  PostEffectDescriptor,
  PostFramegraphOptions,
  PostPassPlanEntry,
  PostPassRequest,
  PostFramegraphPlan,
  ShaderNodeLike
} from './types.js';
import type { AppliedEffect } from './types.js';

export interface ScenePassOptions {
  includeDepth?: boolean;
  colorTargetOptions?: Record<string, unknown>;
  depthTargetOptions?: Record<string, unknown>;
}

export interface ScenePassTargets extends FramegraphInputs {
  scenePass: ShaderNodeLike;
  depthPass?: ShaderNodeLike;
}

export const createScenePassTargets = (
  scene: Scene,
  camera: Camera,
  options: ScenePassOptions = {}
): ScenePassTargets => {
  const scenePassNode = pass(scene, camera, options.colorTargetOptions);
  const color = scenePassNode.getTextureNode?.('output') ?? nodeObject(scenePassNode);

  let depth: ShaderNodeLike | undefined;
  let viewZ: ShaderNodeLike | undefined;
  let depthPassNode: ShaderNodeLike | undefined;

  if (options.includeDepth !== false) {
    try {
      depth = scenePassNode.getTextureNode?.('depth');
    } catch {
      depth = undefined;
    }

    try {
      viewZ = scenePassNode.getViewZNode?.('depth');
    } catch {
      viewZ = undefined;
    }

    if (!depth || !viewZ) {
      depthPassNode = depthPass(scene, camera, options.depthTargetOptions);
      depth = depth ?? depthPassNode.getTextureNode?.('output');
      viewZ = viewZ ?? depthPassNode.getViewZNode?.('output');
    }
  }

  return {
    scenePass: scenePassNode,
    depthPass: depthPassNode,
    color,
    depth,
    viewZ
  };
};

const resolveOptions = <TOptions>(
  descriptor: PostEffectDescriptor<TOptions>,
  request: PostPassRequest<TOptions>
): TOptions => {
  const presetOptions = request.preset
    ? descriptor.presets[request.preset] ?? (() => {
        throw new Error(`Unknown preset "${request.preset}" for effect "${descriptor.name}".`);
      })()
    : {};

  const merged = merge(presetOptions, request.options ?? {});
  return descriptor.schema.parse(merged);
};

export const buildPostFramegraph = (
  baseInputs: FramegraphInputs,
  passRequests: PostPassRequest<unknown>[],
  options: PostFramegraphOptions
): PostFramegraphPlan => {
  let currentInputs: FramegraphInputs = { ...baseInputs };
  let currentColor: ShaderNodeLike = currentInputs.color;

  const passes: PostPassPlanEntry[] = [];

  for (const request of passRequests) {
    const descriptor = request.effect as PostEffectDescriptor<unknown>;
    const resolvedOptions = resolveOptions(descriptor, request as PostPassRequest<unknown>);

    const applied: AppliedEffect<unknown> = descriptor.create(currentColor, { ...options, inputs: currentInputs }, resolvedOptions);

    currentColor = applied.output;
    currentInputs = {
      ...currentInputs,
      ...applied.resources,
      color: currentColor
    };

    const entry: PostPassPlanEntry = {
      effect: descriptor.name,
      renderer: options.renderer,
      quality: applied.quality,
      options: applied.options
    };

    if (applied.notes && applied.notes.length > 0) {
      entry.notes = applied.notes;
    }

    passes.push(entry);
  }

  return {
    output: currentColor,
    inputs: currentInputs,
    passes
  };
};
