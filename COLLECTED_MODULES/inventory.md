# TSLStudio Module Inventory

> **Generated**: November 10, 2025  
> **Total Modules**: 99  
> **Status**: Phase 0 Complete - Ready for Porting

---

## Summary by Category

| Category | Modules | Priority | Estimated Hours |
|----------|---------|----------|----------------|
| Noise | 12 | High | 28 |
| Lighting | 6 | High | 9 |
| Utilities | 18 | Medium-High | 25 |
| SDF | 3 | Medium | 8 |
| Post-Processing | 40 | High | 80 |
| Compute | 11 | High | 90 |
| WGSL Helpers | 5 | Medium | 10 |
| **TOTAL** | **99** | — | **~250 hours** |

---

## Module Catalog

### Noise Functions (12 modules)

| # | Module Name | File | Lines | Source | Priority | Complexity | Est. Hours | Dependencies | Ver | Risk | Notes |
|---|-------------|------|-------|--------|----------|------------|------------|--------------|-----|------|-------|
| 1 | Classic Noise 3D | classicNoise3d.ts | ~50 | portfolio-main | High | Simple | 2 | three/tsl | r170 | Low | Direct port |
| 2 | Curl Noise 3D (portfolio) | curlNoise3d.ts | ~60 | portfolio-main | High | Medium | 3 | three/tsl | r170 | Low | Gradient computation |
| 3 | Curl Noise 4D (portfolio) | curlNoise4d.ts | ~70 | portfolio-main | High | Medium | 3 | three/tsl | r170 | Low | 4D variant |
| 4 | Simplex Noise 2D | simplexNoise2d.ts | ~80 | portfolio-main | High | Simple | 2 | three/tsl | r170 | Low | 2D noise |
| 5 | Simplex Noise 3D (portfolio) | simplexNoise3d.ts | ~100 | portfolio-main | High | Simple | 2 | three/tsl | r170 | Low | Core noise function |
| 6 | Simplex Noise 4D (portfolio) | simplexNoise4d.ts | ~155 | portfolio-main | High | Medium | 3 | three/tsl | r170 | Low | Needs typing |
| 7 | Voronoi | voronoi.ts | ~60 | portfolio-main | Medium | Medium | 3 | three/tsl | r170 | Low | Cellular noise |
| 8 | Noise Common | common.ts | ~40 | fragments-boilerplate | High | Simple | 1 | three/tsl | r175 | Low | Shared helpers |
| 9 | Curl Noise 3D (fragments) | curl_noise_3d.ts | ~50 | fragments-boilerplate | High | Medium | 2 | common | r175 | Low | Uses common |
| 10 | Curl Noise 4D (fragments) | curl_noise_4d.ts | ~60 | fragments-boilerplate | High | Medium | 3 | common | r175 | Low | Uses common |
| 11 | FBM | fbm.ts | ~40 | fragments-boilerplate | High | Simple | 2 | noise | r175 | Low | Fractal Brownian Motion |
| 12 | Perlin Noise 3D | perlin_noise_3d.ts | ~60 | fragments-boilerplate | High | Simple | 2 | common | r175 | Low | Perlin implementation |
| 13 | Simplex Noise 3D (fragments) | simplex_noise_3d.ts | ~58 | fragments-boilerplate | High | Simple | 2 | common | r175 | Low | Another implementation |
| 14 | Simplex Noise 4D (fragments) | simplex_noise_4d.ts | ~120 | fragments-boilerplate | High | Medium | 3 | common | r175 | Low | 4D variant |
| 15 | Turbulence | turbulence.ts | ~30 | fragments-boilerplate | Medium | Simple | 2 | fbm | r175 | Low | Domain warping |

**Notes:**
- Some noise functions have duplicates from different sources (portfolio vs fragments-boilerplate)
- Keep both for comparison; select best during porting
- Common helpers in fragments-boilerplate must be ported first

---

