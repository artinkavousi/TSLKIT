import { describe, expect, it } from 'vitest';

import { isWebGPUSupported } from './isWebGPUSupported.js';

describe('isWebGPUSupported', () => {
  it('returns false when navigator is missing', () => {
    expect(isWebGPUSupported({ navigator: null })).toBe(false);
  });

  it('returns true when gpu object exists', () => {
    const fakeNavigator = { gpu: {} } as unknown as Navigator;

    expect(isWebGPUSupported({ navigator: fakeNavigator })).toBe(true);
  });

  it('returns false when gpu property is undefined', () => {
    const fakeNavigator = { gpu: undefined } as unknown as Navigator;

    expect(isWebGPUSupported({ navigator: fakeNavigator })).toBe(false);
  });
});
