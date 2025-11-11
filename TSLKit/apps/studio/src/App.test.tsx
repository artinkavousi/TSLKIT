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
            id: 'tsl.material.concrete',
            name: 'Layered Concrete',
            kind: 'material',
            description: 'Neutral concrete base with accent aggregate.',
            tags: ['surface', 'architectural'],
            previewColor: '#949494',
            parameters: [
              { name: 'accentWeight', label: 'Accent Mix', type: 'number', defaultValue: 0.25 }
            ],
            noiseSpec: {
              type: 'fbm'
            }
          },
          {
            id: 'tsl.material.wood',
            name: 'Polished Wood',
            kind: 'material',
            description: 'Rich hardwood grain with satin sheen.',
            tags: ['surface', 'organic'],
            previewColor: '#a3612e',
            parameters: [
              { name: 'ringWeight', label: 'Ring Mix', type: 'number', defaultValue: 0.35 }
            ],
            noiseSpec: {
              type: 'rings'
            }
          },
          {
            id: 'tsl.material.satin',
            name: 'Satin Fabric',
            kind: 'material',
            description: 'Shimmering textile preset for vibrant cloth.',
            tags: ['surface', 'fabric'],
            previewColor: '#d83fa5',
            parameters: [
              { name: 'sheenIntensity', label: 'Sheen', type: 'number', defaultValue: 0.6 }
            ],
            noiseSpec: {
              type: 'fbm'
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
          postStack: { passes: [{ type: 'bloom.standard', intensity: 1.1 }, { type: 'tonemap.aces' }] }
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
          presetId: 'tsl.material.concrete',
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
