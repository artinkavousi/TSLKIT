# TSLStudio Product Requirements Document (PRD) v2.0

> **Project**: TSLStudio WebGPU Engine
> **Version**: 2.0
> **Baseline**: Three.js r181+, WebGPU-first
> **Philosophy**: Direct-port working code, adapt only imports/typing

---

## 1. Executive Summary

### 1.1 Vision & Scope
Deliver a self-contained, plug-and-play TSL/WebGPU engine that exposes production-ready noise generators, physically based materials, cinematic post-processing, and compute pipelines through typed, agent-addressable APIs on top of Three.js r181.【F:DOCS/proposal v1/tsl-toolkit-plan.md†L1-L12】【F:DOCS/proposal v1/TSLStudio — Comprehensive Development Plan v1.0.md†L69-L103】

### 1.2 Mission
Port 150+ proven modules from curated WebGPU/TSL examples into a cohesive toolkit without rewriting core logic, focusing on reliability, ergonomic composition, and JSON-schema validated interfaces for human and agent users.【F:DOCS/proposal v1/TSLStudio — Comprehensive Development Plan v1.0.md†L161-L205】

### 1.3 Success Metrics
- 60 FPS @ 1080p mid-range GPUs, <2.5 s first interaction, ΔE < 2 visual parity against source scenes.【F:DOCS/proposal v1/TSLStudio — Comprehensive Development Plan v1.0.md†L69-L75】
- 100+ deployable modules (noise, materials, post-FX, compute) with 50+ material presets and 20+ post pipelines.【F:DOCS/proposal v1/TSLStudio — Comprehensive Development Plan v1.0.md†L69-L75】【F:DOCS/proposal v1/TSLStudio — Comprehensive Development Plan v1.0.md†L307-L326】
- 90% automated coverage across schema validation, render smoke tests, and GPU timing guardrails.【F:DOCS/proposal v1/tsl-toolkit-plan.md†L5-L12】

### 1.4 Constraints & Principles
- WebGPU-first renderer with async initialization; fallback materials remain secondary.【F:DOCS/proposal v1/tsl-toolkit-architecture.md†L5-L21】
- No shader rewrites—only adapt imports, module boundaries, and typing for r181.【F:DOCS/proposal v1/proposal.md†L9-L28】
- Package layout keeps ported code under `packages/tsl-kit/src/ported/<source>` exposed through thin adapters.【F:DOCS/proposal v1/tsl-toolkit-architecture.md†L24-L73】

---

## 2. Technical Architecture

### 2.1 Stack Overview
- **Three.js r181** WebGPURenderer + NodeMaterials for all flagship features.【F:DOCS/proposal v1/tsl-toolkit-architecture.md†L5-L21】
- **TSL graph authoring** via `three/tsl` primitives (`Fn`, `uniform`, `wgslFn`, etc.).【F:RESOURCES/REPOSITORIES/portfolio examples/blog.maximeheckel.com-main/core/components/MDX/Widgets/TSLWebGPU/computeInstance.ts†L1-L115】
- **React Three Fiber** host using async `gl` factories for WebGPU readiness; CLI and standalone examples share renderer bootstrapper.【F:DOCS/proposal v1/tsl-toolkit-architecture.md†L5-L22】

### 2.2 Package Topology
```
/packages
  /tsl-kit
    /materials (core, pbr, surfaces, decals, fog)
    /post (tonemap, bloom, glare, dof, colorfx, motion, ssao-ssgi)
    /compute (pingpong, particles, fluids)
    /noise (ported suites + adapters)
    /util (deviceCaps, budget, fallback, schema, graph)
    /presets (materials, post, compute)
    /ported/<source>/...
  /demo-r3f (studio shell, docs, regression harness)
```
The layout isolates ported assets, surfaces curated APIs, and centralizes validation utilities for agent-facing workflows.【F:DOCS/proposal v1/tsl-toolkit-architecture.md†L24-L117】

