import React from 'react';

import { LAB_PRESET_REGISTRY } from '@tsl/kit';

export default function AdminPage() {
  return (
    <section className="grid gap-8">
      <header className="flex flex-col gap-2">
        <span className="text-xs uppercase tracking-[0.35em] text-slate-500">Operations</span>
        <h1 className="text-3xl font-semibold text-accent">Release &amp; Telemetry Dashboard</h1>
        <p className="max-w-2xl text-slate-300">
          Operationalize presets across the site by mapping them to CMS entries, verifying compute capability coverage,
          and reviewing telemetry capture windows before deployment.
        </p>
      </header>

      <div className="grid gap-6 rounded-xl border border-slate-800 bg-slate-950 p-6 text-sm text-slate-300 lg:grid-cols-2">
        <div>
          <h2 className="text-lg font-semibold text-slate-100">Preset Registry</h2>
          <ul className="mt-3 space-y-2">
            {LAB_PRESET_REGISTRY.presets.map((preset) => (
              <li key={preset.id} className="rounded-lg border border-slate-800 bg-slate-900 px-3 py-2">
                <div className="text-sm font-semibold text-slate-100">{preset.label}</div>
                <div className="text-xs text-slate-400">{preset.summary}</div>
                <div className="mt-2 flex flex-wrap gap-2 text-[10px] uppercase tracking-[0.2em] text-slate-500">
                  {preset.tags.map((tag) => (
                    <span key={tag} className="rounded-full bg-slate-800 px-2 py-1 text-slate-200">
                      {tag}
                    </span>
                  ))}
                </div>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h2 className="text-lg font-semibold text-slate-100">Deployment Checklist</h2>
          <ol className="mt-3 list-decimal space-y-2 pl-4 text-xs text-slate-300">
            <li>CI pipelines run linting, unit tests, and image diffs for each preset.</li>
            <li>Capability matrix verified against adapter telemetry (timestamp queries &amp; indirect draws).</li>
            <li>CMS entries linked to preset IDs with fallback thumbnails for non-WebGPU devices.</li>
            <li>Accessibility review signed off and performance budgets logged.</li>
          </ol>
        </div>
      </div>
    </section>
  );
}
