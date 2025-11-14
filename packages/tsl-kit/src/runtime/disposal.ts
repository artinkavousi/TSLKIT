export interface Disposable {
  dispose(): void;
}

export class DisposalBin {
  private readonly disposables = new Set<Disposable | (() => void)>();

  track<T extends Disposable | (() => void)>(disposable: T): T {
    this.disposables.add(disposable);
    return disposable;
  }

  flush() {
    for (const disposable of this.disposables) {
      try {
        if (typeof disposable === 'function') {
          disposable();
        } else {
          disposable.dispose();
        }
      } catch (error) {
        console.warn('Failed to dispose resource', error);
      }
    }
    this.disposables.clear();
  }
}
