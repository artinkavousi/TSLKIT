# TSLKit Gap Analysis - November 11, 2025

## Executive Summary

This document provides a comprehensive analysis of:
1. **What we collected** in Phase 0 (99 modules)
2. **What we've ported** to `packages/tsl-kit` 
3. **What's missing** from Three.js r181 that we haven't collected yet
4. **Implementation priorities** for completing the system

---

## 📊 Current Status Overview

### Phase 0 Collection Status
- **Total Modules Collected**: 99
- **Sources Scanned**: 10 repositories
- **Categories**: 7 (noise, lighting, utils, sdf, postfx, compute, wgsl)

### Implementation Status (packages/tsl-kit/src)

| Category | Collected | Ported | Missing | % Complete |
|----------|-----------|--------|---------|------------|
| **Noise** | 15 | 13 | 2 | 87% |
| **Lighting** | 6 | 4 | 2 | 67% |
| **Utils** | 18 | 14 | 4 | 78% |
| **SDF** | 3 | 2 | 1 | 67% |
| **Post-FX** | 40 | 24 | 16 | 60% |
| **Compute** | 11 | 2 | 9 | 18% |
| **Materials** | 0 | 0 | 0 | N/A |
| **WGSL** | 5 | 0 | 5 | 0% |
| **TOTAL** | **99** | **59** | **40** | **60%** |

---

## 🔍 Newly Discovered Modules (Not in Phase 0 Collection)

### Critical Missing Modules from Three.js r181

#### 1. Advanced Lighting Systems

**TiledLightsNode.js** - `jsm/tsl/lighting/`
- **Function**: Tiled/clustered lighting for massive point light counts (1024+)
- **Complexity**: High (compute shaders, spatial indexing)
- **Priority**: **HIGH** - Production feature for complex scenes
- **Estimated Effort**: 12-16 hours
- **Dependencies**: 
  - `circleIntersectsAABB` utility
  - Compute pipeline setup
  - Screen-space tiling
- **Use Cases**:
  - Large interior scenes
  - City lighting
  - Particle lights
- **Status**: ❌ **Not collected, not ported**

#### 2. Advanced Shadow Systems

**TileShadowNode.js** - `jsm/tsl/shadows/`
- **Function**: Tiled shadow mapping for improved quality
- **Complexity**: High (multiple tiles, MRT)
- **Priority**: **HIGH** - Quality improvement
- **Estimated Effort**: 10-14 hours
- **Dependencies**:
  - Shadow system
  - Array camera
  - MRT support
- **Status**: ❌ **Not collected, not ported**

**CSMShadowNode.js** - `jsm/csm/`
- **Function**: Cascaded Shadow Maps (CSM)
- **Complexity**: Very High (frustum splitting, cascades)
- **Priority**: **CRITICAL** - Industry standard shadows
- **Estimated Effort**: 16-20 hours
- **Dependencies**:
  - CSMFrustum.js
  - Shadow management
  - Cascade splitting algorithms
- **Features**:
  - 3+ cascades
  - Fade between cascades
  - Uniform/Logarithmic/Practical splits
- **Status**: ❌ **Not collected, not ported**

#### 3. Math Utilities

**Bayer.js** - `jsm/tsl/math/`
- **Function**: Bayer16 dithering matrix
- **Complexity**: Low
- **Priority**: **MEDIUM** - Blue noise alternative
- **Estimated Effort**: 2-3 hours
- **Use Cases**:
  - Raymarching banding reduction
  - Dithering effects
  - Volume rendering
- **Status**: ❌ **Not collected, not ported**

#### 4. Raymarching Utilities

**Raymarching.js** - `jsm/tsl/utils/`
- **Function**: Official raymarching helpers
- **Complexity**: Medium
- **Priority**: **HIGH** - SDF rendering
- **Estimated Effort**: 4-6 hours
- **Features**:
  - `RaymarchingBox` function
  - `hitBox` AABB intersection
  - Box-constrained raymarching
- **Status**: ❌ **Not collected, not ported**

#### 5. Procedural Materials

