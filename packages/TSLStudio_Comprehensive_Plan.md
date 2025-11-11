# TSLStudio WebGPU Engine — Comprehensive Development Plan

> **Version**: 3.0 (Unified)  
> **Date**: November 10, 2025  
> **Baseline**: Three.js r181+, WebGPU-first, TSL-native  
> **Philosophy**: Collection → Planning → Direct-Port → Integration

---

## Table of Contents

1. [Executive Summary](#1-executive-summary)
2. [Phase 0: Resource Collection & Research](#2-phase-0-resource-collection--research)
3. [Technical Architecture](#3-technical-architecture)
4. [Resource Inventory & Port Strategy](#4-resource-inventory--port-strategy)
5. [Feature Specifications](#5-feature-specifications)
6. [Implementation Roadmap (Phases 1-5)](#6-implementation-roadmap-phases-1-5)
7. [API Design & Agent DSL](#7-api-design--agent-dsl)
8. [Quality Standards](#8-quality-standards)
9. [Three.js r181 Migration Strategy](#9-threejs-r181-migration-strategy)
10. [Risk Assessment](#10-risk-assessment)
11. [Success Metrics](#11-success-metrics)

---

## 1. Executive Summary

### 1.1 Vision

Build a **self-contained, plug-and-play TSL/WebGPU engine** on Three.js r181+ that delivers:
- 150+ production-ready modules (noise, materials, post-FX, compute)
- Clean, typed, agent-addressable APIs
- Direct-ported proven code (no reinvention)
- Comprehensive presets and examples

### 1.2 Mission

Port 150+ proven modules from curated WebGPU/TSL examples into a cohesive toolkit **without rewriting core logic**, focusing on:
- **Reliability**: Keep working code working
- **Ergonomics**: One-liner APIs for complex effects
- **Safety**: JSON-schema validated interfaces
- **Performance**: 60 FPS @ 1080p on mid-range GPUs

### 1.3 Core Principles

1. **Collection Before Planning** — Can't plan what you don't know exists
2. **Direct Port First** — Use working code as-is, adapt only imports/types/paths
3. **Minimize Risk** — Don't rewrite proven implementations
4. **Three.js r181 Native** — Follow latest patterns (async init, TSL, NodeMaterials)
5. **Agent-Addressable** — Clean APIs with JSON schemas
6. **Production-Ready** — Complete, tested, documented, optimized
7. **Metadata-Driven** — Every module fully documented before porting
8. **Dependency-Aware** — Understand all relationships before integration

### 1.4 Success Metrics

**Technical Targets:**
- ✅ 150+ modules implemented
- ✅ 60 FPS @ 1080p (RTX 2070-class GPU)
- ✅ < 2.5s first interaction time
- ✅ < 5ms post-FX chain GPU time
- ✅ ΔE < 2 visual parity vs. source
- ✅ 80%+ test coverage

**Deliverables:**
- ✅ 100+ deployable modules
- ✅ 50+ material presets
- ✅ 20+ post-processing pipelines
- ✅ 10+ compute simulations
- ✅ Comprehensive documentation
- ✅ Interactive examples gallery

---

## 2. Phase 0: Resource Collection & Research

### 🎯 CRITICAL FIRST STEP

**Before any planning, architecture, or implementation**, perform exhaustive collection and cataloging of ALL available modules.

### 2.1 Target Directories for Deep Scan

Explore EVERY folder, subfolder, and file in:

#### Priority 1: Portfolio Examples (Maxime Heckel)
```
RESOURCES/REPOSITORIES/portfolio examples/
├── portfolio-main/                    # 40+ modules
│   ├── src/utils/webgpu/nodes/
│   │   ├── lighting/                 # ambient, diffuse, fresnel, hemisphere
│   │   ├── noise/                    # simplex2d/3d/4d, curl, voronoi
│   │   ├── utils/                    # smooth-min, remap, rotate-3d
│   │   └── ...
│   └── examples/                     # 30+ complete labs
└── fragments-boilerplate-main/        # 30+ modules
    ├── src/tsl/
    │   ├── noise/                    # perlin, simplex3/4, fbm, curl, turbulence
    │   ├── post_processing/          # canvas weave, LCD, grain, pixellation
    │   └── utils/                    # lighting helpers
    └── ...
```

#### Priority 2: TSL WebGPU Examples
```
RESOURCES/REPOSITORIES/TSLwebgpuExamples/
├── tsl-compute-particles/            # 500k particle compute sim
├── tsl-particle-waves/               # 200k instanced waves
├── roquefort-main/                   # Full fluid solver (advect, divergence, pressure)
├── ssr-gtao-keio/                    # MRT-driven SSR + GTAO + SMAA
├── ssgi-ssr-painter/                 # SSGI, SSR, TRAA with painting UI
├── test-webgpu-master/               # Multi-million particle pipelines
├── raymarching-tsl/                  # SDF raymarching examples
└── ...
```

#### Priority 3: Three.js r181 Official
```
RESOURCES/three.js-r181/examples/
├── webgpu_*.html                     # 186+ official examples
├── jsm/tsl/display/                  # Bloom, DOF, GTAO, SSS, TRAA nodes
└── jsm/nodes/                        # Core TSL node library
```

#### Priority 4: Additional Resources
```
RESOURCES/
├── THREEJS_TSL_knowladge_DOCS/
│   ├── THREEJSr181-DOCS.txt
│   └── THREEJSr181-WEBGPU_EXAMPLES.txt
├── tsl/                              # If exists
├── materialx/                        # If exists
└── ...
```

### 2.2 What to Collect (Exhaustive List)

#### Core TSL Modules
- All TSL node definitions and custom nodes
- TSL helper functions and utilities
- TSL composition patterns
- Node graph systems

#### Materials & Shading
- PBR materials (clearcoat, sheen, anisotropy, iridescence, transmission)
- MaterialX implementations
- Custom shader materials
- Procedural materials
- Advanced lighting models (fresnel, hemisphere, ambient, diffuse)

#### Noise & Procedurals
- All noise types (Perlin, Simplex 2D/3D/4D, Worley, Voronoi)
- Curl noise variants (2D/3D/4D)
- SDF functions (raymarching, signed distance fields)
- Procedural patterns and structures
- Fractal systems (FBM, domain warping, turbulence)

#### Post-Processing
- Bloom/Glow effects (dual/kawase)
- Depth of Field (DOF) with CoC
- Temporal Anti-Aliasing (TAA/TRAA)
- Screen Space Reflections (SSR)
- Ground Truth Ambient Occlusion (GTAO)
- Screen Space Global Illumination (SSGI)
- Color grading and tone mapping (ACES, filmic)
- Motion blur (camera + per-pixel velocity)
- Chromatic aberration
- Vignette and film grain
- Anamorphic effects
- Stylized effects (LCD, halftone, ASCII, CRT, canvas weave, pixellation)

#### Compute & Simulation
- Particle systems (GPU-based, position/velocity buffers)
- Fluid simulations (2D/3D Navier-Stokes)
- Physics simulations
- Cloth simulation
- Hair/fur systems
- Crowd/agent systems
- Wave/instancing deformation
- Force fields (curl, gravity, attractors, turbulence)

#### Rendering Pipelines
- Custom render passes
- Multi-pass rendering systems (MRT)
- Deferred rendering setups
- Forward+ rendering
- Compute-based rendering
- Storage texture ping-pong management

#### Effects & Transitions
- Visual effects (VFX)
- Transition effects
- Distortion effects
- Particle effects
- Outline/glass materials

#### Lighting & Shadows
- Custom lighting systems
- Shadow mapping techniques
- Volumetric lighting
- Light probes
- Area lights
- IBL helpers

#### Utilities & Helpers
- Math utilities (smooth-min, smooth-mod, remap, compose)
- Geometry utilities (rotation, triplanar)
- Buffer management
- Texture utilities (noise generators, storage textures)
- Performance tools (GPU timing, budgets)
- Debug tools (inspector, parameters)
- Device capability detection
- WGSL helper libraries (matrix composition, PSRD noise)

#### Complete Systems
- Working WebGPU pipelines
- Scene management systems
- Camera controls
- Input handlers (pointer interactions)
- Performance monitoring

### 2.3 Collection Process (10-Day Plan)

#### Days 1-2: Deep Scan & Inventory
- Recursively explore ALL directories and subdirectories
- List every `.js`, `.ts`, `.tsx`, `.glsl`, `.wgsl` file
- Document file paths, purpose, line counts
- Identify module categories and relationships
- Note which examples are complete vs. partial
- Flag priority items (working, production-ready code)
- Create initial categorization spreadsheet

#### Day 3: Best Practices Analysis
- Study Maxime Heckel's portfolio examples deeply:
  - `portfolio examples/fragments-boilerplate-main/`
  - `portfolio examples/portfolio-main/`
- Identify preferred patterns and architectures
- Document TSL composition approaches
- Note WebGPU pipeline structures
- Capture coding conventions and naming patterns
- Identify reusable utility patterns

#### Days 4-5: Physical File Collection
- Create `/COLLECTED_MODULES/` folder structure
- Copy ALL relevant files (don't move)
- Organize by category:
  ```
  /COLLECTED_MODULES/
    ├── /noise/              # All noise functions
    ├── /materials/          # Material implementations
    ├── /postfx/             # Post-processing effects
    ├── /compute/            # Compute shaders & simulations
    ├── /sdf/                # SDF and raymarching
    ├── /lighting/           # Lighting systems
    ├── /effects/            # Visual effects
    ├── /utils/              # Utilities and helpers
    ├── /pipelines/          # Complete rendering pipelines
    ├── /nodes/              # TSL node definitions
    └── /inventory.md        # Master catalog
  ```
- Preserve original folder structure in metadata
- Include example files that demonstrate usage
- Keep provenance information (source path, author, license)

#### Days 6-7: Detailed Documentation
- Create `inventory.md` with comprehensive metadata table
- For each collected item, document:
  - **Module Name**: Clear, descriptive name
  - **Source Path**: Original location
  - **Category**: Type of module/utility
  - **Dependencies**: What it requires (imports, textures, etc.)
  - **Complexity**: Simple/Medium/Complex
  - **Status**: Complete/Partial/Needs-Work
  - **Priority**: High/Medium/Low for porting
  - **Three.js Version**: Which version it's from
  - **Estimated Effort**: Hours to port and integrate
  - **Risk Level**: Low/Medium/High
  - **Notes**: Special considerations, gotchas, opportunities

#### Days 7-8: Three.js r181 Research
- Study Three.js r181 changelog and breaking changes
- Review TSL/WebGPU migration guides
- Document API changes from r170-r180 → r181
- Identify porting considerations for legacy examples
- Note new features to leverage:
  - Async renderer initialization
  - New TSL functions (`Fn`, `wgslFn`, `pass`)
  - MRT (Multiple Render Targets) APIs
  - Storage texture improvements
  - Compute pipeline enhancements
- Create compatibility checklist
- Document import path changes (`three/webgpu`, `three/tsl`)
- List deprecated APIs and their replacements

#### Day 9: Priority Assessment
- Rank all collected modules by importance
- Identify "must-have" vs. "nice-to-have"
- Determine optimal porting order based on:
  - Dependencies (what needs to be ported first)
  - Impact (high-value features)
  - Complexity (quick wins vs. long-term efforts)
  - Risk (proven vs. experimental)
- Calculate total effort estimate
- Create phased porting plan
- Identify potential blockers

#### Day 10: Validation & Sign-Off
- Review completeness of collection
- Ensure no modules missed (double-check all folders)
- Verify categorization accuracy
- Cross-reference with all proposal documents
- Validate effort estimates
- Confirm no "unknown" or "TBD" items remaining
- Get stakeholder approval to proceed to Phase 1
- Lock down the collection (version control snapshot)

### 2.4 Phase 0 Output Artifacts

#### Deliverable 1: `/COLLECTED_MODULES/` Folder
Physical folder with ALL collected code, organized by category, with complete provenance metadata.

#### Deliverable 2: `inventory.md`
Comprehensive catalog with metadata table:

```markdown
| # | Module Name | Category | Source Path | Status | Priority | Complexity | Est. Hours | Dependencies | Three.js Ver | Risk | Notes |
|---|-------------|----------|-------------|--------|----------|------------|------------|--------------|--------------|------|-------|
| 1 | Simplex Noise 3D | Noise | portfolio-main/src/.../simplexNoise3d.ts | Complete | High | Simple | 2 | three/tsl | r170 | Low | Direct port, needs import updates |
| 2 | Perlin Noise | Noise | fragments-boilerplate/.../perlin.ts | Complete | High | Simple | 2 | three/tsl | r175 | Low | Keep helper signatures |
| ... | ... | ... | ... | ... | ... | ... | ... | ... | ... | ... | ... |
```

#### Deliverable 3: `THREE_R181_MIGRATION.md`
Complete migration guide with:
- Import path changes
- API signature changes
- Deprecated features and replacements
- New features to adopt
- Code examples and patterns

#### Deliverable 4: `PORTING_PRIORITY.md`
Ranked list of modules with:
- Phase assignments
- Dependency chains
- Risk assessments
- Quick wins vs. long-term efforts

### 2.5 Phase 0 Success Criteria

**Phase 0 is complete ONLY when:**
- ✅ ALL target directories fully explored (100% coverage)
- ✅ Every relevant file copied to `/COLLECTED_MODULES/`
- ✅ `inventory.md` contains complete metadata for every module
- ✅ Best practices documented from portfolio examples
- ✅ Three.js r181 compatibility research completed
- ✅ Priority rankings assigned to all modules
- ✅ Total effort estimate calculated
- ✅ Dependency chains mapped
- ✅ No "unknown" or "TBD" items remaining
- ✅ Stakeholder sign-off received

**ONLY THEN proceed to Phase 1 (Planning & PRD).**

---

## 3. Technical Architecture

### 3.1 Stack Overview

**Runtime:**
- **Three.js r181+** WebGPURenderer (async initialization required)
- **NodeMaterials/TSL** for all shader authoring (WebGPU-first)
- **React Three Fiber (R3F) v9+** with async `gl` factory pattern
- **WebGPU API** as primary backend (WebGL fallback for banners only)

**Development:**
- **TypeScript** (strict mode)
- **PNPM** monorepo
- **Vite** for bundling
- **Vitest** for testing
- **Zod** for schema validation

**Async Renderer Pattern:**
```tsx
import { Canvas } from '@react-three/fiber'

<Canvas
  gl={async () => {
    const { WebGPURenderer } = await import('three/webgpu')
    const renderer = new WebGPURenderer({ antialias: true })
    await renderer.init()  // CRITICAL! Wait for backend initialization
    return renderer
  }}
/>
```

### 3.2 Package Topology

```
/packages
  /tsl-kit                          # Core library (self-contained)
    /src
      /ported/                      # Original code preserved verbatim
        /portfolio-main/            # From Maxime Heckel portfolio
        /fragments-boilerplate/     # From fragments boilerplate
        /TSLwebgpuExamples/        # From TSL example repos
        /three-r181-examples/      # From official examples
      /materials/                   # Materials & PBR
        /core/                      # Fresnel, BRDF lobes, triplanar, normals, IBL
        /pbr/                       # Disney layers: sheen, clearcoat, anisotropy, iridescence
        /surfaces/                  # Presets: skin, car paint, cloth, plastics, metals
        /noise/                     # Noise node library (adapters)
        /decals/                    # Projection masks, scratches, dirt
        /fog/                       # Height fog, exponential fog, volumetric
      /post/                        # Post-processing
        /core/                      # PostComposer, MRT management
        /tonemap/                   # ACES, filmic, gamma
        /bloom/                     # Dual/Kawase bloom, dirt lens
        /glare/                     # Anamorphic streaks, starburst
        /dof/                       # Circle-of-confusion, bokeh gather
        /colorfx/                   # Lift/gamma/gain, LUT, vignette, grain
        /motion/                    # Camera velocity, per-pixel velocity
        /ssao-ssgi/                 # Ambient occlusion, global illumination
        /stylized/                  # LCD, halftone, ASCII, CRT, canvas weave
      /compute/                     # Compute shaders & simulations
        /core/                      # Ping-pong utilities, barriers, workgroups
        /particles/                 # Position/velocity updates, force fields
        /fluids/                    # 2D fluids (advect, divergence, Jacobi, pressure)
        /instancing/                # Grid deformation, wave patterns
        /wgsl/                      # WGSL helper registry
      /util/                        # Utilities
        deviceCaps.ts               # Adapter limits, feature detection
        budget.ts                   # Frame timing, pass instrumentation
        fallback.ts                 # WebGL fallbacks, warnings
        schema.ts                   # Zod schemas for JSON DSL
        graph.ts                    # DSL compiler (JSON → TSL)
        disposal.ts                 # Resource lifecycle management
      /presets/                     # Curated presets
        /materials/                 # Named material looks
        /post/                      # Named post-processing chains
        /compute/                   # Named compute simulations
      /inspector/                   # Debug & development UI
        parameters.ts               # Leva/Tweakpane integration
        graph-viewer.ts             # Node graph visualization
        profiler.ts                 # Performance dashboard
    index.ts                        # Public API surface

  /studio                           # React application
    /src
      /components/                  # UI components
      /scenes/                      # Demo scenes
      /docs/                        # MDX documentation
    index.html

  /demo-r3f                         # R3F playground
    /src
      /examples/                    # Example implementations
      /harness/                     # Screenshot & regression tools
```

### 3.3 Module Boundaries & Dependencies

**Dependency Flow:**
```
┌─────────────────────────────────────────────────┐
│ Core Utilities (util/)                          │
│ - Device caps, budgets, schemas, disposal       │
└─────────────────┬───────────────────────────────┘
                  │
     ┌────────────┴────────────┐
     ▼                         ▼
┌─────────────┐         ┌─────────────┐
│ Materials   │         │ Compute     │
│ - Noise     │◄────────┤ - Particles │
│ - PBR       │         │ - Fluids    │
│ - Surfaces  │         │ - Instancing│
└─────┬───────┘         └─────┬───────┘
      │                       │
      │        ┌──────────────┘
      │        │
      ▼        ▼
┌─────────────────────┐
│ Post-Processing     │
│ - Tonemap, Bloom    │
│ - DOF, SSGI, etc.   │
└─────────┬───────────┘
          │
          ▼
┌─────────────────────┐
│ Presets & DSL       │
│ - Material presets  │
│ - Post chains       │
│ - Compute sims      │
│ - JSON compiler     │
└─────────────────────┘
```

**Rules:**
- Ported code stays isolated under `/ported/` (read-only)
- Only adapters touch ported code (thin wrappers)
- All public APIs export TypeScript interfaces
- All parameters validated via Zod schemas
- All modules implement `dispose()` lifecycle

### 3.4 Import Patterns (Three.js r181)

**Correct Imports:**
```typescript
// Renderer & materials
import { WebGPURenderer } from 'three/webgpu'
import { MeshPhysicalNodeMaterial, MeshStandardNodeMaterial } from 'three/webgpu'

// TSL primitives
import { color, uv, texture, Fn, wgslFn, uniform, attribute } from 'three/tsl'
import { pass, mrt } from 'three/tsl'

// Post-processing
import { PostProcessing } from 'three/webgpu'

// Nodes
import { BloomNode, DepthOfFieldNode, GTAONode } from 'three/tsl'
```

**Deprecated (DO NOT USE):**
```typescript
// OLD: examples/jsm paths (r170 and earlier)
import { NodeMaterial } from 'three/examples/jsm/nodes/Nodes.js'  // ❌
```

---

## 4. Resource Inventory & Port Strategy

### 4.1 Portfolio Examples (Maxime Heckel) — Priority ⭐⭐⭐⭐⭐

**Source:** `RESOURCES/REPOSITORIES/portfolio examples/`

#### A. Noise & Procedural Toolkit

| Module | Source File | Priority | Effort | Dependencies | Notes |
|--------|-------------|----------|--------|--------------|-------|
| Simplex Noise 2D | portfolio-main/src/.../simplexNoise2d.ts | High | 2h | three/tsl | Direct port |
| Simplex Noise 3D | portfolio-main/src/.../simplexNoise3d.ts | High | 2h | three/tsl | Direct port |
| Simplex Noise 4D | portfolio-main/src/.../simplexNoise4d.ts | High | 3h | three/tsl | Needs typing |
| Curl Noise 2D | portfolio-main/src/.../curlNoise2d.ts | High | 2h | three/tsl | Direct port |
| Curl Noise 3D | portfolio-main/src/.../curlNoise3d.ts | High | 2h | three/tsl | Direct port |
| Curl Noise 4D | portfolio-main/src/.../curlNoise4d.ts | High | 3h | three/tsl | Direct port |
| Voronoi Noise | portfolio-main/src/.../voronoi.ts | Medium | 3h | three/tsl | Algorithm review |
| Classic Noise 3D | fragments-boilerplate/.../classicNoise3d.ts | Medium | 2h | three/tsl | Direct port |
| Perlin Noise | fragments-boilerplate/.../perlin.ts | High | 2h | three/tsl, common | Keep helpers |
| FBM (Fractal Brownian Motion) | fragments-boilerplate/.../fbm.ts | High | 2h | Noise nodes | Multi-octave |
| Turbulence | fragments-boilerplate/.../turbulence.ts | Medium | 2h | Noise nodes | Domain warping |

**Total Noise Modules**: 12 | **Total Effort**: ~28 hours

#### B. Lighting Utilities

| Module | Source File | Priority | Effort | Dependencies | Notes |
|--------|-------------|----------|--------|--------------|-------|
| Ambient Light | portfolio-main/src/.../ambient.ts | High | 1h | three/tsl | Simple wrapper |
| Diffuse Light | portfolio-main/src/.../diffuse.ts | High | 1h | three/tsl | Lambert/Oren-Nayar |
| Directional Light | portfolio-main/src/.../directional.ts | High | 2h | three/tsl | Shadow support |
| Fresnel | portfolio-main/src/.../fresnel.ts | High | 2h | three/tsl | Schlick + dielectric |
| Hemisphere Light | portfolio-main/src/.../hemisphere.ts | High | 1h | three/tsl | Sky + ground |
| Phong Specular | fragments-boilerplate/.../phongSpecular.ts | Medium | 2h | three/tsl | Legacy support |

**Total Lighting Modules**: 6 | **Total Effort**: ~9 hours

#### C. Utilities & Helpers

| Module | Source File | Priority | Effort | Dependencies | Notes |
|--------|-------------|----------|--------|--------------|-------|
| Smooth Min | portfolio-main/src/.../smooth-min.ts | Medium | 1h | three/tsl | SDF operations |
| Smooth Mod | portfolio-main/src/.../smooth-mod.ts | Medium | 1h | three/tsl | Pattern repetition |
| Remap | portfolio-main/src/.../remap.ts | High | 0.5h | three/tsl | Value mapping |
| Compose | portfolio-main/src/.../compose.ts | Medium | 1h | three/tsl | Function composition |
| Rotate 3D Y | portfolio-main/src/.../rotate-3d-y.ts | Medium | 1h | three/tsl | Matrix rotation |

**Total Utility Modules**: 5 | **Total Effort**: ~4.5 hours

#### D. Post-Processing Effects

| Module | Source File | Priority | Effort | Dependencies | Notes |
|--------|-------------|----------|--------|--------------|-------|
| Canvas Weave | fragments-boilerplate/.../canvas_weave.ts | Medium | 3h | PostProcessing | Texture pattern |
| Film Grain | fragments-boilerplate/.../grain_texture.ts | High | 2h | PostProcessing | Blue noise |
| LCD Effect | fragments-boilerplate/.../lcd_effect.ts | Medium | 2h | PostProcessing | Pixelization |
| Pixellation | fragments-boilerplate/.../pixellation.ts | Medium | 2h | PostProcessing | Resolution downscale |
| Speckled Noise | fragments-boilerplate/.../speckled_noise.ts | Low | 2h | PostProcessing | Stylized grain |
| Vignette | fragments-boilerplate/.../vignette.ts | High | 1h | PostProcessing | Edge darkening |

**Total Post-FX Modules**: 6 | **Total Effort**: ~12 hours

#### E. Example Systems & Labs (30+ Scenes)

**High-Priority Labs to Extract Patterns:**
- Particles morphing (WGSL compute + instancing)
- Flow fields (curl noise + particles)
- SDF raymarching (primitives + boolean ops)
- Water simulation (wave displacement)
- Dissolve effects (threshold + noise)

**Estimated Effort**: 24 hours (pattern extraction, decoupling UI)

**Portfolio Examples Total**: 40+ modules | ~77.5 hours

---

### 4.2 TSL WebGPU Example Repositories — Priority ⭐⭐⭐⭐

**Source:** `RESOURCES/REPOSITORIES/TSLwebgpuExamples/`

#### A. Compute Particles

| Module | Source | Priority | Effort | Notes |
|--------|--------|----------|--------|-------|
| TSL Compute Particles | tsl-compute-particles/src/script.js | High | 12h | 500k particles, pointer interaction, disposal patterns |
| TSL Particle Waves | tsl-particle-waves/src/script.js | High | 8h | 200k instanced waves, time-driven kernels |
| Test WebGPU Particles | test-webgpu-master/src/test1/ | High | 10h | Million+ particles, WGSL libs, mesh compute |

**Total**: 3 modules | ~30 hours

#### B. Fluid Simulation

| Module | Source | Priority | Effort | Notes |
|--------|--------|----------|--------|-------|
| Roquefort Fluid Solver | roquefort-main/ | High | 20h | Full Navier-Stokes (advect, divergence, pressure, vorticity, lighting) |

**Total**: 1 module | ~20 hours

#### C. Screen-Space Effects (Critical Quality)

| Module | Source | Priority | Effort | Notes |
|--------|--------|----------|--------|-------|
| SSR + GTAO | ssr-gtao-keio/src/script.js | Critical | 10h | MRT-driven SSR + GTAO + SMAA composition |
| SSGI + SSR + TRAA | ssgi-ssr-painter/src/script.js | Critical | 14h | Combined SSGI, SSR, TRAA with painting UI |

**Total**: 2 modules | ~24 hours

#### D. WGSL Helper Libraries

| Module | Source | Priority | Effort | Notes |
|--------|--------|----------|--------|-------|
| PSRD Noise 3 WGSL | test-webgpu-master/src/wgsl/psrdnoise3.wgsl | Medium | 3h | Periodic noise for compute |
| Matrix Compose WGSL | test-webgpu-master/src/wgsl/mat4-compose.wgsl | Medium | 2h | Matrix utilities |

**Total**: 2 modules | ~5 hours

**TSL Example Repos Total**: 8+ key modules | ~79 hours

---

### 4.3 Three.js r181 Official Examples — Priority ⭐⭐⭐

**Source:** `RESOURCES/three.js-r181/examples/`

#### A. Post-Processing (Canonical References)

| Module | Source | Priority | Effort | Notes |
|--------|--------|----------|--------|-------|
| Bloom Node | webgpu_postprocessing_bloom.html | High | 4h | Official implementation, inspector integration |
| Depth of Field Node | jsm/tsl/display/DepthOfFieldNode.js | High | 6h | CoC prepass, bokeh gather |
| GTAO Node | jsm/tsl/display/GTAONode.js | High | 8h | Ground-truth ambient occlusion |
| Anamorphic Node | jsm/tsl/display/AnamorphicNode.js | Medium | 4h | Anamorphic flares |
| TRAA (Temporal AA) | jsm/tsl/display/... | High | 6h | Temporal anti-aliasing |

**Total**: 5 modules | ~28 hours

#### B. Compute Examples

| Module | Source | Priority | Effort | Notes |
|--------|--------|----------|--------|-------|
| WebGPU Compute Particles | webgpu_compute_particles.html | High | 6h | 200k particles, canonical implementation |

**Total**: 1 module | ~6 hours

#### C. Material Examples

| Module | Source | Priority | Effort | Notes |
|--------|--------|----------|--------|-------|
| Raging Sea | webgpu_tsl_raging_sea.html | High | 8h | Wave materials, normal reconstruction, emissive |

**Total**: 1 module | ~8 hours

**Official Examples Total**: 7+ key modules | ~42 hours

---

### 4.4 Consolidated Module Count

| Category | Modules | Estimated Hours |
|----------|---------|----------------|
| **Noise & Procedural** | 12 | 28 |
| **Lighting** | 6 | 9 |
| **Utilities** | 5+ | 5 |
| **Materials** | 20+ | 40 |
| **Post-Processing** | 20+ | 60 |
| **Compute** | 10+ | 70 |
| **Screen-Space** | 5 | 44 |
| **WGSL Helpers** | 5+ | 10 |
| **Complete Systems** | 30+ | 50 |
| **Documentation** | — | 40 |
| **Testing** | — | 60 |
| **Integration** | — | 80 |
| **TOTAL** | **150+** | **~500 hours** |

**Timeline:** 500 hours ÷ 40 hours/week = **12.5 weeks** (≈ **3 months** at full focus)  
**Realistic Timeline with Buffer:** **20 weeks** (5 months)

---

### 4.5 Port Philosophy & Guidelines

#### Direct-Port Policy

**DO:**
- ✅ Copy original file verbatim under `/ported/<source>/`
- ✅ Keep original logic, math, algorithms unchanged
- ✅ Preserve comments, authorship, licensing
- ✅ Only change imports to match Three.js r181 patterns
- ✅ Only add TypeScript types where missing
- ✅ Only adjust paths to fit package structure
- ✅ Document provenance (source, author, license)

**DON'T:**
- ❌ Rewrite algorithms or "improve" logic
- ❌ Merge different implementations without testing
- ❌ Remove comments or attribution
- ❌ Change parameter names or semantics
- ❌ Optimize before establishing baseline
- ❌ Skip documentation of changes made

#### Adapter Pattern

Every ported module gets a thin adapter:

```typescript
// packages/tsl-kit/src/materials/noise/simplexNoise3d.ts

// Import ported implementation (verbatim)
import { simplexNoise3d as _simplexNoise3d } from '../../ported/portfolio-main/noise/simplexNoise3d'

// Re-export with TypeScript typing
export const simplexNoise3d = _simplexNoise3d

// Provenance metadata
export const meta = {
  source: 'portfolio-main/src/utils/webgpu/nodes/noise/simplexNoise3d.ts',
  author: 'Maxime Heckel',
  license: 'MIT',
  version: 'r170',
  ported: '2025-11-10',
  notes: 'Direct port, updated imports from three/nodes to three/tsl'
}
```

#### Testing Strategy

For every ported module:
1. **Baseline Test**: Render with original code, capture screenshot
2. **Port Test**: Render with ported code, compare (ΔE < 2)
3. **Unit Test**: Test mathematical output (if applicable)
4. **Integration Test**: Use in realistic scene
5. **Performance Test**: Compare frame times

---

## 5. Feature Specifications

### 5.1 Noise & Procedural Toolkit

**Goal**: Comprehensive noise library for materials, compute, and effects

**Features:**
- **2D/3D/4D Noise Variants**: Simplex, Perlin, Curl, Worley, Voronoi
- **Fractal Systems**: FBM (Fractal Brownian Motion), Turbulence, Domain Warping
- **Combinators**: Mix, add, multiply, smooth blend
- **Utilities**: Octave helpers, normalization, tiling
- **Output Modes**: Scalar, vector (gradients), texture sampling

**API Example:**
```typescript
import { simplexNoise3d, fbm, curlNoise3d } from '@tslstudio/tsl-kit/materials/noise'

const noise = simplexNoise3d(position.mul(scale))
const fractal = fbm(position, { octaves: 4, lacunarity: 2.0, gain: 0.5 })
const curl = curlNoise3d(position.mul(0.5))
```

**Presets:**
- Cloud noise (FBM + turbulence)
- Flow field (curl + direction)
- Terrain (multi-octave Perlin)

### 5.2 Material System

**Goal**: Production-ready PBR materials with advanced features

**Core Features:**
- **Disney PBR Stack**: Base color, roughness, metallic
- **Clearcoat**: Second specular lobe, separate normal map
- **Sheen**: Fabric/velvet response (Charlie distribution)
- **Anisotropy**: Directional roughness with rotation
- **Iridescence**: Thin-film interference
- **Transmission**: Glass, translucency
- **Subsurface**: Wrap diffuse, thickness map

**Utility Nodes:**
- Fresnel (Schlick + dielectric)
- Triplanar mapping
- Normal blending (reoriented normal maps)
- IBL/Environment mapping
- Multi-layer composition

**API Example:**
```typescript
import { makeMaterial, presets } from '@tslstudio/tsl-kit/materials'

const carPaint = makeMaterial({
  model: 'pbr',
  layers: [
    presets.baseColor({ hex: '#1b1f73' }),
    presets.anisotropy({ strength: 0.7, rotation: 0.0 }),
    presets.clearcoat({ amount: 0.85, gloss: 0.45 }),
    presets.iridescence({ ior: 1.6, thickness: [250, 900] })
  ],
  mapping: presets.triplanar({ scale: 2.0 })
})
```

**Material Presets:**
- **Skin**: SSS approximation, pore detail
- **Car Paint**: Flakes, clearcoat, iridescence
- **Cloth**: Sheen, fiber detail
- **Water**: Waves, foam, caustics
- **Glass**: Transmission, chromatic aberration
- **Hologram**: Interference patterns

### 5.3 Post-Processing Pipeline

**Goal**: Cinematic post-processing with modular, composable passes

**Core Passes:**
- **Tonemap**: ACES, Filmic, Reinhard, Uncharted2
- **Bloom**: Dual-filtered, kawase, lens dirt
- **Glare**: Anamorphic streaks, starburst
- **Depth of Field**: Circle of Confusion, bokeh gather
- **Motion Blur**: Camera + per-pixel velocity
- **Color Grading**: Lift/gamma/gain, LUT, channel mixer
- **FXAA/TAA**: Anti-aliasing
- **Vignette**: Edge darkening
- **Film Grain**: Blue-noise driven

**Advanced Passes (Feature-Gated):**
- **SSR** (Screen-Space Reflections)
- **GTAO** (Ground-Truth Ambient Occlusion)
- **SSGI** (Screen-Space Global Illumination)
- **SMAA** (Subpixel Morphological Anti-Aliasing)
- **TRAA** (Temporal Reprojection Anti-Aliasing)

**Stylized Passes:**
- **LCD Effect**: Pixelated RGB subpixels
- **Halftone**: CMYK dot patterns
- **ASCII**: Character-based rendering
- **CRT**: Scanlines, chromatic aberration
- **Canvas Weave**: Fabric texture overlay

**API Example:**
```typescript
import { makePostChain } from '@tslstudio/tsl-kit/post'

const cinematic = makePostChain([
  ['tonemap', { curve: 'ACES' }],
  ['bloom', { threshold: 1.0, strength: 0.5, radius: 0.85 }],
  ['glare', { streaks: 4, intensity: 0.25 }],
  ['dof', { aperture: 0.018, focus: 2.8, maxBlur: 7.5 }],
  ['vignette', { intensity: 0.4 }],
  ['grain', { amount: 0.035 }]
])

// Use in render loop
cinematic.render({ scene, camera, renderer, target })
```

**Post-Processing Presets:**
- **Cinema**: ACES + Bloom + DOF
- **Game**: Filmic + TAA + Vignette
- **Stylized**: Halftone + Canvas Weave
- **Tech**: SSR + GTAO + TAA
- **Retro**: CRT + Grain + Chromatic Aberration

### 5.4 Compute Systems

**Goal**: GPU-accelerated simulations and effects

**Particle Systems:**
- Position/velocity buffers (RGBA16F/RGBA32F)
- Force fields: curl, gravity, turbulence, attractors
- Spawn/kill logic for stable counts
- Pointer interaction (click, drag)
- Instanced rendering (SpriteNodeMaterial, InstancedMesh)

**API Example:**
```typescript
import { createParticleSim } from '@tslstudio/tsl-kit/compute/particles'

const particles = createParticleSim({
  count: 512 * 512,
  fields: [
    { type: 'curlNoise', amplitude: 0.6, frequency: 0.8 },
    { type: 'gravity', direction: [0, -1, 0], strength: 0.25 },
    { type: 'attractor', position: [0, 0, 0], strength: 0.8, falloff: 1.5 }
  ],
  spawn: { rate: 1000, lifetime: [1.5, 3.5] }
})

// In render loop
particles.update(deltaTime)
```

**Fluid Simulation (2D/3D):**
- Advection (semi-Lagrangian)
- Diffusion (Jacobi iterations)
- Pressure solve (projection)
- Vorticity confinement
- Dye/density advection
- Optional lighting/shading

**Instancing Utilities:**
- Grid initialization
- Wave-based displacement
- Height-driven coloring
- Morph targets

**WGSL Helper Registry:**
- Matrix composition/decomposition
- Periodic noise functions
- Common math utilities

### 5.5 Agent-Ready APIs

**Goal**: Safe, typed, schema-validated interfaces for AI agents

**TypeScript APIs:**
```typescript
// Type-safe material creation
const material = makeMaterial({
  model: 'pbr',
  layers: [ /* ... */ ],
  mapping: { /* ... */ }
})

// Type-safe post chain
const post = makePostChain([
  ['tonemap', { curve: 'ACES' }],  // Autocomplete on parameters
  ['bloom', { threshold: 1.0 }]
])

// Type-safe compute simulation
const sim = createParticleSim({
  count: 262144,
  fields: [ /* ... */ ]
})
```

**JSON Schema DSL:**
```json
{
  "kind": "material",
  "model": "pbr",
  "layers": [
    { "type": "baseColor", "hex": "#5a6cff" },
    { "type": "clearcoat", "amount": 0.8, "gloss": 0.45 },
    { "type": "sheen", "color": "#d8d8ff", "intensity": 0.5 }
  ],
  "mapping": { "type": "triplanar", "scale": 2.0 }
}
```

**Validation (Zod):**
- Parameter ranges validated (no NaN/Inf)
- Required fields enforced
- Enum types checked
- Nested schemas composed
- Custom validation rules

**Compilation:**
```typescript
import { compileGraph } from '@tslstudio/tsl-kit/util/graph'

const result = compileGraph(jsonSpec)
if (result.errors.length > 0) {
  console.error('Validation failed:', result.errors)
} else {
  const material = result.material
  // Use material
}
```

**Safety Features:**
- Node count limits (prevent graph bombs)
- Texture size caps (respect device limits)
- Iteration limits (Jacobi, blur)
- WGSL kernels require `dangerous: true` flag
- Automatic fallbacks for unsupported features

---

## 6. Implementation Roadmap (Phases 1-5)

### Phase 1: Foundation Enhancement (Weeks 1-4)

**Goal**: Establish solid foundation with core utilities

**Week 1:**
- Day 1-2: Scaffold `packages/tsl-kit` structure
- Day 3-4: Port core noise functions (Simplex 3D, Perlin, Curl)
- Day 5: Port lighting utilities (ambient, diffuse, fresnel)

**Week 2:**
- Day 1-2: Port remaining noise variants (Simplex 2D/4D, Curl 2D/4D)
- Day 3-4: Port utility helpers (remap, smooth-min, rotate-3d)
- Day 5: Setup testing infrastructure (Vitest, golden images)

**Week 3:**
- Day 1-2: Start SDF primitives (sphere, box, torus)
- Day 3-4: Setup device capability detection
- Day 5: Implement async WebGPU renderer init

**Week 4:**
- Day 1-3: Complete SDF library (10+ primitives + operations)
- Day 4: Create demo scenes for testing
- Day 5: Phase review & documentation

**Deliverables:**
- ✅ 12 noise functions
- ✅ 6 lighting utilities
- ✅ 5+ helper functions
- ✅ 10+ SDF primitives
- ✅ Testing infrastructure
- ✅ Device capability system
- ✅ Demo scenes

**Target Module Count:** 30 → 80 (53%)

---

### Phase 2: Material Stack (Weeks 5-8)

**Goal**: Complete PBR material system with presets

**Week 5:**
- Day 1-2: Port PBR core (fresnel, BRDF lobes, triplanar)
- Day 3-4: Implement `makeMaterial` API skeleton
- Day 5: Define Zod schemas for material parameters

**Week 6:**
- Day 1-2: Port Disney PBR layers (clearcoat, sheen, anisotropy, iridescence)
- Day 3-4: Create material presets (skin, car paint, cloth)
- Day 5: Integrate noise into materials

**Week 7:**
- Day 1-2: Implement material inspector controls
- Day 3-4: Capture golden renders (ΔE < 2)
- Day 5: Write material documentation

**Week 8:**
- Day 1-3: Additional material presets (water, glass, metal)
- Day 4: Performance profiling
- Day 5: Phase review

**Deliverables:**
- ✅ Complete PBR stack
- ✅ `makeMaterial` API
- ✅ 10+ material presets
- ✅ Material schemas
- ✅ Inspector integration
- ✅ Golden renders
- ✅ Documentation

**Target Module Count:** 80 → 120 (80%)

---

### Phase 3: Post-Processing Suite (Weeks 9-12)

**Goal**: Complete post-processing pipeline with cinematic presets

**Week 9:**
- Day 1-2: Port PostProcessing harness + MRT
- Day 3-4: Implement `makePostChain` API
- Day 5: Port tonemap passes (ACES, Filmic)

**Week 10:**
- Day 1-2: Port bloom, glare, DOF passes
- Day 3-4: Port color grading, vignette, grain
- Day 5: Port stylized effects (LCD, canvas weave)

**Week 11:**
- Day 1-2: Port screen-space effects (SSR, GTAO, SSGI)
- Day 3-4: Implement GPU timing instrumentation
- Day 5: Create post-processing presets

**Week 12:**
- Day 1-3: Inspector integration + performance tuning
- Day 4: Documentation
- Day 5: Phase review

**Deliverables:**
- ✅ PostProcessing composer
- ✅ 20+ post-processing passes
- ✅ `makePostChain` API
- ✅ 10+ post presets
- ✅ Performance instrumentation
- ✅ SSR/GTAO/SSGI support
- ✅ Documentation

**Target Module Count:** 120 → 140 (93%)

---

### Phase 4: Compute Systems (Weeks 13-16)

**Goal**: GPU compute simulations (particles, fluids)

**Week 13:**
- Day 1-2: Port particle compute system (init/update/dispose)
- Day 3-4: Implement `createParticleSim` API
- Day 5: Port force fields (curl, gravity, attractors)

**Week 14:**
- Day 1-2: Port instancing utilities
- Day 3-4: Setup WGSL helper registry
- Day 5: Port 2D fluid solver

**Week 15:**
- Day 1-2: Implement compute schemas and validation
- Day 3-4: Create compute presets
- Day 5: Inspector integration

**Week 16:**
- Day 1-3: Performance optimization & stress testing
- Day 4: Documentation
- Day 5: Phase review

**Deliverables:**
- ✅ Particle simulation system
- ✅ `createParticleSim` API
- ✅ Force field library
- ✅ Instancing utilities
- ✅ 2D fluid solver
- ✅ WGSL helper registry
- ✅ Compute schemas
- ✅ Documentation

**Target Module Count:** 140 → 150 (100%)

---

### Phase 5: Polish & Launch (Weeks 17-20)

**Goal**: Production-ready release

**Week 17:**
- Day 1-2: Finalize JSON DSL schemas
- Day 3-4: Build `compileGraph` DSL compiler
- Day 5: Integrate DSL into demo UI

**Week 18:**
- Day 1-2: Create comprehensive preset catalog
- Day 3-4: Run full regression suite
- Day 5: Triage and fix issues

**Week 19:**
- Day 1-2: Polish documentation and examples
- Day 3-4: Create walkthrough videos
- Day 5: Prepare release notes

**Week 20:**
- Day 1-3: Final testing and fixes
- Day 4: Release candidate
- Day 5: Launch! 🚀

**Deliverables:**
- ✅ Complete JSON DSL with compiler
- ✅ 50+ material presets
- ✅ 20+ post-processing presets
- ✅ 10+ compute presets
- ✅ Full test coverage
- ✅ Complete documentation
- ✅ Example gallery
- ✅ Release candidate

**Target:** Production-Ready Release

---

## 7. API Design & Agent DSL

### 7.1 TypeScript API Surface

#### Materials API

```typescript
import { makeMaterial, presets } from '@tslstudio/tsl-kit/materials'

// Programmatic material creation
const material = makeMaterial({
  model: 'pbr',
  layers: [
    presets.baseColor({ hex: '#5a6cff' }),
    presets.anisotropy({ strength: 0.7, rotation: 0.0 }),
    presets.clearcoat({ amount: 0.8, gloss: 0.4 }),
    presets.sheen({ color: '#d8d8ff', intensity: 0.5 }),
    presets.iridescence({ ior: 1.5, thickness: [200, 800] })
  ],
  mapping: presets.triplanar({ scale: 2.0 }),
  ibl: { type: 'envLUT', intensity: 1.2 }
})

// Load preset
const skin = loadPreset('materials', 'skin')
const modified = makeMaterial({ ...skin, layers: [...skin.layers, customLayer] })

// Update material at runtime
material.update({ roughness: 0.5 })

// Dispose when done
material.dispose()
```

#### Post-Processing API

```typescript
import { makePostChain, presets } from '@tslstudio/tsl-kit/post'

// Build post-processing chain
const post = makePostChain([
  ['tonemap', { curve: 'ACES' }],
  ['bloom', { threshold: 1.0, strength: 0.5, radius: 0.85 }],
  ['glare', { streaks: 4, intensity: 0.25 }],
  ['dof', { aperture: 0.018, focus: 2.8, maxBlur: 7.5 }],
  ['vignette', { intensity: 0.4 }],
  ['grain', { amount: 0.035 }]
])

// Load preset
const cinematic = loadPreset('post', 'cinematic')

// Render
post.render({ scene, camera, renderer, target })

// Update parameters
post.updatePass('bloom', { strength: 0.7 })

// Dispose
post.dispose()
```

#### Compute API

```typescript
import { createParticleSim, presets } from '@tslstudio/tsl-kit/compute'

// Create particle simulation
const particles = createParticleSim({
  count: 512 * 512,
  fields: [
    { type: 'curlNoise', amplitude: 0.6, frequency: 0.8 },
    { type: 'gravity', direction: [0, -1, 0], strength: 0.25 },
    { type: 'attractor', position: [0, 0, 0], strength: 0.8, falloff: 1.5 }
  ],
  spawn: { rate: 1000, lifetime: [1.5, 3.5] },
  material: { /* SpriteNodeMaterial config */ }
})

// Load preset
const swarm = loadPreset('compute', 'swarm')

// Update in render loop
particles.update(deltaTime)

// Pointer interaction
particles.applyForce(pointerPosition, strength)

// Dispose
particles.dispose()
```

### 7.2 JSON Schema DSL

#### Material Schema

```json
{
  "$schema": "https://tslstudio.dev/schemas/material.json",
  "kind": "material",
  "model": "pbr",
  "layers": [
    {
      "type": "baseColor",
      "hex": "#5a6cff"
    },
    {
      "type": "normalMix",
      "sources": ["flake", "macro"],
      "weights": [0.6, 0.4]
    },
    {
      "type": "clearcoat",
      "amount": 0.8,
      "gloss": 0.45
    },
    {
      "type": "sheen",
      "color": "#d8d8ff",
      "intensity": 0.5
    },
    {
      "type": "iridescence",
      "ior": 1.5,
      "thickness": [200, 800]
    }
  ],
  "mapping": {
    "type": "triplanar",
    "scale": 2.0
  },
  "ibl": {
    "type": "envLUT",
    "intensity": 1.2
  }
}
```

#### Post-Processing Schema

```json
{
  "$schema": "https://tslstudio.dev/schemas/post.json",
  "kind": "post",
  "passes": [
    ["tonemap", { "curve": "ACES" }],
    ["bloom", { "threshold": 1.0, "strength": 0.45, "radius": 0.85 }],
    ["glare", { "streaks": 4, "intensity": 0.25 }],
    ["dof", { "aperture": 0.018, "focus": 2.8, "maxBlur": 7.0 }],
    ["vignette", { "intensity": 0.4 }],
    ["grain", { "amount": 0.035, "temperature": 0.0 }]
  ]
}
```

#### Compute Schema

```json
{
  "$schema": "https://tslstudio.dev/schemas/compute.json",
  "kind": "compute",
  "type": "particles",
  "count": 262144,
  "fields": [
    {
      "type": "curlNoise",
      "amplitude": 0.6,
      "frequency": 0.8
    },
    {
      "type": "gravity",
      "direction": [0, -1, 0],
      "strength": 0.25
    },
    {
      "type": "attractor",
      "position": [0, 0, 0],
      "strength": 0.8,
      "falloff": 1.5
    }
  ],
  "spawn": {
    "rate": 1000,
    "lifetime": [1.5, 3.5]
  }
}
```

### 7.3 DSL Compiler

```typescript
import { compileGraph } from '@tslstudio/tsl-kit/util/graph'

// Compile JSON to runtime objects
const result = compileGraph({
  kind: 'material',
  model: 'pbr',
  layers: [/* ... */]
})

if (result.success) {
  const material = result.material
  mesh.material = material
} else {
  console.error('Compilation errors:', result.errors)
  // [
  //   { path: 'layers[2].amount', message: 'Must be between 0 and 1' },
  //   { path: 'layers[3].color', message: 'Invalid hex color' }
  // ]
}
```

### 7.4 Zod Schema Definitions

```typescript
import { z } from 'zod'

// Material layer schema
const LayerSchema = z.discriminatedUnion('type', [
  z.object({
    type: z.literal('baseColor'),
    hex: z.string().regex(/^#[0-9A-Fa-f]{6}$/)
  }),
  z.object({
    type: z.literal('clearcoat'),
    amount: z.number().min(0).max(1),
    gloss: z.number().min(0).max(1)
  }),
  // ... more layer types
])

// Material schema
export const MaterialSchema = z.object({
  kind: z.literal('material'),
  model: z.enum(['pbr', 'stylized', 'unlit']),
  layers: z.array(LayerSchema).min(1).max(16),
  mapping: z.object({
    type: z.enum(['uv', 'triplanar', 'spherical']),
    scale: z.number().positive()
  }).optional(),
  ibl: z.object({
    type: z.enum(['envMap', 'envLUT']),
    intensity: z.number().min(0).max(10)
  }).optional()
})

// Validation
const result = MaterialSchema.safeParse(jsonData)
```

---

## 8. Quality Standards

### 8.1 Testing Requirements

#### Unit Tests
- ✅ Every utility function tested
- ✅ Noise functions output validated (known values)
- ✅ Schema validation edge cases covered
- ✅ Disposal/lifecycle tested

#### Integration Tests
- ✅ Material presets render correctly
- ✅ Post chains compose without errors
- ✅ Compute simulations run stable
- ✅ Inspector controls update parameters

#### Visual Regression Tests
- ✅ Golden image comparison (ΔE < 2)
- ✅ Automated screenshot capture
- ✅ Perceptual diff reporting
- ✅ CI/CD integration

#### Performance Tests
- ✅ Frame time budgets enforced (60 FPS @ 1080p)
- ✅ GPU timing instrumentation
- ✅ Memory leak detection
- ✅ Stress testing (high particle counts)

#### Cross-Browser Tests
- ✅ Chrome/Edge (WebGPU)
- ✅ Fallback gracefully on unsupported browsers
- ✅ Device capability detection validated

### 8.2 Performance Targets

| Metric | Target | Measurement |
|--------|--------|-------------|
| Frame Rate | ≥ 60 FPS | @ 1080p, RTX 2070-class GPU |
| Post-FX Chain | < 5ms GPU time | Cinema preset (ACES + Bloom + DOF) |
| Compute Dispatch | < 6ms GPU time | 512k particles update |
| First Interaction | < 2.5s | From page load to interactive |
| Memory Footprint | < 500MB | Typical scene with presets |

### 8.3 Code Quality Standards

**Every Module Must Have:**
- [ ] TypeScript strict mode compliance
- [ ] Comprehensive JSDoc comments
- [ ] Usage examples in comments
- [ ] Unit tests (≥80% coverage)
- [ ] Integration in demo scene
- [ ] Performance benchmarks
- [ ] Attribution to source (provenance metadata)
- [ ] Dispose() implementation for resource cleanup

**Code Style:**
- Prettier formatting (enforced)
- ESLint rules (no warnings)
- Consistent naming (camelCase, PascalCase)
- Descriptive variable names
- Small, focused functions
- No magic numbers (use constants)

### 8.4 Documentation Standards

**Required Documentation:**
- README.md with quick start
- API reference (auto-generated from JSDoc)
- Example gallery with live demos
- Tutorial guides (beginner → advanced)
- Migration guide (Three.js versions)
- Troubleshooting guide
- Performance optimization guide
- Preset catalog with previews

**Documentation Format:**
- MDX for interactive examples
- Sandpack embeds for live editing
- TypeScript code examples
- Visual diagrams (mermaid)
- Screenshot/video captures

---

## 9. Three.js r181 Migration Strategy

### 9.1 Import Path Changes

**OLD (r170 and earlier):**
```typescript
import { NodeMaterial } from 'three/examples/jsm/nodes/Nodes.js'
import { color, vec3 } from 'three/examples/jsm/nodes/shadernode/ShaderNode.js'
```

**NEW (r181+):**
```typescript
import { MeshPhysicalNodeMaterial } from 'three/webgpu'
import { color, vec3, Fn, uniform } from 'three/tsl'
```

### 9.2 Async Renderer Initialization

**Required Pattern:**
```tsx
import { Canvas } from '@react-three/fiber'

<Canvas
  gl={async () => {
    const { WebGPURenderer } = await import('three/webgpu')
    const renderer = new WebGPURenderer({ 
      antialias: true,
      trackTimestamp: true  // For performance profiling
    })
    await renderer.init()  // ⚠️ CRITICAL! Must await before first render
    return renderer
  }}
/>
```

**Why:** Prevents "render() called before backend is initialized" errors

### 9.3 TSL Function Changes

**OLD:**
```typescript
const node = tslFn(() => {
  // function body
})
```

**NEW:**
```typescript
import { Fn } from 'three/tsl'

const node = Fn(() => {
  // function body
})
```

**WGSL Functions:**
```typescript
import { wgslFn } from 'three/tsl'

const customKernel = wgslFn(`
  fn myKernel(input: vec3<f32>) -> vec3<f32> {
    return input * 2.0;
  }
`)
```

### 9.4 PostProcessing API

**NEW Pattern:**
```typescript
import { PostProcessing } from 'three/webgpu'
import { pass, mrt } from 'three/tsl'

const postProcessing = new PostProcessing(renderer)

const scenePass = pass(scene, camera)
const scenePassColor = scenePass.getTextureNode()

// MRT (Multiple Render Targets)
scenePass.setMRT(
  mrt({
    output: scenePassColor,
    normal: normalPass,
    depth: depthPass
  })
)
```

### 9.5 Compute Pipeline API

**NEW Pattern:**
```typescript
import { Fn, instancedArray, storage } from 'three/tsl'

// Define compute shader
const computeShader = Fn(() => {
  const position = storage(positionBuffer, 'vec3', particleCount)
  const velocity = storage(velocityBuffer, 'vec3', particleCount)
  
  // Update logic
  velocity.element(instanceIndex).addAssign(/* forces */)
  position.element(instanceIndex).addAssign(velocity.element(instanceIndex))
})()

// Execute compute
renderer.compute(computeShader)
```

### 9.6 Device Capability Checks

**Required Before Advanced Features:**
```typescript
// Query adapter limits
const adapter = await navigator.gpu.requestAdapter()
const limits = adapter.limits

// Check capabilities
const canUseFloat16 = limits.maxStorageBufferBindingSize >= requiredSize
const canUseMRT = limits.maxColorAttachments >= 4
const canUseTimestamp = adapter.features.has('timestamp-query')

// Feature-gate advanced passes
if (canUseMRT) {
  // Enable SSR/GTAO/SSGI
} else {
  // Fallback to simpler passes
}
```

### 9.7 Texture Precision Handling

**Adaptive Precision:**
```typescript
// Check byte budget
if (limits.maxColorAttachmentBytesPerSample < 32) {
  // Use lower precision
  texture.type = THREE.UnsignedByteType
} else {
  // Use higher precision
  texture.type = THREE.FloatType
}
```

### 9.8 Migration Checklist

- [ ] Update all imports to `three/webgpu` and `three/tsl`
- [ ] Implement async renderer initialization
- [ ] Replace deprecated TSL functions with `Fn()`, `wgslFn()`
- [ ] Update PostProcessing to use new `pass()` API
- [ ] Update compute shaders to use new storage API
- [ ] Add device capability checks before advanced features
- [ ] Implement texture precision fallbacks
- [ ] Test on multiple GPUs (high-end, mid-range, integrated)
- [ ] Update documentation with new patterns

---

## 10. Risk Assessment

### 10.1 Technical Risks

| Risk | Impact | Probability | Mitigation |
|------|--------|-------------|-----------|
| **Three.js API Changes** (Future r182+) | High | Medium | Isolate ported code, maintain adapter layer, track changelog |
| **WebGPU Feature Variance** (Device limits) | High | High | Capability detection, dynamic fallbacks, tiered presets |
| **Performance Regressions** (Complex scenes) | Medium | Medium | GPU timing budgets, adaptive quality, performance profiling |
| **Resource Leaks** (Compute/textures) | High | Medium | Mandatory `dispose()`, automated leak tests, ownership tracking |
| **Schema Drift** (Ported modules) | Medium | Low | Provenance metadata, auto-generate schemas, version pinning |
| **Agent Misuse** (Unsafe parameters) | Medium | Medium | Zod validation, clamped ranges, `dangerous` flags for WGSL |

### 10.2 Schedule Risks

| Risk | Impact | Probability | Mitigation |
|------|--------|-------------|-----------|
| **Scope Creep** | High | High | Strict Phase 0 inventory, locked feature set, backlog for v2 |
| **Underestimated Effort** | Medium | Medium | 20% buffer per phase, weekly velocity tracking |
| **Blocked Dependencies** | Medium | Low | Dependency graph, parallel work streams, early integration |
| **Resource Availability** | Medium | Low | Single-person focus, clear priorities, stakeholder alignment |

### 10.3 Quality Risks

| Risk | Impact | Probability | Mitigation |
|------|--------|-------------|-----------|
| **Visual Parity Failures** (ΔE > 2) | High | Low | Golden image tests, early validation, source comparison |
| **Browser Incompatibility** | Medium | Low | WebGPU feature detection, graceful fallbacks, capability banners |
| **Insufficient Testing** | High | Medium | 80% coverage requirement, CI/CD, visual regression |
| **Poor Documentation** | Medium | Medium | Inline examples, interactive demos, weekly doc reviews |

### 10.4 Mitigation Strategies

**For Technical Risks:**
1. **Isolation**: Keep ported code read-only, changes only in adapters
2. **Capability Detection**: Probe device limits before enabling features
3. **Performance Budgets**: Hard limits on GPU timing, automatic degradation
4. **Lifecycle Management**: Mandatory `dispose()`, automated leak detection

**For Schedule Risks:**
1. **Phase 0 Lock-Down**: Complete inventory before starting implementation
2. **Weekly Reviews**: Track velocity, adjust estimates, re-prioritize
3. **Buffer Time**: 20% contingency per phase, full buffer week at end
4. **Parallel Streams**: Materials, post, compute can progress independently

**For Quality Risks:**
1. **Test-First**: Golden images before claiming visual parity
2. **CI/CD Pipeline**: Automated testing on every commit
3. **Code Reviews**: All ports reviewed against source
4. **Documentation-Driven**: Write docs as features are developed

---

## 11. Success Metrics

### 11.1 Technical Metrics

**Module Coverage:**
- ✅ **Target**: 150+ modules
- ✅ **Measure**: Count in `/packages/tsl-kit/`
- ✅ **Threshold**: ≥ 150 (100%)

**Performance:**
- ✅ **Target**: 60 FPS @ 1080p
- ✅ **Measure**: Frame time < 16.67ms
- ✅ **Threshold**: 95th percentile ≤ 18ms

**Visual Parity:**
- ✅ **Target**: ΔE < 2 vs. source
- ✅ **Measure**: Perceptual diff (CIEDE2000)
- ✅ **Threshold**: 100% of golden images pass

**Test Coverage:**
- ✅ **Target**: 80%+ code coverage
- ✅ **Measure**: Istanbul/c8 reports
- ✅ **Threshold**: ≥ 80% lines, branches, functions

**GPU Performance:**
- ✅ **Target**: Post-FX < 5ms GPU time
- ✅ **Measure**: Timestamp queries
- ✅ **Threshold**: Cinema preset ≤ 5ms

### 11.2 Quality Metrics

**Code Quality:**
- ✅ **Target**: 0 linter warnings
- ✅ **Measure**: ESLint reports
- ✅ **Threshold**: 0 errors, 0 warnings

**Documentation:**
- ✅ **Target**: 100% API coverage
- ✅ **Measure**: JSDoc completeness
- ✅ **Threshold**: All public APIs documented

**Examples:**
- ✅ **Target**: 50+ interactive examples
- ✅ **Measure**: Count in example gallery
- ✅ **Threshold**: ≥ 50 working examples

### 11.3 Delivery Metrics

**Timeline:**
- ✅ **Target**: 20 weeks to launch
- ✅ **Measure**: Phase completion dates
- ✅ **Threshold**: Launch by Week 20

**Velocity:**
- ✅ **Target**: ~7.5 modules/week
- ✅ **Measure**: Completed modules per sprint
- ✅ **Threshold**: Track and adjust

**Scope:**
- ✅ **Target**: 100% of Phase 0 inventory
- ✅ **Measure**: Ported vs. planned
- ✅ **Threshold**: All High/Medium priority modules

### 11.4 Success Criteria Summary

**Phase 0 Success:**
- ✅ 100% resource collection complete
- ✅ Inventory with metadata for 150+ modules
- ✅ Three.js r181 migration guide
- ✅ Stakeholder sign-off

**Phase 1 Success:**
- ✅ 80 modules (53%)
- ✅ Core noise + lighting + utilities
- ✅ Testing infrastructure
- ✅ Device capability system

**Phase 2 Success:**
- ✅ 120 modules (80%)
- ✅ Complete material system
- ✅ 10+ material presets
- ✅ Visual parity (ΔE < 2)

**Phase 3 Success:**
- ✅ 140 modules (93%)
- ✅ Complete post-processing
- ✅ 20+ post-processing passes
- ✅ Performance budgets met

**Phase 4 Success:**
- ✅ 150 modules (100%)
- ✅ Compute systems operational
- ✅ Particle + fluid simulations
- ✅ All systems tested

**Phase 5 Success:**
- ✅ JSON DSL complete
- ✅ 50+ material presets
- ✅ 20+ post presets
- ✅ 10+ compute presets
- ✅ Full documentation
- ✅ **🚀 LAUNCH!**

---

## Appendix A: Timeline Summary

```
PHASE 0 (Days 1-10): Resource Collection & Research
├─ Days 1-2:  Deep scan & inventory
├─ Day 3:     Best practices analysis
├─ Days 4-5:  Physical file collection
├─ Days 6-7:  Detailed documentation
├─ Days 7-8:  Three.js r181 research
├─ Day 9:     Priority assessment
└─ Day 10:    Validation & sign-off

PHASE 1 (Weeks 1-4): Foundation Enhancement
├─ Week 1:    Scaffold + noise + lighting (core)
├─ Week 2:    Noise variants + utilities + testing
├─ Week 3:    SDF + device caps + renderer
└─ Week 4:    SDF completion + demos + review

PHASE 2 (Weeks 5-8): Material Stack
├─ Week 5:    PBR core + API + schemas
├─ Week 6:    Disney layers + presets
├─ Week 7:    Inspector + golden renders
└─ Week 8:    Additional presets + review

PHASE 3 (Weeks 9-12): Post-Processing Suite
├─ Week 9:    PostProcessing + tonemap
├─ Week 10:   Bloom + DOF + color grading
├─ Week 11:   Screen-space (SSR/GTAO/SSGI)
└─ Week 12:   Performance + docs + review

PHASE 4 (Weeks 13-16): Compute Systems
├─ Week 13:   Particles + force fields
├─ Week 14:   Instancing + fluids
├─ Week 15:   Schemas + presets + inspector
└─ Week 16:   Performance + docs + review

PHASE 5 (Weeks 17-20): Polish & Launch
├─ Week 17:   JSON DSL + compiler
├─ Week 18:   Presets + regression tests
├─ Week 19:   Documentation + examples
└─ Week 20:   Final testing + LAUNCH! 🚀
```

**Total Duration:** 10 days (Phase 0) + 20 weeks (Phases 1-5) = **≈ 5 months**

---

## Appendix B: Key Principles (Reminder)

1. **Collection Before Planning** — Can't plan what you don't know exists
2. **Physical File Collection** — Copy everything to centralized location
3. **Exhaustive Discovery** — Leave no file unexplored
4. **Direct Port First** — Use working code as-is
5. **Minimize Risk** — Don't rewrite proven implementations
6. **Three.js r181 Native** — Follow latest patterns
7. **Agent-Addressable** — Clean APIs with JSON schemas
8. **Production-Ready** — Complete, tested, documented
9. **Metadata-Driven** — Every module fully documented before porting
10. **Dependency-Aware** — Understand all relationships before integration

---

## Appendix C: Current Task

### 🎯 IMMEDIATE ACTION REQUIRED

**START PHASE 0 NOW**

1. ✅ Begin systematic scan of all resource directories
2. ✅ Create `/COLLECTED_MODULES/` folder structure
3. ✅ Start copying files and building inventory
4. ✅ Document findings in `inventory.md` as you go
5. ✅ Do NOT proceed to planning until collection is 100% complete

**Phase 0 must be completed before any architecture, planning, or implementation begins.**

---

**Document Version:** 3.0 (Unified)  
**Last Updated:** November 10, 2025  
**Status:** Phase 0 Ready to Execute  
**Next Milestone:** Phase 0 Complete (Day 10)

---

**🚀 Let's build something amazing!**

