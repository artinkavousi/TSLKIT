import { grainTextureEffect } from '../ported/fragments/post/grainTextureEffect.js';
import { vignetteEffect } from '../ported/fragments/post/vignetteEffect.js';
import { pixellationEffect } from '../ported/fragments/post/pixellationEffect.js';
import { lcdEffect } from '../ported/fragments/post/lcdEffect.js';
import { speckedNoiseEffect } from '../ported/fragments/post/speckledNoiseEffect.js';

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

registerEffect({
  name: 'pixellationEffect',
  provenance:
    'RESOURCES/REPOSITORIES/portfolio examples/fragments-boilerplate-main/src/tsl/post_processing/pixellation_effect.ts',
  node: pixellationEffect,
});

registerEffect({
  name: 'lcdEffect',
  provenance:
    'RESOURCES/REPOSITORIES/portfolio examples/fragments-boilerplate-main/src/tsl/post_processing/lcd_effect.ts',
  node: lcdEffect,
});

registerEffect({
  name: 'speckedNoiseEffect',
  provenance:
    'RESOURCES/REPOSITORIES/portfolio examples/fragments-boilerplate-main/src/tsl/post_processing/speckled_noise_effect.ts',
  node: speckedNoiseEffect,
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

export {
  grainTextureEffect,
  vignetteEffect,
  pixellationEffect,
  lcdEffect,
  speckedNoiseEffect,
};
