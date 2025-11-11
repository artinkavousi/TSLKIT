import { useMemo } from 'react';
import { vec3 } from 'three/tsl';

import { createPostChain } from '@tslstudio/engine';
import type { PostEffectSpec } from '@tslstudio/tsl-kit/post';

export interface PostChainPreviewStage {
  id: string;
  label: string;
  description: string;
  tags: readonly string[];
  spec: PostEffectSpec;
}

export function usePostChainPreview(passes: PostEffectSpec[] | undefined): PostChainPreviewStage[] {
  return useMemo(() => {
    if (!passes || passes.length === 0) {
      return [];
    }

    const chain = createPostChain({ passes, baseColor: vec3(1.0, 1.0, 1.0) });

    return chain.stages.map((stage) => ({
      id: stage.metadata.id,
      label: stage.metadata.label,
      description: stage.metadata.description,
      tags: stage.metadata.tags,
      spec: stage.spec as PostEffectSpec
    }));
  }, [passes]);
}