**WoodNodeMaterial.js** - `jsm/materials/`
- **Function**: Complete procedural wood material
- **Complexity**: Very High (advanced TSL composition)
- **Priority**: **MEDIUM** - Advanced showcase feature
- **Estimated Effort**: 8-12 hours
- **Features**:
  - 10 wood types (teak, walnut, oak, pine, etc.)
  - 4 finish types (raw, matte, semigloss, gloss)
  - Voronoi cell structure
  - FBM warping
  - Ring patterns
  - Physical clearcoat
- **Components**:
  - `mapRange` utility
  - `voronoi3d` (WGSL)
  - `softLightMix` blend mode
  - `noiseFbm` / `noiseFbm3d`
  - Wood structure functions
- **Status**: ❌ **Not collected, not ported**

---

## 📦 Ported vs Not-Yet-Ported (From Collection)

### ✅ Successfully Ported (59 modules)

#### Noise (13/15)
- ✅ classicNoise3d
- ✅ curlNoise3d (v2)
- ✅ curlNoise4d
- ✅ simplexNoise2d
- ✅ simplexNoise3d
- ✅ simplexNoise4d
- ✅ voronoi
- ✅ common
- ✅ fbm
- ✅ perlinNoise3d
- ✅ turbulence
- ❌ **Missing**: perlin_noise_3d (fragments), simplex_noise_3d (fragments)

#### Lighting (4/6)
- ✅ ambient
- ✅ diffuse
- ✅ fresnel
- ✅ hemisphere
- ❌ **Missing**: directional, lighting-utils

#### Utils (14/18)
- ✅ bloom
- ✅ bloomEdgePattern
- ✅ compose
- ✅ coordinates
- ✅ cosinePalette
- ✅ deviceCaps
- ✅ domainIndex
- ✅ median3
- ✅ remap
- ✅ repeatingPattern
- ✅ rotate3dY
- ✅ screenAspectUV
- ✅ smoothMin
- ✅ smoothMod
- ❌ **Missing**: complex math, pointer, tonemapping (advanced), WGSL helpers

#### SDF (2/3)
- ✅ operations
- ✅ shapes
- ❌ **Missing**: sphere

#### Post-FX (24/40)
- ✅ anamorphic
- ✅ bloom
- ✅ canvasWeave
- ✅ chromaticAberration
- ✅ denoise
- ✅ depthOfField
- ✅ filmGrain
- ✅ fxaa
- ✅ gaussianBlur
- ✅ gtao
- ✅ lcdEffect
- ✅ lensflare
- ✅ lut3d
- ✅ motionBlur
- ✅ outline
- ✅ pixellation
- ✅ rgbShift
- ✅ smaa
- ✅ ssgi
- ✅ ssr
- ✅ tonemapping
- ✅ traa
- ✅ vignette
- ❌ **Missing**: 16 official nodes (AfterImage, Anaglyph, BleachBypass, DotScreen, Film, hashBlur, Parallax, Sepia, Sobel, SSAA, SSS, Stereo nodes, Transition)

#### Compute (2/11)
- ✅ particleSystem (basic)
- ✅ index (setup)
- ❌ **Missing**: All advanced compute (fluids, waves, instancing, custom materials)

#### WGSL (0/5)
- ❌ **All missing**: mat3-lookAt, mat3-rotationXYZ, mat4-compose, psrdnoise3, psrdnoise3-common

---

## 🎯 Priority Recommendations

### Tier 1: Critical Additions (Must Have)

1. **CSMShadowNode** (20h)
   - Industry-standard shadow technique
   - Massive visual quality improvement
   - Required for professional rendering

2. **TiledLightsNode** (16h)
   - Performance breakthrough for many lights
   - Enables complex lighting scenarios
   - Modern rendering feature

3. **Official Raymarching Utilities** (6h)
   - Missing SDF rendering helper
   - Completes SDF toolkit
   - Used in volume examples

4. **Directional Lighting** (3h)
   - Basic lighting missing
   - High use frequency
   - Low effort

**Total Tier 1 Effort**: ~45 hours (2-3 weeks)

---

### Tier 2: High-Value Additions (Should Have)

5. **TileShadowNode** (14h)
   - Shadow quality improvement
   - Advanced shadow technique
   - Pairs with tiled lighting

