# 🎨 TSLStudio

> **A comprehensive TSL (Three.js Shading Language) library for WebGPU**

Professional, production-ready shader functions for Three.js r181+ with full WebGPU support.

[![Three.js](https://img.shields.io/badge/Three.js-r181+-blue.svg)](https://threejs.org/)
[![WebGPU](https://img.shields.io/badge/WebGPU-Ready-green.svg)](https://www.w3.org/TR/webgpu/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.3+-blue.svg)](https://www.typescriptlang.org/)
[![License](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

---

## ✨ Features

- 🎨 **70+ TSL Functions** - Noise, SDF, lighting, math, color utilities
- ⚡ **WebGPU Native** - Built for Three.js r181+ WebGPU renderer
- 📦 **Tree-Shakeable** - Import only what you need
- 🔒 **Type-Safe** - Full TypeScript support
- 📖 **Well Documented** - Comprehensive JSDoc comments
- 🎯 **Production Ready** - Professional code quality
- 🚀 **Zero Dependencies** - Only peer dependency on Three.js

---

## 🚀 Quick Start

### Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/tslstudio.git
cd tslstudio

# Install dependencies
npm install

# Build the library
npm run build
```

### Basic Usage

```typescript
import * as THREE from 'three'
import { WebGPURenderer } from 'three/webgpu'
import { Fn, uniform, uv, vec3 } from 'three/tsl'
import { simplexNoise3d, sdSphere, cosinePalette } from '@tslstudio/tsl'

// Create WebGPU renderer
const renderer = new WebGPURenderer({ antialias: true })
await renderer.init()

// Create material with TSL functions
const material = new THREE.NodeMaterial()
material.fragmentNode = Fn(() => {
  // Use noise
  const noise = simplexNoise3d(uv().mul(5.0))
  
  // Use SDF
  const shape = sdSphere(uv().sub(0.5), 0.3)
  
  // Use colors
  const color = cosinePalette(noise, a, b, c, d)
  
  return color
})()
```

---

## 📚 Modules

### 🌊 Noise Module
**13 functions** for procedural generation

```typescript
import { 
  simplexNoise2d, simplexNoise3d, simplexNoise4d,
  perlinNoise3d, curlNoise3d, curlNoise4d,
  fbm, ridgedFbm, turbulence, voronoi
} from '@tslstudio/tsl/noise'
```

- Simplex noise (2D, 3D, 4D)
- Perlin & classic noise
- Curl noise for flow fields
- FBM (Fractional Brownian Motion)
- Turbulence & voronoi patterns

### 🔷 SDF Module
**19 functions** for signed distance fields

```typescript
import {
  // Shapes
  sdSphere, sdBox2d, sdBox3d, sdHexagon, sdTriangle,
  // Operations
  sdfSmoothUnion, sdfSubtraction, sdfRepeat
} from '@tslstudio/tsl/sdf'
```

- Primitive shapes (sphere, box, hexagon, etc.)
- Boolean operations (union, subtraction, intersection)
- Smooth blending & domain repetition

### 💡 Lighting Module
**5 functions** for lighting models

```typescript
import {
  ambientLightNode, diffuseNode, directionalLightNode,
  createFresnelNode, createHemisphereLight
} from '@tslstudio/tsl/lighting'
```

- Ambient, diffuse, specular lighting
- Fresnel effects
- Hemisphere lighting

### 🔢 Math Module
**20+ functions** for mathematical operations

```typescript
import {
  remap, rotate3dY, complexMul,
  cartesianToPolar, smoothMod
} from '@tslstudio/tsl/math'
```

- Remapping & interpolation
- 2D/3D rotations
- Complex number operations
- Coordinate transformations

### 🎨 Color Module
**10+ functions** for color manipulation

```typescript
import {
  cosinePalette,
  acesTonemap, reinhardTonemap, uncharted2Tonemap
} from '@tslstudio/tsl/color'
```

- Procedural color palettes
- 7 tonemapping operators
- Color space conversions

### 🛠️ Utils Module
**3 functions** for common utilities

```typescript
import { 
  bloom, screenAspectUV, repeatingPattern 
} from '@tslstudio/tsl/utils'
```

- Bloom effects
- Aspect ratio correction
- Pattern repetition

---

## 📖 Examples

Check out the `examples/` directory for live demos:

- **01-simplex-noise** - 3D simplex noise animation
- **02-fbm-noise** - Fractional Brownian Motion
- **03-sdf-shapes** - Distance field shapes with blending
- **04-color-palette** - Procedural color gradients

**Run examples:**
```bash
npm run build
npx vite examples
# Open http://localhost:5173
```

---

## 🧪 Testing

```bash
npm test          # Run all tests
npm test -- noise # Test specific module
npm run coverage  # Generate coverage report
```

---

## 🏗️ Development

```bash
npm install       # Install dependencies
npm run dev       # Development mode with watch
npm run build     # Build for production
npm run lint      # Lint code
npm run format    # Format code with Prettier
```

---

## 📦 Project Structure

```
tslstudio/
├── src/
│   ├── tsl/              # TSL modules
│   │   ├── noise/        # Noise functions
│   │   ├── sdf/          # SDF functions
│   │   ├── lighting/     # Lighting functions
│   │   ├── math/         # Math utilities
│   │   ├── color/        # Color functions
│   │   └── utils/        # General utilities
│   ├── core/             # Core infrastructure
│   └── index.ts          # Main entry point
├── examples/             # Live examples
├── tests/                # Test suite
└── dist/                 # Built files
```

---

## 🎯 Browser Support

**Requires WebGPU support:**
- Chrome 113+ (stable)
- Edge 113+ (stable)
- Chrome Canary (latest features)
- Safari Technology Preview (experimental)

Enable WebGPU in `chrome://flags` if needed.

---

## 📄 License

MIT © 2025 TSLStudio

---

## 🤝 Contributing

Contributions welcome! Stage 2 development is planned for:
- 53 procedural materials
- 32 post-processing effects
- GPU compute systems
- MaterialX integration

See `PORT_MODULES/PORTING_TODO.md` for the roadmap.

---

## 🙏 Acknowledgments

Built with:
- [Three.js](https://threejs.org/) - 3D library
- [Vite](https://vitejs.dev/) - Build tool
- [Vitest](https://vitest.dev/) - Testing framework
- [TypeScript](https://www.typescriptlang.org/) - Type safety

Inspired by:
- Inigo Quilez's shader techniques
- Three.js TSL examples
- WebGPU best practices

---

## 📞 Links

- **Documentation:** [Full API Docs](./docs/)
- **Examples:** [Live Demos](./examples/)
- **Issues:** [GitHub Issues](https://github.com/yourusername/tslstudio/issues)
- **Roadmap:** [PORT_MODULES/PORTING_TODO.md](../PORT_MODULES/PORTING_TODO.md)

---

**TSLStudio v0.1.0** - Stage 1 Foundation  
*Professional TSL/WebGPU library for Three.js r181+*

🎨 Made with passion for the Three.js community
