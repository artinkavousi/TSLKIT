import { useEffect, useMemo, useState } from 'react';

import { AgentClient } from './api/agent.js';
import { GallerySection } from './sections/GallerySection.js';
import { InspectorSection } from './sections/InspectorSection.js';
import { LabSection } from './sections/LabSection.js';
import { TutorialsSection } from './sections/TutorialsSection.js';
import type { Preset, Tutorial } from './types/presets.js';

const agent = new AgentClient();

export default function App(): JSX.Element {
  const [materials, setMaterials] = useState<Preset[]>([]);
  const [postStacks, setPostStacks] = useState<Preset[]>([]);
  const [tutorials, setTutorials] = useState<Tutorial[]>([]);
  const [selectedPreset, setSelectedPreset] = useState<Preset | null>(null);

  useEffect(() => {
    agent.getPresets('material').then((entries) => {
      setMaterials(entries);
      setSelectedPreset((previous) => previous ?? entries[0] ?? null);
    });
    agent.getPresets('post').then(setPostStacks);
    agent.getTutorials().then(setTutorials);
  }, []);

  const presetsById = useMemo(() => {
    const all = [...materials, ...postStacks];
    return new Map(all.map((preset) => [preset.id, preset] as const));
  }, [materials, postStacks]);

  const handleSelectPreset = (presetId: string) => {
    const next = presetsById.get(presetId) ?? null;
    setSelectedPreset(next);
  };

  return (
    <div className="app-shell">
      <header className="app-header">
        <h1>TSL Studio</h1>
        <p>Interactive playground for TSL materials, post-processing stacks, and tutorials.</p>
      </header>
      <main className="app-main">
        <LabSection
          materials={materials}
          postStacks={postStacks}
          selectedPreset={selectedPreset}
          onSelectPreset={handleSelectPreset}
        />
        <GallerySection
          materials={materials}
          postStacks={postStacks}
          onSelectPreset={handleSelectPreset}
        />
        <TutorialsSection tutorials={tutorials} onSelectPreset={handleSelectPreset} />
        <InspectorSection preset={selectedPreset} />
      </main>
    </div>
  );
}
