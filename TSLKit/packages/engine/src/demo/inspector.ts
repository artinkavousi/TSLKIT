import { folder, useControls } from 'leva';

import { useOptionalFramegraph } from './context.js';

export interface FramegraphInspectorOptions {
  readonly label?: string;
  readonly qualityRange?: readonly [number, number];
  readonly step?: number;
}

export function useFramegraphInspector(options: FramegraphInspectorOptions = {}): void {
  const framegraph = useOptionalFramegraph();
  const label = options.label ?? 'Renderer';
  const [min, max] = options.qualityRange ?? [0.25, 1];
  const step = options.step ?? 0.05;

  useControls(() => {
    if (!framegraph) {
      return {};
    }

    return {
      [label]: folder({
        quality: {
          label: 'Quality',
          value: framegraph.getQualityScale(),
          min,
          max,
          step,
          onChange: (value: number) => framegraph.setQualityScale(value)
        }
      })
    };
  }, [framegraph, label, min, max, step]);
}