6. **WoodNodeMaterial** (12h)
   - Showcase-worthy procedural material
   - Demonstrates TSL power
   - Complete material system example
   - Includes multiple sub-utilities

7. **Missing Post-FX Nodes** (20h)
   - Complete the post-processing suite
   - Fill gaps in official coverage
   - Low-risk ports (already ported 24/40)

8. **Compute Systems** (30h)
   - Fluids (14h)
   - Waves (8h)
   - Advanced particles (8h)

**Total Tier 2 Effort**: ~76 hours (4-5 weeks)

---

### Tier 3: Nice-to-Have (Polish)

9. **Bayer Dithering** (3h)
10. **WGSL Helpers** (10h)
11. **Remaining Utils** (8h)
12. **Specialty Materials** (8h)

**Total Tier 3 Effort**: ~29 hours (1-2 weeks)

---

## 📋 Detailed Missing Module Inventory

### New Category: Advanced Shadows (3 modules)

| Module | File | Source | Priority | Hours | Status |
|--------|------|--------|----------|-------|--------|
| CSM Shadow Node | CSMShadowNode.js | three.js-r181/jsm/csm/ | Critical | 20 | ❌ Not collected |
| Tile Shadow Node | TileShadowNode.js | three.js-r181/jsm/tsl/shadows/ | High | 14 | ❌ Not collected |
| Tile Shadow Helper | TileShadowNodeHelper.js | three.js-r181/jsm/tsl/shadows/ | High | 2 | ❌ Not collected |

### New Category: Advanced Lighting (1 module)

| Module | File | Source | Priority | Hours | Status |
|--------|------|--------|----------|-------|--------|
| Tiled Lights | TiledLightsNode.js | three.js-r181/jsm/tsl/lighting/ | High | 16 | ❌ Not collected |

### New Category: Math Utilities (1 module)

| Module | File | Source | Priority | Hours | Status |
|--------|------|--------|----------|-------|--------|
| Bayer Dithering | Bayer.js | three.js-r181/jsm/tsl/math/ | Medium | 3 | ❌ Not collected |

### New Category: Raymarching (1 module)

| Module | File | Source | Priority | Hours | Status |
|--------|------|--------|----------|-------|--------|
| Raymarching Utils | Raymarching.js | three.js-r181/jsm/tsl/utils/ | High | 6 | ❌ Not collected |

### New Category: Procedural Materials (1+ modules)

| Module | File | Source | Priority | Hours | Status |
|--------|------|--------|----------|-------|--------|
| Wood Material | WoodNodeMaterial.js | three.js-r181/jsm/materials/ | Medium | 12 | ❌ Not collected |
| LDraw Conditional | LDrawConditionalLineNodeMaterial.js | three.js-r181/jsm/materials/ | Low | 4 | ❌ Not collected |

---

## 🔧 Implementation Gaps (From Collection)

### Lighting (2 missing from collected)
| Module | File | Status | Priority | Hours |
|--------|------|--------|----------|-------|
| Directional Light | directional.ts | ❌ Not ported | High | 3 |
| Lighting Utils | lighting-utils.ts | ❌ Not ported | Medium | 3 |

### Noise (2 variants)
| Module | File | Status | Priority | Hours |
|--------|------|--------|----------|-------|
| Perlin 3D (fragments) | perlin_noise_3d.ts | ❌ Not ported | Low | 2 |
| Simplex 3D (fragments) | simplex_noise_3d.ts | ❌ Not ported | Low | 2 |

**Note**: We already have working versions, these are alternate implementations

### Post-FX (16 official nodes)
| Module | Status | Priority | Hours |
|--------|--------|----------|-------|
| AfterImageNode | ❌ Not ported | Low | 2 |
| AnaglyphPassNode | ❌ Not ported | Low | 2 |
| BleachBypass | ❌ Not ported | Low | 1 |
| DotScreenNode | ❌ Not ported | Low | 2 |
| FilmNode | ❌ Not ported | Medium | 2 |
| hashBlur | ❌ Not ported | Medium | 2 |
| ParallaxBarrierPassNode | ❌ Not ported | Low | 2 |
| Sepia | ❌ Not ported | Low | 1 |
| SobelOperatorNode | ❌ Not ported | Medium | 2 |
| SSAAPassNode | ❌ Not ported | Medium | 3 |
| SSSNode | ❌ Not ported | High | 8 |
| StereoCompositePassNode | ❌ Not ported | Low | 2 |
| StereoPassNode | ❌ Not ported | Low | 2 |
| TransitionNode | ❌ Not ported | Medium | 3 |
| **SSGI+SSR combined** | ❌ Not ported | Critical | 14 |
| **SSR+GTAO combined** | ❌ Not ported | Critical | 10 |

