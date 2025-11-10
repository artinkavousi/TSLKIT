<!-- c6665a43-292e-4a3a-90fd-5b565fef66f4 b4a0160b-75c4-4f07-825c-abc0b2907f9f -->
# TSLStudio Two-Stage Build Plan

## Stage 1: Core Engine Infrastructure + Pipeline (Foundation)

### 1.1 Core WebGPU Engine Infrastructure

**File: `src/core/renderer/WebGPUSetup.ts`**

- Create WebGPU renderer initialization helper
- Handle async init() pattern for Three.js r181
- Setup default renderer configuration
- Add capability detection and fallback logic

**File: `src/core/materials/NodeMaterialBase.ts`**

- Base class for all TSL-based materials
- Common properties and methods
- Update lifecycle management
- Type-safe parameter handling

**File: `src/core/passes/RenderPass.ts`**

- Base render pass class
- Setup pass orchestration
- Render target management
- Pass chaining utilities

**Files: `src/core/passes/{ComputePass.ts, FullscreenPass.ts}`**

- ComputePass for GPU compute operations
- FullscreenPass for post-processing effects
- Buffer management utilities

### 1.2 Complete TSL Noise Module

**Port from: `PORT_MODULES/01_TSL_Nodes/noise/`**

Files to create:

- `src/tsl/noise/simplexNoise2d.ts` (from PORT_MODULES)
- `src/tsl/noise/simplexNoise4d.ts` (from PORT_MODULES)
- `src/tsl/noise/perlinNoise3d.ts` (from PORT_MODULES)
- `src/tsl/noise/curlNoise3d.ts` (from PORT_MODULES)
- `src/tsl/noise/curlNoise4d.ts` (from PORT_MODULES)
- `src/tsl/noise/voronoi.ts` (from PORT_MODULES)
- `src/tsl/noise/fbm.ts` (from PORT_MODULES)
- `src/tsl/noise/turbulence.ts` (from PORT_MODULES)

Update: `src/tsl/noise/index.ts` to export all functions

### 1.3 Complete SDF Module

**Port from: `PORT_MODULES/01_TSL_Nodes/sdf/`**

**File: `src/tsl/sdf/shapes.ts`**

- Port all 10 SDF shapes from `PORT_MODULES/01_TSL_Nodes/utils/sdf/shapes.js`
- Shapes: sdSphere, sdBox2d, sdBox3d, sdDiamond, sdHexagon, sdEquilateralTriangle, sdLine, sdRing, sdParallelogram, sdRhombus, sdTriangle

**File: `src/tsl/sdf/operations.ts`**

- Port all SDF operations from `PORT_MODULES/01_TSL_Nodes/utils/sdf/operations.js`
- Operations: sdfUnion, sdfSubtraction, sdfIntersection, sdfSmoothMin, sdfSmoothMax, sdfRepeat, transformations

Update: `src/tsl/sdf/index.ts` to export all

### 1.4 Complete Lighting Module

**Port from: `PORT_MODULES/01_TSL_Nodes/lighting/`**

Files to create:

- `src/tsl/lighting/ambient.ts`
- `src/tsl/lighting/diffuse.ts`
- `src/tsl/lighting/directional.ts`
- `src/tsl/lighting/fresnel.ts`
- `src/tsl/lighting/hemisphere.ts`

Update: `src/tsl/lighting/index.ts`

### 1.5 Complete Math Utilities Module

**Port from: `PORT_MODULES/01_TSL_Nodes/math/` and `/utils/math/`**

Files to create:

- `src/tsl/math/remap.ts`
- `src/tsl/math/smoothMin.ts`
- `src/tsl/math/smoothMod.ts`
- `src/tsl/math/rotate3dY.ts`
- `src/tsl/math/complex.ts`
- `src/tsl/math/coordinates.ts`

Update: `src/tsl/math/index.ts`

### 1.6 Complete Color Utilities Module

**Port from: `PORT_MODULES/01_TSL_Nodes/utils/color/`**

Files to create:

- `src/tsl/color/cosinePalette.ts`
- `src/tsl/color/tonemapping.ts`

Update: `src/tsl/color/index.ts`

### 1.7 General Utilities Module

