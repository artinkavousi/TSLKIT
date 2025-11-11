# Module Porting Priority & Phase Assignments

> **Date**: November 10, 2025  
> **Total Modules**: 99  
> **Estimated Total Effort**: ~250 hours (12-15 weeks)

---

## Executive Summary

This document provides a prioritized roadmap for porting all 99 collected modules from Three.js r170-r180 to r181+. Modules are ranked by:
- **Business Value**: Impact on end-user experience
- **Technical Foundation**: Required by other modules
- **Complexity**: Effort vs. value ratio
- **Risk**: Technical challenges and unknowns

---

## Priority Tiers

### Tier 1: Critical Foundation (Must Have First)
**Modules**: 20 | **Effort**: ~50 hours | **Timeline**: Weeks 1-2

| # | Module | Category | Effort | Why Critical |
|---|--------|----------|--------|--------------|
| 1 | Noise Common | Noise | 1h | Required by all fragments-boilerplate noise |
| 2 | Simplex Noise 3D | Noise | 2h | Most widely used noise function |
| 3 | Perlin Noise 3D | Noise | 2h | Alternative noise, widely used |
| 4 | Curl Noise 3D | Noise | 3h | Essential for particle systems |
| 5 | FBM | Noise | 2h | Fractal noise foundation |
| 6 | Fresnel | Lighting | 2h | Core PBR lighting component |
| 7 | Ambient Light | Lighting | 1h | Basic lighting |
| 8 | Diffuse Light | Lighting | 1h | Basic lighting |
| 9 | Hemisphere Light | Lighting | 1h | Basic lighting |
| 10 | Remap | Utils | 0.5h | Used everywhere for value mapping |
| 11 | Smooth Min | Utils | 1h | SDF operations |
| 12 | Compose | Utils | 1h | Function composition |
| 13 | Sphere SDF | SDF | 1h | Basic SDF primitive |
| 14 | SDF Shapes | SDF | 4h | All SDF primitives |
| 15 | SDF Operations | SDF | 3h | Union, intersection, subtraction |
| 16 | Bloom Helpers | Utils | 2h | Post-FX foundation |
| 17 | Tonemapping | Utils | 2h | Color grading foundation |
| 18 | Coordinates | Utils | 1h | Spatial transforms |
| 19 | Gaussian Blur | Post-FX | 3h | Core blur algorithm |
| 20 | Device Caps Detection | Utils | 4h | Feature gating system |

**Acceptance Criteria:**
- ✅ All modules compile without errors
- ✅ Visual output matches source (manual inspection)
- ✅ Dependencies properly resolved
- ✅ Unit tests pass

---

### Tier 2: Core Features (High Priority)
**Modules**: 27 | **Effort**: ~90 hours | **Timeline**: Weeks 3-6

#### 2A: Extended Noise Library (10 modules, ~20 hours)

| Module | Effort | Dependencies | Notes |
|--------|--------|--------------|-------|
| Simplex Noise 2D | 2h | common | 2D variant |
| Simplex Noise 4D | 3h | common | 4D variant |
| Curl Noise 4D | 3h | common | 4D curl |
| Classic Noise 3D | 2h | three/tsl | Alternative implementation |
| Voronoi | 3h | three/tsl | Cellular noise |
| Turbulence | 2h | fbm | Domain warping |
| Curl Noise 3D (fragments) | 2h | common | Duplicate, compare with portfolio |
| Curl Noise 4D (fragments) | 3h | common | Duplicate, compare with portfolio |
| Simplex Noise 3D (fragments) | 2h | common | Duplicate, compare with portfolio |
| Simplex Noise 4D (fragments) | 3h | common | Duplicate, compare with portfolio |

**Decision Point**: Choose best implementation between portfolio and fragments-boilerplate versions.

#### 2B: Lighting & Material Helpers (4 modules, ~8 hours)

| Module | Effort | Priority | Why High Priority |
|--------|--------|----------|-------------------|
| Directional Light | 2h | High | Shadows support |
| Lighting Utils | 2h | High | Additional lighting helpers |
| Bloom Edge Pattern | 1h | Medium | Edge detection for materials |
| Cosine Palette | 1h | Medium | Procedural color generation |

#### 2C: Essential Utilities (6 modules, ~10 hours)

