import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import App from './App.js';

vi.mock('@tslstudio/engine', () => ({
  createRenderer: vi.fn(async ({ canvas }) => ({
    renderer: {
      domElement: canvas as HTMLCanvasElement,
      setSize: () => undefined,
      setPixelRatio: () => undefined,
      dispose: () => undefined,
      render: () => undefined
    },
    isWebGPU: false
  }))
}));

vi.mock('./api/agent.js', () => {
  class MockAgent {
    async getPresets(kind: 'material' | 'post') {
      if (kind === 'material') {
        return [
          {
            id: 'mat.basic',
            name: 'Basic Material',
            kind: 'material',
            version: '1.0.0',
            description: 'Test material',
            tags: ['test'],
            previewColor: '#ffffff',
            parameters: [],
            noiseSpec: {
              type: 'simplex'
            },
            schema: {
              module: 'materials',
              name: 'materialPreset',
              version: '1.0.0'
            },
            suitability: ['realtime'],
            featureFlags: [],
            createdAt: '2024-05-01T00:00:00.000Z',
            updatedAt: '2024-05-01T00:00:00.000Z'
          }
        ];
      }

      return [
        {
          id: 'post.cinematic',
          name: 'Cinematic Stack',
          kind: 'post',
          version: '1.0.0',
          description: 'Test post stack',
          tags: ['post'],
          previewColor: '#ff00ff',
          parameters: [],
          postStack: {
            stages: ['bloom'],
            supportsRealtime: true,
            supportsDeferred: false,
            hasAsyncPasses: false,
            renderScale: 1,
            outputs: []
          },
          schema: {
            module: 'post',
            name: 'postStackPreset',
            version: '1.0.0'
          },
          suitability: ['cinematic'],
          featureFlags: ['realtime'],
          createdAt: '2024-05-01T00:00:00.000Z',
          updatedAt: '2024-05-01T00:00:00.000Z'
        }
      ];
    }

    async getTutorials() {
      return [
        {
          id: 'tutorial.intro',
          title: 'Intro Tutorial',
          excerpt: 'Learn the basics.',
          difficulty: 'beginner' as const,
          presetId: 'mat.basic',
          durationMinutes: 5,
          topics: ['materials'],
          focus: 'materials' as const,
          steps: [],
          resources: [],
          schema: {
            module: 'materials',
            name: 'tutorialEntry',
            version: '1.0.0'
          }
        }
      ];
    }
  }

  return { AgentClient: MockAgent };
});

describe('App', () => {
  it('renders core sections', async () => {
    render(<App />);

    expect(await screen.findByRole('heading', { name: /TSL Studio/i })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Lab' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Gallery' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Tutorials' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Inspector' })).toBeInTheDocument();
  });
});
