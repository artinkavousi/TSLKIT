import type { FrameBudgetTracker } from '../performance/frameBudgetTracker.js';
import type { AdaptivePostPass, FrameBudgetStats } from '../performance/types.js';

export interface AdaptivePostChainOptions {
  onDowngrade?: (pass: AdaptivePostPass, stats: FrameBudgetStats) => void;
  onUpgrade?: (pass: AdaptivePostPass, stats: FrameBudgetStats) => void;
}

export class AdaptivePostChain {
  private readonly passes: AdaptivePostPass[];
  private readonly tracker: FrameBudgetTracker;
  private readonly onDowngrade?: (pass: AdaptivePostPass, stats: FrameBudgetStats) => void;
  private readonly onUpgrade?: (pass: AdaptivePostPass, stats: FrameBudgetStats) => void;
  private readonly disabledStack: AdaptivePostPass[] = [];

  constructor(
    passes: AdaptivePostPass[],
    tracker: FrameBudgetTracker,
    options: AdaptivePostChainOptions = {},
  ) {
    this.passes = [...passes];
    this.tracker = tracker;
    this.onDowngrade = options.onDowngrade;
    this.onUpgrade = options.onUpgrade;
  }

  evaluate(timestamp: number): void {
    this.tracker.record(timestamp);
    const stats = this.tracker.stats;

    if (stats.sampleSize === 0) {
      return;
    }

    if (stats.budgetBreached) {
      const passToDisable = this.findMostExpensiveEnabledPass();

      if (passToDisable) {
        passToDisable.disable();
        if (!this.disabledStack.includes(passToDisable)) {
          this.disabledStack.push(passToDisable);
        }
        this.onDowngrade?.(passToDisable, stats);
      }

      return;
    }

    const passToEnable = this.findNextPassToEnable();
    if (passToEnable) {
      passToEnable.enable();
      this.onUpgrade?.(passToEnable, stats);
    }
  }

  private findMostExpensiveEnabledPass(): AdaptivePostPass | undefined {
    let candidate: AdaptivePostPass | undefined;

    for (const pass of this.passes) {
      if (!pass.isEnabled()) {
        continue;
      }

      if (!candidate || pass.cost > candidate.cost) {
        candidate = pass;
      }
    }

    return candidate;
  }

  private findNextPassToEnable(): AdaptivePostPass | undefined {
    while (this.disabledStack.length > 0) {
      const pass = this.disabledStack.pop();
      if (!pass) {
        continue;
      }

      if (!pass.isEnabled()) {
        return pass;
      }
    }

    return undefined;
  }
}