### Lighting Utilities (6 modules)

| # | Module Name | File | Source | Priority | Complexity | Est. Hours | Dependencies | Ver | Risk | Notes |
|---|-------------|------|--------|----------|------------|------------|--------------|-----|------|-------|
| 16 | Ambient Light | ambient.ts | portfolio-main | High | Simple | 1 | three/tsl | r170 | Low | Basic ambient |
| 17 | Diffuse Light | diffuse.ts | portfolio-main | High | Simple | 1 | three/tsl | r170 | Low | Lambert/Oren-Nayar |
| 18 | Directional Light | directional.ts | portfolio-main | High | Medium | 2 | three/tsl | r170 | Low | With shadows |
| 19 | Fresnel | fresnel.ts | portfolio-main | High | Medium | 2 | three/tsl | r170 | Low | Schlick approximation |
| 20 | Hemisphere Light | hemisphere.ts | portfolio-main | High | Simple | 1 | three/tsl | r170 | Low | Sky + ground |
| 21 | Lighting Utils | lighting-utils.ts | fragments-boilerplate | High | Simple | 2 | three/tsl | r175 | Low | Additional helpers |

---

### Utility Functions (18 modules)

| # | Module Name | File | Source | Priority | Complexity | Est. Hours | Ver | Notes |
|---|-------------|------|--------|----------|------------|------------|-----|-------|
| 22 | Compose | compose.ts | portfolio-main | Medium | Simple | 1 | r170 | Function composition |
| 23 | Remap | remap.ts | portfolio-main | High | Simple | 0.5 | r170 | Value remapping |
| 24 | Rotate 3D Y | rotate-3d-y.ts | portfolio-main | Medium | Simple | 1 | r170 | Matrix rotation |
| 25 | Smooth Min | smooth-min.ts | portfolio-main | Medium | Simple | 1 | r170 | SDF operations |
| 26 | Smooth Mod | smooth-mod.ts | portfolio-main | Medium | Simple | 1 | r170 | Pattern repetition |
| 27 | Bloom | bloom.ts | fragments-boilerplate | High | Medium | 2 | r175 | Bloom helpers |
| 28 | Bloom Edge Pattern | bloom_edge_pattern.ts | fragments-boilerplate | Medium | Simple | 1 | r175 | Edge detection |
| 29 | Cosine Palette | cosine_palette.ts | fragments-boilerplate | Medium | Simple | 1 | r175 | Color generation |
| 30 | Domain Index | domain_index.ts | fragments-boilerplate | Medium | Simple | 1 | r175 | Spatial indexing |
| 31 | Median3 | median3.ts | fragments-boilerplate | Low | Simple | 1 | r175 | Median filter |
| 32 | Repeating Pattern | repeating_pattern.ts | fragments-boilerplate | Medium | Simple | 1 | r175 | Pattern repetition |
| 33 | Screen Aspect UV | screen_aspect_uv.ts | fragments-boilerplate | Medium | Simple | 1 | r175 | UV correction |
| 34 | Tonemapping | tonemapping.ts | fragments-boilerplate | High | Medium | 2 | r175 | Color grading |
| 35 | Complex Math | math/complex.ts | fragments-boilerplate | Low | Simple | 1 | r175 | Complex numbers |
| 36 | Coordinates | math/coordinates.ts | fragments-boilerplate | Medium | Simple | 1 | r175 | Coordinate transforms |
| 37 | Pointer Utils | pointer.js | test-webgpu | Medium | Simple | 1 | r180 | Pointer interaction |

---

### SDF Functions (3 modules)

| # | Module Name | File | Source | Priority | Complexity | Est. Hours | Notes |
|---|-------------|------|--------|----------|------------|------------|-------|
| 38 | Sphere SDF | sphere.ts | portfolio-main | High | Simple | 1 | Basic primitive |
| 39 | SDF Operations | operations.ts | fragments-boilerplate | High | Medium | 3 | Union, intersection, subtraction |
| 40 | SDF Shapes | shapes.ts | fragments-boilerplate | High | Medium | 4 | Box, torus, cylinder, etc. |

