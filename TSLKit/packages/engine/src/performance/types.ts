export interface AdaptivePostPass {
  id: string;
  label: string;
  cost: number;
  isEnabled(): boolean;
  enable(): void;
  disable(): void;
}

export interface AdaptivePostChainEvent {
  readonly budgetBreached: boolean;
  readonly averageFrameTime: number;
  readonly averageFPS: number;
}
