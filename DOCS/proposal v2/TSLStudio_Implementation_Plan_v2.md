# TSLStudio Implementation Plan v2.0

> **Timeline**: 20 weeks (5 phases)
> **Strategy**: Direct-port first, wrap with typed adapters, validate via schemas

---

## 1. Phase Breakdown (5 Phases / 20 Weeks)
| Phase | Weeks | Objective | Primary Sources |
| --- | --- | --- | --- |
| **Phase 1 – Foundation & Migration** | 1–4 | Stabilize Three.js r181 WebGPU stack, scaffold schema/compiler, set up testing harness and provenance logging. | Architecture blueprint & stack guidance.【F:DOCS/proposal v1/tsl-toolkit-architecture.md†L5-L117】【F:RESOURCES/THREEJS_TSL_knowladge_DOCS/Complete-WebGPU-TSL-Ecosystem-Guide.md†L76-L108】 |
| **Phase 2 – Noise & Materials Library** | 5–8 | Port noise suites, lighting utilities, and baseline PBR/stylized materials with preset scaffolding. | Portfolio examples & fragments boilerplate.【F:DOCS/proposal v1/TSLStudio — Comprehensive Development Plan v1.0.md†L166-L199】【F:RESOURCES/REPOSITORIES/portfolio examples/fragments-boilerplate-main/src/tsl/noise/simplex_noise_4d.ts†L1-L120】 |
| **Phase 3 – Post-Processing & Screen Space** | 9–12 | Integrate cinematic post chain, SSR/GTAO/SSGI, motion blur, and quality toggles. | SSR/GTAO/SSGI repos & official TSL nodes.【F:RESOURCES/REPOSITORIES/TSLwebgpuExamples/ssr-gtao-keio/src/script.js†L84-L167】【F:RESOURCES/REPOSITORIES/TSLwebgpuExamples/ssgi-ssr-painter/src/script.js†L68-L202】【F:RESOURCES/three.js-r181/examples/jsm/tsl/display/BloomNode.js†L1-L116】 |
| **Phase 4 – Compute & Simulation Systems** | 13–16 | Ship particle frameworks, wave/cloth utilities, fluid solver, and perf guardrails. | Compute repositories & fluid toolkit.【F:RESOURCES/REPOSITORIES/TSLwebgpuExamples/tsl-compute-particles/src/script.js†L35-L239】【F:RESOURCES/REPOSITORIES/TSLwebgpuExamples/tsl-particle-waves/src/script.js†L31-L110】【F:DOCS/proposal v1/TSLStudio — Comprehensive Development Plan v1.0.md†L241-L259】 |
| **Phase 5 – Polish, Documentation, QA** | 17–20 | Embed Sandpack docs, finalize JSON schemas, run regression/golden tests, prep presets and release assets. | Blog widgets & quality standards.【F:RESOURCES/REPOSITORIES/portfolio examples/blog.maximeheckel.com-main/core/components/MDX/Widgets/TSLWebGPU/Sandpack.tsx†L1-L160】【F:DOCS/proposal v1/TSLStudio — Comprehensive Development Plan v1.0.md†L69-L75】 |

---