---

### Post-Processing Effects (40 modules)

#### Stylized Effects (6 modules)

| # | Module Name | File | Source | Priority | Est. Hours | Notes |
|---|-------------|------|--------|----------|------------|-------|
| 41 | Canvas Weave | canvas_weave_effect.ts | fragments-boilerplate | Medium | 3 | Fabric texture overlay |
| 42 | Film Grain | grain_texture_effect.ts | fragments-boilerplate | High | 2 | Blue-noise grain |
| 43 | LCD Effect | lcd_effect.ts | fragments-boilerplate | Medium | 2 | Pixelated RGB subpixels |
| 44 | Pixellation | pixellation_effect.ts | fragments-boilerplate | Medium | 2 | Resolution downscale |
| 45 | Speckled Noise | speckled_noise_effect.ts | fragments-boilerplate | Low | 2 | Stylized grain |
| 46 | Vignette | vignette_effect.ts | fragments-boilerplate | High | 1 | Edge darkening |

#### Advanced Screen-Space (2 modules)

| # | Module Name | File | Source | Priority | Est. Hours | Notes |
|---|-------------|------|--------|----------|------------|-------|
| 47 | SSR + GTAO | ssr-gtao/ssr-gtao.js | N8Programs | Critical | 10 | MRT-driven SSR + GTAO + SMAA |
| 48 | SSGI + SSR + TRAA | ssgi-ssr/ssgi-ssr.js | N8Programs | Critical | 14 | Screen-space GI + reflections |

#### Official Three.js TSL Nodes (33 modules)

| # | Module Name | File | Priority | Est. Hours | Category | Notes |
|---|-------------|------|----------|------------|----------|-------|
| 49 | After Image | AfterImageNode.js | Low | 2 | Effect | Motion trails |
| 50 | Anaglyph Pass | AnaglyphPassNode.js | Low | 2 | Stereo | 3D glasses |
| 51 | Anamorphic | AnamorphicNode.js | Medium | 4 | Effect | Anamorphic flares |
| 52 | Bleach Bypass | BleachBypass.js | Low | 2 | Color | Film effect |
| 53 | Bloom | BloomNode.js | High | 4 | Core | Official bloom |
| 54 | Box Blur | boxBlur.js | Medium | 2 | Utility | Box filter |
| 55 | Chromatic Aberration | ChromaticAberrationNode.js | Medium | 3 | Effect | Color fringing |
| 56 | Denoise | DenoiseNode.js | Medium | 4 | Utility | Noise reduction |
| 57 | Depth of Field | DepthOfFieldNode.js | High | 6 | Core | CoC + bokeh |
| 58 | Dot Screen | DotScreenNode.js | Low | 2 | Effect | Halftone dots |
| 59 | Film | FilmNode.js | Medium | 2 | Effect | Film grain |
| 60 | FXAA | FXAANode.js | High | 3 | AA | Fast anti-aliasing |
| 61 | Gaussian Blur | GaussianBlurNode.js | High | 3 | Utility | Gaussian filter |
| 62 | GTAO | GTAONode.js | Critical | 8 | Core | Ambient occlusion |
| 63 | Hash Blur | hashBlur.js | Medium | 2 | Utility | Hash-based blur |
| 64 | Lensflare | LensflareNode.js | Medium | 4 | Effect | Lens artifacts |
| 65 | LUT 3D | Lut3DNode.js | High | 3 | Color | Color lookup |
| 66 | Motion Blur | MotionBlur.js | High | 5 | Effect | Camera/pixel velocity |
| 67 | Outline | OutlineNode.js | Medium | 3 | Effect | Edge detection |
| 68 | Parallax Barrier | ParallaxBarrierPassNode.js | Low | 2 | Stereo | 3D display |
| 69 | Pixelation | PixelationPassNode.js | Medium | 2 | Effect | Pixel art |
| 70 | RGB Shift | RGBShiftNode.js | Medium | 2 | Effect | Color shift |
| 71 | Sepia | Sepia.js | Low | 1 | Color | Sepia tone |
| 72 | SMAA | SMAANode.js | High | 6 | AA | Morphological AA |
| 73 | Sobel Operator | SobelOperatorNode.js | Medium | 2 | Utility | Edge detection |
| 74 | SSAA | SSAAPassNode.js | Medium | 3 | AA | Supersampling |
| 75 | SSGI | SSGINode.js | Critical | 10 | Core | Global illumination |
| 76 | SSR | SSRNode.js | Critical | 10 | Core | Screen-space reflections |
| 77 | SSS | SSSNode.js | High | 8 | Effect | Subsurface scattering |
| 78 | Stereo Composite | StereoCompositePassNode.js | Low | 2 | Stereo | Stereo combination |
| 79 | Stereo Pass | StereoPassNode.js | Low | 2 | Stereo | Stereo rendering |
| 80 | TRAA | TRAANode.js | High | 6 | AA | Temporal reprojection AA |
| 81 | Transition | TransitionNode.js | Medium | 3 | Effect | Scene transitions |

