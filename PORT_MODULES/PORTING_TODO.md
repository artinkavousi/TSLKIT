# TSLStudio Port Modules - Detailed Porting TODO Plan

**Date:** November 8, 2025  
**Project:** TSLStudio WebGPU Engine v2  
**Total Duration:** 20 Weeks (5 Phases)

---

## 📋 Overview

This document provides a granular, actionable TODO list for porting all collected TSL/WebGPU modules to TSLStudio. Each task includes estimated effort, dependencies, and acceptance criteria.

---

## 🎯 Phase 1: Foundation & Core TSL Nodes (Weeks 1-4)

### Week 1: Project Setup & Noise Functions

#### Day 1-2: Project Infrastructure ⚙️
- [ ] **Task 1.1:** Initialize TSLStudio base project structure
  - Create `src/tsl/` directory structure
  - Set up TypeScript configuration for r181
  - Configure build system (Vite/Rollup)
  - Set up testing framework (Vitest + Playwright)
  - **Effort:** 8 hours
  - **Dependencies:** None
  - **Acceptance:** Build runs, tests execute

- [ ] **Task 1.2:** Set up import aliases and path mapping
  - Configure `three/tsl` imports
  - Configure `three/webgpu` imports
  - Set up module resolution for TSLStudio
  - **Effort:** 2 hours
  - **Dependencies:** Task 1.1
  - **Acceptance:** Imports resolve correctly

#### Day 3-5: Noise Functions - Part 1 🌀
- [ ] **Task 1.3:** Port simplex noise functions
  - [ ] Copy `simplexNoise2d.ts` → `src/tsl/noise/simplexNoise2d.ts`
  - [ ] Copy `simplexNoise3d.ts` → consolidate with `.js` version
  - [ ] Copy `simplexNoise4d.ts` → consolidate with `.js` version
  - [ ] Update imports to r181 format
  - [ ] Add TypeScript types
  - [ ] Add JSDoc comments
  - [ ] Create unit tests
  - [ ] Create visual test example
  - **Effort:** 12 hours
  - **Dependencies:** Task 1.2
  - **Acceptance:** All tests pass, visual output matches reference

- [ ] **Task 1.4:** Port perlin noise
  - [ ] Copy `perlin_noise_3d.js` → convert to TS
  - [ ] Update to r181 TSL API
  - [ ] Add tests
  - **Effort:** 4 hours
  - **Dependencies:** Task 1.2
  - **Acceptance:** Tests pass

- [ ] **Task 1.5:** Port curl noise functions
  - [ ] Port `curlNoise3d.ts` (consolidate JS/TS versions)
  - [ ] Port `curlNoise4d.ts` (consolidate JS/TS versions)
  - [ ] Add tests and examples
  - **Effort:** 6 hours
  - **Dependencies:** Task 1.3
  - **Acceptance:** Tests pass, visual examples work

#### Day 6-7: Noise Functions - Part 2
- [ ] **Task 1.6:** Port voronoi and advanced noise
  - [ ] Port `voronoi.ts`
  - [ ] Port `fbm.js` → convert to TS
  - [ ] Port `turbulence.js` → convert to TS
  - [ ] Port `common.js` (permute, taylorInvSqrt)
  - [ ] Create unified noise utilities module
  - **Effort:** 8 hours
  - **Dependencies:** Task 1.3
  - **Acceptance:** All noise functions working

- [ ] **Task 1.7:** Create noise module index
  - [ ] Create `src/tsl/noise/index.ts` with exports
  - [ ] Add barrel exports
  - [ ] Document API
  - **Effort:** 2 hours
  - **Dependencies:** Tasks 1.3-1.6
  - **Acceptance:** Tree-shakeable imports work

### Week 2: SDF & Math Utilities

#### Day 1-3: SDF Shapes 📐
- [ ] **Task 2.1:** Port 2D SDF shapes
  - [ ] Port `sdSphere`
  - [ ] Port `sdBox2d`
  - [ ] Port `sdDiamond`
  - [ ] Port `sdRing`
  - [ ] Port `sdLine`
  - [ ] Port `sdHexagon`
  - [ ] Port `sdEquilateralTriangle`
  - [ ] Port `sdParallelogram`
  - [ ] Port `sdRhombus`
  - [ ] Port `sdTriangle`
  - Update all to r181, add types, tests
  - **Effort:** 12 hours
  - **Dependencies:** Task 1.2
  - **Acceptance:** All SDFs render correctly

- [ ] **Task 2.2:** Port 3D SDF shapes
  - [ ] Port `sdBox3d`
  - [ ] Add sphere3d, cylinder, torus, etc.
  - [ ] Tests and visual examples
  - **Effort:** 6 hours
  - **Dependencies:** Task 2.1
  - **Acceptance:** 3D SDFs render correctly

