# TSLStudio Product Requirements Document (PRD) v2

## 1. Executive Summary
TSLStudio will deliver a self-contained, plug-and-play TSL/WebGPU engine on top of Three.js r181+ that bundles production-ready noise fields, materials, post-processing, and compute systems exposed through typed, agent-addressable APIs.【F:DOCS/proposal v1/tsl-toolkit-plan.md†L1-L12】 Success is defined by:
- **Coverage**: Port and harden 150+ proven TSL/WebGPU modules covering noise, SDFs, materials, post-FX, and compute workflows.【F:DOCS/proposal v1/# 📚 TSLStudio  readme comprewhensive plan.md†L9-L113】
- **Reliability**: Maintain source parity with the original working examples—only adapt imports, types, and schema wrappers to minimize regressions.【F:DOCS/proposal v1/proposal.md†L1-L38】
- **Usability**: Ship ergonomic TypeScript APIs and JSON-schema validated agent DSL so materials, post stacks, and compute sims can be constructed from prompts or presets.【F:DOCS/proposal v1/tsl-toolkit-architecture.md†L76-L138】
- **Performance**: Match or exceed baseline WebGPU examples by enforcing frame budgets, device capability gates, and automated visual regression checks.【F:DOCS/proposal v1/tsl-toolkit-architecture.md†L48-L72】

## 2. Technical Architecture
### 2.1 Runtime Stack
- Three.js r181+ WebGPURenderer with async initialization inside React Three Fiber (R3F) canvases to guarantee backend readiness.【F:DOCS/proposal v1/tsl-toolkit-architecture.md†L5-L22】
- NodeMaterials/TSL as the primary shader authoring path; WebGL fallbacks provided only for capability banners.【F:DOCS/proposal v1/tsl-toolkit-architecture.md†L5-L9】
- Package layout organized under `packages/tsl-kit` with feature-specific subfolders (materials, post, compute, util, presets) and shared inspector/debug tooling.【F:DOCS/proposal v1/tsl-toolkit-architecture.md†L24-L63】

### 2.2 Module Boundaries
- **Materials**: Node builders and presets for PBR layers, structure generators, and surface looks.
- **Post**: Pass factories wired through `THREE.PostProcessing`, supporting tonemapping, bloom, glare, DoF, filmic effects, motion, and ambient GI stubs.【F:DOCS/proposal v1/tsl-toolkit-architecture.md†L38-L46】
- **Compute**: Ping-pong helpers, particle/fluids kernels, WGSL escape hatches, all feature-gated by device caps.【F:DOCS/proposal v1/tsl-toolkit-architecture.md†L48-L51】
- **Utilities**: Capability detection, performance budgets, fallback materials, schema validation, graph compiler, and preset loaders.【F:DOCS/proposal v1/tsl-toolkit-architecture.md†L52-L63】
- **APIs/DSL**: `makeMaterial`, `makePostChain`, `createParticleSim`, plus JSON schemas for agent-safe graph definitions.【F:DOCS/proposal v1/tsl-toolkit-architecture.md†L76-L151】