---

### Compute Modules (11 modules)

#### Particle Systems (5 modules)

| # | Module Name | File | Source | Priority | Est. Hours | Notes |
|---|-------------|------|--------|----------|------------|-------|
| 82 | TSL Compute Particles | particles/tsl-compute-particles.js | N8Programs | High | 12 | 500k particles, pointer interaction |
| 83 | Particle Waves | waves/tsl-particle-waves.js | N8Programs | High | 8 | 200k instanced waves |
| 84 | Test WebGPU Main | test-webgpu/main.js | Unknown | Medium | 3 | Setup & initialization |
| 85 | Particles | test-webgpu/Particles.js | Unknown | Medium | 4 | Particle rendering |
| 86 | Particles Compute | test-webgpu/ParticlesCompute.js | Unknown | High | 6 | Compute shader setup |
| 87 | Custom Material | test-webgpu/MeshCustomNodeMaterial.js | Unknown | Medium | 4 | Custom node material |

#### Fluid Simulation (5 modules + sub-modules)

| # | Module Name | File | Source | Est. Hours | Notes |
|---|-------------|------|--------|------------|-------|
| 88 | Fluid Main | fluids/main.js | N8Programs | 4 | Entry point |
| 89 | Fluid Config | fluids/config.js | N8Programs | 1 | Configuration |
| 90 | Fluid GUI | fluids/gui.js | N8Programs | 2 | UI controls |
| 91 | Fluid Utils | fluids/utils.js | N8Programs | 2 | Utility functions |
| 92 | View Controls | fluids/view_controls.js | N8Programs | 2 | Camera controls |

**Fluid Simulation Sub-modules** (not in count, bundled):
- simulation/advect.js
- simulation/common.js
- simulation/divergence.js
- simulation/emitters.js
- simulation/gradient_subtract.js
- simulation/pressure.js
- simulation/vorticity.js
- rendering/blur.js
- rendering/lighting.js
- rendering/render.js

---

### WGSL Helper Libraries (5 modules)

| # | Module Name | File | Source | Priority | Est. Hours | Notes |
|---|-------------|------|--------|----------|------------|-------|
| 93 | Mat3 LookAt | wgsl/mat3-lookAt.wgsl | test-webgpu | Medium | 2 | Matrix utilities |
| 94 | Mat3 Rotation | wgsl/mat3-rotationXYZ.wgsl | test-webgpu | Medium | 2 | Rotation matrices |
| 95 | Mat4 Compose | wgsl/mat4-compose.wgsl | test-webgpu | Medium | 2 | Matrix composition |
| 96 | PSRD Noise 3 | wgsl/psrdnoise3.wgsl | test-webgpu | Medium | 3 | Periodic noise |
| 97 | PSRD Common | wgsl/psrdnoise3-common.wgsl | test-webgpu | Medium | 1 | Noise helpers |