#### Day 4-5: SDF Operations 🔧
- [ ] **Task 2.3:** Port SDF operations
  - [ ] Port from `sdf/operations.js`
  - [ ] Union, subtraction, intersection
  - [ ] Smooth min/max operations
  - [ ] Domain repetition
  - [ ] Transformations (rotate, translate, scale)
  - [ ] Add tests for each operation
  - **Effort:** 8 hours
  - **Dependencies:** Task 2.1
  - **Acceptance:** Operations work correctly

- [ ] **Task 2.4:** Create SDF module index
  - [ ] Create `src/tsl/sdf/index.ts`
  - [ ] Organize shapes and operations
  - [ ] Document SDF API
  - **Effort:** 2 hours
  - **Dependencies:** Tasks 2.1-2.3
  - **Acceptance:** Clean API exports

#### Day 6-7: Math Utilities 🧮
- [ ] **Task 2.5:** Port math utilities
  - [ ] Port `remap.ts` - value remapping
  - [ ] Port `smooth-min.ts`
  - [ ] Port `smooth-mod.ts`
  - [ ] Port `rotate-3d-y.ts`
  - [ ] Port `complex.js` → TS
  - [ ] Port `coordinates.js` → TS
  - [ ] Add comprehensive tests
  - **Effort:** 8 hours
  - **Dependencies:** Task 1.2
  - **Acceptance:** All math functions tested

- [ ] **Task 2.6:** Create math module index
  - [ ] Create `src/tsl/math/index.ts`
  - [ ] Organize utilities
  - **Effort:** 2 hours
  - **Dependencies:** Task 2.5
  - **Acceptance:** Clean exports

### Week 3: Lighting & Color Systems

#### Day 1-3: Lighting Nodes 💡
- [ ] **Task 3.1:** Port basic lighting
  - [ ] Port `ambient.ts`
  - [ ] Port `diffuse.ts`
  - [ ] Port `directional.ts`
  - [ ] Port `hemisphere.ts`
  - [ ] Update to r181 lighting API
  - [ ] Add tests and visual examples
  - **Effort:** 10 hours
  - **Dependencies:** Task 1.2
  - **Acceptance:** Lighting renders correctly

- [ ] **Task 3.2:** Port advanced lighting
  - [ ] Port `fresnel.ts`
  - [ ] Add specular lighting
  - [ ] Add point lights
  - [ ] Add spot lights
  - [ ] Create lighting utilities
  - **Effort:** 8 hours
  - **Dependencies:** Task 3.1
  - **Acceptance:** Advanced lighting works

#### Day 4-5: Color Utilities 🎨
- [ ] **Task 3.3:** Port color functions
  - [ ] Port `cosine_palette.js` → TS
  - [ ] Port `tonemapping.js` → TS
  - [ ] Add color space conversions
  - [ ] Add gradient utilities
  - [ ] Tests and examples
  - **Effort:** 6 hours
  - **Dependencies:** Task 1.2
  - **Acceptance:** Color functions work

- [ ] **Task 3.4:** Create lighting/color modules index
  - [ ] Create `src/tsl/lighting/index.ts`
  - [ ] Create `src/tsl/color/index.ts`
  - [ ] Document APIs
  - **Effort:** 2 hours
  - **Dependencies:** Tasks 3.1-3.3
  - **Acceptance:** Clean API

#### Day 6-7: Utility Functions 🛠️
- [ ] **Task 3.5:** Port function utilities
  - [ ] Port `bloom.js` → TS
  - [ ] Port `bloom_edge_pattern.js` → TS
  - [ ] Port `screen_aspect_uv.js` → TS
  - [ ] Port `repeating_pattern.js` → TS
  - [ ] Port `domain_index.js` → TS
  - [ ] Port `median3.js` → TS
  - **Effort:** 8 hours
  - **Dependencies:** Task 1.2
  - **Acceptance:** Utilities work

- [ ] **Task 3.6:** Port compose utilities
  - [ ] Port `compose.ts`
  - [ ] Add function composition helpers
  - [ ] Tests
  - **Effort:** 3 hours
  - **Dependencies:** Task 3.5
  - **Acceptance:** Composition works

### Week 4: Post-Processing Foundation

#### Day 1-3: Basic Post-Processing 🎬
- [ ] **Task 4.1:** Set up post-processing framework
  - [ ] Create `src/tsl/postprocessing/` structure
  - [ ] Set up pass system
  - [ ] Create base pass class
  - [ ] Set up render target management
  - **Effort:** 8 hours
  - **Dependencies:** Task 1.1
  - **Acceptance:** Framework operational