## 2. Sprint-by-Sprint Tasks
| Week | Focus | Key Tasks |
| --- | --- | --- |
| **1** | WebGPU baseline | Upgrade renderer bootstrap (`await renderer.init()`), configure capability probing, add device limit registry.【F:RESOURCES/THREEJS_TSL_knowladge_DOCS/TSL-WebGPU-Complete-Reference.md†L446-L471】【F:RESOURCES/REPOSITORIES/TSLwebgpuExamples/ssgi-ssr-painter/src/script.js†L37-L49】 |
| **2** | Schema scaffolding | Implement Zod schemas for material/post/compute descriptors, wire DSL compiler stubs.【F:DOCS/proposal v1/tsl-toolkit-architecture.md†L74-L152】 |
| **3** | Testing harness | Set up golden image harness & GPU timing metrics, add CLI for provenance manifests.【F:DOCS/proposal v1/tsl-toolkit-plan.md†L5-L12】 |
| **4** | Documentation shell | Integrate Sandpack viewer skeleton for interactive docs, stub design-system wrappers.【F:RESOURCES/REPOSITORIES/portfolio examples/blog.maximeheckel.com-main/core/components/MDX/Widgets/TSLWebGPU/SimpleCompute.tsx†L1-L80】 |
| **5** | Noise adapters | Port simplex/curl/perlin/voronoi nodes with typed wrappers and tests.【F:DOCS/proposal v1/TSLStudio — Comprehensive Development Plan v1.0.md†L166-L186】 |
| **6** | Lighting & utility nodes | Migrate ambient/diffuse/directional/fresnel/hemisphere + smoothing utilities into `materials/core`.【F:DOCS/proposal v1/TSLStudio — Comprehensive Development Plan v1.0.md†L166-L186】 |
| **7** | PBR layers | Adapt PBR presets (clearcoat, sheen, anisotropy, iridescence) and surface presets with schema defaults.【F:DOCS/proposal v1/tsl-toolkit-architecture.md†L30-L117】 |
| **8** | Stylized materials | Port glass blob, outlines, halftone materials; validate emissive/alpha paths.【F:RESOURCES/REPOSITORIES/portfolio examples/blog.maximeheckel.com-main/core/components/MDX/Widgets/TSLWebGPU/glassblob.ts†L1-L160】 |
| **9** | Tonemap & bloom | Wire tonemap, bloom, glare adapters from official nodes; create baseline cinematic preset.【F:RESOURCES/three.js-r181/examples/jsm/tsl/display/BloomNode.js†L1-L116】 |
| **10** | Depth & motion | Integrate DOF, motion blur, film grain; add parameter schemas and guardrails.【F:RESOURCES/three.js-r181/examples/jsm/tsl/display/DepthOfFieldNode.js†L1-L160】 |
| **11** | SSR/GTAO | Port SSR and GTAO passes with MRT plumbing, add bandwidth toggles and quality tiers.【F:RESOURCES/REPOSITORIES/TSLwebgpuExamples/ssr-gtao-keio/src/script.js†L84-L125】 |
| **12** | SSGI & TRAA | Integrate SSGI + TRAA composite chain, add velocity pass instrumentation.【F:RESOURCES/REPOSITORIES/TSLwebgpuExamples/ssgi-ssr-painter/src/script.js†L68-L202】 |
| **13** | Particle core | Port instanced array compute init/update loops, pointer hit testing, preset tiers.【F:RESOURCES/REPOSITORIES/TSLwebgpuExamples/tsl-compute-particles/src/script.js†L35-L239】 |
| **14** | Wave/cloth modules | Adapt wave compute kernels and size modulation utilities, add designable presets.【F:RESOURCES/REPOSITORIES/TSLwebgpuExamples/tsl-particle-waves/src/script.js†L31-L110】 |
| **15** | Fluid solver | Translate roquefort simulation pipeline (advect/divergence/pressure/vorticity) with scheduling helpers.【F:DOCS/proposal v1/TSLStudio — Comprehensive Development Plan v1.0.md†L241-L259】 |
| **16** | Performance tiering | Implement adaptive quality toggles (particle count, SSR resolution, fluid grid) and timestamp-based fallbacks.【F:RESOURCES/REPOSITORIES/TSLwebgpuExamples/ssr-gtao-keio/src/script.js†L110-L125】 |
| **17** | Docs & presets | Publish preset catalog with provenance, embed interactive docs using Sandpack/diagrams.【F:RESOURCES/REPOSITORIES/portfolio examples/blog.maximeheckel.com-main/core/components/MDX/Widgets/TSLWebGPU/Sandpack.tsx†L1-L160】 |
| **18** | QA automation | Run golden renders, schema fuzz tests, perf sweeps; capture metrics dashboard.【F:DOCS/proposal v1/TSLStudio — Comprehensive Development Plan v1.0.md†L69-L75】 |
| **19** | Release prep | Finalize package exports, write migration guide, produce change logs referencing source repos.【F:DOCS/proposal v1/proposal.md†L9-L28】 |
| **20** | Launch & backlog triage | Publish release candidates, triage optional WebGL-to-WebGPU conversions, plan backlog sprints.【F:DOCS/proposal v1/TSLStudio — Comprehensive Development Plan v1.0.md†L292-L304】 |

---

