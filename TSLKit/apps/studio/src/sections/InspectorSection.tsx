import { Fragment, useMemo } from 'react';
import { noiseSpecSchema } from '@tslstudio/tsl-kit/schemas';
import { getNoiseMetadata } from '@tslstudio/tsl-kit/noise';

import type { Preset } from '../types/presets.js';

interface InspectorSectionProps {
  preset: Preset | null;
}

export function InspectorSection({ preset }: InspectorSectionProps): JSX.Element {
  const parsedNoise = useMemo(() => {
    if (!preset?.noiseSpec) {
      return null;
    }

    const result = noiseSpecSchema.safeParse(preset.noiseSpec);
    return result.success ? result.data : null;
  }, [preset]);

  const noiseMetadata = useMemo(() => {
    const metadata = getNoiseMetadata();
    return Array.isArray(metadata) ? metadata : [metadata];
  }, []);

  return (
    <section className="panel">
      <div className="panel-header">
        <div>
          <h2>Inspector</h2>
          <p>View schema metadata validated by @tslstudio/tsl-kit and explore noise building blocks.</p>
        </div>
      </div>
      {preset ? (
        <div className="inspector-grid">
          <div>
            <h3>Preset Details</h3>
            <dl className="definition-list">
              <dt>Name</dt>
              <dd>{preset.name}</dd>
              <dt>Version</dt>
              <dd>{preset.version}</dd>
              <dt>Kind</dt>
              <dd>{preset.kind}</dd>
              <dt>Description</dt>
              <dd>{preset.description}</dd>
              <dt>Tags</dt>
              <dd>{preset.tags.join(', ')}</dd>
              <dt>Schema</dt>
              <dd>
                {preset.schema.module} · {preset.schema.name} v{preset.schema.version}
              </dd>
              {preset.createdAt ? (
                <Fragment>
                  <dt>Published</dt>
                  <dd>{new Date(preset.createdAt).toLocaleDateString()}</dd>
                </Fragment>
              ) : null}
              {preset.updatedAt ? (
                <Fragment>
                  <dt>Updated</dt>
                  <dd>{new Date(preset.updatedAt).toLocaleDateString()}</dd>
                </Fragment>
              ) : null}
              {preset.suitability?.length ? (
                <Fragment>
                  <dt>Suitability</dt>
                  <dd>{preset.suitability.join(', ')}</dd>
                </Fragment>
              ) : null}
              {preset.featureFlags?.length ? (
                <Fragment>
                  <dt>Feature Flags</dt>
                  <dd>{preset.featureFlags.join(', ')}</dd>
                </Fragment>
              ) : null}
              {preset.postStack ? (
                <Fragment>
                  <dt>Post Stages</dt>
                  <dd>{preset.postStack.stages.join(' → ')}</dd>
                  <dt>Render Scale</dt>
                  <dd>{preset.postStack.renderScale.toFixed(2)}</dd>
                  <dt>Realtime Ready</dt>
                  <dd>{preset.postStack.supportsRealtime ? 'Yes' : 'No'}</dd>
                  <dt>Deferred Ready</dt>
                  <dd>{preset.postStack.supportsDeferred ? 'Yes' : 'No'}</dd>
                  <dt>Async Passes</dt>
                  <dd>{preset.postStack.hasAsyncPasses ? 'Yes' : 'No'}</dd>
                </Fragment>
              ) : null}
              {parsedNoise ? (
                <Fragment>
                  <dt>Noise Spec</dt>
                  <dd>
                    <code>{JSON.stringify(parsedNoise, null, 2)}</code>
                  </dd>
                </Fragment>
              ) : null}
              {preset.documentation ? (
                <Fragment>
                  <dt>Docs</dt>
                  <dd>
                    <a href={preset.documentation} target="_blank" rel="noreferrer">
                      Reference Documentation
                    </a>
                  </dd>
                </Fragment>
              ) : null}
            </dl>
          </div>
          <div>
            <h3>Noise Modules</h3>
            <ul className="noise-list">
              {noiseMetadata.map((metadata) => (
                <li key={metadata.id}>
                  <article className="noise-card">
                    <header>
                      <h4>{metadata.label}</h4>
                      <span className="chip">{metadata.id}</span>
                    </header>
                    <p>{metadata.description}</p>
                    <ul className="tag-list">
                      {metadata.tags.map((tag) => (
                        <li key={tag}>{tag}</li>
                      ))}
                    </ul>
                  </article>
                </li>
              ))}
            </ul>
          </div>
        </div>
      ) : (
        <p className="empty">Select a preset from the Lab to inspect its parameters and metadata.</p>
      )}
    </section>
  );
}