- [ ] **Task 4.2:** Port basic effects
  - [ ] Port `vignette_effect.js` → TS
  - [ ] Port `grain_texture_effect.js` → TS
  - [ ] Port `pixellation_effect.js` → TS
  - [ ] Add tests and visual examples
  - **Effort:** 8 hours
  - **Dependencies:** Task 4.1
  - **Acceptance:** Effects render correctly

#### Day 4-7: Core Module Integration 🔗
- [ ] **Task 4.3:** Create main TSL module index
  - [ ] Create `src/tsl/index.ts` main export
  - [ ] Organize all sub-modules
  - [ ] Add tree-shaking support
  - [ ] Document module structure
  - **Effort:** 6 hours
  - **Dependencies:** All previous tasks
  - **Acceptance:** Clean, organized API

- [ ] **Task 4.4:** Phase 1 testing & documentation
  - [ ] Write comprehensive tests for all modules
  - [ ] Create visual test gallery
  - [ ] Generate API documentation
  - [ ] Create usage examples
  - [ ] Performance benchmarks
  - **Effort:** 12 hours
  - **Dependencies:** Task 4.3
  - **Acceptance:** 100% test coverage, docs complete

---

## 🎨 Phase 2: Materials & Advanced Post-Processing (Weeks 5-8)

### Week 5: Procedural Textures - Part 1

#### Day 1-7: Organic Materials 🌿
- [ ] **Task 5.1:** Port organic textures (Priority Set 1)
  - [ ] `marble.js` → TS
  - [ ] `wood.js` → TS
  - [ ] `clouds.js` → TS
  - [ ] `water-drops.js` → TS
  - [ ] `cork.js` → TS
  - [ ] Update to r181, add types, tests
  - **Effort:** 20 hours
  - **Dependencies:** Phase 1 complete
  - **Acceptance:** Textures generate correctly

- [ ] **Task 5.2:** Port fabric & surfaces
  - [ ] `satin.js` → TS
  - [ ] `crumpled-fabric.js` → TS
  - [ ] `rough-clay.js` → TS
  - [ ] `concrete.js` → TS
  - [ ] Tests and examples
  - **Effort:** 12 hours
  - **Dependencies:** Task 5.1
  - **Acceptance:** Materials look correct

### Week 6: Procedural Textures - Part 2

#### Day 1-4: Geometric Patterns 📊
- [ ] **Task 6.1:** Port geometric textures
  - [ ] `bricks.js` → TS
  - [ ] `grid.js` → TS
  - [ ] `voronoi-cells.js` → TS
  - [ ] `polka-dots.js` → TS
  - [ ] `circles.js` → TS
  - [ ] `isolines.js` → TS
  - [ ] Tests and examples
  - **Effort:** 16 hours
  - **Dependencies:** Phase 1 complete
  - **Acceptance:** Patterns generate correctly

#### Day 5-7: Special Effects ✨
- [ ] **Task 6.2:** Port effect textures
  - [ ] `caustics.js` → TS
  - [ ] `neon-lights.js` → TS
  - [ ] `turbulent-smoke.js` → TS
  - [ ] `stars.js` → TS
  - [ ] `rust.js` → TS
  - [ ] Tests and examples
  - **Effort:** 12 hours
  - **Dependencies:** Task 6.1
  - **Acceptance:** Effects work correctly

### Week 7: Official Three.js Post-Processing - Part 1

#### Day 1-3: Anti-Aliasing & Blur 🔍
- [ ] **Task 7.1:** Port FXAA & SMAA
  - [ ] Copy `FXAANode.js` from 05_Three_Official
  - [ ] Copy `SMAANode.js`
  - [ ] Update for r181 if needed
  - [ ] Add to post-processing stack
  - [ ] Tests
  - **Effort:** 8 hours
  - **Dependencies:** Task 4.1
  - **Acceptance:** AA works, performance good

- [ ] **Task 7.2:** Port blur effects
  - [ ] Copy `GaussianBlurNode.js`
  - [ ] Copy `boxBlur.js`
  - [ ] Copy `hashBlur.js`
  - [ ] Tests and benchmarks
  - **Effort:** 6 hours
  - **Dependencies:** Task 7.1
  - **Acceptance:** Blur quality good

#### Day 4-7: Bloom & DOF 🌟
- [ ] **Task 7.3:** Port bloom
  - [ ] Copy `BloomNode.js`
  - [ ] Integrate with post-processing stack
  - [ ] Add threshold, intensity, radius controls
  - [ ] Performance optimization
  - [ ] Tests
  - **Effort:** 10 hours
  - **Dependencies:** Task 7.2
  - **Acceptance:** Bloom looks great, performs well