## 3. Resource Inventory & Port Strategy
### 3.1 Portfolio Examples (Priority Source)
| Category | Representative Modules | Port Priority | Dependencies & Notes |
| --- | --- | --- | --- |
| Noise & Procedural | `simplexNoise3d`, `perlin`, `curl`, `fbm` TSL nodes for volumetric fields and flow maps.【F:RESOURCES/REPOSITORIES/portfolio examples/fragments-boilerplate-main/src/tsl/noise/simplex_noise_3d.ts†L1-L58】 | High | Shared `common` helpers; drop-in under `materials/noise`. |
| Post-FX | LCD/pixellation/speckled/vignette effects built on `THREE.PostProcessing` with MRT setup.【F:RESOURCES/REPOSITORIES/portfolio examples/fragments-boilerplate-main/src/tsl/post_processing/post_processing.tsx†L1-L42】【F:RESOURCES/REPOSITORIES/portfolio examples/fragments-boilerplate-main/src/tsl/post_processing/lcd_effect.ts†L1-L41】 | High | Ports into `post/ported/maxime`, requires canvas utility wrappers. |
| Lighting Utilities | Fresnel, hemispheric, diffuse, and phong specular helpers for layered materials.【F:RESOURCES/REPOSITORIES/portfolio examples/fragments-boilerplate-main/src/tsl/utils/lighting.ts†L1-L60】 | High | Compose into PBR core; no external deps. |
| Compute/Particles UX | WGSL-driven instancing demo with async compute dispatch and height-driven coloring.【F:RESOURCES/REPOSITORIES/portfolio examples/blog.maximeheckel.com-main/core/components/MDX/Widgets/TSLWebGPU/computeInstance.ts†L1-L195】 | High | Provides patterns for `compute/pingpong` and inspector widgets. |
| Scene Widgets | Particle diagrams, sandboxes, fallback nodes for MDX docs (UX inspiration).【F:RESOURCES/REPOSITORIES/portfolio examples/blog.maximeheckel.com-main/core/components/MDX/Widgets/TSLWebGPU/ParticleCompute.tsx†L1-L60】 | Medium | Port only supporting components that visualize compute graphs. |
| WebGPU Utilities | Noise nodes, SDFs, rotation helpers, pointer inputs, demo scenes for particles, SDF materials, flow fields, dissolves.【F:RESOURCES/REPOSITORIES/portfolio examples/portfolio-main/src/utils/webgpu/nodes/noise/simplexNoise4d.ts†L1-L155】 | High | Provide comprehensive field library; requires adapter to TypeScript strict mode. |

### 3.2 TSL/WebGPU Example Repositories
| Category | Representative Modules | Port Priority | Dependencies & Notes |
| --- | --- | --- | --- |
| Compute Particles | Noise-driven instanced particle system with WGSL compute, dynamic attraction, buffer disposal.【F:RESOURCES/REPOSITORIES/TSLwebgpuExamples/test-webgpu-master/src/test1/ParticlesCompute.js†L1-L93】 | High | Ideal source for `compute/particles` engine; adapt to typed configs. |
| Curl Noise Particle Systems | Standalone TSL noise utilities and particle orchestrators (`three.js-tsl-particles-system`).【F:RESOURCES/REPOSITORIES/TSLwebgpuExamples/three.js-tsl-particles-system-master/src/tsl/curlNoise3d.js†L1-L40】* | Medium | Reuse noise math for motion field presets. |
| Sandbox Effects | Raging sea, portals, volumetrics, raymarching, halftone—broad coverage for presets. | High | Mirror folder structure under `ported/sandbox`. |
| WGSL Helpers | Matrix composition/look-at WGSL modules for compute pipelines.【F:RESOURCES/REPOSITORIES/TSLwebgpuExamples/test-webgpu-master/src/wgsl/mat4-compose.wgsl†L1-L80】* | Medium | Feed into compute utility library. |
*Use `head` extracts during porting to confirm module signatures.

### 3.3 Official Three.js r181 WebGPU Examples
| Category | Representative Examples | Port Priority | Notes |
| --- | --- | --- | --- |
| Post-Processing | Bloom pass pipeline wiring `pass(scene,camera)` with `THREE.PostProcessing` and inspector controls.【F:RESOURCES/three.js-r181/examples/webgpu_postprocessing_bloom.html†L1-L171】 | High | Serves as canonical reference for `post` adapters and inspector integration. |
| Compute | 200k-particle WebGPU compute pipeline using instanced arrays, click interactions, WGSL Fn nodes.【F:RESOURCES/three.js-r181/examples/webgpu_compute_particles.html†L1-L189】 | High | Baseline for compute orchestration, performance thresholds, and event handling. |
| Materials | Raging sea TSL material layering waves noise, emissive responses, normal reconstruction.【F:RESOURCES/three.js-r181/examples/webgpu_tsl_raging_sea.html†L1-L185】 | High | Provides end-to-end PBR + TSL example to benchmark our presets. |

