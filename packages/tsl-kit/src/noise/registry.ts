import type {
  NoiseMetadata,
  NoiseNodeBuilderContext,
  NoiseNodeDefinition,
  NoiseRuntimeNode,
  NoiseSpec,
  NoiseType,
  NormalizedNoiseSpec
} from './types.js';

const NOISE_DEFAULTS: Record<NoiseType, NormalizedNoiseSpec> = {
  simplex: {
    type: 'simplex',
    frequency: 1,
    amplitude: 1,
    seed: 0,
    octaves: 1,
    warp: 0
  },
  curl: {
    type: 'curl',
    frequency: 1,
    amplitude: 1,
    seed: 0,
    octaves: 1,
    warp: 0.5
  },
  fbm: {
    type: 'fbm',
    frequency: 1,
    amplitude: 1,
    seed: 0,
    octaves: 4,
    warp: 0.75
  },
  voronoi: {
    type: 'voronoi',
    frequency: 1,
    amplitude: 1,
    seed: 0,
    octaves: 2,
    warp: 0
  },
  domainWarp: {
    type: 'domainWarp',
    frequency: 1,
    amplitude: 1,
    seed: 0,
    octaves: 3,
    warp: 1.5
  }
};

const COMMON_PARAMETERS: NoiseMetadata['parameters'] = [
  {
    name: 'frequency',
    label: 'Frequency',
    description: 'Base tiling frequency of the noise field.',
    type: 'number',
    min: 0.01,
    max: 32,
    step: 0.01,
    defaultValue: 1,
    unit: 'Hz'
  },
  {
    name: 'amplitude',
    label: 'Amplitude',
    description: 'Multiplier applied to the final noise value.',
    type: 'number',
    min: 0,
    max: 10,
    step: 0.01,
    defaultValue: 1
  },
  {
    name: 'seed',
    label: 'Seed',
    description: 'Deterministic seed for reproducible noise.',
    type: 'number',
    min: 0,
    max: 9999,
    step: 1,
    defaultValue: 0
  },
  {
    name: 'octaves',
    label: 'Octaves',
    description: 'Number of fractal octaves to accumulate.',
    type: 'number',
    min: 1,
    max: 8,
    step: 1,
    defaultValue: 1
  },
  {
    name: 'warp',
    label: 'Domain Warp',
    description: 'Warp intensity applied before evaluating noise.',
    type: 'number',
    min: 0,
    max: 4,
    step: 0.01,
    defaultValue: 0
  }
];

const NOISE_METADATA: Record<NoiseType, NoiseMetadata> = {
  simplex: {
    id: 'tsl.noise.simplex',
    label: 'Simplex Noise',
    description:
      'Canonical simplex noise with adjustable frequency, amplitude and seed controls.',
    parameters: COMMON_PARAMETERS,
    tags: ['procedural', 'foundation', 'animated']
  },
  curl: {
    id: 'tsl.noise.curl',
    label: 'Curl Noise',
    description:
      'Divergence-free curl noise ideal for velocity fields and flow effects.',
    parameters: COMMON_PARAMETERS.map((parameter) =>
      parameter.name === 'warp'
        ? {
            ...parameter,
            defaultValue: 0.5,
            description: 'Warp strength applied to the base simplex field before curling.'
          }
        : parameter
    ),
    tags: ['vector', 'simulation', 'flow']
  },
  fbm: {
    id: 'tsl.noise.fbm',
    label: 'Fractal Brownian Motion',
    description:
      'Layered simplex noise with adjustable octave accumulation for natural surfaces.',
    parameters: COMMON_PARAMETERS.map((parameter) =>
      parameter.name === 'octaves'
        ? { ...parameter, defaultValue: 4, max: 8 }
        : parameter.name === 'warp'
          ? { ...parameter, defaultValue: 0.75 }
          : parameter
    ),
    tags: ['procedural', 'terrain', 'organic']
  },
  voronoi: {
    id: 'tsl.noise.voronoi',
    label: 'Voronoi Noise',
    description:
      'Cell-based Voronoi noise that can drive crystal or cellular materials.',
    parameters: COMMON_PARAMETERS.map((parameter) =>
      parameter.name === 'warp' ? { ...parameter, max: 1 } : parameter
    ),
    tags: ['cells', 'masking', 'stylized']
  },
  domainWarp: {
    id: 'tsl.noise.domainWarp',
    label: 'Domain Warp',
    description:
      'Meta noise that warps coordinates using an internal simplex pass.',
    parameters: COMMON_PARAMETERS.map((parameter) =>
      parameter.name === 'warp'
        ? { ...parameter, defaultValue: 1.5, max: 5 }
        : parameter
    ),
    tags: ['advanced', 'utility', 'displacement']
  }
};