- [ ] **Task 7.4:** Port depth of field
  - [ ] Copy `DepthOfFieldNode.js`
  - [ ] Add bokeh controls
  - [ ] Add focus distance control
  - [ ] Tests and visual examples
  - **Effort:** 8 hours
  - **Dependencies:** Task 7.3
  - **Acceptance:** DOF realistic

### Week 8: Advanced Rendering Effects

#### Day 1-4: SSR, SSGI, GTAO 🔥
- [ ] **Task 8.1:** Port GTAO (Ground Truth AO)
  - [ ] Copy `GTAONode.js`
  - [ ] Understand implementation
  - [ ] Integrate with rendering pipeline
  - [ ] Add quality/performance settings
  - [ ] Tests
  - **Effort:** 12 hours
  - **Dependencies:** Task 4.1
  - **Acceptance:** AO looks realistic

- [ ] **Task 8.2:** Port SSR (Screen Space Reflections)
  - [ ] Copy `SSRNode.js`
  - [ ] Port from 03_Compute/ssr-gtao if needed
  - [ ] Integrate with pipeline
  - [ ] Add controls (intensity, falloff)
  - [ ] Tests
  - **Effort:** 12 hours
  - **Dependencies:** Task 8.1
  - **Acceptance:** Reflections look good

#### Day 5-7: SSGI & SSS 🌈
- [ ] **Task 8.3:** Port SSGI (Screen Space GI)
  - [ ] Copy `SSGINode.js`
  - [ ] Port from 03_Compute/ssgi-ssr if needed
  - [ ] Integrate with lighting
  - [ ] Performance optimization
  - [ ] Tests
  - **Effort:** 12 hours
  - **Dependencies:** Task 8.2
  - **Acceptance:** GI realistic, performant

- [ ] **Task 8.4:** Port SSS (Subsurface Scattering)
  - [ ] Copy `SSSNode.js`
  - [ ] Add material integration
  - [ ] Tests with translucent materials
  - **Effort:** 8 hours
  - **Dependencies:** Task 8.3
  - **Acceptance:** SSS looks realistic

---

## ⚙️ Phase 3: Compute Shaders & Particles (Weeks 9-12)

### Week 9: GPU Compute Foundation

#### Day 1-3: Compute Shader Setup 🖥️
- [ ] **Task 9.1:** Set up compute shader framework
  - [ ] Create `src/compute/` structure
  - [ ] Set up compute pipeline
  - [ ] Create buffer management system
  - [ ] Add compute pass utilities
  - **Effort:** 10 hours
  - **Dependencies:** Phase 1 complete
  - **Acceptance:** Compute shaders run

- [ ] **Task 9.2:** Port basic compute examples
  - [ ] Port from `03_Compute/tsl-compute-particles`
  - [ ] Create simple compute shader
  - [ ] Test read/write buffers
  - **Effort:** 8 hours
  - **Dependencies:** Task 9.1
  - **Acceptance:** Compute works

#### Day 4-7: Particle System Foundation 🎆
- [ ] **Task 9.3:** Create particle system base
  - [ ] Design particle system architecture
  - [ ] Create particle buffer management
  - [ ] Set up particle rendering
  - [ ] Add basic particle simulation
  - **Effort:** 12 hours
  - **Dependencies:** Task 9.2
  - **Acceptance:** Basic particles render

- [ ] **Task 9.4:** Port particle waves
  - [ ] Port from `03_Compute/tsl-particle-waves`
  - [ ] Add wave propagation
  - [ ] Add interaction
  - [ ] Tests
  - **Effort:** 10 hours
  - **Dependencies:** Task 9.3
  - **Acceptance:** Wave simulation works

### Week 10: Advanced Particle Systems

#### Day 1-4: Attractors & Flow Fields 🌀
- [ ] **Task 10.1:** Port attractor system
  - [ ] Port from `04_Complete_Examples/three-tsl-sandbox/attractors`
  - [ ] Add multiple attractor types
  - [ ] Add repulsion
  - [ ] Tests
  - **Effort:** 12 hours
  - **Dependencies:** Task 9.3
  - **Acceptance:** Attractors work

- [ ] **Task 10.2:** Port flow field particles
  - [ ] Port from `04_Complete_Examples/three-tsl-sandbox/particles-flow-field`
  - [ ] Add 3D flow fields
  - [ ] Add curl noise integration
  - [ ] Tests
  - **Effort:** 12 hours
  - **Dependencies:** Task 10.1
  - **Acceptance:** Flow fields realistic

#### Day 5-7: Particle Morphing 🦋
- [ ] **Task 10.3:** Port particle morphing
  - [ ] Port from `particles-morphing` examples
  - [ ] Add shape interpolation
  - [ ] Add multiple target shapes
  - [ ] Tests
  - **Effort:** 10 hours
  - **Dependencies:** Task 10.2
  - **Acceptance:** Morphing smooth

