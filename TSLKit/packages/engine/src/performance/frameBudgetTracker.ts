export interface FrameBudgetTrackerOptions {
  sampleSize: number;
  budgetMs: number;
  hysteresisMs: number;
  onBudgetExceeded?: (stats: FrameBudgetStats) => void;
  onBudgetRecovered?: (stats: FrameBudgetStats) => void;
}

export interface FrameBudgetStats {
  readonly sampleSize: number;
  readonly averageFrameTime: number;
  readonly averageFPS: number;
  readonly budgetBreached: boolean;
}

function clampSampleSize(sampleSize: number): number {
  return Math.max(1, Math.floor(sampleSize));
}

export class FrameBudgetTracker {
  private readonly options: FrameBudgetTrackerOptions;
  private lastTimestamp: number | null = null;
  private readonly durations: number[] = [];
  private budgetBreached = false;

  constructor(options: FrameBudgetTrackerOptions) {
    this.options = {
      ...options,
      sampleSize: clampSampleSize(options.sampleSize),
      budgetMs: options.budgetMs,
      hysteresisMs: Math.max(0, options.hysteresisMs),
    };
  }

  get stats(): FrameBudgetStats {
    const averageFrameTime = this.calculateAverageFrameTime();
    const averageFPS = averageFrameTime > 0 ? 1000 / averageFrameTime : 0;

    return {
      sampleSize: this.durations.length,
      averageFrameTime,
      averageFPS,
      budgetBreached: this.budgetBreached,
    };
  }

  record(timestampMs: number): void {
    if (this.lastTimestamp !== null) {
      const delta = Math.max(0, timestampMs - this.lastTimestamp);
      this.pushDuration(delta);
      this.evaluateBudget();
    }

    this.lastTimestamp = timestampMs;
  }

  reset(): void {
    this.durations.length = 0;
    this.lastTimestamp = null;
    this.budgetBreached = false;
  }

  private pushDuration(durationMs: number): void {
    if (this.durations.length === this.options.sampleSize) {
      this.durations.shift();
    }

    this.durations.push(durationMs);
  }

  private calculateAverageFrameTime(): number {
    if (this.durations.length === 0) {
      return 0;
    }

    const total = this.durations.reduce((sum, duration) => sum + duration, 0);
    return total / this.durations.length;
  }

  private evaluateBudget(): void {
    const averageFrameTime = this.calculateAverageFrameTime();
    const exceeded = averageFrameTime > this.options.budgetMs;
    const recovered = averageFrameTime < this.options.budgetMs - this.options.hysteresisMs;

    if (!this.budgetBreached && exceeded) {
      this.budgetBreached = true;
      this.options.onBudgetExceeded?.(this.stats);
    } else if (this.budgetBreached && recovered) {
      this.budgetBreached = false;
      this.options.onBudgetRecovered?.(this.stats);
    }
  }
}
