# @tslstudio/tsl-kit

TSL/WebGPU toolkit for Three.js r181+ featuring noise functions, lighting utilities, materials, post-processing effects, and compute modules.

## Installation

```bash
npm install @tslstudio/tsl-kit three@^0.181.0
```

## Usage

```typescript
import { simplexNoise3d, createFresnelNode } from '@tslstudio/tsl-kit'
import { MeshPhysicalNodeMaterial } from 'three/webgpu'
import { vec3, color } from 'three/tsl'

// Use noise in materials
const material = new MeshPhysicalNodeMaterial()
material.colorNode = simplexNoise3d(vec3(uv(), 0))

// Use lighting helpers
material.clearcoatNode = createFresnelNode(viewDir, normal, 5)
```

## Modules

- **Noise**: Simplex, Perlin, Curl, FBM, Voronoi
- **Lighting**: Fresnel, Ambient, Diffuse, Hemisphere, Directional
- **Utilities**: Remap, Compose, SDF operations, Math helpers
- **SDF**: Shapes, Operations, Primitives
- **Post-FX**: Bloom, Tonemapping, Gaussian Blur

## License

MIT - Portions based on work by Maxime Heckel, N8Programs, and Three.js contributors

