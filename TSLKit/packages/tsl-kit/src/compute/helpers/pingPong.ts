export class PingPongResource<T extends { destroy?: () => void }> {
  private index = 0;

  constructor(private readonly resources: [T, T]) {}

  get read(): T {
    return this.resources[this.index];
  }

  get write(): T {
    return this.resources[(this.index + 1) % 2];
  }

  swap(): void {
    this.index = (this.index + 1) % 2;
  }

  dispose(): void {
    const [first, second] = this.resources;
    first.destroy?.();
    if (second !== first) {
      second.destroy?.();
    }
  }
}
