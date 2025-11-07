/**
 * Entry point for material builders. Concrete implementations will wrap
 * ported TSL node graphs as described in the PRD.
 */
export interface MaterialHandle {
  readonly id: string;
  readonly dispose: () => void;
}

export interface MaterialFactoryOptions {
  readonly name: string;
  readonly schemaRef?: string;
}

export function makeMaterial(options: MaterialFactoryOptions): MaterialHandle {
  const { name } = options;
  return {
    id: `material:${name}`,
    dispose: () => {
      /* placeholder for release logic */
    }
  };
}