| Module | Effort | Use Cases |
|--------|--------|-----------|
| Rotate 3D Y | 1h | Transformations |
| Smooth Mod | 1h | Pattern repetition |
| Screen Aspect UV | 1h | UV correction |
| Repeating Pattern | 1h | Tiling |
| Domain Index | 1h | Spatial indexing |
| Median3 | 1h | Filtering |

#### 2D: Critical Post-Processing (7 modules, ~52 hours)

| Module | Effort | Priority | Why Critical |
|--------|--------|----------|--------------|
| **Official Bloom** | 4h | Critical | Core post-FX |
| **Official GTAO** | 8h | Critical | Ambient occlusion (quality differentiator) |
| **Official SSR** | 10h | Critical | Reflections (quality differentiator) |
| **Official SSGI** | 10h | Critical | Global illumination (quality differentiator) |
| **Official DOF** | 6h | Critical | Depth of field |
| **Official FXAA** | 3h | High | Anti-aliasing |
| **Official SMAA** | 6h | High | Better anti-aliasing |
| **Official TRAA** | 6h | High | Temporal anti-aliasing |

**Notes**: These official nodes are already r181-compatible but need integration and testing.

---

### Tier 3: Advanced Features (Should Have)
**Modules**: 35 | **Effort**: ~80 hours | **Timeline**: Weeks 7-10

#### 3A: Stylized Post-FX (6 modules, ~12 hours)

| Module | Effort | Visual Impact | Use Cases |
|--------|--------|---------------|-----------|
| Vignette | 1h | High | Cinematic feel |
| Film Grain | 2h | High | Texture, realism |
| LCD Effect | 2h | Medium | Retro style |
| Canvas Weave | 3h | Medium | Fabric texture |
| Pixellation | 2h | Medium | Pixel art style |
| Speckled Noise | 2h | Low | Stylized grain |

#### 3B: Advanced Post-FX (10 modules, ~35 hours)

| Module | Effort | Complexity | Feature Gate |
|--------|--------|------------|--------------|
| Anamorphic | 4h | Medium | Optional |
| Chromatic Aberration | 3h | Simple | Optional |
| Motion Blur | 5h | High | Velocity buffers |
| Lensflare | 4h | Medium | Optional |
| LUT 3D | 3h | Simple | Color grading |
| Outline | 3h | Medium | Edge detection |
| RGB Shift | 2h | Simple | Glitch effects |
| Denoise | 4h | Medium | Quality improvement |
| SSS (Subsurface Scattering) | 8h | Complex | Advanced material |
| Pixelation Pass | 2h | Simple | Stylized |

#### 3C: Particle Systems (5 modules, ~30 hours)

| Module | Effort | Priority | Notes |
|--------|--------|----------|-------|
| **TSL Compute Particles** | 12h | High | 500k particles, flagship feature |
| **Particle Waves** | 8h | High | 200k instanced waves |
| Particles Compute | 6h | Medium | Compute shader setup |
| Test WebGPU Particles | 4h | Medium | Additional patterns |
| Custom Material | 4h | Medium | Node material examples |

#### 3D: Additional Utilities (8 modules, ~14 hours)

| Module | Effort | Use Cases |
|--------|--------|-----------|
| Complex Math | 1h | Mathematical operations |
| Pointer Utils | 1h | Interaction |
| Box Blur | 2h | Fast blur |
| Hash Blur | 2h | Noise-based blur |
| Sobel Operator | 2h | Edge detection |
| Dot Screen | 2h | Halftone |
| Film Node | 2h | Film effects |
| After Image | 2h | Motion trails |

#### 3E: WGSL Helpers (5 modules, ~10 hours)

| Module | Effort | Use Cases |
|--------|--------|-----------|
| Mat3 LookAt | 2h | Camera matrices |
| Mat3 Rotation | 2h | Rotation transforms |
| Mat4 Compose | 2h | Matrix composition |
| PSRD Noise 3 | 3h | Periodic noise |
| PSRD Common | 1h | Noise helpers |

#### 3F: Screen-Space Advanced (2 modules, ~24 hours)

| Module | Effort | Priority | Notes |
|--------|--------|----------|-------|
| **SSR + GTAO (N8Programs)** | 10h | Critical | MRT-driven, production-ready |
| **SSGI + SSR + TRAA (N8Programs)** | 14h | Critical | Complete screen-space solution |

---

### Tier 4: Complex Systems (Nice to Have)
**Modules**: 17 | **Effort**: ~50 hours | **Timeline**: Weeks 11-13

#### 4A: Fluid Simulation (11 modules, ~30 hours)