### 2.3 Core Services
- **Renderer Service**: Async WebGPU init, adapter feature probing, tone mapping presets.
- **Framegraph/PostProcessing**: Node-based pass composer compatible with MRT outputs (SSR/GTAO/SSGI pipelines).【F:RESOURCES/REPOSITORIES/TSLwebgpuExamples/ssr-gtao-keio/src/script.js†L84-L125】【F:RESOURCES/REPOSITORIES/TSLwebgpuExamples/ssgi-ssr-painter/src/script.js†L68-L120】
- **Compute Orchestrator**: Storage buffer/texture lifecycle, ping-pong scheduling, timestamp queries.【F:RESOURCES/REPOSITORIES/TSLwebgpuExamples/tsl-compute-particles/src/script.js†L35-L239】
- **Schema & DSL Compiler**: Zod-driven validation mapping JSON graphs to TSL builders.【F:DOCS/proposal v1/tsl-toolkit-architecture.md†L74-L152】

---

## 3. Resource Inventory & Port Strategy

### 3.1 Portfolio Examples (Maxime Heckel)
| Category | Key Modules | Priority | Dependencies | Effort (hrs) | Risks |
| --- | --- | --- | --- | --- | --- |
| Noise/Procedural | `simplexNoise2d/3d/4d`, `curlNoise3d/4d`, `classicNoise3d`, `voronoi` | High | `three/tsl` Fn suite | 12 | Need to restore `@ts-nocheck` helpers or write types around heavy TSL macros.【F:DOCS/proposal v1/TSLStudio — Comprehensive Development Plan v1.0.md†L166-L185】 |
| Lighting | Ambient, Diffuse, Directional, Fresnel, Hemisphere nodes | High | NodeMaterials lighting model | 6 | Align exported functions with engine naming without breaking semantics.【F:DOCS/proposal v1/TSLStudio — Comprehensive Development Plan v1.0.md†L166-L185】 |
| Utilities | `smooth-min`, `smooth-mod`, `remap`, `compose`, `rotate-3d-y` | Medium | Utility library, math nodes | 6 | Compose-friendly typing to avoid inference regressions.【F:DOCS/proposal v1/TSLStudio — Comprehensive Development Plan v1.0.md†L181-L186】 |
| Example Systems | 30+ labs (particles morphing, flow fields, SDFs, water) | High | R3F host, PostProcessing | 24 | Each scene bundles bespoke controls; need decoupling w/out breaking logic.【F:DOCS/proposal v1/TSLStudio — Comprehensive Development Plan v1.0.md†L188-L199】 |

### 3.2 Fragments Boilerplate (Portfolio shell)
| Category | Modules | Priority | Dependencies | Effort | Risks |
| --- | --- | --- | --- | --- | --- |
| Noise Suite | Perlin, Simplex3/4, Curl3/4, FBM, Turbulence | High | `three/tsl` noise macros | 10 | Ensure compatibility with existing noise wrappers to avoid double FBM stacking.【F:RESOURCES/REPOSITORIES/portfolio examples/fragments-boilerplate-main/src/tsl/noise/simplex_noise_4d.ts†L1-L120】 |
| Post Effects | Canvas weave, grain texture, LCD, pixellation, speckled noise, vignette | Medium | PostProcessing quad nodes | 8 | Porting React wrappers to engine presets without DOM dependencies.【F:RESOURCES/REPOSITORIES/portfolio examples/fragments-boilerplate-main/src/tsl/post_processing/post_processing.tsx†L1-L120】 |
| Lighting Utils | Lighting helper nodes | Medium | NodeMaterials lighting base | 4 | Merge with portfolio lighting without duplication.【F:RESOURCES/REPOSITORIES/portfolio examples/fragments-boilerplate-main/src/tsl/utils/lighting.ts†L1-L160】 |

