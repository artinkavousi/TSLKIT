import { Color } from 'three';
import {
  MeshPhysicalNodeMaterial,
  clamp,
  mix,
  texture,
  uniform,
  vec2,
  vec3
} from 'three/examples/jsm/nodes/Nodes.js';

export interface TransmissionOptions {
  thickness?: number;
  chroma?: number;
  attenuationColor?: string | number | Color;
}

export function createTransmissionMaterial(options: TransmissionOptions = {}) {
  const { thickness = 1.5, chroma = 0.25, attenuationColor = '#38bdf8' } = options;

  const material = new MeshPhysicalNodeMaterial();
  material.colorNode = vec3(new Color('#0f172a'));
  material.roughnessNode = uniform(0.02);
  material.metalnessNode = uniform(0.0);
  material.transmissionNode = uniform(1.0);
  material.thicknessNode = uniform(thickness);
  material.attenuationDistance = 3.5;
  material.attenuationColor = new Color(attenuationColor);

  const dispersion = clamp(texture('#tsl/presets/prisms/dispersion.png', vec2(0.8, 0.2)), 0.0, 1.0);
  const chromaNode = uniform(chroma);
  material.sheenColorNode = mix(vec3(1.0), vec3(0.6, 0.7, 1.1), dispersion);
  material.iridescenceNode = chromaNode;
  material.iridescenceIORNode = uniform(1.1 + chroma * 0.2);

  material.userData.metadata = {
    category: 'advanced',
    preset: 'transmission',
    thickness,
    chroma
  };

  return material;
}
