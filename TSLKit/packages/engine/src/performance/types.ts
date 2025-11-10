export interface FrameBudgetStats {
  averageFrameTime: number;
  averageFPS: number;
  sampleSize: number;
  budgetBreached: boolean;
}

export interface FrameBudgetTrackerOptions {
  budgetMs: number;
  sampleSize: number;
  hysteresisMs?: number;
  onBudgetExceeded?: (stats: FrameBudgetStats) => void;
  onBudgetRecovered?: (stats: FrameBudgetStats) => void;
}

export interface AdaptivePostPass {
  id: string;
  label: string;
  cost: number;
  isEnabled(): boolean;
  enable(): void;
  disable(): void;
}
