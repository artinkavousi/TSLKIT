# TSLStudio Project

> **Professional TSL/WebGPU Library for Three.js r181+**

A comprehensive collection of Three.js Shading Language (TSL) functions and WebGPU utilities for modern 3D web development.

---

## 🎉 v0.1.0 - Stage 1 Released!

**Status:** ✅ Production Ready  
**Functions:** 70+  
**Examples:** 4 working demos  
**Documentation:** Complete

---

## 📁 Project Structure

```
TSLKIT/
├── tslstudio/              # Main library (READY TO USE)
│   ├── src/                # 70+ TSL functions
│   ├── examples/           # 4 working examples
│   ├── tests/              # Test suite
│   ├── dist/               # Built library
│   └── README.md           # Full documentation
│
├── PORT_MODULES/           # Resource collection (200+ files)
│   ├── 01_TSL_Nodes/
│   ├── 02_Materials/
│   ├── 03_Compute/
│   ├── 04_Complete_Examples/
│   ├── 05_Three_Official/
│   ├── 06_Shaders_GLSL/
│   ├── 07_MaterialX/
│   ├── RESOURCE_INVENTORY.md
│   └── PORTING_TODO.md     # Stage 2 roadmap
│
├── DOCS/                   # Project documentation
│   └── proposal v2/
│       └── TSLStudio_PRD_v2.md
│
└── Documentation/          # Status reports
    ├── TSLSTUDIO_V0.1.0_RELEASE.md
    └── TSLSTUDIO_STAGE1_FINAL.md
```

---

## 🚀 Quick Start

```bash
cd tslstudio
npm install
npm run build
npx vite examples
```

See [tslstudio/QUICK_START.md](tslstudio/QUICK_START.md) for detailed instructions.

---

## 📚 What's Inside

### TSLStudio Library (v0.1.0)
- **Noise** - 13 functions (simplex, perlin, FBM, curl, voronoi)
- **SDF** - 19 functions (shapes + operations)
- **Lighting** - 5 functions (ambient, diffuse, fresnel)
- **Math** - 20+ functions (rotations, complex, coordinates)
- **Color** - 10+ functions (palettes, tonemapping)
- **Utils** - 3 functions (bloom, aspect, patterns)

### Resource Collection (PORT_MODULES)
- 200+ collected files ready for Stage 2
- Organized by category
- Complete inventory and roadmap

---

## 📖 Documentation

### User Docs
- [Library README](tslstudio/README.md) - Full API documentation
- [Quick Start](tslstudio/QUICK_START.md) - 5-minute tutorial
- [Examples Guide](tslstudio/examples/README.md) - Example documentation
- [Changelog](tslstudio/CHANGELOG.md) - Version history

### Developer Docs
- [v0.1.0 Release Notes](TSLSTUDIO_V0.1.0_RELEASE.md) - Official release
- [Stage 1 Final Report](TSLSTUDIO_STAGE1_FINAL.md) - Complete summary
- [Shipping Checklist](tslstudio/SHIPPING_CHECKLIST.md) - QA verification
- [PRD](DOCS/proposal%20v2/TSLStudio_PRD_v2.md) - Product requirements

### Planning Docs
- [Resource Inventory](PORT_MODULES/RESOURCE_INVENTORY.md) - All collected modules
- [Porting TODO](PORT_MODULES/PORTING_TODO.md) - Stage 2 roadmap (20 weeks)
- [Collection Summary](PORT_MODULES/COLLECTION_SUMMARY.md) - Resource report

---

## ✨ Features

- ⚡ **WebGPU Native** - Built for Three.js r181+ WebGPU renderer
- 📦 **Tree-Shakeable** - Import only what you need
- 🔒 **Type-Safe** - Full TypeScript support
- 📖 **Well Documented** - JSDoc on all functions
- 🎯 **Production Ready** - Professional code quality
- 🎨 **70+ Functions** - Comprehensive toolkit
- 🚀 **Zero Dependencies** - Only Three.js peer dependency

---

## 🎨 Usage Example

```typescript
import * as THREE from 'three'
import { WebGPURenderer } from 'three/webgpu'
import { Fn, uniform, uv, vec3 } from 'three/tsl'
import { 
  simplexNoise3d, 
  sdSphere, 
  cosinePalette,
  sdfSmoothUnion 
} from '@tslstudio/tsl'

const material = new THREE.NodeMaterial()
material.fragmentNode = Fn(() => {
  const noise = simplexNoise3d(uv().mul(5.0))
  const sphere = sdSphere(uv(), 0.3)
  const color = cosinePalette(noise, a, b, c, d)
  return color
})()
```

---

## 🗺️ Roadmap

### ✅ Stage 1 - Foundation (COMPLETE)
- ✅ 70+ core TSL functions
- ✅ WebGPU infrastructure
- ✅ 4 working examples
- ✅ Complete documentation
- ✅ Basic test suite

### ⏳ Stage 2 - Full Library (Planned)
- 53 procedural materials
- 32 post-processing effects
- GPU compute systems
- MaterialX integration
- 90%+ test coverage
- **Timeline:** 8-12 weeks

---

## 📄 License

MIT © 2025 TSLStudio

---

## 🙏 Credits

**Built with:**
- [Three.js](https://threejs.org/) - 3D graphics
- [Vite](https://vitejs.dev/) - Build tool
- [TypeScript](https://www.typescriptlang.org/) - Type safety

**Inspired by:**
- Inigo Quilez - Shader techniques
- Three.js team - TSL implementation
- WebGPU standards

---

## 🎯 Links

- **Main Library:** [tslstudio/](tslstudio/)
- **Examples:** [tslstudio/examples/](tslstudio/examples/)
- **Resources:** [PORT_MODULES/](PORT_MODULES/)
- **Docs:** [DOCS/](DOCS/)

---

**TSLStudio v0.1.0** - Production Ready ✨  
*Professional TSL/WebGPU library for Three.js r181+*

