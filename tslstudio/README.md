# 🎨 TSLStudio

**The Complete Three.js TSL/WebGPU Material Library**

[![npm version](https://img.shields.io/npm/v/@tslstudio/core.svg)](https://www.npmjs.com/package/@tslstudio/core)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-100%25-blue.svg)](https://www.typescriptlang.org/)
[![Three.js](https://img.shields.io/badge/Three.js-r181%2B-green.svg)](https://threejs.org/)
[![WebGPU](https://img.shields.io/badge/WebGPU-Ready-purple.svg)](https://gpuweb.github.io/gpuweb/)

**53 production-ready procedural materials** for Three.js WebGPU, powered by TSL (Three.js Shading Language).

---

## ✨ Features

- 🎨 **53 Procedural Materials** - Organic, fabric, patterns, surfaces, and more
- ⚡ **WebGPU Accelerated** - Maximum performance on modern browsers
- 📝 **100% TypeScript** - Full type safety and IntelliSense support
- 🌳 **Tree-Shakeable** - Import only what you need
- 📚 **Fully Documented** - JSDoc for every material with examples
- 🔧 **12 Special Channels** - Opacity, normal, and roughness support
- 🎛️ **Parametric Control** - All parameters adjustable in real-time
- ✅ **Production Ready** - Battle-tested and optimized

---

## 🚀 Quick Start

### Installation

```bash
npm install @tslstudio/core three
```

### Basic Usage

```typescript
import * as THREE from 'three'
import WebGPURenderer from 'three/addons/renderers/webgpu/WebGPURenderer.js'
import { marble } from '@tslstudio/core'

// Setup WebGPU renderer
const renderer = new WebGPURenderer({ antialias: true })
await renderer.init()

// Create material with TSLStudio
const material = new THREE.MeshStandardNodeMaterial()
material.colorNode = marble({
  scale: 2,
  seed: 0
})

// Use it!
const mesh = new THREE.Mesh(
  new THREE.SphereGeometry(1, 64, 64),
  material
)
```

**[📖 See Full Quick Start Guide →](./QUICK_START.md)**

---

## 🎨 Material Gallery

### 🌿 Organic (5)

Beautiful natural patterns perfect for architectural visualization.

```typescript
import { marble, wood, clouds, brain, cork } from '@tslstudio/core'
```

- **marble** - Classic marble with veins
- **wood** - Realistic wood grain
- **clouds** - Volumetric clouds (with opacity)
- **brain** - Brain cortex pattern (with normal map)
- **cork** - Cork cellular texture

### 🧵 Fabric (4)

Textile and fur patterns for fashion and character design.

```typescript
import { crumpledFabric, satin, tigerFur, dalmatianSpots } from '@tslstudio/core'
```

### 🔲 Patterns (5)

Geometric patterns for UI, architecture, and design.

```typescript
import { bricks, grid, circles, polkaDots, zebraLines } from '@tslstudio/core'
```

### 🏔️ Surfaces (6)

Surface textures for realistic materials.

```typescript
import { concrete, caustics, rust, stars, processedWood, karstRock } from '@tslstudio/core'
```

- **concrete** - Rough concrete (with normal map)
- **caustics** - Animated water caustics ⏱️
- **rust** - Weathered rust (with opacity)
- **stars** - Starfield pattern

### 🌊 Nature (4)

Natural phenomena and elements.

```typescript
import { waterDrops, watermelon, caveArt, gasGiant } from '@tslstudio/core'
```

### 🎨 Artistic (4)

Artistic and stylized effects.

```typescript
import { planet, dysonSphere, darthMaul, scream } from '@tslstudio/core'
```

### ✨ Miscellaneous (21)

Unique procedural effects and patterns.

```typescript
import { 
  camouflage, fordite, roughClay, staticNoise, voronoiCells,
  turbulentSmoke, neonLights, supersphere, isolines, isolayers,
  photosphere, protozoa, circleDecor, entangled, reticularVeins,
  romanPaving, runnyEggs, scepterHead, simplexNoise
} from '@tslstudio/core'
```

### 🔧 Utilities (4)

3D transformation effects.

```typescript
import { rotator, scaler, translator, melter } from '@tslstudio/core'
```

**[🎨 See Complete Materials Guide →](./MATERIALS_GUIDE.md)**

---

## 🔥 Highlights

### Special Channels

Many materials support additional channels for advanced effects:

```typescript
// Opacity Channel (transparent regions)
material.colorNode = clouds({ scale: 1.5 })
material.opacityNode = clouds.opacity({ scale: 1.5 })
material.transparent = true

// Normal Maps (3D surface detail)
material.colorNode = brain({ scale: 2 })
material.normalNode = brain.normal({ scale: 2 })

// Roughness (PBR material control)
material.colorNode = runnyEggs({ scale: 1 })
material.normalNode = runnyEggs.normal({ scale: 1 })
material.roughnessNode = runnyEggs.roughness({ scale: 1 })

// Position Transformation (geometry warping)
material.positionNode = rotator({ 
  angles: new THREE.Vector3(0.4, -0.6, 0) 
})
material.normalNode = rotator.normal({ 
  angles: new THREE.Vector3(0.4, -0.6, 0) 
})
```

**Special Channels Available:**
- 🎭 **Opacity** (3): clouds, rust, staticNoise
- 🗺️ **Normal** (10): brain, waterDrops, concrete, roughClay, supersphere, runnyEggs, rotator, scaler, translator, melter
- ✨ **Roughness** (1): runnyEggs
- 📍 **Position** (5): supersphere, rotator, scaler, translator, melter

### Animated Materials

Some materials animate with time for dynamic effects:

```typescript
// Animated caustics (water reflections)
material.colorNode = caustics({ scale: 1.5, speed: 1 })

// Turbulent smoke
material.colorNode = turbulentSmoke({ scale: 2, speed: 0 })

// TV static noise
material.colorNode = staticNoise({ scale: 2 })
```

---

## 📚 Documentation

- **[🚀 Quick Start Guide](./QUICK_START.md)** - Get started in 5 minutes
- **[🎨 Materials Guide](./MATERIALS_GUIDE.md)** - Complete material reference
- **[🔧 API Documentation](./docs/api/)** - Full API reference
- **[💡 Examples](./examples/materials/)** - Interactive showcase

---

## 🎯 Use Cases

### Architectural Visualization
```typescript
import { marble, wood, concrete } from '@tslstudio/core'
// Perfect for realistic building materials
```

### Game Development
```typescript
import { planet, gasGiant, stars } from '@tslstudio/core'
// Procedural planets and space environments
```

### Product Design
```typescript
import { satin, crumpledFabric, fordite } from '@tslstudio/core'
// Fabric and surface textures
```

### Abstract Art
```typescript
import { neonLights, turbulentSmoke, scream } from '@tslstudio/core'
// Artistic and abstract effects
```

### UI/Graphics
```typescript
import { grid, circles, polkaDots } from '@tslstudio/core'
// Geometric patterns for interfaces
```

---

## 🛠️ Advanced Usage

### Multiple Materials

```typescript
import { marble, wood, caustics } from '@tslstudio/core'

// Create multiple materials
const marbleMaterial = new THREE.MeshStandardNodeMaterial()
marbleMaterial.colorNode = marble({ scale: 2 })

const woodMaterial = new THREE.MeshStandardNodeMaterial()
woodMaterial.colorNode = wood({ scale: 2 })

const waterMaterial = new THREE.MeshStandardNodeMaterial()
waterMaterial.colorNode = caustics({ scale: 1.5 })
```

### Material Variations

```typescript
import { marble } from '@tslstudio/core'

// Create variations with different seeds
const variations = [0, 42, 99].map(seed => {
  const material = new THREE.MeshStandardNodeMaterial()
  material.colorNode = marble({ scale: 2, seed })
  return material
})
```

### Custom Colors

```typescript
import { marble } from '@tslstudio/core'
import { Color } from 'three'

material.colorNode = marble({
  scale: 2,
  color: new Color(0x00BFFF),       // Cyan veins
  background: new Color(0x000033)    // Dark blue base
})
```

### PBR Material Properties

```typescript
import { rust } from '@tslstudio/core'

material.colorNode = rust({ scale: 2 })
material.roughness = 0.9  // Very rough
material.metalness = 0.8  // Metallic
// Combine TSL materials with standard PBR properties!
```

---

## 🏗️ Architecture

TSLStudio is built on a solid foundation:

- **TSLFn Wrapper** - Custom function wrapper for Three.js r181+ compatibility
- **Parameter System** - Unified parameter processing with defaults
- **Matrix Utilities** - Complete 3D transformation support
- **Modular Design** - Tree-shakeable exports for optimal bundle size
- **Type Safety** - Full TypeScript with comprehensive type definitions

### Module Structure

```
@tslstudio/core
├── materials/          # 53 procedural materials
│   ├── organic/       # Marble, wood, clouds, etc.
│   ├── fabric/        # Textile patterns
│   ├── patterns/      # Geometric patterns
│   ├── surfaces/      # Surface textures
│   ├── nature/        # Natural phenomena
│   ├── artistic/      # Artistic effects
│   ├── misc/          # Various effects
│   └── utilities/     # Transformations
├── tsl/               # Core TSL modules
│   ├── noise/         # Noise functions
│   ├── sdf/           # Signed distance fields
│   ├── lighting/      # Lighting utilities
│   ├── math/          # Math operations
│   ├── color/         # Color utilities
│   └── utils/         # Helper functions
└── core/              # Core engine
    ├── renderer/      # WebGPU setup
    ├── materials/     # Material base classes
    └── passes/        # Render passes
```

---

## ⚡ Performance

### Optimized for WebGPU

All materials use WebGPU for maximum performance:

- ✅ GPU-accelerated procedural generation
- ✅ Efficient shader compilation
- ✅ Minimal CPU overhead
- ✅ Real-time parameter updates

### Performance Tips

```typescript
// 1. Use appropriate geometry detail
const lowPoly = new THREE.SphereGeometry(1, 32, 32)   // Faster
const highPoly = new THREE.SphereGeometry(1, 128, 128) // More detail

// 2. Lower scale for better performance
marble({ scale: 1 })  // Fast
marble({ scale: 5 })  // Slower but more detail

// 3. Tree-shake unused materials
import { marble } from '@tslstudio/core'  // Good
import * as Materials from '@tslstudio/core'  // Loads all

// 4. Reuse material instances
const material = new THREE.MeshStandardNodeMaterial()
material.colorNode = marble({ scale: 2 })
// Use same material for multiple meshes
```

---

## 🧪 Testing

Comprehensive test coverage ensures reliability:

```bash
npm test
```

- ✅ 100% material export validation
- ✅ Special channel verification
- ✅ Category organization tests
- ✅ TypeScript type checking

---

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guide](./CONTRIBUTING.md) for details.

### Development Setup

```bash
# Clone repository
git clone https://github.com/your-org/tslstudio.git
cd tslstudio

# Install dependencies
npm install

# Run development server
npm run dev

# Run tests
npm test

# Build
npm run build
```

---

## 📦 Package Information

- **Package**: `@tslstudio/core`
- **Version**: `0.2.0`
- **License**: MIT
- **Dependencies**: Three.js r181+
- **Size**: Tree-shakeable (import only what you need)

---

## 🗺️ Roadmap

### ✅ Completed
- [x] Core engine and TSL modules
- [x] 53 procedural materials
- [x] Complete documentation
- [x] Material showcase
- [x] Testing framework

### 🚧 In Progress
- [ ] Three.js viewer integration
- [ ] Advanced examples
- [ ] API documentation site

### 📅 Planned
- [ ] Post-processing framework
- [ ] Compute shader systems
- [ ] MaterialX integration
- [ ] Community gallery
- [ ] Plugin system

---

## 📄 License

MIT License - see [LICENSE](./LICENSE) for details.

---

## 🙏 Acknowledgments

- **Three.js Team** - For the amazing TSL system and WebGPU renderer
- **Original Authors** - tsl-textures and portfolio examples that inspired many materials
- **WebGPU Working Group** - For the next-generation graphics API
- **Community** - For feedback and contributions

---

## 📞 Support

- 📖 [Documentation](./MATERIALS_GUIDE.md)
- 💬 [Discussions](https://github.com/your-org/tslstudio/discussions)
- 🐛 [Issue Tracker](https://github.com/your-org/tslstudio/issues)
- 🌐 [Website](https://tslstudio.dev)

---

## 🌟 Show Your Support

If you find TSLStudio useful, please consider:

- ⭐ Starring the repository
- 🐦 Sharing on social media
- 📝 Writing about your experience
- 🤝 Contributing materials or improvements

---

**Built with ❤️ using Three.js, TypeScript, and WebGPU**

**Start creating amazing materials today!** 🎨✨

```bash
npm install @tslstudio/core
```

---

## 📊 Stats

- **53 Materials** - Largest TSL library
- **12 Special Channels** - Advanced effects
- **100% TypeScript** - Type safe
- **100% Documented** - Every material
- **0 Dependencies** - (except Three.js)
- **Tree-Shakeable** - Optimal bundle size

**[Get Started →](./QUICK_START.md)**
