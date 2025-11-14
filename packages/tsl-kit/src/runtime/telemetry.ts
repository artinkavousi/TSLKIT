export interface TelemetrySample {
  fps: number;
  frameTime: number;
  timestamp: number;
}

export interface TelemetryStats {
  samples: TelemetrySample[];
  maxSamples: number;
}

export function createTelemetry(maxSamples = 120): TelemetryStats {
  return {
    samples: [],
    maxSamples
  };
}

export function pushTelemetrySample(stats: TelemetryStats, frameTime: number) {
  const fps = frameTime > 0 ? 1000 / frameTime : 0;
  stats.samples.push({ fps, frameTime, timestamp: performance.now() });
  if (stats.samples.length > stats.maxSamples) {
    stats.samples.splice(0, stats.samples.length - stats.maxSamples);
  }
}