## 3. Port Mapping Table
| Source Module | Target Package Path | Notes |
| --- | --- | --- |
| `portfolio-main/src/utils/webgpu/nodes/noise/simplexNoise4d.ts`【F:RESOURCES/REPOSITORIES/portfolio examples/portfolio-main/src/utils/webgpu/nodes/noise/simplexNoise4d.ts†L1-L80】 | `packages/tsl-kit/noise/simplex/simplexNoise4d.ts` | Preserve `Fn` structure; wrap with TypeScript typing and export alias.
| `portfolio-main/src/utils/webgpu/nodes/lighting/diffuse.ts`【F:RESOURCES/REPOSITORIES/portfolio examples/portfolio-main/src/utils/webgpu/nodes/lighting/diffuse.ts†L1-L80】 | `packages/tsl-kit/materials/core/diffuseNode.ts` | Merge with lighting suite, expose typed builder.
| `fragments-boilerplate-main/src/tsl/noise/curl_noise_4d.ts`【F:RESOURCES/REPOSITORIES/portfolio examples/fragments-boilerplate-main/src/tsl/noise/curl_noise_4d.ts†L1-L80】 | `packages/tsl-kit/noise/curl/curlNoise4d.ts` | Add optional normalization and octave parameters.
| `fragments-boilerplate-main/src/tsl/post_processing/pixellation_effect.ts`【F:RESOURCES/REPOSITORIES/portfolio examples/fragments-boilerplate-main/src/tsl/post_processing/pixellation_effect.ts†L1-L160】 | `packages/tsl-kit/post/pixellation/index.ts` | Adapt React hooks into pure factory returning PostProcessing node.
| `blog.maximeheckel.com/core/components/MDX/Widgets/TSLWebGPU/computeInstance.ts`【F:RESOURCES/REPOSITORIES/portfolio examples/blog.maximeheckel.com-main/core/components/MDX/Widgets/TSLWebGPU/computeInstance.ts†L1-L207】 | `packages/tsl-kit/docs/inspectors/computeInstanceDemo.tsx` | Embed as documentation demo; factor out design-system dependencies.
| `tsl-compute-particles/src/script.js`【F:RESOURCES/REPOSITORIES/TSLwebgpuExamples/tsl-compute-particles/src/script.js†L35-L239】 | `packages/tsl-kit/compute/particles/index.ts` | Convert to reusable simulation class with tier presets and pointer API.
| `tsl-particle-waves/src/script.js`【F:RESOURCES/REPOSITORIES/TSLwebgpuExamples/tsl-particle-waves/src/script.js†L31-L110】 | `packages/tsl-kit/compute/waves/index.ts` | Provide configurable grid sizing & amplitude controls.
| `roquefort-main/src/simulation/*.js`【F:DOCS/proposal v1/TSLStudio — Comprehensive Development Plan v1.0.md†L241-L254】 | `packages/tsl-kit/compute/fluids/*` | Translate compute stages into modular WGSL/TSL kernels with scheduler.
| `ssr-gtao-keio/src/script.js`【F:RESOURCES/REPOSITORIES/TSLwebgpuExamples/ssr-gtao-keio/src/script.js†L84-L167】 | `packages/tsl-kit/post/ssrGtao/index.ts` | Build combined SSR+GTAO preset with MRT configuration and tuning.
| `ssgi-ssr-painter/src/script.js`【F:RESOURCES/REPOSITORIES/TSLwebgpuExamples/ssgi-ssr-painter/src/script.js†L68-L202】 | `packages/tsl-kit/post/ssgi/index.ts` | Extract SSGI + TRAA composite, document required limits.
| `three.js-r181/examples/jsm/tsl/display/BloomNode.js`【F:RESOURCES/three.js-r181/examples/jsm/tsl/display/BloomNode.js†L1-L116】 | `packages/tsl-kit/post/bloom/adapters.ts` | Use official node as canonical implementation; expose schema defaults.
| `test-webgpu-master/src/wgsl/psrdnoise3.wgsl`【F:RESOURCES/REPOSITORIES/TSLwebgpuExamples/test-webgpu-master/src/wgsl/psrdnoise3.wgsl†L1-L160】 | `packages/tsl-kit/wgsl/psrdnoise3.wgsl` | Register with loader, surface builder to convert to TSL `Fn`.

---

## 4. Dependency Graph
```
flowchart TD
  A[packages/tsl-kit/util/deviceCaps] --> B[post/adapter]
  A --> C[compute/pingpong]
  B --> D[post/presets]
  C --> E[compute/presets]
  F[noise suite] --> G[materials/core]
  G --> H[materials/presets]
  F --> E
  D --> I[pipeline compiler]
  E --> I
  H --> I
  I --> J[demo-r3f app]
```
- Utilities feed both post and compute modules; noise flows into materials and compute; pipeline compiler composes outputs for demos and agents.【F:DOCS/proposal v1/tsl-toolkit-architecture.md†L24-L117】

---