| Module | Effort | Complexity | Dependencies |
|--------|--------|------------|--------------|
| Fluid Main | 4h | High | All simulation modules |
| Fluid Config | 1h | Simple | None |
| Fluid GUI | 2h | Medium | lil-gui |
| Fluid Utils | 2h | Medium | None |
| View Controls | 2h | Medium | OrbitControls |
| Advect | 3h | High | Storage textures |
| Divergence | 3h | High | Compute shaders |
| Pressure | 4h | High | Jacobi iterations |
| Vorticity | 3h | High | Curl computation |
| Gradient Subtract | 2h | Medium | Gradient operators |
| Emitters | 2h | Medium | Particle spawn |

**Notes**: 
- Fluid simulation is a complete subsystem
- Can be developed in parallel with other modules
- Requires significant testing and tuning

#### 4B: Low-Priority Effects (6 modules, ~20 hours)

| Module | Effort | Use Case |
|--------|--------|----------|
| Sepia | 1h | Retro filter |
| Bleach Bypass | 2h | Film effect |
| Anaglyph Pass | 2h | 3D glasses |
| Parallax Barrier | 2h | 3D display |
| Stereo Composite | 2h | VR/Stereo |
| Stereo Pass | 2h | VR/Stereo |
| Transition Node | 3h | Scene transitions |
| SSAA Pass | 3h | Supersampling AA |
| Dot Screen | 2h | Halftone |
| Function Overloading | 2h | Advanced TSL |

---

## Phase Assignments

### Phase 1: Foundation (Weeks 1-4)
**Target**: 80 modules (80%)

**Week 1-2: Core Foundation (Tier 1)**
- All critical noise functions
- Essential lighting
- Core utilities
- SDF primitives
- Device capability system

**Week 3-4: Extended Foundation (Tier 2A-2C)**
- Extended noise library
- Additional lighting/utilities
- Comparisons between duplicate implementations

**Deliverables:**
- Working noise library (all variants)
- Complete lighting system
- SDF toolkit functional
- Utility functions operational
- Unit tests for all modules

---

### Phase 2: Core Features (Weeks 5-8)
**Target**: 100 modules (95%)

**Week 5-6: Critical Post-FX (Tier 2D)**
- Official TSL display nodes
- Screen-space effects (SSR, GTAO, SSGI)
- Anti-aliasing (FXAA, SMAA, TRAA)

**Week 7-8: Particles & Advanced FX (Tier 3A-3C)**
- TSL Compute Particles
- Particle Waves
- Stylized post-FX
- Advanced post-FX

**Deliverables:**
- Complete post-processing pipeline
- Particle systems operational
- Visual parity confirmed (ΔE < 2)
- Performance benchmarks established

---

### Phase 3: Advanced Systems (Weeks 9-12)
**Target**: All 99 modules (100%)

**Week 9-10: Remaining Utilities & Effects (Tier 3D-3F)**
- WGSL helpers
- N8Programs screen-space effects
- Additional utilities

**Week 11-12: Fluid Simulation (Tier 4A)**
- Complete fluid solver
- Rendering pipeline
- GUI controls

**Week 13: Polish & Low-Priority (Tier 4B)**
- Stereo/VR effects
- Legacy effects
- Final cleanup

**Deliverables:**
- All 99 modules ported
- Comprehensive test suite
- Performance optimized
- Documentation complete

---

## Dependency Graph

```
Foundation Layer (Tier 1)
  ├─ Noise Common
  │   └─ All fragments-boilerplate noise functions
  ├─ Three/TSL Imports
  │   └─ Everything
  └─ WGSL Helpers
      └─ Compute modules

Core Library (Tier 2)
  ├─ Extended Noise
  │   ├─ Materials (procedural)
  │   ├─ Particle force fields
  │   └─ Post-FX (grain, distortion)
  ├─ Lighting System
  │   └─ Materials (PBR)
  └─ Utilities
      ├─ Post-FX helpers
      └─ Material helpers

Advanced Features (Tier 3)
  ├─ Post-Processing
  │   ├─ Bloom → DOF → Motion Blur
  │   ├─ GTAO → SSR → SSGI
  │   └─ Anti-aliasing (FXAA → SMAA → TRAA)
  ├─ Particle Systems
  │   ├─ Compute foundation
  │   └─ Force fields (noise)
  └─ Screen-Space Effects
      ├─ MRT setup
      └─ Normal/depth buffers

Complex Systems (Tier 4)
  └─ Fluid Simulation
      ├─ Compute shaders
      ├─ Storage textures
      └─ Rendering pipeline
```

