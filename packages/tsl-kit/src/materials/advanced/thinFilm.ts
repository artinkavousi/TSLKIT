import { Color } from 'three';
import {
  MeshPhysicalNodeMaterial,
  mix,
  normalTexture,
  pow,
  smoothstep,
  texture,
  uniform,
  vec3
} from 'three/examples/jsm/nodes/Nodes.js';

export interface ThinFilmOptions {
  thickness?: number;
  ior?: number;
  baseColor?: string | number | Color;
}

export function createThinFilmMaterial(options: ThinFilmOptions = {}) {
  const { thickness = 650, ior = 1.45, baseColor = '#fef3c7' } = options;

  const material = new MeshPhysicalNodeMaterial();
  material.colorNode = vec3(new Color(baseColor));
  material.roughnessNode = uniform(0.1);
  material.metalnessNode = uniform(0.0);
  material.clearcoatNode = uniform(0.9);
  material.clearcoatRoughnessNode = uniform(0.05);

  const normalMap = normalTexture(texture('#tsl/presets/films/normal.jpg'), 0.35);
  material.normalNode = normalMap;

  const interference = smoothstep(
    uniform(0.1),
    uniform(1.4),
    pow(vec3(thickness / 1000), uniform(ior))
  );

  material.sheenColorNode = mix(vec3(1.4, 0.7, 1.2), vec3(0.4, 0.9, 1.5), interference);
  material.sheenRoughnessNode = uniform(0.25);

  material.userData.metadata = {
    category: 'advanced',
    preset: 'thin-film',
    thickness,
    ior
  };

  return material;
}
