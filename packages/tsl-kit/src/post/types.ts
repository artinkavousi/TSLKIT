export interface PostEffectPass {
  name: string;
  shader: string;
  defines?: Record<string, number | string>;
  inputs?: string[];
  outputs?: string[];
}

export interface PostProcessingChain {
  id: string;
  label: string;
  description: string;
  passes: PostEffectPass[];
}