### 3.3 Blog Widget Toolkit
Interactive Sandpack demos showcasing compute pipelines, outline/glass materials, and post chains. Ideal for documentation embeds and inspector modules.【F:RESOURCES/REPOSITORIES/portfolio examples/blog.maximeheckel.com-main/core/components/MDX/Widgets/TSLWebGPU/computeInstance.ts†L1-L207】【F:RESOURCES/REPOSITORIES/portfolio examples/blog.maximeheckel.com-main/core/components/MDX/Widgets/TSLWebGPU/postprocessing.ts†L1-L160】 Port priority: Medium (used for education/UX); risk: UI coupling with design-system components.

### 3.4 TSL WebGPU Example Repositories
| Source | Feature Highlights | Priority | Effort | Risks |
| --- | --- | --- | --- | --- |
| `tsl-compute-particles` | 500k sprite compute sim with pointer impulses, SpriteNodeMaterial wiring | High | 12 | Requires compute budget guards & pointer interaction abstraction.【F:RESOURCES/REPOSITORIES/TSLwebgpuExamples/tsl-compute-particles/src/script.js†L7-L239】 |
| `tsl-particle-waves` | 200k instanced waves using time-driven compute kernels | High | 8 | Needs reusable wave/FFT presets; watch for large workgroup defaults.【F:RESOURCES/REPOSITORIES/TSLwebgpuExamples/tsl-particle-waves/src/script.js†L7-L140】 |
| `roquefort-main` | Full fluid solver (advect, divergence, pressure, vorticity, lighting) | High | 20 | Complex pipeline ordering; storage texture sizes must match adapter limits.【F:DOCS/proposal v1/TSLStudio — Comprehensive Development Plan v1.0.md†L241-L259】 |
| `ssr-gtao-keio` | MRT-driven SSR + GTAO + SMAA composition | Critical | 10 | Requires MRT abstractions and optional precision downgrade toggles.【F:RESOURCES/REPOSITORIES/TSLwebgpuExamples/ssr-gtao-keio/src/script.js†L84-L167】 |
| `ssgi-ssr-painter` | Combined SSGI, SSR, TRAA with painting UI | Critical | 14 | Depends on high attachment budgets (`maxColorAttachmentBytesPerSample`); interactive GLTF export path to decouple.【F:RESOURCES/REPOSITORIES/TSLwebgpuExamples/ssgi-ssr-painter/src/script.js†L1-L202】 |
| `test-webgpu-master` | Multi-million particle pipelines, PSRD noise WGSL libs, mesh compute nodes | Medium | 16 | Mixed module formats (WGSL + JS) require bundler integration and pointer utilities.【F:RESOURCES/REPOSITORIES/TSLwebgpuExamples/test-webgpu-master/src/test1/main.js†L1-L120】【F:RESOURCES/REPOSITORIES/TSLwebgpuExamples/test-webgpu-master/src/wgsl/psrdnoise3.wgsl†L1-L160】 |
| `raymarching-tsl`, `interactwave`, etc. | Additional stylized effects & SDF examples (archived) | Low | 12 | Some repos are WebGL; flag for optional conversions.

### 3.5 three.js r181 Official Modules
Official TSL nodes (Bloom, DOF, GTAO, SSS, Traa, Motion blur, etc.) provide authoritative implementations for adapters and schema definitions.【F:RESOURCES/three.js-r181/examples/jsm/tsl/display/BloomNode.js†L1-L116】【F:RESOURCES/three.js-r181/examples/jsm/tsl/display/DepthOfFieldNode.js†L1-L160】 Leverage these as canonical references for parameter bounds and update hooks.

### 3.6 Port Philosophy
- Preserve original file trees under `ported` namespace with provenance metadata to ease upstream diff tracking.【F:DOCS/proposal v1/proposal.md†L9-L28】
- Wrap exported builders with schema-driven factories and TypeScript typing; no shader-level edits unless required for r181 API changes.
- Capture module dependencies (textures, UI assets) in manifest for deterministic bundling.

