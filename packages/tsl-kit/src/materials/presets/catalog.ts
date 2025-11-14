import type { NodeMaterial } from 'three/examples/jsm/nodes/Nodes.js';

import { createThinFilmMaterial, type ThinFilmOptions } from '../advanced/thinFilm';
import { createTransmissionMaterial, type TransmissionOptions } from '../advanced/transmission';

export interface MaterialPreset<TOptions = unknown> {
  id: string;
  label: string;
  tags: string[];
  create: (options?: TOptions) => NodeMaterial;
  defaults: TOptions;
}

export const MATERIAL_PRESETS: MaterialPreset[] = [
  {
    id: 'thin-film-nebula',
    label: 'Thin Film Nebula',
    tags: ['advanced', 'hero', 'specular'],
    create: (options?: ThinFilmOptions) => createThinFilmMaterial(options),
    defaults: {
      thickness: 720,
      ior: 1.52,
      baseColor: '#f9a8d4'
    } satisfies ThinFilmOptions
  },
  {
    id: 'prism-transmission',
    label: 'Prism Transmission',
    tags: ['advanced', 'glass', 'refraction'],
    create: (options?: TransmissionOptions) => createTransmissionMaterial(options),
    defaults: {
      thickness: 1.8,
      chroma: 0.32,
      attenuationColor: '#38bdf8'
    } satisfies TransmissionOptions
  }
];