- [ ] **Task 10.4:** Port GPU particles
  - [ ] Port from `gpu-particles` example
  - [ ] Optimize for performance
  - [ ] Add emission controls
  - [ ] Tests
  - **Effort:** 8 hours
  - **Dependencies:** Task 10.3
  - **Acceptance:** High particle count performs well

### Week 11: Fluid Simulation

#### Day 1-7: Roquefort Fluid System 💧
- [ ] **Task 11.1:** Port fluid simulation core
  - [ ] Port `03_Compute/roquefort/simulation/` folder
  - [ ] Port `advect.js` → TS
  - [ ] Port `divergence.js` → TS
  - [ ] Port `pressure.js` → TS
  - [ ] Port `gradient_subtract.js` → TS
  - [ ] Update to r181 compute API
  - **Effort:** 20 hours
  - **Dependencies:** Task 9.1
  - **Acceptance:** Core simulation runs

- [ ] **Task 11.2:** Port fluid vorticity & emitters
  - [ ] Port `vorticity.js` → TS
  - [ ] Port `emitters.js` → TS
  - [ ] Port `common.js` → TS
  - [ ] Tests
  - **Effort:** 8 hours
  - **Dependencies:** Task 11.1
  - **Acceptance:** Vorticity looks realistic

- [ ] **Task 11.3:** Port fluid rendering
  - [ ] Port `rendering/blur.js` → TS
  - [ ] Port `rendering/lighting.js` → TS
  - [ ] Port `rendering/render.js` → TS
  - [ ] Add visual controls
  - [ ] Tests
  - **Effort:** 10 hours
  - **Dependencies:** Task 11.2
  - **Acceptance:** Fluid renders beautifully

### Week 12: Complete Particle Examples

#### Day 1-7: Portfolio Lab Particle Examples 🎨
- [ ] **Task 12.1:** Port FBO particles
  - [ ] Port from `fbo-particles` example
  - [ ] Add FBO ping-pong rendering
  - [ ] Tests
  - **Effort:** 8 hours
  - **Dependencies:** Task 9.3
  - **Acceptance:** FBO particles work

- [ ] **Task 12.2:** Port particle destruction
  - [ ] Port from `mesh-particles-destruction`
  - [ ] Add mesh shattering
  - [ ] Add particle physics
  - [ ] Tests
  - **Effort:** 10 hours
  - **Dependencies:** Task 12.1
  - **Acceptance:** Destruction looks great

- [ ] **Task 12.3:** Port cursor interaction particles
  - [ ] Port `particles-following-cursor-position`
  - [ ] Port `particles-photo-mouse-trail`
  - [ ] Add touch support
  - [ ] Tests
  - **Effort:** 8 hours
  - **Dependencies:** Task 12.2
  - **Acceptance:** Interaction smooth

- [ ] **Task 12.4:** Phase 3 integration testing
  - [ ] Test all particle systems together
  - [ ] Performance benchmarks
  - [ ] Optimize
  - [ ] Documentation
  - **Effort:** 8 hours
  - **Dependencies:** All Phase 3 tasks
  - **Acceptance:** All systems stable

---

## 🌟 Phase 4: Advanced Effects & Materials (Weeks 13-16)

### Week 13: Color Grading & Temporal Effects

#### Day 1-3: LUT & Color Grading 🎨
- [ ] **Task 13.1:** Port LUT3D color grading
  - [ ] Copy `Lut3DNode.js`
  - [ ] Add LUT loading utilities
  - [ ] Create LUT presets
  - [ ] Add LUT editor interface
  - [ ] Tests
  - **Effort:** 10 hours
  - **Dependencies:** Task 4.1
  - **Acceptance:** LUT grading works

- [ ] **Task 13.2:** Port color effects
  - [ ] Copy `BleachBypass.js`
  - [ ] Copy `Sepia.js`
  - [ ] Copy `FilmNode.js`
  - [ ] Tests
  - **Effort:** 6 hours
  - **Dependencies:** Task 13.1
  - **Acceptance:** Color effects work

#### Day 4-7: Temporal Effects ⏱️
- [ ] **Task 13.3:** Port temporal anti-aliasing
  - [ ] Copy `TRAANode.js`
  - [ ] Implement jitter pattern
  - [ ] Add history buffer
  - [ ] Tests and benchmarks
  - **Effort:** 12 hours
  - **Dependencies:** Task 7.1
  - **Acceptance:** TRAA smooth, no ghosting

