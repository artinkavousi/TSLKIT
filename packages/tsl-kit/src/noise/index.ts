/**
 * Placeholder interfaces for procedural noise nodes. Concrete implementations
 * will be ported from the curated repositories.
 */
export interface NoiseNodeDescriptor {
  readonly name: string;
  readonly dimensions: 2 | 3 | 4;
  readonly provenance: string;
}

export const registeredNoiseNodes: NoiseNodeDescriptor[] = [];

export function registerNoiseNode(descriptor: NoiseNodeDescriptor): void {
  if (registeredNoiseNodes.some((node) => node.name === descriptor.name)) {
    throw new Error(`Noise node "${descriptor.name}" already registered`);
  }

  registeredNoiseNodes.push(descriptor);
}