**Port from: `PORT_MODULES/01_TSL_Nodes/utils/function/`**

Files to create:

- `src/tsl/utils/bloom.ts`
- `src/tsl/utils/bloomEdgePattern.ts`
- `src/tsl/utils/screenAspectUv.ts`
- `src/tsl/utils/repeatingPattern.ts`
- `src/tsl/utils/compose.ts`

Update: `src/tsl/utils/index.ts`

### 1.8 Testing Infrastructure

**File: `tests/tsl/noise/simplexNoise3d.test.ts`**

- Test deterministic output
- Test value range [-1, 1]
- Test smoothness/continuity
- Performance benchmark

Create similar test files for:

- All noise functions
- All SDF shapes
- All lighting functions
- All math/color utilities

**File: `tests/visual/NoiseVisualTest.ts`**

- Visual regression tests using Playwright
- Screenshot comparison with reference images
- Tolerance thresholds

**File: `tests/integration/CorePipeline.test.ts`**

- Test WebGPU renderer initialization
- Test material creation and rendering
- Test compute pass execution
- Test render pass chaining

### 1.9 Example Implementations

**File: `src/examples/01-noise-demo.ts`**

- Demonstrate all noise functions
- Interactive controls
- Visual output

**File: `src/examples/02-sdf-demo.ts`**

- Demonstrate SDF shapes and operations
- Raymarching visualization

**File: `src/examples/03-lighting-demo.ts`**

- Demonstrate lighting functions
- Compare different lighting models

## Stage 2: Complete Port (All Remaining Modules)

### 2.1 Procedural Materials (53 materials)

**Port from: `PORT_MODULES/02_Materials/tsl-textures/`**

Priority Set 1 (Week 5):

- `src/materials/procedural/MarbleMaterial.ts`
- `src/materials/procedural/WoodMaterial.ts`
- `src/materials/procedural/CloudsMaterial.ts`
- `src/materials/procedural/CausticsMaterial.ts`
- `src/materials/procedural/CorkMaterial.ts`
- ... (10 materials)

Priority Set 2-5 (Weeks 6-8):

- Remaining 43 materials from tsl-textures
- Each material extends NodeMaterialBase
- Configurable parameters (scale, colors, seed)
- Update methods for animation

**File: `src/materials/procedural/index.ts`**

- Export all 53 materials
- Type-safe material options

### 2.2 Official Three.js Post-Processing

**Port from: `PORT_MODULES/05_Three_Official/display/`**

Anti-aliasing (Week 7):

- `src/postprocessing/antialiasing/FXAAPass.ts`
- `src/postprocessing/antialiasing/SMAAPass.ts`
- `src/postprocessing/antialiasing/TRAAPass.ts`
- `src/postprocessing/antialiasing/SSAAPass.ts`

Core Effects (Week 7):

- `src/postprocessing/effects/BloomPass.ts`
- `src/postprocessing/effects/DepthOfFieldPass.ts`
- `src/postprocessing/effects/MotionBlurPass.ts`
- `src/postprocessing/effects/GaussianBlurPass.ts`

Global Illumination (Week 8):

- `src/postprocessing/gi/GTAOPass.ts`
- `src/postprocessing/gi/SSRPass.ts`
- `src/postprocessing/gi/SSGIPass.ts`
- `src/postprocessing/gi/SSSPass.ts`

Color Grading (Week 8):

- `src/postprocessing/grading/Lut3DPass.ts`
- `src/postprocessing/grading/BleachBypassPass.ts`
- `src/postprocessing/grading/SepiaPass.ts`
- `src/postprocessing/grading/FilmGrainPass.ts`

Lens Effects (Week 8):

- `src/postprocessing/lens/ChromaticAberrationPass.ts`
- `src/postprocessing/lens/LensFlarePass.ts`
- `src/postprocessing/lens/AnamorphicPass.ts`
- `src/postprocessing/lens/VignettePass.ts`

All 32 effects from `PORT_MODULES/05_Three_Official/display/`

### 2.3 GPU Compute Systems

**Particle Systems (Weeks 9-10):**

**Port from: `PORT_MODULES/03_Compute/tsl-compute-particles/`**

- `src/compute/particles/GPUParticleSystem.ts`