---

## 4. Feature Specifications

### 4.1 Noise & Procedural Toolkit
- Curate perlin/simplex/curl/voronoi/fbm suites with multi-octave helpers and normalization utilities, exposing presets for materials and compute fields.【F:DOCS/proposal v1/TSLStudio — Comprehensive Development Plan v1.0.md†L166-L186】【F:RESOURCES/REPOSITORIES/TSLwebgpuExamples/tsl-particle-waves/src/script.js†L31-L76】
- Provide 2D/3D/4D adapters, gradient outputs, and tiling options; integrate storage-texture-based noise generators for compute initialization.【F:RESOURCES/REPOSITORIES/portfolio examples/portfolio-main/src/utils/webgpu/noise-generator/simplex2DNoiseTexture.ts†L1-L80】

### 4.2 Materials Library
- PBR stack with clearcoat, sheen, anisotropy, iridescence, transmission; layered BRDF nodes referencing official docs for defaults.【F:DOCS/proposal v1/tsl-toolkit-architecture.md†L30-L117】【F:RESOURCES/three.js-r181/examples/jsm/tsl/display/BloomNode.js†L12-L41】
- Stylized materials (glass blob, outline, halftone) from portfolio/blog demos packaged as presets with color/edge controls.【F:RESOURCES/REPOSITORIES/portfolio examples/blog.maximeheckel.com-main/core/components/MDX/Widgets/TSLWebGPU/glassblob.ts†L1-L160】【F:RESOURCES/REPOSITORIES/TSLwebgpuExamples/test-webgpu-master/src/test2/MeshCustomNodeMaterial.js†L1-L160】

### 4.3 Post-Processing Suite
- Cinematic pipeline: tonemap (ACES), Bloom, Anamorphic, DOF (CoC), Motion Blur, SSR, GTAO, SSGI, TRAA blending.【F:RESOURCES/REPOSITORIES/TSLwebgpuExamples/ssgi-ssr-painter/src/script.js†L68-L120】【F:RESOURCES/three.js-r181/examples/jsm/tsl/display/AnamorphicNode.js†L1-L120】
- Provide `makePostChain()` builder with pass ordering validation, MRT attachments, and bandwidth optimization toggles (byte type overrides).【F:RESOURCES/REPOSITORIES/TSLwebgpuExamples/ssr-gtao-keio/src/script.js†L84-L125】

### 4.4 Compute Systems
- Particle framework (position/velocity buffers, forces, pointer interactions) with high/low presets for desktop/mobile.【F:RESOURCES/REPOSITORIES/TSLwebgpuExamples/tsl-compute-particles/src/script.js†L35-L239】
- Wave/cloth/instanced compute utilities for grid-based deformation.【F:RESOURCES/REPOSITORIES/TSLwebgpuExamples/tsl-particle-waves/src/script.js†L31-L110】
- Fluid solver module (advect, divergence, pressure solve) with barrier scheduling and optional blur/lighting stages.【F:DOCS/proposal v1/TSLStudio — Comprehensive Development Plan v1.0.md†L241-L254】

### 4.5 Agent-Ready APIs
- TypeScript factories (`makeMaterial`, `makePostChain`, `createParticleSim`) return typed handles with `update`, `dispose`, and introspection metadata.【F:DOCS/proposal v1/tsl-toolkit-architecture.md†L74-L117】
- JSON schema DSL with allow-listed node types, range bounds derived from presets, and optional `dangerous` flag for raw WGSL kernels.【F:DOCS/proposal v1/tsl-toolkit-architecture.md†L74-L152】

