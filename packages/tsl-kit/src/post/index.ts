export interface PostPassConfig {
  readonly name: string;
  readonly params: Record<string, unknown>;
}

export interface PostChainHandle {
  readonly id: string;
  readonly passes: readonly PostPassConfig[];
  readonly dispose: () => void;
}

export function makePostChain(passes: readonly PostPassConfig[]): PostChainHandle {
  return {
    id: `post:${passes.map((pass) => pass.name).join('+')}`,
    passes,
    dispose: () => {
      /* TODO: release framegraph resources */
    }
  };
}
