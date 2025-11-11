import { Fragment, useMemo } from 'react';
import { noiseSpecSchema, postEffectSpecSchema } from '@tslstudio/tsl-kit/schemas';
import { getNoiseMetadata } from '@tslstudio/tsl-kit/noise';
import { getPostMetadata, listPostPassMetadata } from '@tslstudio/tsl-kit/post';

import type { Preset } from '../types/presets.js';
import { usePostChainPreview } from '../hooks/usePostChainPreview.js';

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

  const parsedPostPasses = useMemo(() => {
    if (!preset?.postStack) {
      return [];
    }

    return preset.postStack.passes
      .map((pass) => {
        const result = postEffectSpecSchema.safeParse(pass);
        return result.success ? result.data : null;
      })
      .filter((value): value is typeof preset.postStack.passes[number] => value !== null);
  }, [preset]);

  const postChainPreview = usePostChainPreview(parsedPostPasses);

  const allPostMetadata = useMemo(() => listPostPassMetadata(), []);

  return (
    <section className="panel">
      <div className="panel-header">
        <div>
          <h2>Inspector</h2>
          <p>View schema metadata validated by @tslstudio/tsl-kit and explore noise and post-processing modules.</p>
        </div>
      </div>
      {preset ? (
        <div className="inspector-grid">
          <div>
            <h3>Preset Details</h3>
            <dl className="definition-list">
              <dt>Name</dt>
              <dd>{preset.name}</dd>
              <dt>Kind</dt>
              <dd>{preset.kind}</dd>
              <dt>Description</dt>
              <dd>{preset.description}</dd>
              <dt>Tags</dt>
              <dd>{preset.tags.join(', ')}</dd>
              {postChainPreview.length > 0 ? (
                <Fragment>
                  <dt>Post Chain</dt>
                  <dd>
                    <ol className="post-chain-list">
                      {postChainPreview.map((stage) => (
                        <li key={stage.id}>
                          <header>
                            <strong>{stage.label}</strong>
                            <span className="chip">{stage.id}</span>
                          </header>
                          <p>{stage.description}</p>
                          <span className="post-tags">{stage.tags.join(', ')}</span>
                        </li>
                      ))}
                    </ol>
                  </dd>
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
            <h3>Post Pass Library</h3>
            <ul className="post-list">
              {allPostMetadata.map((metadata) => (
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
