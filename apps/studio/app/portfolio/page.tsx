import React from 'react';

import { EngineCanvas } from '../../components/EngineCanvas';
import { LAB_PRESET_REGISTRY } from '@tsl/kit';

export default function PortfolioPage() {
  const heroPreset = LAB_PRESET_REGISTRY.presets[0];
  const secondaryPreset = LAB_PRESET_REGISTRY.presets[1];

  return (
    <section className="grid gap-8">
      <header className="flex flex-col gap-2">
        <span className="text-xs uppercase tracking-[0.3em] text-slate-500">Portfolio</span>
        <h1 className="text-3xl font-semibold text-accent">Engine-Driven Showcase Scenes</h1>
        <p className="max-w-2xl text-slate-300">
          Each section below maps to a CMS slot. Presets expose metadata so editors can schedule hero animations,
          background loops, and interactive callouts without developer assistance.
        </p>
      </header>

      <article className="grid gap-6 lg:grid-cols-[2fr,1fr]">
        <div className="aspect-[21/9] overflow-hidden rounded-xl border border-slate-800 bg-slate-950">
          <EngineCanvas presetId={heroPreset.id} />
        </div>
        <div className="flex flex-col gap-3 rounded-xl border border-slate-800 bg-slate-950 p-5 text-sm text-slate-300">
          <h2 className="text-lg font-semibold text-slate-100">Hero Experience</h2>
          <p>
            {heroPreset.summary} This preset is wired to marketing automation hooks for launch campaigns and seasonal
            takeovers.
          </p>
          <ul className="text-xs uppercase tracking-[0.2em] text-slate-500">
            {heroPreset.tags.map((tag) => (
              <li key={tag}>• {tag}</li>
            ))}
          </ul>
        </div>
      </article>

      <article className="grid gap-6 lg:grid-cols-[1fr,2fr]">
        <div className="flex flex-col gap-3 rounded-xl border border-slate-800 bg-slate-950 p-5 text-sm text-slate-300">
          <h2 className="text-lg font-semibold text-slate-100">Lab Spotlight</h2>
          <p>
            {secondaryPreset.summary} Editors can stage interactive labs by referencing preset IDs and toggling compute
            modules per layout.
          </p>
          <ul className="text-xs uppercase tracking-[0.2em] text-slate-500">
            {secondaryPreset.tags.map((tag) => (
              <li key={tag}>• {tag}</li>
            ))}
          </ul>
        </div>
        <div className="aspect-[4/3] overflow-hidden rounded-xl border border-slate-800 bg-slate-950">
          <EngineCanvas presetId={secondaryPreset.id} />
        </div>
      </article>
    </section>
  );
}