**Port from: `PORT_MODULES/04_Complete_Examples/three-tsl-sandbox/particles-flow-field/`**

- `src/compute/particles/FlowFieldParticles.ts`

**Port from: `PORT_MODULES/04_Complete_Examples/portfolio-lab/attractor-collisions/`**

- `src/compute/particles/AttractorParticles.ts`

**Port from: `PORT_MODULES/04_Complete_Examples/particles-morphing-2/`**

- `src/compute/particles/MorphingParticles.ts`

**Fluid Simulation (Week 11):**

**Port from: `PORT_MODULES/03_Compute/roquefort/`**

Files to create:

- `src/compute/fluids/FluidSimulation.ts` (main class)
- `src/compute/fluids/advection.ts`
- `src/compute/fluids/divergence.ts`
- `src/compute/fluids/pressure.ts`
- `src/compute/fluids/vorticity.ts`
- `src/compute/fluids/gradientSubtract.ts`
- `src/compute/fluids/emitters.ts`
- `src/compute/fluids/rendering.ts`

### 2.4 MaterialX Integration

**Port from: `PORT_MODULES/07_MaterialX/`**

**File: `src/materials/materialx/MaterialXLoader.ts`**

- Parse .mtlx XML files
- Map MaterialX nodes to Three.js nodes
- Support for all 20 example materials

**File: `src/materials/materialx/MaterialXNodes.ts`**

- MaterialX node implementations
- Transmission, sheen, IOR, thin-film support

### 2.5 Complete Examples

**Port from: `PORT_MODULES/04_Complete_Examples/`**

Key examples to port (Weeks 17-18):

- Portfolio lab WebGPU examples (35+)
- TSL sandbox examples (29)
- Interactive demos for each major feature

### 2.6 Documentation & Polish

**Week 19:**

- Generate API documentation with TypeDoc
- Create usage guides for each module category
- Performance optimization pass
- Memory leak detection and fixes

**Week 20:**

- Final testing (90%+ coverage)
- Visual regression test suite complete
- Example gallery website
- NPM package preparation
- v1.0 release

## Acceptance Criteria

### Stage 1 Complete When:

- All core TSL nodes ported (13 noise + 10 SDF + 5 lighting + 8 math/color)
- Core engine infrastructure functional (renderer, materials, passes)
- 90%+ test coverage on Stage 1 code
- All Stage 1 examples working
- Performance targets met (60fps on target hardware)
- Zero TypeScript errors
- All linter rules passing
- Documentation complete for Stage 1 modules

### Stage 2 Complete When:

- All 53 procedural materials ported
- All 32 post-processing effects ported
- All compute systems ported (particles, fluids)
- MaterialX integration complete
- All examples ported and working
- 90%+ overall test coverage
- Performance targets maintained
- Complete documentation
- NPM package published
- v1.0 released

## Estimated Timeline

**Stage 1:** 4 weeks (160 hours)

- Week 1: Core infrastructure + Noise module
- Week 2: SDF + Math/Color modules
- Week 3: Lighting + Utilities + Testing
- Week 4: Integration, examples, polish

**Stage 2:** 16 weeks (640 hours)

- Weeks 5-8: Materials + Post-processing (Phase 2)
- Weeks 9-12: Compute systems (Phase 3)
- Weeks 13-16: MaterialX + Advanced features (Phase 4)
- Weeks 17-20: Examples + Polish + Release (Phase 5)

**Total:** 20 weeks (800 hours)

### To-dos

- [ ] Build core WebGPU engine infrastructure (renderer, materials, passes)
- [ ] Complete noise module (12 remaining functions)
- [ ] Complete SDF module (shapes + operations)
- [ ] Complete lighting module (5 functions)
- [ ] Complete math and color utilities (10 functions)
- [ ] Create comprehensive test suite for Stage 1 (90%+ coverage)
- [ ] Create Stage 1 example implementations
- [ ] Port all 53 procedural materials
- [ ] Port all 32 post-processing effects from Three.js official
- [ ] Port all compute systems (particles, fluids)
- [ ] Implement MaterialX integration
- [ ] Port all remaining examples from PORT_MODULES
- [ ] Generate complete API documentation and guides
- [ ] Final polish, testing, and v1.0 release