- [ ] **Task 13.4:** Port motion blur
  - [ ] Copy `MotionBlur.js`
  - [ ] Add velocity buffer
  - [ ] Add quality controls
  - [ ] Tests
  - **Effort:** 10 hours
  - **Dependencies:** Task 13.3
  - **Acceptance:** Motion blur realistic

### Week 14: Lens & Camera Effects

#### Day 1-4: Lens Effects 📷
- [ ] **Task 14.1:** Port lens effects
  - [ ] Copy `ChromaticAberrationNode.js`
  - [ ] Copy `LensflareNode.js`
  - [ ] Copy `AnamorphicNode.js`
  - [ ] Add controls for each
  - [ ] Tests
  - **Effort:** 12 hours
  - **Dependencies:** Task 4.1
  - **Acceptance:** Lens effects realistic

- [ ] **Task 14.2:** Port distortion effects
  - [ ] Add barrel distortion
  - [ ] Add pincushion distortion
  - [ ] Add fish-eye
  - [ ] Tests
  - **Effort:** 8 hours
  - **Dependencies:** Task 14.1
  - **Acceptance:** Distortions correct

#### Day 5-7: Stylized Effects 🎭
- [ ] **Task 14.3:** Port stylized rendering
  - [ ] Copy `DotScreenNode.js`
  - [ ] Copy `SobelOperatorNode.js`
  - [ ] Copy `OutlineNode.js`
  - [ ] Copy `RGBShiftNode.js`
  - [ ] Tests
  - **Effort:** 10 hours
  - **Dependencies:** Task 4.1
  - **Acceptance:** Effects look good

- [ ] **Task 14.4:** Port pixelation & retro effects
  - [ ] Copy `PixelationPassNode.js`
  - [ ] Add dithering effects
  - [ ] Add CRT effects
  - [ ] Tests
  - **Effort:** 8 hours
  - **Dependencies:** Task 14.3
  - **Acceptance:** Retro look authentic

### Week 15: MaterialX Integration

#### Day 1-4: MaterialX Core 🧬
- [ ] **Task 15.1:** Set up MaterialX system
  - [ ] Study MaterialX specification
  - [ ] Create MaterialX loader
  - [ ] Parse .mtlx files
  - [ ] Map to Three.js materials
  - **Effort:** 16 hours
  - **Dependencies:** Phase 2 complete
  - **Acceptance:** Basic .mtlx files load

- [ ] **Task 15.2:** Port MaterialX examples
  - [ ] Port transmission materials
  - [ ] Port thin film (iridescence)
  - [ ] Port texture opacity
  - [ ] Tests
  - **Effort:** 12 hours
  - **Dependencies:** Task 15.1
  - **Acceptance:** Materials render correctly

#### Day 5-7: Advanced Materials 💎
- [ ] **Task 15.3:** Port advanced material features
  - [ ] Port sheen materials
  - [ ] Port specular models
  - [ ] Port roughness variations
  - [ ] Port IOR controls
  - [ ] Tests
  - **Effort:** 12 hours
  - **Dependencies:** Task 15.2
  - **Acceptance:** Advanced materials realistic

- [ ] **Task 15.4:** Material editor integration
  - [ ] Create material node graph
  - [ ] Add material preview
  - [ ] Add parameter controls
  - [ ] Save/load materials
  - **Effort:** 12 hours
  - **Dependencies:** Task 15.3
  - **Acceptance:** Editor functional

### Week 16: Raymarching & SDFs

#### Day 1-7: Raymarching System 🎯
- [ ] **Task 16.1:** Port raymarching utilities
  - [ ] Copy `Raymarching.js` from 05_Three_Official/utils
  - [ ] Port from `04_Complete_Examples/raymarching`
  - [ ] Create raymarching material system
  - [ ] Add SDF scene composition
  - **Effort:** 16 hours
  - **Dependencies:** Week 2 (SDF)
  - **Acceptance:** Raymarching renders correctly

- [ ] **Task 16.2:** Port raymarching examples
  - [ ] Port all 6 raymarching steps from examples
  - [ ] Add advanced SDF operations
  - [ ] Add lighting for raymarched scenes
  - [ ] Add shadows
  - [ ] Tests
  - **Effort:** 16 hours
  - **Dependencies:** Task 16.1
  - **Acceptance:** Complex scenes render

- [ ] **Task 16.3:** Phase 4 documentation & testing
  - [ ] Document all new systems
  - [ ] Create example gallery
  - [ ] Performance testing
  - [ ] Optimize
  - **Effort:** 8 hours
  - **Dependencies:** All Phase 4 tasks
  - **Acceptance:** Phase 4 complete

---

## 🚀 Phase 5: Polish, Optimization & Production (Weeks 17-20)

### Week 17: Complete Examples & Integration

