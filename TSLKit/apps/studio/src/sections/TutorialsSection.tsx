import type { Tutorial } from '../types/presets.js';

interface TutorialsSectionProps {
  tutorials: Tutorial[];
  onSelectPreset: (presetId: string) => void;
}

const difficultyLabels: Record<Tutorial['difficulty'], string> = {
  beginner: 'Beginner',
  intermediate: 'Intermediate',
  advanced: 'Advanced'
};

export function TutorialsSection({ tutorials, onSelectPreset }: TutorialsSectionProps): JSX.Element {
  return (
    <section className="panel">
      <div className="panel-header">
        <div>
          <h2>Tutorials</h2>
          <p>Guided walkthroughs powered by the agent preset registry and live renderer integrations.</p>
        </div>
      </div>
      <ol className="tutorial-list">
        {tutorials.map((tutorial) => (
          <li key={tutorial.id}>
            <article className="tutorial-card">
              <header>
                <h3>{tutorial.title}</h3>
                <div className="tutorial-meta">
                  <span className="chip">{difficultyLabels[tutorial.difficulty]}</span>
                  <span className="chip">{tutorial.durationMinutes} min</span>
                </div>
              </header>
              <p>{tutorial.excerpt}</p>
              <button type="button" onClick={() => onSelectPreset(tutorial.presetId)}>
                Load Linked Preset
              </button>
            </article>
          </li>
        ))}
      </ol>
    </section>
  );
}
