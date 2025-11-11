import { describe, expect, it, vi } from 'vitest';
import { vec3 } from 'three/tsl';

import type { PostEffectSpec } from '@tslstudio/tsl-kit/post';

import { createPostChain } from './createPostChain.js';

describe('createPostChain', () => {
  it('composes passes using the provided pass factory', () => {
    const passes: PostEffectSpec[] = [
      { type: 'bloom.standard', intensity: 1.1 },
      { type: 'tonemap.aces', exposure: 1.2 }
    ];

    const sceneStub = { kind: 'scene' } as any;
    const cameraStub = { kind: 'camera' } as any;
    const getTextureNode = vi.fn(() => vec3(1.0, 0.9, 0.7));
    const passStub = vi.fn(() => ({ getTextureNode }));

    const result = createPostChain({
      scene: sceneStub,
      camera: cameraStub,
      passes,
      passFactory: passStub
    });

    expect(passStub).toHaveBeenCalledWith(sceneStub, cameraStub);
    expect(result.stages).toHaveLength(2);
    expect(result.output).toBeDefined();
  });

  it('falls back to base color when no scene pass is provided', () => {
    const baseColor = vec3(0.3, 0.4, 0.5);
    const passes: PostEffectSpec[] = [{ type: 'aa.fxaa' }];

    const result = createPostChain({ passes, baseColor });
    expect(result.scenePass).toBeNull();
    expect(result.stages[0].metadata.id).toBe('tsl.post.aa.fxaa');
  });
});
