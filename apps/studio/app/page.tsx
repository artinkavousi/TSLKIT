'use client';

import Link from 'next/link';
import React from 'react';

import { EngineCanvas } from '../components/EngineCanvas';
import { PresetDetails } from '../components/PresetDetails';
import { PresetSelector } from '../components/PresetSelector';

export default function HomePage() {
  const [activePreset, setActivePreset] = React.useState('aurora-lab');

  return (
    <main className="grid gap-10">
      <header className="flex flex-col gap-2">
        <span className="text-xs uppercase tracking-[0.35em] text-slate-500">Phase 4 Milestone</span>
        <h1 className="text-4xl font-semibold text-accent">Unified Engine Control Center</h1>
        <p className="max-w-3xl text-slate-300">
          Select any WebGPU preset to boot the engine, stream compute simulations, and layer filmic post-processing
          without leaving the browser console. Every preset is backed by schema-driven metadata and compute pipelines to
          support authoring workflows.
        </p>
      </header>

      <section className="grid gap-6 lg:grid-cols-[2fr,1fr]">
        <div className="aspect-video overflow-hidden rounded-xl border border-slate-800 bg-slate-950">
          <EngineCanvas presetId={activePreset} />
        </div>
        <div className="flex flex-col gap-6">
          <PresetSelector activePreset={activePreset} onChange={setActivePreset} />
          <PresetDetails presetId={activePreset} />
        </div>
      </section>

      <section className="grid gap-4 rounded-xl border border-slate-800 bg-slate-950 p-6 text-sm text-slate-300 lg:grid-cols-3">
        <div>
          <h2 className="text-lg font-semibold text-slate-100">Phase 1 — Research & Prep</h2>
          <p className="mt-2">
            Resource inventory, direct-port mapping, and capability research completed with versioned documentation for
            all repositories.
          </p>
        </div>
        <div>
          <h2 className="text-lg font-semibold text-slate-100">Phase 2 — Core Skeleton</h2>
          <p className="mt-2">Engine workspace, async WebGPU bootstrap, and baseline materials delivered with deterministic tests.</p>
        </div>
        <div>
          <h2 className="text-lg font-semibold text-slate-100">Phases 3 &amp; 4 — Feature + Site</h2>
          <p className="mt-2">
            Compute pipelines, advanced materials, post stack, multi-route Next.js site, and release ops dashboards are
            now live.
          </p>
          <Link
            className="mt-3 inline-flex w-fit items-center justify-center rounded-md bg-accent px-4 py-2 text-sm font-medium text-slate-900 shadow transition hover:brightness-110"
            href="/lab"
          >
            Explore Lab Presets
          </Link>
        </div>
      </section>
    </main>
  );
}
