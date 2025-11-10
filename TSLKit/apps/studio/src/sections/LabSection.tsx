import { Fragment, useEffect, useMemo } from 'react';
import { Leva, useControls } from 'leva';

import { useRenderer } from '../hooks/useRenderer.js';
import type { Preset } from '../types/presets.js';

interface LabSectionProps {
  materials: Preset[];
  postStacks: Preset[];
  selectedPreset: Preset | null;
  onSelectPreset: (presetId: string) => void;
}

export function LabSection({
  materials,
  postStacks,
  selectedPreset,
  onSelectPreset
}: LabSectionProps): JSX.Element {
  const controlsSchema = useMemo(() => {
    if (!selectedPreset) {
      return {};
    }

    return selectedPreset.parameters.reduce<Record<string, unknown>>((accumulator, parameter) => {
      if (parameter.type === 'number') {
        accumulator[parameter.name] = {
          value: parameter.defaultValue as number,
          min: parameter.min,
          max: parameter.max,
          step: parameter.step ?? 0.01
        };
      } else if (parameter.type === 'color') {
        accumulator[parameter.name] = parameter.defaultValue;
      } else if (parameter.type === 'boolean') {
        accumulator[parameter.name] = parameter.defaultValue;
      }

      return accumulator;
    }, {});
  }, [selectedPreset]);

  const [controlValues] = useControls(() => controlsSchema, [controlsSchema]);
  const controlsSignature = useMemo(() => JSON.stringify(controlValues), [controlValues]);
  const { canvasRef, captureSnapshot, updateMaterial, snapshot, error, isWebGPU } = useRenderer(selectedPreset);

  useEffect(() => {
    if (!selectedPreset) {
      return;
    }

    const overrides = selectedPreset.parameters.reduce<Record<string, unknown>>((accumulator, parameter) => {
      accumulator[parameter.name] =
        controlValues?.[parameter.name as keyof typeof controlValues] ?? parameter.defaultValue;
      return accumulator;
    }, {});

    updateMaterial(selectedPreset, overrides);
  }, [selectedPreset, controlsSignature, controlValues, updateMaterial]);

  return (
    <section className="panel">
      <div className="panel-header">
        <div>
          <h2>Lab</h2>
          <p>Experiment with presets using live parameter controls powered by the agent API.</p>
        </div>
        <div className="preset-selector">
          <label htmlFor="preset-select">Preset</label>
          <select
            id="preset-select"
            value={selectedPreset?.id ?? ''}
            onChange={(event) => onSelectPreset(event.target.value)}
          >
            {[{ label: 'Materials', data: materials }, { label: 'Post Stacks', data: postStacks }].map(
              (group) => (
                <optgroup key={group.label} label={group.label}>
                  {group.data.map((preset) => (
                    <option key={preset.id} value={preset.id}>
                      {preset.name}
                    </option>
                  ))}
                </optgroup>
              )
            )}
          </select>
        </div>
      </div>

      <div className="lab-content">
        <div className="preview">
          <canvas ref={canvasRef} width={640} height={360} />
          <div className="preview-meta">
            <span className="chip">{isWebGPU ? 'WebGPU Renderer' : 'WebGL Renderer'}</span>
            <button type="button" onClick={captureSnapshot}>
              Capture Snapshot
            </button>
          </div>
          {error ? <p className="preview-error">{error}</p> : null}
          {snapshot ? (
            <Fragment>
              <p className="preview-hint">Snapshot captured. Save or drag the image for documentation.</p>
              <img alt="Captured preset snapshot" src={snapshot} className="snapshot" />
            </Fragment>
          ) : null}
        </div>
        <div className="controls">
          <Leva titleBar={{ position: { x: 0, y: 0 } }} collapsed />
        </div>
      </div>
    </section>
  );
}
