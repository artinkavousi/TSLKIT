import {
  AmbientLight,
  BufferGeometry,
  Color,
  DirectionalLight,
  Group,
  Material,
  Mesh,
  Points,
  PointsMaterial,
  Scene,
  SphereGeometry,
  Vector3
} from 'three';

import type { ScenePreset } from '../presets';

function ensureGeometry(): BufferGeometry {
  return new SphereGeometry(1, 128, 128);
}

function buildMaterialGroup(preset: ScenePreset): Group {
  const group = new Group();
  const geometry = ensureGeometry();
  const presets = Array.isArray(preset.material) ? preset.material : [preset.material];

  presets.forEach((definition, index) => {
    const material = definition.create(definition.defaults);
    const mesh = new Mesh(geometry, material as unknown as Material);
    mesh.position.set((index - presets.length / 2) * 1.6, 0, 0);
    group.add(mesh);
  });

  return group;
}

function buildComputeDebug(preset: ScenePreset): Group | null {
  if (!preset.compute) {
    return null;
  }

  const group = new Group();
  const computePresets = Array.isArray(preset.compute) ? preset.compute : [preset.compute];
  computePresets.forEach((config, index) => {
    const points = new Points(
      new BufferGeometry().setFromPoints(
        new Array(256).fill(0).map((_, i) => new Vector3(Math.sin(i) * 0.5, Math.cos(i) * 0.5, 0))
      ),
      new PointsMaterial({ color: new Color('#38bdf8'), size: 0.02 })
    );
    points.position.set(0, -index * 0.4 - 0.6, 0);
    points.userData.computePipeline = config.pipeline;
    points.userData.timeline = config.timeline;
    group.add(points);
  });

  return group;
}

export function createSceneFromPreset(preset: ScenePreset): Scene {
  const scene = new Scene();
  scene.background = new Color('#020617');

  const ambient = new AmbientLight('#22d3ee', 0.15);
  const key = new DirectionalLight('#bfdbfe', 1.4);
  key.position.set(4, 6, 8);
  const rim = new DirectionalLight('#fda4af', 0.5);
  rim.position.set(-4, 2, -6);

  scene.add(ambient, key, rim);

  const materialGroup = buildMaterialGroup(preset);
  scene.add(materialGroup);

  const computeGroup = buildComputeDebug(preset);
  if (computeGroup) {
    scene.add(computeGroup);
  }

  scene.userData.post = preset.post;
  scene.userData.presetId = preset.id;
  scene.userData.tags = preset.tags;

  return scene;
}