## 4. Feature Specifications
### 4.1 Noise & Procedural Toolkit
- Ship 3D/4D simplex, Perlin, Worley, FBM, curl noise, turbulence, and SDF primitives directly ported from the portfolio examples and TSL sandbox repositories.【F:RESOURCES/REPOSITORIES/portfolio examples/fragments-boilerplate-main/src/tsl/noise/simplex_noise_3d.ts†L1-L58】【F:RESOURCES/REPOSITORIES/portfolio examples/portfolio-main/src/utils/webgpu/nodes/noise/simplexNoise4d.ts†L1-L155】
- Provide flow-field generators, triplanar mapping helpers, and field combinators for agent-driven structures.

### 4.2 Material System
- Core PBR node stack with clearcoat, sheen, anisotropy, iridescence, diffusion variants, and lighting utilities imported verbatim.【F:RESOURCES/REPOSITORIES/portfolio examples/fragments-boilerplate-main/src/tsl/utils/lighting.ts†L1-L60】
- Preset surfaces (car paint, skin, cloth, water, hologram) wrap ported node trees with JSON-schema parameter definitions for automation.【F:DOCS/proposal v1/tsl-toolkit-architecture.md†L24-L63】
- Provide serialized graph snapshots for inspector previews and regression testing.

### 4.3 Post-Processing Pipeline
- `makePostChain` composes passes (tonemap, bloom, glare, DoF, film grain, LUTs) using ported effect nodes; ensure compatibility with `THREE.PostProcessing` MRT setups.【F:RESOURCES/REPOSITORIES/portfolio examples/fragments-boilerplate-main/src/tsl/post_processing/post_processing.tsx†L1-L42】【F:RESOURCES/three.js-r181/examples/webgpu_postprocessing_bloom.html†L36-L139】
- Include noise-based stylization effects (LCD, speckled, weave) as optional pass blocks.【F:RESOURCES/REPOSITORIES/portfolio examples/fragments-boilerplate-main/src/tsl/post_processing/lcd_effect.ts†L1-L41】

### 4.4 Compute Modules
- Particle simulator: initialize/update kernels, buffer orchestration, hit interactions, and WGSL hooks derived from `test-webgpu-master` and official examples.【F:RESOURCES/REPOSITORIES/TSLwebgpuExamples/test-webgpu-master/src/test1/ParticlesCompute.js†L1-L93】【F:RESOURCES/three.js-r181/examples/webgpu_compute_particles.html†L31-L189】
- Instancing utilities: grid initialization, wave-based displacement, and color modulation patterns for instanced meshes.【F:RESOURCES/REPOSITORIES/portfolio examples/blog.maximeheckel.com-main/core/components/MDX/Widgets/TSLWebGPU/computeInstance.ts†L61-L142】
- Fluid/cloth stubs: leverage WGSL modules in the repositories for future phases.

### 4.5 Agent-Ready APIs & Schemas
- TypeScript wrappers returning materials, post composers, compute sims with `update`, `dispose`, and inspector metadata.【F:DOCS/proposal v1/tsl-toolkit-architecture.md†L76-L118】
- JSON schemas (zod) capping parameter ranges (e.g., noise frequency, pass intensity) to guard against prompt injection.【F:DOCS/proposal v1/tsl-toolkit-architecture.md†L119-L151】

## 5. API Design Overview
| API | Purpose | Key Inputs | Outputs |
| --- | --- | --- | --- |
| `makeMaterial(spec, opts?)` | Compile TSL layer graph into `MeshPhysicalNodeMaterial`. | Graph schema (layers, mappings, IBL). | NodeMaterial instance + metadata (uniforms, inspector hooks).【F:DOCS/proposal v1/tsl-toolkit-architecture.md†L86-L105】 |
| `makePostChain(passes, opts?)` | Assemble ordered post-processing passes. | Array of `[id, params]`, device caps. | Composer with `render()`, `update()`, screenshot harness.【F:DOCS/proposal v1/tsl-toolkit-architecture.md†L102-L107】 |
| `createParticleSim(config)` | Build compute kernels + buffer state. | Particle count, field presets, spawn/lifetime. | Simulation controller exposing `compute`, `dispose`, inspector bindings.【F:DOCS/proposal v1/tsl-toolkit-architecture.md†L108-L117】 |
| `loadPreset(type, name)` | Fetch curated module configurations. | Preset namespace + name. | Deep-cloned spec ready for compilation. |
| `compileGraph(json)` | Agent DSL compiler with validation. | JSON spec validated via zod. | Compiled NodeMaterial/Post chain + error set.【F:DOCS/proposal v1/tsl-toolkit-architecture.md†L119-L151】 |