### 4.6 Utilities & Tooling
- Device capability probing (limits, features) gating compute/post combos.【F:RESOURCES/REPOSITORIES/TSLwebgpuExamples/ssgi-ssr-painter/src/script.js†L37-L49】
- Performance budgeter with GPU timestamp queries, delta warnings, and preset downscaling (SSR resolution, compute workgroup).【F:RESOURCES/REPOSITORIES/TSLwebgpuExamples/ssr-gtao-keio/src/script.js†L110-L125】
- Inspector UI (derived from blog widgets) for embedding interactive diagrams and Sandpack demos.【F:RESOURCES/REPOSITORIES/portfolio examples/blog.maximeheckel.com-main/core/components/MDX/Widgets/TSLWebGPU/Sandpack.tsx†L1-L160】

---

## 5. API & Schema Design

### 5.1 TypeScript Surface
- `import { makeMaterial } from '@tslstudio/tsl-kit/materials'` returning NodeMaterial builders with typed layer descriptors and defaults.
- `import { makePostChain } from '@tslstudio/tsl-kit/post'` accepting array of `[pass, params]`, inferring parameter types from schema definitions.
- `import { createParticleSim } from '@tslstudio/tsl-kit/compute'` constructing compute passes with `init`, `update`, `hitTest` hooks for interactions.【F:DOCS/proposal v1/tsl-toolkit-architecture.md†L74-L117】

### 5.2 JSON Schema DSL
- `kind: 'material' | 'post' | 'compute' | 'pipeline'` with nested nodes referencing registry keys; Zod schemas enforce numeric bounds, color formats, optional textures.
- Graph compiler resolves nodes into TSL expressions, verifies ported module availability, and attaches provenance metadata for diagnostics.【F:DOCS/proposal v1/tsl-toolkit-architecture.md†L119-L152】

### 5.3 Preset Catalog Metadata
- Each preset stores description, provenance source (`portfolio-main`, `tsl-compute-particles`, etc.), expected GPU cost, fallback recommendations.
- Expose search API for agent queries (by tags: `particles`, `fluid`, `ssgi`, etc.) referencing module inventory taxonomy.【F:DOCS/proposal v1/TSLStudio — Comprehensive Development Plan v1.0.md†L307-L320】

---

## 6. Quality Standards

### 6.1 Testing & Verification
- **Visual**: Golden image diff per preset with ΔE < 2 threshold; nightly comparisons against source renders.【F:DOCS/proposal v1/TSLStudio — Comprehensive Development Plan v1.0.md†L69-L75】
- **Performance**: GPU timing budgets (post chain <5 ms, compute <6 ms) with adaptive resolution fallback triggers.【F:DOCS/proposal v1/tsl-toolkit-plan.md†L5-L12】【F:RESOURCES/REPOSITORIES/TSLwebgpuExamples/ssr-gtao-keio/src/script.js†L110-L125】
- **Schema**: 100% validation coverage for JSON DSL, including boundary fuzz tests for floats/ints.
- **Regression**: WebGPU renderer smoke tests on desktop (Chrome, Edge) and fallback path on WebGL for capability banners.

### 6.2 Documentation & UX
- Interactive docs embedding Sandpack demos, compute diagrams, and slider controls derived from blog widgets.【F:RESOURCES/REPOSITORIES/portfolio examples/blog.maximeheckel.com-main/core/components/MDX/Widgets/TSLWebGPU/SimpleCompute.tsx†L1-L80】
- Canvas-first website ensures persistent engine state with accessible controls and reduced-motion modes.【F:DOCS/proposal v1/TSLStudio — Comprehensive Development Plan v1.0.md†L60-L74】

---

## 7. Migration Strategy (Three.js r181)

