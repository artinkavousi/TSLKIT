# TSLStudio Implementation Plan (20 Weeks)

> **Version:** 1.0 — November 8, 2025  
> **Source Assets:** `TSLKit/RESOURCE_SNAPSHOTS/**`, `TSLKit/docs/RESOURCE_port_modules.md`  
> **Guiding Principles:** Direct ports, Three.js r181-native APIs, agent-ready schemas, production quality each phase.

---

## 1. Phase Breakdown (5 phases × 4 weeks)

| Phase | Weeks | Goal | Key Deliverables | Primary Sources |
|-------|-------|------|------------------|-----------------|
| **P1 – Foundation & Audit** | 1–4 | Finish resource ingestion, port lighting/noise/SDF utilities, establish renderer + testing scaffolding | `@tsl-kit/noise`, `@tsl-kit/utils`, renderer factory, Vitest baseline, initial docs | `portfolio-main` nodes, `fragments-boilerplate` utils, official `examples/jsm/tsl` |
| **P2 – Materials & Post Core** | 5–8 | Ship material builders + first post stack, release 15 presets, 10 post effects | `createMaterial`, preset registry, bloom/DOF/TAA pipeline, Material schema metadata | `tsl-textures-main`, `fragments-boilerplate` post, `webgpu_postprocessing_*` |
| **P3 – Compute & Dynamics** | 9–12 | Port particles, fluids, flow fields, histogram utilities, add compute API | Particle & fluid modules, ping-pong helper, Leva inspector for compute | `roquefort-main`, `tsl-compute-particles`, `webgpu_compute_*`, `three.js-tsl-particles-system` |
| **P4 – Advanced Rendering** | 13–16 | Integrate SSR/GTAO/SSGI, MaterialX loader, raymarching kit, timeline demos | GI pass suite, MaterialX importer, raymarch composer, timeline transitions | `ssr-gtao-keio`, `ssgi-ssr-painter`, `examples/materialx`, `three.js-tsl-sandbox` |
| **P5 – Production & Release** | 17–20 | Polish demos, optimize, finalize docs/tests, publish packages & site | Studio site, Storybook, automated benchmarks, CI/CD, npm publish | All sources + analytics tasks |

---

## 2. Sprint-by-Sprint (Day-by-Day) Tasks

Each week assumes a 5-day cadence; adjust if weekends are used.

### Weeks 1–4 (Phase 1 – Foundation)

**Week 1 – Resource validation & tooling**

| Day | Focus | Tasks |
|-----|-------|-------|
| Mon | Repo hygiene | Verify `TSLKit/RESOURCE_SNAPSHOTS/**` checksums, label sources. |
| Tue | Renderer scaffold | Implement async `WebGPURenderer` factory + fallback warnings (`packages/engine/renderer`). |
| Wed | Testing baseline | Configure Vitest + jsdom + Playwright skeleton; add smoke test for renderer init. |
| Thu | Build tooling | Set up ESLint, Prettier, Turborepo tasks, commit hooks. |
| Fri | Docs kickoff | Draft contribution guide + architecture overview referencing PRD. |

**Week 2 – Lighting nodes**

| Day | Focus | Tasks |
|-----|-------|-------|
| Mon | Port `ambient.ts`, `diffuse.ts` | Copy from `portfolio-main/src/utils/webgpu/nodes/lighting` → `packages/tsl-kit/noise/lighting`. |
| Tue | Port `directional.ts`, `hemisphere.ts` | Ensure Fn signatures align with `three/tsl`. |
| Wed | Port `fresnel.ts` + add rim/cook-torrance from official nodes. |
| Thu | Create lighting tests (snapshot numeric outputs) + TS docs. |
| Fri | Demo integration – simple scene toggling lighting nodes in Storybook. |

**Week 3 – Noise library**

| Day | Focus | Tasks |
|-----|-------|-------|
| Mon | Simplex2D/3D/4D nodes + schema metadata. |
| Tue | Curl noise (3D/4D) + turbulence helper from fragments repo. |
| Wed | Voronoi + FBM conversions; ensure seeding support. |
| Thu | Domain warp & octave helpers; add TypeDoc. |
| Fri | Noise showcase demo (animated plane, CLI seeds). |

**Week 4 – SDF & helper utilities**

| Day | Focus | Tasks |
|-----|-------|-------|
| Mon | Port `smooth-Min/Mod`, `remap`, `compose` utilities. |
| Tue | Implement SDF shapes (sphere, box, torus, etc.) referencing sandbox + fragments. |
| Wed | Add operations (smooth union/subtract, displacement). |
| Thu | Create `raymarchScene` helper + tests from `raymarching-tsl-main`. |
| Fri | Phase review; update docs, close issues, prep Phase 2 backlog. |

