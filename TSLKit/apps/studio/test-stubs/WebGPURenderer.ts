export default class WebGPURenderer {
  domElement: HTMLCanvasElement;

  constructor(options: { canvas: HTMLCanvasElement }) {
    this.domElement = options.canvas;
  }

  setPixelRatio(): void {
    // no-op for tests
  }

  setSize(): void {
    // no-op for tests
  }

  dispose(): void {
    // no-op for tests
  }

  render(): void {
    // no-op for tests
  }
}