### Compute (9 advanced systems)
| System | Modules | Status | Priority | Hours |
|--------|---------|--------|----------|-------|
| Fluid Simulation | 11 files | ❌ Not ported | High | 30 |
| Particle Waves | tsl-particle-waves.js | ❌ Not ported | High | 8 |
| TSL Compute Particles | tsl-compute-particles.js | ❌ Not ported | High | 12 |
| Test WebGPU | 4 files | ❌ Not ported | Medium | 10 |

### WGSL Helpers (5 modules)
| Module | File | Status | Priority | Hours |
|--------|------|--------|----------|-------|
| Mat3 LookAt | mat3-lookAt.wgsl | ❌ Not ported | Medium | 2 |
| Mat3 Rotation | mat3-rotationXYZ.wgsl | ❌ Not ported | Medium | 2 |
| Mat4 Compose | mat4-compose.wgsl | ❌ Not ported | Medium | 2 |
| PSRD Noise 3 | psrdnoise3.wgsl | ❌ Not ported | Medium | 3 |
| PSRD Common | psrdnoise3-common.wgsl | ❌ Not ported | Medium | 1 |

---

## 📊 Revised Total Module Count

### Original Phase 0 Inventory
- **Collected**: 99 modules
- **Ported**: 59 modules (60%)
- **Remaining**: 40 modules

### Newly Discovered Modules
- **Critical Shadows**: 3 modules
- **Advanced Lighting**: 1 module
- **Math Utils**: 1 module
- **Raymarching**: 1 module
- **Procedural Materials**: 2+ modules

### **NEW TOTAL**
- **Total Available**: **107+ modules**
- **Total Ported**: **59 modules (55%)**
- **Remaining**: **48+ modules (45%)**

---

## 🚀 Recommended Action Plan

### Phase 1A: Critical Additions (Weeks 1-3)
**Goal**: Add missing critical systems

1. **Week 1**: Collect & Port CSM Shadows (20h)
   - Collect CSMShadowNode + dependencies
   - Port to packages/tsl-kit/src/shadows/
   - Create CSM demo in showcase
   - Test cascade splitting

2. **Week 2**: Collect & Port Tiled Lighting (16h)
   - Collect TiledLightsNode
   - Port with compute pipeline
   - Create tiled lights demo
   - Performance testing

3. **Week 3**: Complete SDF System (9h)
   - Collect Raymarching.js (6h)
   - Port sphere SDF (1h)
   - Port directional lighting (2h)
   - Update SDF demo

**Phase 1A Output**: 3 critical systems, 46 hours

---

### Phase 1B: High-Value Additions (Weeks 4-7)
**Goal**: Add showcase features and complete categories

4. **Week 4**: Tile Shadow System (14h)
   - Collect TileShadowNode
   - Port with MRT support
   - Integrate with showcase

5. **Week 5**: Procedural Wood Material (12h)
   - Collect WoodNodeMaterial
   - Port all sub-utilities
   - Create material showcase

6. **Weeks 6-7**: Complete Post-FX Suite (20h)
   - Port remaining 16 official nodes
   - Update AllPostFXDemo
   - Visual regression tests

**Phase 1B Output**: Advanced features complete, 46 hours

---

### Phase 2: Compute Systems (Weeks 8-11)
**Goal**: Complete compute shader systems

7. **Weeks 8-9**: Fluid Simulation (30h)
8. **Week 10**: Particle Systems (20h)
9. **Week 11**: Polish & Integration (10h)

**Phase 2 Output**: Full compute capability, 60 hours

---

