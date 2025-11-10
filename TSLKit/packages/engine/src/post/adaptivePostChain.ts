import type { FrameBudgetTracker, FrameBudgetStats } from '../performance/frameBudgetTracker.js';
import type { AdaptivePostChainEvent, AdaptivePostPass } from '../performance/types.js';

export interface AdaptivePostChainOptions {
  onDowngrade?: (pass: AdaptivePostPass, event: AdaptivePostChainEvent) => void;
  onUpgrade?: (pass: AdaptivePostPass, event: AdaptivePostChainEvent) => void;
}

function sortByCostDescending(passA: AdaptivePostPass, passB: AdaptivePostPass): number {
  return passB.cost - passA.cost;
}

export class AdaptivePostChain {
  private readonly passes: AdaptivePostPass[];
  private readonly tracker: FrameBudgetTracker;
  private readonly options: AdaptivePostChainOptions;
  private readonly downgradeOrder: AdaptivePostPass[];

  constructor(passes: AdaptivePostPass[], tracker: FrameBudgetTracker, options: AdaptivePostChainOptions = {}) {
    this.passes = [...passes];
    this.tracker = tracker;
    this.options = options;
    this.downgradeOrder = [...passes].sort(sortByCostDescending);
  }

  evaluate(timestampMs: number): void {
    this.tracker.record(timestampMs);
    const stats = this.tracker.stats;

    if (stats.sampleSize === 0) {
      return;
    }

    if (stats.budgetBreached) {
      this.disableExpensivePass(stats);
    } else {
      this.enableCheapestDisabledPass(stats);
    }
  }

  private disableExpensivePass(stats: FrameBudgetStats): void {
    const pass = this.downgradeOrder.find((candidate) => candidate.isEnabled());
    if (!pass) {
      return;
    }

    pass.disable();
    this.options.onDowngrade?.(pass, stats);
  }

  private enableCheapestDisabledPass(stats: FrameBudgetStats): void {
    const pass = [...this.downgradeOrder].reverse().find((candidate) => !candidate.isEnabled());
    if (!pass) {
      return;
    }

    pass.enable();
    this.options.onUpgrade?.(pass, stats);
  }
}