## 6. Quality Standards
- **Visual Parity**: Golden renders for every preset; Delta-E ≤ 2 relative to source examples.
- **Performance**: Default demos must sustain ≥ 60 FPS on desktop adapters matching official WebGPU examples; compute modules run ≤ 4 ms per dispatch with instrumentation via `util/budget` timers.【F:DOCS/proposal v1/tsl-toolkit-architecture.md†L48-L55】
- **Stability**: All modules expose `dispose()` and guard resources (buffers, textures) for deterministic cleanup.【F:RESOURCES/REPOSITORIES/TSLwebgpuExamples/test-webgpu-master/src/test1/ParticlesCompute.js†L80-L92】
- **Documentation**: Each module ships with code comments, schema docs, and inspector presets referencing source origin.

## 7. Three.js r181 Migration Strategy
1. **Imports**: Ensure all modules import from `three/webgpu` and `three/tsl` (no legacy `examples/jsm/nodes`).【F:RESOURCES/three.js-r181/examples/webgpu_postprocessing_bloom.html†L25-L45】
2. **Async Renderer Init**: Wrap R3F `Canvas` with async `gl` returning `await renderer.init()` to match r181 requirements.【F:DOCS/proposal v1/tsl-toolkit-architecture.md†L14-L22】
3. **PostProcessing**: Use new `THREE.PostProcessing` API and `pass(scene,camera)` nodes; migrate old composer scripts accordingly.【F:RESOURCES/three.js-r181/examples/webgpu_postprocessing_bloom.html†L97-L139】
4. **Compute Pipelines**: Adopt `renderer.compute`/`computeAsync` flow with instanced array nodes and WGSL functions.【F:RESOURCES/three.js-r181/examples/webgpu_compute_particles.html†L69-L189】
5. **Material Nodes**: Align with `MeshStandardNodeMaterial` patterns showcased in r181 samples (e.g., wave normals, emissive nodes).【F:RESOURCES/three.js-r181/examples/webgpu_tsl_raging_sea.html†L62-L185】
6. **Inspector Hooks**: Use `renderer.inspector.createParameters` for runtime tweaking, enabling parity with upstream examples.【F:RESOURCES/three.js-r181/examples/webgpu_postprocessing_bloom.html†L115-L143】
7. **Capability Gates**: Query adapter limits via `navigator.gpu.requestAdapter()` wrappers and fall back gracefully when WebGPU is unavailable.【F:DOCS/proposal v1/tsl-toolkit-architecture.md†L5-L9】

## 8. Risk Assessment & Mitigations
| Risk | Impact | Mitigation |
| --- | --- | --- |
| Diverging Three.js APIs (future r182+) | Breaking imports or API signatures. | Track upstream changelog; maintain adapter layer isolating imports and inspector integration. |
| Performance regressions when composing many passes | Frame drops below target FPS. | Enforce `util/budget` telemetry, add adaptive quality toggles, provide preset guidelines. |
| Agent misuse via DSL (unsafe parameters) | GPU crashes or extreme values. | Validate via zod schemas, clamp inputs, require explicit `dangerous` flag for custom WGSL. |
| Resource leaks in compute modules | Memory exhaustion over long sessions. | Mandate `dispose()` in ported modules and add automated leak tests covering buffer lifecycle.【F:RESOURCES/REPOSITORIES/TSLwebgpuExamples/test-webgpu-master/src/test1/ParticlesCompute.js†L80-L92】 |
| WebGPU availability variance | Feature gaps on unsupported hardware. | Provide minimal WebGL fallback messaging, degrade gracefully to non-node materials, and surface diagnostics in inspector. |

