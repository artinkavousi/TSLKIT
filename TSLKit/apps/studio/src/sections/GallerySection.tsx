import type { Preset } from '../types/presets.js';

interface GallerySectionProps {
  materials: Preset[];
  postStacks: Preset[];
  onSelectPreset: (presetId: string) => void;
}

function renderPresetCard(preset: Preset, onSelectPreset: (presetId: string) => void): JSX.Element {
  return (
    <article key={preset.id} className="card" style={{ borderColor: preset.previewColor }}>
      <header>
        <h3>{preset.name}</h3>
        <span className="chip">{preset.kind === 'material' ? 'Material' : 'Post Stack'}</span>
      </header>
      <div className="card-preview" style={{ background: preset.previewColor }} aria-hidden="true" />
      <p>{preset.description}</p>
      <ul className="tag-list">
        {preset.tags.map((tag) => (
          <li key={tag}>{tag}</li>
        ))}
      </ul>
      <button type="button" onClick={() => onSelectPreset(preset.id)}>
        Load in Lab
      </button>
    </article>
  );
}

export function GallerySection({ materials, postStacks, onSelectPreset }: GallerySectionProps): JSX.Element {
  return (
    <section className="panel">
      <div className="panel-header">
        <div>
          <h2>Gallery</h2>
          <p>Browse curated presets, covering both materials and cinematic post-processing stacks.</p>
        </div>
      </div>
      <div className="card-grid">
        {[...materials, ...postStacks].map((preset) => renderPresetCard(preset, onSelectPreset))}
      </div>
    </section>
  );
}
