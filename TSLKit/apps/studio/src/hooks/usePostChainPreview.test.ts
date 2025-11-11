import { renderHook } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { usePostChainPreview } from './usePostChainPreview.js';

describe('usePostChainPreview', () => {
  it('returns metadata for provided passes', () => {
    const { result } = renderHook(() =>
      usePostChainPreview([
        { type: 'bloom.standard', intensity: 1.0 },
        { type: 'tonemap.aces' },
        { type: 'aa.fxaa' }
      ])
    );

    expect(result.current).toHaveLength(3);
    expect(result.current[0].id).toBe('tsl.post.bloom.standard');
  });
});
