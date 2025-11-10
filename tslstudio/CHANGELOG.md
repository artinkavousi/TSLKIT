# Changelog

All notable changes to TSLStudio will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [0.2.0] - 2025-11-10

### 🎉 Major Release - Complete Material Library

This release completes the core material library with all 53 materials ported, tested, and documented.

### ✨ Added

#### Materials (53 total)
- **Organic (5):** marble, wood, clouds, brain, cork
- **Fabric (4):** crumpledFabric, satin, tigerFur, dalmatianSpots
- **Patterns (5):** bricks, grid, circles, polkaDots, zebraLines
- **Surfaces (6):** concrete, caustics, rust, stars, processedWood, karstRock
- **Nature (4):** waterDrops, watermelon, caveArt, gasGiant
- **Artistic (4):** planet, dysonSphere, darthMaul, scream
- **Miscellaneous (21):** camouflage, fordite, roughClay, staticNoise, voronoiCells, turbulentSmoke, neonLights, supersphere, isolines, isolayers, photosphere, protozoa, circleDecor, entangled, reticularVeins, romanPaving, runnyEggs, scepterHead, simplexNoise, and more
- **Utilities (4):** rotator, scaler, translator, melter

#### Framework
- Custom `TSLFn` wrapper for Three.js r181+ compatibility
- `prepare` utility for parameter processing
- Matrix transformation utilities (7 functions)
- Color conversion utilities (HSL)
- Noise and helper functions

#### Special Features
- 12 special channels (opacity, normal, roughness)
- 3 animated materials (caustics, turbulentSmoke, staticNoise)
- 4 position transformation materials
- Complete parameter system with defaults

#### Documentation
- Comprehensive Materials Guide (1,000+ lines)
- Quick Start Guide (500+ lines)
- Material showcase examples
- Complete JSDoc for all materials
- Contributing guide
- API documentation structure

#### Testing
- Complete test suite for all 53 materials
- Special channel validation
- Category organization tests
- 100% material coverage

#### Examples
- Material showcase landing page
- Interactive material viewer UI
- Example README documentation

### 🔧 Changed
- Updated to Three.js r181+ compatibility
- Improved type safety throughout
- Enhanced build system configuration
- Optimized tree-shaking support

### 📝 Documentation
- Added MATERIALS_GUIDE.md
- Added QUICK_START.md
- Added CONTRIBUTING.md
- Added comprehensive README.md
- Updated package.json with metadata

---

## [0.1.0] - 2025-11-09

### 🎊 Initial Release - Core Engine

First release of TSLStudio with core engine and TSL modules.

### ✨ Added

#### Core Engine
- WebGPU renderer setup and initialization
- Material base classes (NodeMaterialBase, ProceduralMaterial)
- Render pass system (RenderPass, ComputePass)
- Scene management utilities

#### TSL Modules
- **Noise Functions:** simplexNoise2d/3d/4d, perlinNoise3d, classicNoise3d, curlNoise3d/4d, fbm, ridgedFbm, turbulence, voronoi
- **SDF Shapes:** sdSphere, sdBox, sdTorus, sdCylinder, sdCapsule, sdCone
- **SDF Operations:** opUnion, opSubtraction, opIntersection, opSmoothUnion
- **Lighting:** ambientLight, diffuseLight, specularLight, fresnelLight
- **Math Utilities:** remap, smoothMod, rotate3dY, coordinates conversion
- **Color Utilities:** cosinePalette, tonemapping (ACES, Reinhard, Uncharted2)
- **Utils:** bloom, repeatingPattern, screenAspectUv

#### Build System
- Vite configuration for optimal bundling
- TypeScript strict mode compilation
- Vitest testing framework
- ESLint and Prettier configuration
- Tree-shakeable exports

#### Documentation
- Basic project README
- API structure
- Build and test instructions

### 🔧 Technical
- TypeScript 5.3+
- Three.js r181+ support
- WebGPU-only rendering
- Modular architecture
- Full type safety

---

## Version History

- **[0.2.0]** - Complete material library (53 materials)
- **[0.1.0]** - Core engine and TSL modules

---

## Upcoming

### [0.3.0] - Planned
- Three.js integration for material viewer
- Advanced material examples
- Per-material showcase pages
- Performance profiling tools

### [0.4.0] - Planned
- Post-processing framework
- Bloom, DOF, motion blur effects
- SSAO, SSR, GTAO effects
- Color grading and vignette

### [0.5.0] - Planned
- Compute shader systems
- Particle systems
- Fluid simulation
- Physics compute

### [1.0.0] - Planned
- MaterialX integration
- Complete API documentation
- npm package publication
- Official website launch

---

## Contributing

See [CONTRIBUTING.md](./CONTRIBUTING.md) for how to contribute to TSLStudio.

---

## License

MIT License - see [LICENSE](./LICENSE) for details.

---

[0.2.0]: https://github.com/your-org/tslstudio/compare/v0.1.0...v0.2.0
[0.1.0]: https://github.com/your-org/tslstudio/releases/tag/v0.1.0