### Weeks 5–8 (Phase 2 – Materials & Post)

**Week 5 – Material core**

| Day | Focus | Tasks |
|-----|-------|-------|
| Mon | Implement `createMaterial` builder scaffolding + types. |
| Tue | Port base BRDF layers (diffuse/spec/lights) referencing official nodes. |
| Wed | Add clearcoat + sheen nodes. |
| Thu | Add anisotropy + iridescence support. |
| Fri | Create unit tests for parameter ranges + golden renders. |

**Week 6 – Procedural presets**

| Day | Focus | Tasks |
|-----|-------|-------|
| Mon | Convert 10 textures from `tsl-textures-main` (wood, marble, gas-giant, fordite, etc.). |
| Tue | Add additional 10 presets + schema metadata. |
| Wed | Create preset registry + search tags (e.g., `material:organic`). |
| Thu | Storybook preset gallery + agent JSON schemas. |
| Fri | QA & doc updates. |

**Week 7 – Post-processing foundation**

| Day | Focus | Tasks |
|-----|-------|-------|
| Mon | Implement `createPostChain` using TSL `pass()`. |
| Tue | Port Bloom variants (`grain_texture`, `lcd`, `vignette` from fragments). |
| Wed | Port DOF (from `webgpu_postprocessing_dof*.html`), film grain, tonemap nodes. |
| Thu | Add AA (FXAA/SMAA/TRAA) referencing official nodes. |
| Fri | Visual regression tests + doc updates. |

**Week 8 – Post pipeline release**

| Day | Focus | Tasks |
|-----|-------|-------|
| Mon | Integrate selective bloom & mask support (`webgpu_postprocessing_bloom_selective.html`). |
| Tue | Add motion blur + trail passes. |
| Wed | Compose default cinematic chain preset. |
| Thu | Update agent schema for passes, include JSON example. |
| Fri | Phase 2 review + release notes. |

### Weeks 9–12 (Phase 3 – Compute & Dynamics)

**Week 9 – Ping-pong & storage helpers**

| Day | Focus | Tasks |
|-----|-------|-------|
| Mon | Port ping-pong manager from `tsl-compute-particles`. |
| Tue | Implement StorageBuffer helper + typed array uploads. |
| Wed | Add compute test harness (Vitest + mock). |
| Thu | Integrate Stats/perf logging (per `portfolio-main` lab). |
| Fri | Docs for compute API. |

**Week 10 – Particle systems**

| Day | Focus | Tasks |
|-----|-------|-------|
| Mon | Port `ParticlesSystem.js` core loops. |
| Tue | Add force modules (curl, flow field, attractors). |
| Wed | Add emitter presets (burst, trail, surface) from lab demos. |
| Thu | Build inspector UI for particle params. |
| Fri | Snapshot tests + video capture. |

**Week 11 – Fluid / field sims**

| Day | Focus | Tasks |
|-----|-------|-------|
| Mon | Port Roquefort advect/divergence passes. |
| Tue | Pressure solve + Jacobi iterations. |
| Wed | Vorticity confinement + emitter API. |
| Thu | Build 2D fluid demo + ability to switch kernels. |
| Fri | Document tuning guidelines. |

**Week 12 – Integration**

| Day | Focus | Tasks |
|-----|-------|-------|
| Mon | Combine compute outputs with post chain (e.g., fluid + bloom). |
| Tue | Hook compute modules into agent schema. |
| Wed | End-to-end tests (compute + render). |
| Thu | Performance profiling, add adaptive quality toggles. |
| Fri | Phase 3 review. |

### Weeks 13–16 (Phase 4 – Advanced Rendering)

**Week 13 – Screen-space GI**

| Day | Focus | Tasks |
|-----|-------|-------|
| Mon | Port SSR node from `ssr-gtao-keio`. |
| Tue | Port GTAO (`ao` node) + integrate with G-buffer. |
| Wed | Wire SMAA/fallback toggles. |
| Thu | Setup multi-render target structure referencing official MRT examples. |
| Fri | Tests & docs. |

**Week 14 – SSGI & denoise**

| Day | Focus | Tasks |
|-----|-------|-------|
| Mon | Port SSGI painter pipeline. |
| Tue | Add temporal accumulation + neighborhood clamps. |
| Wed | Add history textures + responsive filtering. |
| Thu | Visual QA vs original videos. |
| Fri | Schema + user docs. |

**Week 15 – MaterialX integration**

