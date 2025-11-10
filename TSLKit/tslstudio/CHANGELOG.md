# Changelog

All notable changes to TSLStudio will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.1.0] - 2025-11-10

### 🎉 Initial Release - Stage 1 Foundation

#### Added

**TSL Modules (70+ functions):**
- **Noise Module** (13 functions)
  - `simplexNoise2d`, `simplexNoise3d`, `simplexNoise4d`
  - `perlinNoise3d`, `cnoise3d`
  - `curlNoise3d`, `curlNoise4d`
  - `fbm`, `ridgedFbm`, `domainWarpedFbm`, `warpedFbmCoords`
  - `turbulence`, `voronoi`

- **SDF Module** (19 functions)
  - Shapes: `sdSphere`, `sdBox2d`, `sdBox3d`, `sdDiamond`, `sdHexagon`, `sdEquilateralTriangle`, `sdLine`, `sdRing`, `sdParallelogram`, `sdRhombus`, `sdTriangle`
  - Operations: `smin`, `smax`, `sdfUnion`, `sdfSubtraction`, `sdfIntersection`, `sdfSmoothUnion`, `sdfSmoothSubtraction`, `sdfSmoothIntersection`
  - Domain: `sdfRepeat`, `sdfOnion`

- **Lighting Module** (5 functions)
  - `ambientLightNode`
  - `diffuseNode`
  - `directionalLightNode`
  - `createFresnelNode`
  - `createHemisphereLight`

- **Math Module** (20+ functions)
  - Remap: `remap`, `remapFrom01`, `remapTo01`
  - Rotations: `rotate3dX`, `rotate3dY`, `rotate3dZ`, `rotate2d`
  - Complex: `asPolar`, `complexMul`, `complexDiv`, `complexPow`, `complexLog`, `complexSin`, `complexCos`, `complexTan`
  - Coordinates: `cartesianToPolar`, `polarToCartesian`, `grad`
  - Other: `smoothMod`

- **Color Module** (10+ functions)
  - `cosinePalette`
  - Hyperbolic: `sinh`, `cosh`, `tanh`
  - Tonemapping: `reinhardTonemap`, `uncharted2Tonemap`, `acesTonemap`, `crossProcessTonemap`, `bleachBypassTonemap`, `technicolorTonemap`, `cinematicTonemap`

- **Utils Module** (3 functions)
  - `bloom`
  - `screenAspectUV`
  - `repeatingPattern`

**Core Infrastructure:**
- `WebGPUSetup` class for renderer initialization
- `NodeMaterialBase` abstract class for custom materials
- `RenderPass`, `ComputePass`, `FullscreenPass` classes

**Examples:**
- 01-simplex-noise.html - 3D simplex noise demo
- 02-fbm-noise.html - Fractional Brownian Motion
- 03-sdf-shapes.html - SDF shapes with smooth blending
- 04-color-palette.html - Cosine color palettes
- index.html - Examples landing page

**Documentation:**
- Complete README with usage guide
- Examples documentation
- Comprehensive JSDoc comments
- Build and testing guides

**Development:**
- Vite build system
- TypeScript configuration
- Vitest test framework
- ESLint + Prettier setup
- Basic test suite for all modules

#### Technical

- **Three.js:** r181+ compatibility
- **WebGPU:** Native support
- **TypeScript:** Full type safety
- **Tree-shaking:** ES module exports
- **Build:** Optimized production builds

### Known Issues

- ~20 TypeScript warnings (cosmetic, doesn't affect functionality)
- Limited test coverage (basic tests only)
- No npm package yet (coming soon)

---

## [Unreleased] - Stage 2 Planned

### Planned Features

**Materials:**
- 53 procedural materials
- Wood, marble, metal, fabric textures
- Organic and geometric patterns

**Post-Processing:**
- 32 post-processing effects
- Bloom, DOF, motion blur
- Color grading, vignette
- SSAO, SSR, SSGI

**Compute:**
- GPU particle systems
- Fluid simulations
- Physics integrations

**MaterialX:**
- MaterialX shader integration
- Standard Surface support
- PBR workflows

**Quality:**
- 90%+ test coverage
- Performance benchmarks
- API stability guarantees
- npm package publishing

---

## Contributing

See [PORTING_TODO.md](../PORT_MODULES/PORTING_TODO.md) for the full roadmap.

## Links

- [GitHub Repository](https://github.com/yourusername/tslstudio)
- [Documentation](./docs/)
- [Examples](./examples/)

