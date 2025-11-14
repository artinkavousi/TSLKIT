'use client';

import React from 'react';

import { LAB_PRESET_REGISTRY } from '@tsl/kit';

interface PresetDetailsProps {
  presetId: string;
}

export function PresetDetails({ presetId }: PresetDetailsProps) {
  const preset = LAB_PRESET_REGISTRY.findById(presetId);
  if (!preset) {
    return null;
  }

  const postEffects = Array.isArray(preset.post) ? preset.post : preset.post ? [preset.post] : [];
  const computeEffects = Array.isArray(preset.compute)
    ? preset.compute
    : preset.compute
    ? [preset.compute]
    : [];

  return (
    <div className="rounded-lg border border-slate-800 bg-slate-950 p-4 text-sm text-slate-300">
      <h3 className="text-base font-semibold text-slate-100">Preset Insights</h3>
      <p className="mt-2 text-xs text-slate-400">{preset.summary}</p>
      <div className="mt-4 grid gap-3 text-xs uppercase tracking-[0.2em] text-slate-400">
        <div>
          <span className="font-semibold text-slate-200">Tags</span>
          <div className="mt-2 flex flex-wrap gap-2 text-[10px] normal-case">
            {preset.tags.map((tag) => (
              <span key={tag} className="rounded-full bg-slate-800 px-2 py-1 text-slate-200">
                {tag}
              </span>
            ))}
          </div>
        </div>
        <div>
          <span className="font-semibold text-slate-200">Post Effects</span>
          <ul className="mt-2 space-y-1 text-[11px] normal-case text-slate-300">
            {postEffects.length === 0 ? <li>None</li> : null}
            {postEffects.map((effect) => (
              <li key={effect.id}>{effect.label}</li>
            ))}
          </ul>
        </div>
        <div>
          <span className="font-semibold text-slate-200">Compute Pipelines</span>
          <ul className="mt-2 space-y-1 text-[11px] normal-case text-slate-300">
            {computeEffects.length === 0 ? <li>None</li> : null}
            {computeEffects.map((sim) => (
              <li key={sim.id}>{sim.label}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