| Day | Focus | Tasks |
|-----|-------|-------|
| Mon | Integrate `MaterialXLoader` + resource resolver. |
| Tue | Map MaterialX parameters to TSL builder outputs. |
| Wed | Build CLI/tool to convert `.mtlx` into preset JSON. |
| Thu | QA using `examples/materialx/*.mtlx`. |
| Fri | Docs + tutorial. |

**Week 16 – Raymarching & transitions**

| Day | Focus | Tasks |
|-----|-------|-------|
| Mon | Port `raymarching-tsl-main` components into `@tsl-kit/sdf`. |
| Tue | Add timeline-based transitions from `threejs-gsap-liquid-morphology-slideshow`. |
| Wed | Build portal demo referencing sandbox. |
| Thu | Integrate into Studio site as hero. |
| Fri | Phase 4 review. |

### Weeks 17–20 (Phase 5 – Production & Release)

**Week 17 – Docs & Storybook**

| Day | Focus | Tasks |
|-----|-------|-------|
| Mon | Build MDX docs per module with live demos. |
| Tue | Wire Storybook CI + Chromatic. |
| Wed | Author tutorials (lighting, post, compute). |
| Thu | Finalize API reference (TypeDoc). |
| Fri | Content review. |

**Week 18 – QA & performance**

| Day | Focus | Tasks |
|-----|-------|-------|
| Mon | Run Playwright screenshot suite vs golden images. |
| Tue | GPU profiler runs (Chrome tracing). |
| Wed | Memory + load testing. |
| Thu | Fix regressions. |
| Fri | Update metrics dashboards. |

**Week 19 – Packaging & distribution**

| Day | Focus | Tasks |
|-----|-------|-------|
| Mon | Finalize package exports, tree-shaking tests. |
| Tue | Add Changesets + release candidates. |
| Wed | Set up CI publish workflow. |
| Thu | Dry-run npm publish + tag release. |
| Fri | Freeze code, prep announcement posts. |

**Week 20 – Launch**

| Day | Focus | Tasks |
|-----|-------|-------|
| Mon | Production deploy of Studio site. |
| Tue | Publish `@tslstudio/tsl-kit` 1.0. |
| Wed | Social/blog rollout. |
| Thu | Post-launch monitoring + hotfix buffer. |
| Fri | Retrospective + backlog grooming for v1.1. |

---

## 3. Port Mapping Table

| Category | Source Path(s) | Target Module | Owner | Dependencies | Notes |
|----------|----------------|---------------|-------|--------------|-------|
| Lighting nodes | `portfolio-main/src/utils/webgpu/nodes/lighting/*.ts` | `packages/tsl-kit/noise/lighting` | Rendering | TSL Fn helpers | Map one-to-one; add additional models from official nodes. |
| Noise & helpers | `portfolio-main`, `fragments-boilerplate(-vanilla)/src/tsl/noise`, `examples/jsm/tsl/procedural` | `packages/tsl-kit/noise` | Rendering | Device caps for precision | Provide schema metadata (min/max). |
| SDF & raymarch | `fragments-boilerplate`, `three.js-tsl-sandbox`, `raymarching-tsl-main` | `packages/tsl-kit/sdf` | Rendering | Noise nodes | Add surface normal helpers + AO nodes. |
| Material presets | `tsl-textures-main/src/*.js`, `examples/materialx/*.mtlx` | `packages/tsl-kit/materials/presets` | Materials | Material builder core | Convert to TS + TSL nodes; maintain naming. |
| Post effects | `fragments-boilerplate*/src/tsl/post_processing`, `portfolio lab`, `examples/webgpu_postprocessing_*`, `ssr-gtao-keio`, `ssgi-ssr-painter` | `packages/tsl-kit/post` | Rendering | Framegraph, MRT | Use TSL `pass()`; keep effect-specific configs. |
| Compute (particles) | `tsl-compute-particles`, `three.js-tsl-particles-system`, `portfolio lab/fbo-*` | `packages/tsl-kit/compute/particles` | Simulation | Ping-pong helper | Provide CLI to spawn sims from JSON. |
| Compute (fluids) | `roquefort-main/src/simulation` | `packages/tsl-kit/compute/fluids` | Simulation | Texture utils | Keep passes modular (advect/pressure). |
| Agent schemas | Derived from all modules + `tsl-webgpu-companion/examples` | `packages/tsl-kit/schemas` | DX | None | Use Zod; ensure units + slider hints. |
| Website/demos | `portfolio-main/src/app/lab`, `three.js-tsl-sandbox`, `blog.maximeheckel.com-main` | `apps/studio`, `apps/sandbox` | DX | All modules | Each demo references exported modules only. |

---

## 4. Dependency Graph

