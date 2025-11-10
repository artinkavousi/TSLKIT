import type { FrameBudgetStats, FrameBudgetTrackerOptions } from './types.js';

const MILLISECONDS_IN_SECOND = 1000;

function clampSampleSize(sampleSize: number): number {
  return Number.isFinite(sampleSize) && sampleSize > 0 ? Math.floor(sampleSize) : 1;
}

function calculateAverage(values: readonly number[]): number {
  if (values.length === 0) {
    return 0;
  }

  const sum = values.reduce((total, value) => total + value, 0);

  return sum / values.length;
}

export class FrameBudgetTracker {
  private readonly budgetMs: number;
  private readonly hysteresisMs: number;
  private readonly sampleSize: number;
  private readonly onBudgetExceeded?: (stats: FrameBudgetStats) => void;
  private readonly onBudgetRecovered?: (stats: FrameBudgetStats) => void;

  private readonly frameTimes: number[] = [];
  private lastTimestamp?: number;
  private _stats: FrameBudgetStats = {
    averageFrameTime: 0,
    averageFPS: 0,
    sampleSize: 0,
    budgetBreached: false,
  };

  constructor(options: FrameBudgetTrackerOptions) {
    this.budgetMs = options.budgetMs;
    this.hysteresisMs = Math.max(0, options.hysteresisMs ?? 0);
    this.sampleSize = clampSampleSize(options.sampleSize);
    this.onBudgetExceeded = options.onBudgetExceeded;
    this.onBudgetRecovered = options.onBudgetRecovered;
  }

  get stats(): FrameBudgetStats {
    return this._stats;
  }

  record(timestamp: number): void {
    if (typeof timestamp !== 'number' || Number.isNaN(timestamp)) {
      return;
    }

    if (this.lastTimestamp === undefined) {
      this.lastTimestamp = timestamp;
      return;
    }

    const frameTime = Math.max(0, timestamp - this.lastTimestamp);
    this.lastTimestamp = timestamp;

    this.frameTimes.push(frameTime);
    if (this.frameTimes.length > this.sampleSize) {
      this.frameTimes.shift();
    }

    if (this.frameTimes.length === 0) {
      return;
    }

    const averageFrameTime = calculateAverage(this.frameTimes);
    const averageFPS = averageFrameTime > 0 ? MILLISECONDS_IN_SECOND / averageFrameTime : 0;

    const previouslyBreached = this._stats.budgetBreached;
    let budgetBreached = previouslyBreached;

    if (!previouslyBreached && averageFrameTime > this.budgetMs) {
      budgetBreached = true;
    } else if (
      previouslyBreached &&
      averageFrameTime <= Math.max(0, this.budgetMs - this.hysteresisMs)
    ) {
      budgetBreached = false;
    }

    this._stats = {
      averageFrameTime,
      averageFPS,
      sampleSize: this.frameTimes.length,
      budgetBreached,
    };

    if (!previouslyBreached && budgetBreached) {
      this.onBudgetExceeded?.(this._stats);
    } else if (previouslyBreached && !budgetBreached) {
      this.onBudgetRecovered?.(this._stats);
    }
  }
}
