'use client';

import React from 'react';

import { EngineCanvas } from '../../components/EngineCanvas';
import { LAB_PRESET_REGISTRY } from '@tsl/kit';

export default function LabPage() {
  const [activePreset, setActivePreset] = React.useState(LAB_PRESET_REGISTRY.presets[0]?.id ?? 'aurora-lab');

  return (
    <section className="grid gap-8">
      <header className="flex flex-col gap-2">
        <span className="text-xs uppercase tracking-[0.35em] text-slate-500">Lab Control</span>
        <h1 className="text-3xl font-semibold text-accent">Interactive WebGPU Presets</h1>
        <p className="max-w-2xl text-slate-300">
          Toggle presets to rehearse compute and post-processing stacks before promoting them to production portfolio
          pages.
        </p>
      </header>

      <div className="grid gap-6 lg:grid-cols-[1fr,2fr]">
        <div className="rounded-xl border border-slate-800 bg-slate-950 p-5 text-sm text-slate-300">
          <ul className="grid gap-3">
            {LAB_PRESET_REGISTRY.presets.map((preset) => (
              <li key={preset.id}>
                <button
                  type="button"
                  onClick={() => setActivePreset(preset.id)}
                  className={`w-full rounded-lg border px-4 py-3 text-left transition ${
                    preset.id === activePreset
                      ? 'border-accent bg-accent/10 text-accent'
                      : 'border-slate-800 bg-slate-900 text-slate-200 hover:border-slate-700'
                  }`}
                >
                  <span className="text-sm font-semibold">{preset.label}</span>
                  <span className="block text-xs text-slate-400">{preset.summary}</span>
                </button>
              </li>
            ))}
          </ul>
        </div>
        <div className="aspect-video overflow-hidden rounded-xl border border-slate-800 bg-slate-950">
          <EngineCanvas presetId={activePreset} />
        </div>
      </div>
    </section>
  );
}