## 5. Acceptance Criteria
- **Phase 1**: WebGPU renderer initializes asynchronously, capability registry documented, schema tests passing for empty graphs.【F:RESOURCES/THREEJS_TSL_knowladge_DOCS/Complete-WebGPU-TSL-Ecosystem-Guide.md†L76-L108】【F:DOCS/proposal v1/tsl-toolkit-architecture.md†L74-L117】
- **Phase 2**: Noise/material APIs expose typed builders, presets render within ΔE < 2 of source scenes, parameter validation prevents out-of-range values.【F:DOCS/proposal v1/TSLStudio — Comprehensive Development Plan v1.0.md†L166-L199】【F:DOCS/proposal v1/tsl-toolkit-architecture.md†L74-L117】
- **Phase 3**: Post chain supports bloom/SSR/GTAO/SSGI combinations with MRT toggles and resolution scaling; golden images match references.【F:RESOURCES/REPOSITORIES/TSLwebgpuExamples/ssr-gtao-keio/src/script.js†L84-L167】【F:RESOURCES/REPOSITORIES/TSLwebgpuExamples/ssgi-ssr-painter/src/script.js†L68-L202】
- **Phase 4**: Particle and fluid sims run within 6 ms compute budget at default tiers with adaptive fallbacks logged.【F:RESOURCES/REPOSITORIES/TSLwebgpuExamples/tsl-compute-particles/src/script.js†L35-L239】【F:DOCS/proposal v1/TSLStudio — Comprehensive Development Plan v1.0.md†L241-L259】
- **Phase 5**: Documentation demos embedded, regression suite green across platforms, release notes include provenance and schema diffs.【F:RESOURCES/REPOSITORIES/portfolio examples/blog.maximeheckel.com-main/core/components/MDX/Widgets/TSLWebGPU/Sandpack.tsx†L1-L160】【F:DOCS/proposal v1/TSLStudio — Comprehensive Development Plan v1.0.md†L69-L75】

---

## 6. Progress Tracking Checklist
### Foundation
- [ ] WebGPU renderer bootstrap with async init and feature detection.【F:RESOURCES/THREEJS_TSL_knowladge_DOCS/Complete-WebGPU-TSL-Ecosystem-Guide.md†L76-L108】
- [ ] Schema compiler + provenance manifest generator.【F:DOCS/proposal v1/tsl-toolkit-architecture.md†L74-L152】

### Noise & Materials
- [ ] Simplex/Curl/Perlin/Voronoi nodes wrapped and tested.【F:DOCS/proposal v1/TSLStudio — Comprehensive Development Plan v1.0.md†L166-L186】
- [ ] Lighting utilities and smoothing helpers exported.【F:DOCS/proposal v1/TSLStudio — Comprehensive Development Plan v1.0.md†L166-L186】
- [ ] PBR & stylized presets with JSON schemas.【F:DOCS/proposal v1/tsl-toolkit-architecture.md†L30-L117】

### Post-Processing
- [ ] Tonemap/Bloom/Glare adapters with presets.【F:RESOURCES/three.js-r181/examples/jsm/tsl/display/BloomNode.js†L1-L116】
- [ ] SSR/GTAO/SSGI pipeline integrated with resolution scaling.【F:RESOURCES/REPOSITORIES/TSLwebgpuExamples/ssr-gtao-keio/src/script.js†L84-L167】

### Compute Systems
- [ ] Particle simulation module with pointer interactions.【F:RESOURCES/REPOSITORIES/TSLwebgpuExamples/tsl-compute-particles/src/script.js†L35-L239】
- [ ] Wave/cloth compute module with presets.【F:RESOURCES/REPOSITORIES/TSLwebgpuExamples/tsl-particle-waves/src/script.js†L31-L110】
- [ ] Fluid solver staged with configurable grid sizes.【F:DOCS/proposal v1/TSLStudio — Comprehensive Development Plan v1.0.md†L241-L254】

### Documentation & QA
- [ ] Sandpack-based docs with interactive controls.【F:RESOURCES/REPOSITORIES/portfolio examples/blog.maximeheckel.com-main/core/components/MDX/Widgets/TSLWebGPU/Sandpack.tsx†L1-L160】
- [ ] Golden image & perf regression suite automated.【F:DOCS/proposal v1/TSLStudio — Comprehensive Development Plan v1.0.md†L69-L75】
- [ ] Release notes + migration guide referencing original sources.【F:DOCS/proposal v1/proposal.md†L9-L28】

Progress review occurs end of each week; update checklist and sprint retro notes in repo docs.
