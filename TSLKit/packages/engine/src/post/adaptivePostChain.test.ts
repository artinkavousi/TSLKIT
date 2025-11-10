import { describe, expect, it, vi } from 'vitest';

import { FrameBudgetTracker } from '../performance/frameBudgetTracker.js';
import type { AdaptivePostPass } from '../performance/types.js';

import { AdaptivePostChain } from './adaptivePostChain.js';

function createPass(id: string, cost: number, enabled = true): AdaptivePostPass {
  let isEnabled = enabled;
  return {
    id,
    label: id,
    cost,
    isEnabled: () => isEnabled,
    enable: () => {
      isEnabled = true;
    },
    disable: () => {
      isEnabled = false;
    },
  };
}

describe('AdaptivePostChain', () => {
  it('disables the most expensive pass when the frame budget is exceeded', () => {
    const tracker = new FrameBudgetTracker({ budgetMs: 16, sampleSize: 1, hysteresisMs: 0 });
    const bloom = createPass('bloom', 4);
    const grain = createPass('grain', 1);
    const onDowngrade = vi.fn();
    const chain = new AdaptivePostChain([bloom, grain], tracker, { onDowngrade });

    chain.evaluate(0);
    chain.evaluate(10);
    chain.evaluate(40);

    expect(bloom.isEnabled()).toBe(false);
    expect(grain.isEnabled()).toBe(true);
    expect(onDowngrade).toHaveBeenCalledWith(
      bloom,
      expect.objectContaining({ budgetBreached: true }),
    );
  });

  it('re-enables passes when the budget recovers', () => {
    const tracker = new FrameBudgetTracker({ budgetMs: 16, sampleSize: 2, hysteresisMs: 0 });
    const bloom = createPass('bloom', 4);
    const grain = createPass('grain', 1);
    const onUpgrade = vi.fn();
    const chain = new AdaptivePostChain([bloom, grain], tracker, { onUpgrade });

    chain.evaluate(0);
    chain.evaluate(40);
    expect(bloom.isEnabled()).toBe(false);

    chain.evaluate(56);
    chain.evaluate(72);
    chain.evaluate(80);
    chain.evaluate(88);

    expect(bloom.isEnabled()).toBe(true);
    expect(onUpgrade).toHaveBeenCalledWith(
      bloom,
      expect.objectContaining({ budgetBreached: false }),
    );
  });
});
