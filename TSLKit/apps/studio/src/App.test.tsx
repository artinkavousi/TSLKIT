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
            description: 'Test material',
            tags: ['test'],
            previewColor: '#ffffff',
            parameters: [],
            noiseSpec: {
              type: 'simplex'
            }
          }
        ];
      }

      return [
        {
          id: 'post.cinematic',
          name: 'Cinematic Stack',
          kind: 'post',
          description: 'Test post stack',
          tags: ['post'],
          previewColor: '#ff00ff',
          parameters: [],
          postStack: { stages: ['bloom'] }
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
          durationMinutes: 5
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
