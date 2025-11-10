import { describe, expect, it, vi } from 'vitest';

import { FrameBudgetTracker } from './frameBudgetTracker.js';

function stepTracker(tracker: FrameBudgetTracker, timestamps: number[]): void {
  timestamps.forEach((timestamp) => {
    tracker.record(timestamp);
  });
}

describe('FrameBudgetTracker', () => {
  it('tracks average frame time and fps', () => {
    const tracker = new FrameBudgetTracker({ sampleSize: 5, budgetMs: 16, hysteresisMs: 0 });

    stepTracker(tracker, [0, 17, 34, 51, 68, 85]);

    const stats = tracker.stats;

    expect(stats.averageFrameTime).toBeGreaterThan(16);
    expect(stats.averageFPS).toBeGreaterThan(0);
    expect(stats.sampleSize).toBe(5);
  });

  it('invokes callbacks when breaching and recovering budget', () => {
    const onExceeded = vi.fn();
    const onRecovered = vi.fn();
    const tracker = new FrameBudgetTracker({
      budgetMs: 16,
      sampleSize: 2,
      hysteresisMs: 0,
      onBudgetExceeded: onExceeded,
      onBudgetRecovered: onRecovered,
    });

    stepTracker(tracker, [0, 40, 80, 120]);
    expect(onExceeded).toHaveBeenCalledOnce();
    expect(tracker.stats.budgetBreached).toBe(true);

    stepTracker(tracker, [136, 150, 165, 180, 195, 210]);
    expect(onRecovered).toHaveBeenCalledOnce();
    expect(tracker.stats.budgetBreached).toBe(false);
  });
});