---

## Risk Assessment by Priority

### High-Risk, High-Priority (Address First)

| Module | Risk Level | Mitigation Strategy |
|--------|------------|---------------------|
| SSGI + SSR + TRAA | High | MRT complexity, requires device limits check, implement feature gates |
| SSR + GTAO | High | MRT complexity, provide fallback to simpler effects |
| Fluid Simulation | High | Complex interdependencies, develop as isolated subsystem |
| Compute Particles (500k) | Medium | Performance on low-end GPUs, implement quality presets |
| Official GTAO | Medium | Understanding official implementation, study r181 examples thoroughly |

### Medium-Risk, High-Priority (Monitor Closely)

| Module | Risk Level | Mitigation Strategy |
|--------|------------|---------------------|
| Motion Blur | Medium | Velocity buffer requirements, make optional |
| Particle Waves | Medium | Instancing patterns, test on multiple devices |
| DOF | Medium | CoC prepass complexity, follow official implementation |
| SSS | Medium | Advanced shading, feature-gate for high-end GPUs |

### Low-Risk, All Priorities (Standard Process)

- All noise functions
- Basic lighting
- Simple utilities
- Stylized post-FX
- WGSL helpers

---

## Quick Win Opportunities

### High Value, Low Effort (Do Early for Momentum)

1. **Vignette** (1h, high visual impact)
2. **Film Grain** (2h, adds texture/realism)
3. **Remap** (0.5h, used everywhere)
4. **Simplex Noise 3D** (2h, most widely used)
5. **Fresnel** (2h, essential for PBR)

### Parallel Work Streams

Can be developed simultaneously by different developers or in parallel sprints:

**Stream A: Noise & Utilities**
- All noise functions
- Math utilities
- SDF operations

**Stream B: Lighting & Materials**
- Lighting functions
- Material helpers
- PBR utilities

**Stream C: Post-Processing**
- Official TSL nodes
- Stylized effects
- Advanced effects

**Stream D: Compute**
- Particle systems
- Compute infrastructure
- WGSL helpers

**Stream E: Screen-Space (Dependent on C)**
- SSR/GTAO/SSGI
- MRT setup
- N8Programs implementations

---

## Success Metrics by Phase

### Phase 1 Success
- ✅ 20+ foundation modules operational
- ✅ Zero import errors
- ✅ All dependencies resolved
- ✅ Unit tests pass
- ✅ Basic demo scene renders

### Phase 2 Success
- ✅ 47+ modules operational (cumulative)
- ✅ Post-processing chain functional
- ✅ Particle systems running at 60 FPS
- ✅ Visual parity confirmed (ΔE < 2)
- ✅ Performance benchmarks met

### Phase 3 Success
- ✅ All 99 modules operational
- ✅ Screen-space effects working
- ✅ Fluid simulation stable
- ✅ Comprehensive test coverage
- ✅ Documentation complete
- ✅ Production-ready

---

## Effort Breakdown by Category

| Category | Modules | Hours | % of Total |
|----------|---------|-------|------------|
| Noise | 15 | 35 | 14% |
| Lighting | 6 | 9 | 4% |
| Utilities | 18 | 25 | 10% |
| SDF | 3 | 8 | 3% |
| Post-Processing | 40 | 120 | 48% |
| Compute | 11 | 45 | 18% |
| WGSL Helpers | 5 | 10 | 4% |
| **TOTAL** | **99** | **~250** | **100%** |

---

## Timeline Summary

| Phase | Weeks | Modules | Completion % | Key Deliverable |
|-------|-------|---------|--------------|-----------------|
| Phase 0 | 0 (Done) | 0 → 99 collected | 0% → Ready | Complete collection & inventory |
| Phase 1 | 1-4 | 0 → 20 | 0% → 20% | Foundation operational |
| Phase 2 | 5-8 | 20 → 67 | 20% → 68% | Core features complete |
| Phase 3 | 9-13 | 67 → 99 | 68% → 100% | All modules ported |
| **Total** | **13 weeks** | **99** | **100%** | **Production-ready engine** |

**With buffer**: 15 weeks (3.75 months) at full focus

---

**Status**: ✅ Ready for Implementation  
**Next Action**: Begin Phase 1, Week 1 - Port Tier 1 foundation modules  
**Last Updated**: November 10, 2025