### Phase 3: Polish & Completion (Weeks 12-13)
**Goal**: 100% completion

10. **Week 12**: WGSL & Math Utils (13h)
11. **Week 13**: Testing & Documentation (10h)

**Phase 3 Output**: 100% module coverage, 23 hours

---

## 📈 Estimated Timeline

| Phase | Duration | Effort | Modules Added | Completion % |
|-------|----------|--------|---------------|--------------|
| **Current** | — | — | 59 | 55% |
| **Phase 1A** | 3 weeks | 46h | +7 | 62% |
| **Phase 1B** | 4 weeks | 46h | +19 | 80% |
| **Phase 2** | 4 weeks | 60h | +11 | 90% |
| **Phase 3** | 2 weeks | 23h | +11 | **100%** |
| **TOTAL** | **13 weeks** | **175h** | **+48** | **100%** |

---

## 🎯 Success Metrics

### Completion Criteria

✅ **Tier 1 Complete** (Critical)
- [ ] CSM shadows working with cascade fading
- [ ] Tiled lighting supporting 1000+ lights
- [ ] Official raymarching utilities ported
- [ ] Complete lighting system (all 7 types)

✅ **Tier 2 Complete** (Professional)
- [ ] Tiled shadows working
- [ ] Procedural wood material with 10 variants
- [ ] All 40 post-FX nodes ported
- [ ] Basic compute systems working

✅ **Tier 3 Complete** (Polish)
- [ ] All WGSL helpers integrated
- [ ] Bayer dithering available
- [ ] All utilities ported
- [ ] Comprehensive showcase demos

### Quality Gates
- ✅ All ported modules have TypeScript types
- ✅ All modules have working showcase demos
- ✅ Performance benchmarks pass
- ✅ Visual regression tests pass
- ✅ Three.js r181+ compatibility verified

---

## 🔍 Key Findings

### What We Did Well
1. ✅ Comprehensive Phase 0 collection (99 modules)
2. ✅ Good coverage of noise and basic post-FX
3. ✅ Solid foundation with 60% ported
4. ✅ Clean architecture in tsl-kit package

### Critical Gaps Discovered
1. ❌ **Missing industry-standard techniques** (CSM shadows)
2. ❌ **Missing performance features** (tiled lighting)
3. ❌ **Incomplete official node coverage** (16 post-FX nodes)
4. ❌ **No advanced materials** (procedural wood, etc.)
5. ❌ **Minimal compute shader examples** (2/11 ported)

### Opportunities
1. 🎯 **CSM + Tiled Lighting** = Professional rendering
2. 🎯 **Procedural Materials** = Showcase differentiator
3. 🎯 **Complete Post-FX** = Full Three.js compatibility
4. 🎯 **Compute Shaders** = Advanced GPU features

---

## 📝 Next Immediate Actions

### This Week
1. ✅ Complete this gap analysis
2. ⬜ Collect 7 critical missing modules
3. ⬜ Update inventory.md with new modules
4. ⬜ Begin CSM shadow implementation

### Next Week
1. ⬜ Complete CSM shadows
2. ⬜ Start tiled lighting
3. ⬜ Update showcase app

---

## 📚 References

### Source Locations
- **Three.js r181 TSL**: `RESOURCES/three.js-r181/examples/jsm/tsl/`
- **Three.js r181 Materials**: `RESOURCES/three.js-r181/examples/jsm/materials/`
- **Three.js r181 CSM**: `RESOURCES/three.js-r181/examples/jsm/csm/`
- **Current Collection**: `COLLECTED_MODULES/`
- **Current Implementation**: `packages/tsl-kit/src/`

### Documentation
- Three.js r181 Docs: `RESOURCES/three.js-r181/docs/`
- TSL Knowledge Docs: `RESOURCES/THREEJS_TSL_knowladge_DOCS/`
- Migration Guide: `COLLECTED_MODULES/THREE_R181_MIGRATION.md`
- Best Practices: `COLLECTED_MODULES/BEST_PRACTICES.md`

---

**Document Status**: ✅ Complete  
**Last Updated**: November 11, 2025  
**Next Review**: After Phase 1A completion  
**Version**: 1.0

