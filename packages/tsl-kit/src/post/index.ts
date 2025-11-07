import { grainTextureEffect } from '../ported/fragments/post/grainTextureEffect.js';
import { vignetteEffect } from '../ported/fragments/post/vignetteEffect.js';

export interface PostEffectDescriptor {
  readonly name: string;
  readonly provenance: string;
  readonly node: unknown;
}

const effectRegistry = new Map<string, PostEffectDescriptor>();

function registerEffect(descriptor: PostEffectDescriptor): void {
  if (effectRegistry.has(descriptor.name)) {
    throw new Error(`Post effect "${descriptor.name}" already registered`);
  }

  effectRegistry.set(descriptor.name, descriptor);
}

registerEffect({
  name: 'grainTextureEffect',
  provenance:
    'RESOURCES/REPOSITORIES/portfolio examples/fragments-boilerplate-main/src/tsl/post_processing/grain_texture_effect.ts',
  node: grainTextureEffect,
});

registerEffect({
  name: 'vignetteEffect',
  provenance:
    'RESOURCES/REPOSITORIES/portfolio examples/fragments-boilerplate-main/src/tsl/post_processing/vignette_effect.ts',
  node: vignetteEffect,
});

export interface PostPassConfig {
  readonly name: string;
  readonly params: Record<string, unknown>;
}

export interface PostChainHandle {
  readonly id: string;
  readonly passes: readonly PostPassConfig[];
  readonly dispose: () => void;
}

export function getPostEffect(name: string): PostEffectDescriptor | undefined {
  return effectRegistry.get(name);
}

export function listPostEffects(): readonly PostEffectDescriptor[] {
  return Array.from(effectRegistry.values());
}

export function makePostChain(passes: readonly PostPassConfig[]): PostChainHandle {
  return {
    id: `post:${passes.map((pass) => pass.name).join('+')}`,
    passes,
    dispose: () => {
      /* TODO: release framegraph resources */
    },
  };
}

export { grainTextureEffect, vignetteEffect };