function normalizeSpec(type: NoiseType, spec: NoiseSpec): NormalizedNoiseSpec {
  const defaults = NOISE_DEFAULTS[type];
  return {
    type,
    frequency: spec.frequency ?? defaults.frequency,
    amplitude: spec.amplitude ?? defaults.amplitude,
    seed: spec.seed ?? defaults.seed,
    octaves: spec.octaves ?? defaults.octaves,
    warp: spec.warp ?? defaults.warp
  };
}

function createRuntimeNode(normalized: NormalizedNoiseSpec): NoiseRuntimeNode {
  return {
    kind: 'tsl.noise',
    type: normalized.type,
    spec: normalized
  };
}

const BUILT_IN_DEFINITIONS: Record<NoiseType, NoiseNodeDefinition> = {
  simplex: {
    type: 'simplex',
    metadata: NOISE_METADATA.simplex,
    build: ({ normalize }, spec) => createRuntimeNode(normalize({ ...spec, type: 'simplex' }))
  },
  curl: {
    type: 'curl',
    metadata: NOISE_METADATA.curl,
    build: ({ normalize }, spec) => createRuntimeNode(normalize({ ...spec, type: 'curl' }))
  },
  fbm: {
    type: 'fbm',
    metadata: NOISE_METADATA.fbm,
    build: ({ normalize }, spec) => createRuntimeNode(normalize({ ...spec, type: 'fbm' }))
  },
  voronoi: {
    type: 'voronoi',
    metadata: NOISE_METADATA.voronoi,
    build: ({ normalize }, spec) => createRuntimeNode(normalize({ ...spec, type: 'voronoi' }))
  },
  domainWarp: {
    type: 'domainWarp',
    metadata: NOISE_METADATA.domainWarp,
    build: ({ normalize }, spec) => createRuntimeNode(normalize({ ...spec, type: 'domainWarp' }))
  }
};

export class NoiseRegistry {
  private readonly definitions = new Map<NoiseType, NoiseNodeDefinition>();

  constructor() {
    Object.values(BUILT_IN_DEFINITIONS).forEach((definition) => {
      this.definitions.set(definition.type, definition);
    });
  }

  register(definition: NoiseNodeDefinition): void {
    this.definitions.set(definition.type, definition);
  }

  get(type: NoiseType): NoiseNodeDefinition | undefined {
    return this.definitions.get(type);
  }

  list(): NoiseMetadata[] {
    return Array.from(this.definitions.values()).map((definition) => definition.metadata);
  }
}

export const noiseRegistry = new NoiseRegistry();

export const noiseBuilderContext: NoiseNodeBuilderContext = {
  normalize(spec: NoiseSpec): NormalizedNoiseSpec {
    return normalizeSpec(spec.type, spec);
  }
};

export function buildNoiseNode(spec: NoiseSpec): { metadata: NoiseMetadata; node: NoiseRuntimeNode } {
  const definition = noiseRegistry.get(spec.type);
  if (!definition) {
    throw new Error(`Unknown noise type: ${spec.type}`);
  }

  const node = definition.build(noiseBuilderContext, spec);

  return {
    metadata: definition.metadata,
    node
  };
}

export function getNoiseMetadata(type?: NoiseType): NoiseMetadata | NoiseMetadata[] {
  if (type) {
    const definition = noiseRegistry.get(type);
    if (!definition) {
      throw new Error(`Unknown noise type: ${type}`);
    }

    return definition.metadata;
  }

  return noiseRegistry.list();
}