#### Day 1-4: Portfolio Lab Integration 🎨
- [ ] **Task 17.1:** Port remaining lab examples
  - [ ] Port `displaced-sphere` variants
  - [ ] Port `infinite-water`
  - [ ] Port `magic-wand-cursor`
  - [ ] Port `nightingale-hover-effect`
  - [ ] Tests
  - **Effort:** 16 hours
  - **Dependencies:** Phases 1-4 complete
  - **Acceptance:** Examples work

- [ ] **Task 17.2:** Port advanced examples
  - [ ] Port `distorted-scroller`
  - [ ] Port `dissolve` effect
  - [ ] Port `smoke-particles`
  - [ ] Port `snowflakes`
  - [ ] Tests
  - **Effort:** 12 hours
  - **Dependencies:** Task 17.1
  - **Acceptance:** All examples functional

#### Day 5-7: TSL Sandbox Integration 📦
- [ ] **Task 17.3:** Port key sandbox examples
  - [ ] Port `animated-galaxy`
  - [ ] Port `portal-scene`
  - [ ] Port `procedural-terrain`
  - [ ] Port `raging-sea`
  - [ ] Port `hologram`
  - [ ] Tests
  - **Effort:** 12 hours
  - **Dependencies:** Task 17.2
  - **Acceptance:** Sandbox examples work

### Week 18: Optimization & Performance

#### Day 1-4: Performance Optimization ⚡
- [ ] **Task 18.1:** Profile and optimize
  - [ ] Profile all systems
  - [ ] Optimize hot paths
  - [ ] Reduce memory allocations
  - [ ] Optimize shader compilation
  - [ ] Add performance monitoring
  - **Effort:** 16 hours
  - **Dependencies:** All features complete
  - **Acceptance:** 60fps on target hardware

- [ ] **Task 18.2:** Memory optimization
  - [ ] Optimize buffer usage
  - [ ] Add resource pooling
  - [ ] Fix memory leaks
  - [ ] Add disposal methods
  - **Effort:** 12 hours
  - **Dependencies:** Task 18.1
  - **Acceptance:** No memory leaks

#### Day 5-7: Build Optimization 📦
- [ ] **Task 18.3:** Build system optimization
  - [ ] Optimize bundle size
  - [ ] Add tree-shaking
  - [ ] Add code splitting
  - [ ] Minification
  - [ ] Source maps
  - **Effort:** 10 hours
  - **Dependencies:** Task 18.2
  - **Acceptance:** Bundle size < 500KB gzipped

- [ ] **Task 18.4:** Loading optimization
  - [ ] Lazy load modules
  - [ ] Add preloading
  - [ ] Optimize asset loading
  - [ ] Add caching
  - **Effort:** 8 hours
  - **Dependencies:** Task 18.3
  - **Acceptance:** Fast initial load

### Week 19: Testing & Documentation

#### Day 1-4: Comprehensive Testing 🧪
- [ ] **Task 19.1:** Unit testing
  - [ ] Write tests for all modules
  - [ ] Aim for 90%+ coverage
  - [ ] Add edge case tests
  - [ ] Performance regression tests
  - **Effort:** 16 hours
  - **Dependencies:** All features complete
  - **Acceptance:** 90% test coverage

- [ ] **Task 19.2:** Visual regression testing
  - [ ] Set up visual testing framework
  - [ ] Capture reference images
  - [ ] Add comparison tests
  - [ ] CI integration
  - **Effort:** 12 hours
  - **Dependencies:** Task 19.1
  - **Acceptance:** Visual tests pass

#### Day 5-7: Documentation 📚
- [ ] **Task 19.3:** API documentation
  - [ ] Generate TypeDoc documentation
  - [ ] Add JSDoc comments everywhere
  - [ ] Create API reference
  - [ ] Add type documentation
  - **Effort:** 12 hours
  - **Dependencies:** Task 19.2
  - **Acceptance:** Complete API docs

- [ ] **Task 19.4:** User guides
  - [ ] Write getting started guide
  - [ ] Write concept guides
  - [ ] Write cookbook recipes
  - [ ] Add video tutorials
  - **Effort:** 12 hours
  - **Dependencies:** Task 19.3
  - **Acceptance:** Comprehensive guides

### Week 20: Production Release

#### Day 1-3: Final Polish ✨
- [ ] **Task 20.1:** Bug fixing
  - [ ] Fix all known bugs
  - [ ] Address user feedback
  - [ ] Polish UI/UX
  - [ ] Final QA pass
  - **Effort:** 12 hours
  - **Dependencies:** All previous tasks
  - **Acceptance:** No critical bugs