```
Device Caps & Renderer (Phase 1)
        │
        ▼
TSL Core (Noise, Lighting, SDF)
        │
        ▼
Material Builder & Post Chain (Phase 2)
        │
        ├──────────────┐
        ▼              ▼
Compute Systems   Screen-Space GI (Phase 3 & 4)
        │              │
        └──────┬───────┘
               ▼
Presets, Demos, Agent APIs (Phase 4+5)
```

**Interpretation**
- Renderer + capability detection must land before any high-level work.
- Noise/SDF feed directly into materials and compute; they cannot slip past Phase 1.
- Screen-space GI depends on post chain and MRT support delivered in Phase 2.
- Agent API documentation waits until module schemas are stable (late Phase 2 onwards).

---

## 5. Acceptance Criteria

| Phase | Acceptance Criteria |
|-------|---------------------|
| **P1** | Renderer factory passes async init tests; Lighting/Noise/SDF modules ported with unit tests; docs outlining port workflow published. |
| **P2** | `createMaterial` + 15 presets + 10 post effects available with schemas; demo scenes showing materials + post stack; CI running visual tests. |
| **P3** | Particle + fluid compute modules integrated; inspector UI for compute; automated performance logging; agent schema for compute commands. |
| **P4** | SSR/GTAO/SSGI working with toggles; MaterialX loader converting sample `.mtlx`; raymarch kit powering at least 2 demos. |
| **P5** | Studio site live, docs complete, 90%+ coverage, packages published, release checklist signed. |

Module-level “definition of done” (applies to every port):
1. Source copied verbatim into `packages/**` with attribution.
2. Rewired imports to `three/webgpu` & `three/tsl`.
3. TypeScript types + JSDoc added.
4. Unit test or visual regression recorded.
5. Schema metadata + docs entry complete.

---

## 6. Progress Tracking

### Checklist (update weekly)
- [ ] Lighting utilities (`portfolio-main/.../lighting`)
- [ ] Noise suite (`portfolio-main` & `fragments`)  
- [ ] SDF primitives & operations  
- [ ] Renderer factory + device caps  
- [ ] Material core builder  
- [ ] 50+ material presets (`tsl-textures-main`)  
- [ ] Post effects Phase 1 (bloom, DOF, tonemap)  
- [ ] Post effects Phase 2 (AA, motion blur, LUT)  
- [ ] SSR/GTAO/SSGI suite  
- [ ] Particle simulations  
- [ ] Fluid simulations  
- [ ] Ping-pong + storage helpers  
- [ ] MaterialX loader  
- [ ] Raymarching kit  
- [ ] Agent schema registry  
- [ ] Demo site (Lab, Gallery, Tutorials)  
- [ ] Storybook + MDX docs  
- [ ] CI/CD pipeline + release automation

### Status Dashboard (sample format)

| Module Group | Status | Notes |
|--------------|--------|-------|
| Renderer & tooling | ☐ Not started | Waiting on Phase 1 kickoff. |
| Noise/Lighting/SDF | ☐ | Week 2–4 scope. |
| Materials | ☐ | Depends on Phase 1 completion. |
| Post-FX Core | ☐ | Week 7–8. |
| Compute | ☐ | Week 9+. |
| Advanced GI | ☐ | Week 13+. |
| MaterialX/Raymarch | ☐ | Week 15–16. |
| Docs & Release | ☐ | Week 17+. |

Update statuses during weekly reviews; tie each row to GitHub projects/issues for transparency.

---

## 7. Porting Process Reference

1. Copy source file from `TSLKit/RESOURCE_SNAPSHOTS/**` into target package.
2. Update imports (`three/tsl`, `three/webgpu`), wrap shader logic with `Fn` if needed.
3. Add TypeScript types + doc comments, export via package barrel.
4. Write Vitest(s) +, where visual, add Playwright screenshot scenario referencing original asset.
5. Register schema metadata.
6. Link module in docs + Demo/Storybook.

Use this checklist for every module to ensure uniform quality.

---

## 8. Reporting & Review Cadence

- **Weekly (Friday):** Update progress checklist, review sprint tasks, capture blockers.
- **Phase Gate (Week 4/8/12/16/20):** Demo deliverables, review acceptance criteria, lock next phase scope.
- **Daily Standup:** Highlight porting assignments (lighting/noise/material/post/compute).
- **Artifacts:** Keep PRD + Implementation Plan updated in `TSLKit/docs`. Reference `TSLKit/docs/RESOURCE_port_modules.md` for source mapping during reviews.

---

This plan keeps all resource analysis, scheduling, and quality gates co-located. Update it alongside progress to maintain a trustworthy single source of truth for TSLStudio.
