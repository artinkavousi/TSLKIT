'use client';

import React from 'react';

import { LAB_PRESET_REGISTRY } from '@tsl/kit';

interface PresetSelectorProps {
  activePreset: string;
  onChange: (presetId: string) => void;
}

export function PresetSelector({ activePreset, onChange }: PresetSelectorProps) {
  return (
    <div className="grid gap-2">
      {LAB_PRESET_REGISTRY.presets.map((preset) => {
        const isActive = preset.id === activePreset;
        const base = 'flex flex-col rounded-lg border px-4 py-3 text-left transition';
        const variant = isActive
          ? 'border-accent bg-accent/10 text-accent'
          : 'border-slate-800 bg-slate-900 text-slate-200 hover:border-slate-700';
        return (
          <button
            key={preset.id}
            type="button"
            onClick={() => onChange(preset.id)}
            className={`${base} ${variant}`}
          >
            <span className="text-sm font-semibold">{preset.label}</span>
            <span className="text-xs text-slate-400">{preset.summary}</span>
          </button>
        );
      })}
    </div>
  );
}
