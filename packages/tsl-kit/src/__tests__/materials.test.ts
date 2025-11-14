import { describe, expect, it } from 'vitest';

import { createThinFilmMaterial } from '../materials/advanced/thinFilm';
import { createTransmissionMaterial } from '../materials/advanced/transmission';

describe('advanced material presets', () => {
  it('creates thin-film material with metadata', () => {
    const material = createThinFilmMaterial({ thickness: 700, ior: 1.6 });
    expect(material.userData.metadata).toMatchObject({ preset: 'thin-film' });
    expect(material.sheenColorNode).toBeDefined();
  });

  it('creates transmission material with attenuation color', () => {
    const material = createTransmissionMaterial({ attenuationColor: '#22d3ee', chroma: 0.3 });
    expect(material.userData.metadata).toMatchObject({ preset: 'transmission' });
    expect(material.attenuationColor.getHexString()).toBe('22d3ee');
  });
});