- [ ] **Task 20.2:** Example gallery
  - [ ] Create interactive gallery
  - [ ] Add all examples
  - [ ] Add source code links
  - [ ] Add live editing
  - **Effort:** 10 hours
  - **Dependencies:** Task 20.1
  - **Acceptance:** Gallery impressive

#### Day 4-7: Release 🎉
- [ ] **Task 20.3:** Release preparation
  - [ ] Prepare changelog
  - [ ] Update README
  - [ ] Create release notes
  - [ ] Prepare marketing materials
  - **Effort:** 8 hours
  - **Dependencies:** Task 20.2
  - **Acceptance:** Ready to release

- [ ] **Task 20.4:** Production deployment
  - [ ] Deploy to npm
  - [ ] Deploy documentation site
  - [ ] Deploy example gallery
  - [ ] Announce release
  - **Effort:** 8 hours
  - **Dependencies:** Task 20.3
  - **Acceptance:** TSLStudio v1.0 live! 🚀

---

## 📊 Progress Tracking Template

### Daily Progress
```markdown
## Date: YYYY-MM-DD
### Completed
- [x] Task X.X: Description (Xh actual vs Xh estimated)

### In Progress
- [ ] Task X.X: Description (X% complete)

### Blocked
- [ ] Task X.X: Description - Reason for block

### Tomorrow
- [ ] Task X.X: Description
```

### Weekly Review
```markdown
## Week X Review
### Accomplishments
- Completed X tasks
- X modules ported
- X tests written

### Challenges
- Challenge description and resolution

### Next Week Focus
- Priority 1
- Priority 2
```

---

## 🎯 Acceptance Criteria Summary

### Module Acceptance Criteria
Every ported module must meet:
- ✅ TypeScript with full type safety
- ✅ Three.js r181 compatible imports
- ✅ JSDoc comments for all public APIs
- ✅ Unit tests with 80%+ coverage
- ✅ Visual test if applicable
- ✅ Performance benchmarks pass
- ✅ No console errors/warnings
- ✅ Tree-shakeable exports
- ✅ Documentation in API reference

### System Acceptance Criteria
Every major system must have:
- ✅ Architecture documentation
- ✅ Usage examples
- ✅ Integration tests
- ✅ Performance targets met
- ✅ Error handling
- ✅ TypeScript types exported
- ✅ Playground example

---

## 📝 Risk Mitigation

### Technical Risks

| Risk | Probability | Impact | Mitigation |
|------|------------|--------|------------|
| Three.js r181 API changes | Medium | High | Test early, follow changelog closely |
| Performance issues | Medium | High | Profile continuously, optimize iteratively |
| WebGPU browser support | Low | Medium | Provide WebGL2 fallback |
| Complex shader bugs | High | Medium | Comprehensive visual testing |
| Memory leaks | Medium | High | Use memory profiler, add disposal |

### Schedule Risks

| Risk | Probability | Impact | Mitigation |
|------|------------|--------|------------|
| Underestimated complexity | High | High | Add 20% buffer time |
| Scope creep | Medium | High | Strict scope control, defer non-essential |
| Dependencies block progress | Low | Medium | Parallelize independent tasks |
| Burnout | Medium | High | Reasonable hours, regular breaks |

---

## 🔗 Dependencies & Prerequisites

### External Dependencies
- Three.js r181+
- TypeScript 5.0+
- Vite 5.0+
- Vitest (testing)
- Playwright (E2E testing)

### Browser Requirements
- Chrome 113+ (WebGPU)
- Edge 113+
- Safari 17+ (Preview)
- Firefox Nightly (WebGPU enabled)

### Development Environment
- Node.js 20+
- Git
- VS Code (recommended)
- GPU with WebGPU support

---

## 📈 Progress Dashboard

### Overall Progress
- [ ] Phase 1: Foundation (0/27 tasks) - 0%
- [ ] Phase 2: Materials (0/23 tasks) - 0%
- [ ] Phase 3: Compute (0/19 tasks) - 0%
- [ ] Phase 4: Advanced (0/18 tasks) - 0%
- [ ] Phase 5: Production (0/13 tasks) - 0%

**Total: 0/100 tasks complete (0%)**

### Module Counts
- TSL Nodes: 0/50 ported
- Materials: 0/53 ported
- Post-Processing: 0/30 ported
- Compute: 0/5 systems ported
- Examples: 0/40 ported

---

## 🎯 Next Actions

1. ✅ Review this plan
2. ✅ Set up development environment
3. ✅ Start Phase 1, Week 1, Task 1.1
4. 🔄 Update progress daily
5. 🔄 Conduct weekly reviews

---

**Ready to begin! 🚀**

*Last Updated: November 8, 2025*  
*Next Review: After Phase 1 completion*

