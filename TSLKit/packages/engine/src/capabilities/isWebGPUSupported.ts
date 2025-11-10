export interface WebGPUAvailabilityOptions {
  readonly navigator?: Navigator | null;
}

/**
 * Runtime-safe feature detection for WebGPU. Browsers that do not expose the `navigator.gpu`
 * field should fall back to WebGL. The optional `navigator` parameter keeps the function
 * testable in Node environments where `globalThis.navigator` is undefined.
 */
export function isWebGPUSupported(options: WebGPUAvailabilityOptions = {}): boolean {
  const candidateNavigator = options.navigator ?? (globalThis as typeof globalThis & { navigator?: Navigator }).navigator;

  if (!candidateNavigator) {
    return false;
  }

  // Some browsers expose the property but return undefined when feature-flagged off.
  return typeof (candidateNavigator as Navigator & { gpu?: unknown }).gpu !== 'undefined';
}
