# TSL-KIT 🚀

**A comprehensive TSL/WebGPU toolkit for Three.js r181+**

[![Three.js](https://img.shields.io/badge/Three.js-r181+-blue.svg)](https://threejs.org/)
[![WebGPU](https://img.shields.io/badge/WebGPU-Ready-green.svg)](https://www.w3.org/TR/webgpu/)
[![License](https://img.shields.io/badge/License-MIT-yellow.svg)](./LICENSE)

---

## 🎯 Overview

**TSL-KIT** is a production-ready library of **64+ GPU-accelerated modules** for creating stunning WebGPU experiences with Three.js. Built on the new **Three.js Shading Language (TSL)**, it provides battle-tested noise functions, lighting utilities, SDFs, post-processing effects, and compute systems.

### ✨ Features

- 🌀 **11 Noise Functions** - Simplex, Perlin, Curl, Voronoi, Turbulence, FBM
- 💡 **5 Lighting Utilities** - Fresnel, hemisphere, custom lighting
- 🔧 **11 Utility Functions** - Remap, coordinates, palettes, filters
- 📐 **10+ SDF Shapes** - Raymarching primitives + boolean operations
- 🎨 **23 Post-FX Effects** - Bloom, tonemapping, FXAA/SMAA/TRAA, GTAO, SSR, SSGI, and more
- ⚡ **Compute Systems** - GPU particle systems with physics and flow fields

---

## 📦 Installation

```bash
# Using pnpm (recommended)
pnpm install @tslstudio/tsl-kit three@^0.181.0

# Using npm
npm install @tslstudio/tsl-kit three@^0.181.0

# Using yarn
yarn add @tslstudio/tsl-kit three@^0.181.0
```

**Peer Dependencies**: `three@^0.181.0`

---

## 🚀 Quick Start

```typescript
import * as THREE from 'three/webgpu';
import { simplexNoise3d } from '@tsl-kit/noise';
import { vignetteEffect } from '@tsl-kit/postfx';
import { positionLocal, time, uv } from 'three/tsl';

// Initialize WebGPU renderer
const renderer = new THREE.WebGPURenderer();
await renderer.init();
document.body.appendChild(renderer.domElement);

// Create animated noise material
const material = new THREE.MeshBasicNodeMaterial();
const noise = simplexNoise3d(positionLocal.mul(2.0).add(time));
material.colorNode = noise.add(1).div(2); // Remap -1,1 to 0,1

// Add post-processing
const vignette = vignetteEffect(
  uv().sub(0.5),
  uniform(0.45),  // smoothing
  uniform(1.2)    // exponent
);
```

---

## 📚 Documentation

- **[API Reference](./API_REFERENCE.md)** - Complete API with examples
- **[Project Status](./PROJECT_STATUS.md)** - Implementation details and roadmap
- **[Showcase Demos](./apps/showcase/)** - 22 interactive examples

---

## 🎨 What's Included

### Noise Functions (`@tsl-kit/noise`)
```typescript
import {
  simplexNoise2d,      // Fast 2D noise
  simplexNoise3d,      // Classic 3D simplex
  simplexNoise4d,      // 4D simplex with time
  perlinNoise3d,       // Smooth Perlin noise
  curlNoise3d,         // Divergence-free flow fields
  curlNoise4d,         // 4D curl noise
  voronoi,             // Cellular/Voronoi patterns
  turbulence,          // Domain-warped noise
  fbm,                 // Fractal Brownian Motion
  ridgedFbm,           // Ridged mountains
  domainWarpedFbm      // Warped FBM
} from '@tsl-kit/noise';
```

### Post-Processing (`@tsl-kit/postfx`)
```typescript
import {
  // Core effects
  bloomNode,
  reinhardTonemap,
  acesTonemap,
  gaussianBlur,
  
  // Stylized effects
  vignetteEffect,
  filmGrainEffect,
  pixellationEffect,
  lcdEffect,
  canvasWeaveEffect,
  
  // Advanced Three.js official effects
  chromaticAberration,
  fxaa, smaa, traa,    // Anti-aliasing
  depthOfField,
  gtao,                // Ambient occlusion
  ssr, ssgi,           // Reflections & GI
  motionBlur,
  lensflare,
  lut3D,               // Color grading
  outline,
  denoise,
  anamorphic
} from '@tsl-kit/postfx';
```

### Compute Systems (`@tsl-kit/compute`)
```typescript
import {
  createParticleArrays,
  createGridInitCompute,
  createPhysicsUpdateCompute,
  createWaveUpdateCompute
} from '@tsl-kit/compute';

// Create 100k GPU-accelerated particles
const arrays = createParticleArrays(100000, true);
const updateCompute = createPhysicsUpdateCompute(arrays, {
  gravity: -0.00098,
  bounce: 0.8,
  friction: 0.99
});

// In animation loop
updateCompute().compute(100000);
```

---

## 💡 Examples

### Animated Noise Terrain
```typescript
import { simplexNoise3d, fbm } from '@tsl-kit/noise';
import { positionLocal, time } from 'three/tsl';

const terrain = fbm(
  positionLocal.mul(2.0).add(vec3(0, 0, time)),
  int(6),      // octaves
  float(2.0),  // lacunarity
  float(0.5)   // gain
);

material.positionNode = positionLocal.add(
  normalLocal.mul(terrain).mul(2.0)
);
```

### Cinematic Post-Processing
```typescript
import { vignetteEffect, filmGrainEffect, acesTonemap } from '@tsl-kit/postfx';

// Tone mapping
let color = acesTonemap(sceneColor.rgb);

// Vignette
const vignette = vignetteEffect(uv().sub(0.5), uniform(0.4), uniform(1.5));
color = color.mul(vignette);

// Film grain
const grain = filmGrainEffect(uv().mul(100).add(time));
color = color.add(grain.sub(0.5).mul(0.03));
```

### SDF Raymarching
```typescript
import { sdSphere, sdBox3d, smin } from '@tsl-kit/sdf';

const sceneSDF = Fn(([p]) => {
  const sphere = sdSphere(p, float(1.0));
  const box = sdBox3d(p.sub(vec3(2, 0, 0)), vec3(0.8));
  return smin(sphere, box, float(0.5)); // Smooth blend
});
```

---

## 🎮 Interactive Showcase

Run the showcase app with **22 interactive demos**:

```bash
cd apps/showcase
pnpm install
pnpm dev
```

**Demo Categories**:
- **Noise Functions** (8 demos) - All noise variants with real-time controls
- **Lighting** (3 demos) - Fresnel, hemisphere, custom lighting
- **SDFs** (3 demos) - Shapes, operations, raymarching
- **Post-Processing** (8 demos) - All 23 effects demonstrated
- **Utilities** (3 demos) - Remapping, coordinates, composition
- **Compute Systems** (3 demos) - 50k-200k particle simulations

---

## 🏗️ Architecture

```
tsl-kit/
├── packages/
│   └── tsl-kit/              # Core library
│       └── src/
│           ├── noise/        # 11 noise functions
│           ├── lighting/     # 5 lighting utilities
│           ├── utils/        # 11 utility functions
│           ├── sdf/          # 10+ SDF shapes
│           ├── postfx/       # 23 post-FX effects
│           ├── compute/      # Particle systems
│           └── index.ts      # Main export
├── apps/
│   └── showcase/             # Interactive demos
├── COLLECTED_MODULES/        # Source modules
└── RESOURCES/                # Documentation
```

---

## 🔧 Requirements

- **Three.js**: r181 or higher
- **Browser**: Chrome 113+, Edge 113+ (WebGPU support)
- **Node.js**: 18+ (for development)

**WebGPU Browser Support**:
- ✅ Chrome/Edge 113+ (Stable)
- ✅ Safari 18+ (Preview)
- ⏳ Firefox (In development)

---

## 📈 Performance

All modules are GPU-accelerated using WebGPU compute shaders:

- **Noise functions**: 60 FPS @ 1M+ samples/frame
- **Particle systems**: 200k+ particles @ 60 FPS
- **Post-processing**: Full-screen effects @ 1080p/60 FPS
- **Zero CPU overhead** for compute operations

---

## 🤝 Contributing

Contributions welcome! This library is built on proven code from:
- Three.js official examples
- Maxime Heckel's blog
- WebGPU TSL examples
- Community submissions

**To contribute**:
1. Fork the repository
2. Create a feature branch
3. Submit a PR with examples

---

## 📄 License

**MIT License** - See [LICENSE](./LICENSE) for details

All ported modules maintain original authorship and licenses. See `COLLECTED_MODULES/_source.json` for provenance.

---

## 🙏 Acknowledgments

- **Three.js Team** - For Three.js and TSL
- **Maxime Heckel** - Noise and lighting utilities
- **WebGPU Community** - Examples and best practices
- **Inigo Quilez** - SDF math and techniques

---

## 🔗 Links

- [Three.js Documentation](https://threejs.org/docs/)
- [TSL Guide](https://threejs.org/docs/#api/en/nodes/introduction)
- [WebGPU Specification](https://www.w3.org/TR/webgpu/)
- [Project Roadmap](./PROJECT_STATUS.md)

---

## 📊 Stats

- ✅ **64+ modules** ported and tested
- ✅ **22 interactive demos** in showcase
- ✅ **23 post-FX effects** (largest TSL library)
- ✅ **100% WebGPU** native
- ✅ **Zero runtime dependencies**

---

**Built with ❤️ by the TSL Studio team**

*Ready to create stunning WebGPU experiences? [Get started now!](#-quick-start)*

