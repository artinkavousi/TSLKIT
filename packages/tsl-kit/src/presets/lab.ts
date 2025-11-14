import { createParticleSwarmPreset } from '../compute/particles';
import { createFluidAdvectionPreset } from '../compute/fluid';
import { MATERIAL_PRESETS } from '../materials/presets/catalog';
import { createBloomChain } from '../post/bloom';
import { createDepthOfFieldChain } from '../post/depthOfField';
import { createMotionBlurChain } from '../post/motionBlur';
import { createPresetRegistry, type ScenePreset } from './types';

function presetById(id: string) {
  const preset = MATERIAL_PRESETS.find((item) => item.id === id);
  if (!preset) {
    throw new Error(`Material preset ${id} not found`);
  }
  return preset;
}

export const LAB_SCENE_PRESETS: ScenePreset[] = [
  {
    id: 'aurora-lab',
    label: 'Aurora Lab',
    summary: 'Thin-film surfaces driven by curl-noise particles and cinematic bloom.',
    material: presetById('thin-film-nebula'),
    compute: createParticleSwarmPreset({ curlStrength: 0.42 }),
    post: [createBloomChain({ strength: 1.2 }), createMotionBlurChain({ sampleCount: 6 })],
    tags: ['lab', 'hero', 'particles']
  },
  {
    id: 'prism-lab',
    label: 'Prism Lab',
    summary: 'Refraction-heavy transmission with DOF and volumetric advection.',
    material: presetById('prism-transmission'),
    compute: [createFluidAdvectionPreset({ resolution: 96 }), createParticleSwarmPreset({ particleCount: 65_536 })],
    post: [createDepthOfFieldChain({ focusDistance: 3.2 }), createBloomChain({ radius: 0.35 })],
    tags: ['lab', 'fluid', 'glass']
  }
];

export const LAB_PRESET_REGISTRY = createPresetRegistry(LAB_SCENE_PRESETS);