1. **Imports**: Use `three/webgpu` and `three/tsl` namespaces exclusively; replace legacy `examples/jsm` imports (documented divergence between r170 legacy and r181 current).【F:RESOURCES/THREEJS_TSL_knowladge_DOCS/TSL-WebGPU-Complete-Reference.md†L446-L471】
2. **Async Init**: Enforce `await renderer.init()` (R3F promise-based `gl`) to avoid pre-init render errors.【F:RESOURCES/THREEJS_TSL_knowladge_DOCS/Complete-WebGPU-TSL-Ecosystem-Guide.md†L76-L108】
3. **TSL API Updates**: Replace deprecated node factories with `Fn`, `wgslFn`, `instancedArray`, `pass` wrappers showcased in portfolio/blog compute examples.【F:RESOURCES/REPOSITORIES/TSLwebgpuExamples/tsl-compute-particles/src/script.js†L35-L154】【F:RESOURCES/REPOSITORIES/portfolio examples/blog.maximeheckel.com-main/core/components/MDX/Widgets/TSLWebGPU/computeInstance.ts†L24-L120】
4. **MRT Pipelines**: Adopt new `pass().setMRT(mrt({ ... }))` APIs for SSR/GTAO/SSGI compatibility.【F:RESOURCES/REPOSITORIES/TSLwebgpuExamples/ssr-gtao-keio/src/script.js†L84-L123】
5. **Renderer Limits**: Detect `requiredLimits` (e.g., `maxColorAttachmentBytesPerSample`) before enabling heavy post passes.【F:RESOURCES/REPOSITORIES/TSLwebgpuExamples/ssgi-ssr-painter/src/script.js†L37-L49】
6. **Texture Precision**: Provide toggles to downgrade MRT textures to `UnsignedByteType` when needed (sampled from official examples).【F:RESOURCES/REPOSITORIES/TSLwebgpuExamples/ssr-gtao-keio/src/script.js†L96-L103】
7. **WGSL Assets**: Integrate `.wgsl` utilities via bundler loaders with schema-registered functions (`psrdnoise`, matrix utils).【F:RESOURCES/REPOSITORIES/TSLwebgpuExamples/test-webgpu-master/src/wgsl/psrdnoise3.wgsl†L1-L160】

Checklist deliverable: Migration guide enumerating replacements, lint rules, and automated codemods for imports.

---

## 8. Risk Assessment

| Risk | Impact | Mitigation |
| --- | --- | --- |
| **Feature Gating**: WebGPU feature variance (MRT bytes per sample, timestamp queries) can disable high-end pipelines on lower-end GPUs. | Loss of SSR/SSGI or inaccurate perf telemetry. | Implement capability probing before enabling passes; provide dynamic fallbacks and UI messaging.【F:RESOURCES/REPOSITORIES/TSLwebgpuExamples/ssgi-ssr-painter/src/script.js†L37-L120】 |
| **Compute Budget Overruns**: High particle counts (500k+) may exceed budget on integrated GPUs. | Frame drops or device resets. | Offer tiered presets, expose adaptive workgroup sizing, integrate perf budget alerts.【F:RESOURCES/REPOSITORIES/TSLwebgpuExamples/tsl-compute-particles/src/script.js†L7-L239】 |
| **Schema Drift**: Ported modules may expose undocumented uniforms leading to invalid agent prompts. | Runtime errors or undefined visuals. | Attach provenance metadata, auto-generate schema from source defaults, enforce validation before compilation.【F:DOCS/proposal v1/tsl-toolkit-architecture.md†L74-L152】 |
| **UI Coupling**: Blog widgets rely on design-system components. | Slows documentation integration. | Extract pure rendering logic into reusable hooks, stub UI dependencies in docs app.【F:RESOURCES/REPOSITORIES/portfolio examples/blog.maximeheckel.com-main/core/components/MDX/Widgets/TSLWebGPU/SimpleCompute.tsx†L1-L80】 |
| **Legacy Example Divergence**: Some assets (fluidglass, archived sandboxes) target WebGL. | Porting them directly may require shader rewrites. | Prioritize WebGPU-ready repos; mark legacy ones as optional backlog conversions with extra review. |

---

**Next Steps:** Align implementation plan, confirm phase schedule, and begin porting with high-priority compute/post pipelines backed by automated schema validation.
