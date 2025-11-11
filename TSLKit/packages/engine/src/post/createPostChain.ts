import type { Camera, Scene } from 'three';
import { pass, vec3 } from 'three/tsl';
import type { ShaderNodeObject } from 'three/tsl';

import {
  buildPostPass,
  type NormalizedPostEffectSpecOf,
  type PostEffectMetadata,
  type PostEffectSpec,
  type PostEffectType,
  type PostPassBuildResult,
  type PostPassFactoryContext
} from '@tslstudio/tsl-kit/post';

export interface PostChainStage<TType extends PostEffectType = PostEffectType>
  extends PostPassBuildResult<TType> {}

export interface CreatePostChainOptions {
  scene?: Scene;
  camera?: Camera;
  passes: PostEffectSpec[];
  baseColor?: ShaderNodeObject<any>;
  context?: PostPassFactoryContext;
  passFactory?: typeof pass;
}

export interface PostChainResult {
  readonly scenePass: unknown;
  readonly stages: PostChainStage[];
  readonly output: ShaderNodeObject<any>;
}

export function createPostChain(options: CreatePostChainOptions): PostChainResult {
  const { scene, camera, passes, baseColor, context, passFactory } = options;
  const factory = passFactory ?? pass;

  let scenePass: unknown = null;
  let colorNode: ShaderNodeObject<any> = baseColor ?? vec3(0.0, 0.0, 0.0);

  if (scene && camera) {
    scenePass = factory(scene, camera);

    if (scenePass && typeof (scenePass as any).getTextureNode === 'function') {
      colorNode = (scenePass as any).getTextureNode('output');
    }
  }

  const stages: PostChainStage[] = [];
  let currentNode = colorNode;

  for (const passSpec of passes) {
    const result = buildPostPass(currentNode, passSpec, context);
    currentNode = result.node;
    stages.push(result);
  }

  return {
    scenePass,
    stages,
    output: currentNode
  };
}

export function summarizePostChain(
  stages: PostChainStage[]
): Array<{ metadata: PostEffectMetadata; spec: NormalizedPostEffectSpecOf<PostEffectType> }> {
  return stages.map((stage) => ({ metadata: stage.metadata, spec: stage.spec }));
}