---

## Priority Breakdown

### High Priority (Must Have) - 47 modules
**Estimated Effort**: ~140 hours

- All noise functions (12)
- All lighting utilities (6)
- Key utilities (remap, smooth-min, bloom, tonemapping)
- Critical post-FX (Bloom, DOF, GTAO, SSR, SSGI, FXAA, SMAA, TRAA)
- Core particle systems (TSL compute particles, waves)
- Particle compute shader
- SDF shapes and operations

### Medium Priority (Should Have) - 35 modules
**Estimated Effort**: ~80 hours

- Additional utilities
- Stylized post-FX (LCD, canvas weave, vignette)
- Advanced post-FX (Anamorphic, Lensflare, Motion Blur)
- WGSL helpers
- Fluid simulation
- Additional particle modules

### Low Priority (Nice to Have) - 17 modules
**Estimated Effort**: ~30 hours

- Experimental effects
- Stereo rendering nodes
- Legacy effects (Sepia, Bleach Bypass)
- Complex math utilities

---

## Dependency Chains

### Foundation (Must port first):
1. **Noise Common** (fragments-boilerplate) → All fragment-boilerplate noise functions
2. **Three/TSL imports** → Everything
3. **WGSL helpers** → Compute modules

### Layer 1 (After Foundation):
- Noise functions
- Lighting utilities
- Basic utilities (remap, compose)
- SDF primitives

### Layer 2 (After Layer 1):
- Advanced utilities (bloom helpers, tonemapping)
- Material helpers
- Post-FX building blocks

### Layer 3 (After Layer 2):
- Complete post-FX nodes
- Particle systems
- Fluid simulation

---

## Three.js Version Compatibility

| Version | Modules | Migration Priority |
|---------|---------|-------------------|
| r170 | 18 | High - Maxime Heckel portfolio |
| r175 | 32 | High - fragments-boilerplate |
| r180 | 16 | Medium - test-webgpu |
| r181 | 33 | Low - Official (already compatible) |

**Key Migration Tasks:**
- Update import paths (`three/webgpu`, `three/tsl`)
- Replace deprecated TSL functions
- Implement async renderer initialization
- Update PostProcessing API usage
- Update compute pipeline patterns

---

## Risks & Considerations

### High Risk:
- SSR/GTAO/SSGI complexity (MRT requirements)
- Fluid simulation complexity (multiple interdependent modules)
- WGSL integration (bundler configuration needed)
- Compute shader performance (device limits)

### Medium Risk:
- Duplicate noise implementations (need to choose best)
- Import path changes across versions
- TSL API changes from r170→r181
- MeshCustomNodeMaterial patterns

### Low Risk:
- Basic utilities and helpers
- Simple post-FX
- Lighting functions
- SDF primitives

---

## Next Steps (Phase 1 Planning)

1. **Week 1-2**: Port foundation modules
   - Noise common helpers
   - Core noise functions (simplex 3D, perlin, curl)
   - Basic lighting (fresnel, ambient, diffuse, hemisphere)
   - Essential utilities (remap, smooth-min)

2. **Week 3-4**: Port primary modules
   - Remaining noise functions
   - SDF shapes and operations
   - Advanced lighting
   - Utility functions

3. **Documentation**:
   - Create porting guide per module
   - Document API changes
   - Create test cases
   - Establish visual parity benchmarks

---

**Phase 0 Status**: ✅ **COMPLETE**  
**Next Phase**: Phase 1 - Foundation Porting  
**Total Collected**: 99 modules  
**Estimated Total Effort**: ~250 hours (12-15 weeks at full focus)

