# RESOURCE_port_modules — Available Resources Analysis

> **Last updated:** November 8, 2025  
> **Snapshot root:** `TSLKit/RESOURCE_SNAPSHOTS/`  
> **Goal:** Provide an actionable catalog of every WebGPU/TSL/MaterialX asset copied into the new `TSLKit` workspace so we can plan direct ports without re-discovering source material.

The new `TSLKit` folder mirrors each upstream repository that previously lived under `RESOURCES/**`. All references below point to the copied paths so we can diff, annotate, and eventually delete upstream mirrors safely.

---

## 1. Portfolio Examples Snapshot

### 1.1 `portfolio-main` (Maxime Heckel)

| Module Set | Source Path | Dependencies | Priority | Effort | Notes |
|------------|-------------|--------------|----------|--------|-------|
| Lighting TSL nodes (`ambient.ts`, `diffuse.ts`, `directional.ts`, `fresnel.ts`, `hemisphere.ts`) | `TSLKit/RESOURCE_SNAPSHOTS/portfolio_examples/portfolio-main/src/utils/webgpu/nodes/lighting/*.ts` | Pure `three/tsl`; no external deps | **High** | 6–8h | Battle-tested BRDF building blocks; match TODO list items exactly. |
| Noise nodes (`classicNoise3d.ts`, `simplexNoise{2,3,4}d.ts`, `curlNoise{3,4}d.ts`, `voronoi.ts`) | `.../nodes/noise/*.ts` | `three/tsl` math utils | **High** | 1 day | Includes all variations requested in TODO; perfect drop-in for `@tsl/noise`. |
| Helpers (`smooth-min.ts`, `smooth-mod.ts`, `compose.ts`, `remap.ts`, `rotate-3d-y.ts`) | `.../nodes/*.ts` | None | Medium | 4h | Utility graph nodes needed for SDFs and transitions. |
| Pointer abstractions (`Pointer.ts`, `PointerNoDom.ts`) | `.../src/utils/webgpu/Pointer*.ts` | DOM pointer events | Medium | 3h | Provides consistent pointer uniforms; good agent control hook. |
| Noise texture generator (`noise-generator/simplex2DNoiseTexture.ts`) | `.../noise-generator/` | GPU ping-pong setup | Medium | 1 day | Useful for pregenerating textures for PostFX and compute seeds. |
| 30+ Lab demos (`fbo-particles`, `particles-morphing-2`, `flow-field`, `magic-wand-cursor`, etc.) | `.../src/app/lab/*` | FrameGraph wrapper, Leva UI | **High** | 1–2 days per demo | Full WebGPU pipelines showing post chains, compute passes, interactivity. Provides copy-ready feature slices. |

**Notes:**
- Each lab demo exports a TSX page plus shared `BaseExperience.ts` and `ExperimentLayout.tsx`, making it straightforward to port as Storybook/R3F examples.
- Materials lean on `MeshPhysicalMaterial` today; when porting, swap to NodeMaterial via the same TSL nodes already present.

### 1.2 `fragments-boilerplate-main`

| Module Area | Source Path | Assets | Priority | Effort | Notes |
|-------------|-------------|--------|----------|--------|-------|
| Post-processing TSL effects (`canvas_weave_effect.ts`, `grain_texture_effect.ts`, `lcd_effect.ts`, `pixellation_effect.ts`, `speckled_noise_effect.ts`, `vignette_effect.ts`) | `TSLKit/RESOURCE_SNAPSHOTS/portfolio_examples/fragments-boilerplate-main/src/tsl/post_processing/` | 6 reusable passes + JSX composer | **High** | 1.5 days | Already structured as composable nodes; minimal glue needed. |
| Noise utilities (`curl_noise_*`, `fbm.ts`, `perlin_noise_3d.ts`, `simplex_noise_{3,4}d.ts`, `turbulence.ts`, `common.ts`) | `.../src/tsl/noise` | 8 functions | High | 1 day | Complement `portfolio-main` by adding FBM/turbulence flavors. |
| Utility suites (color palette & tonemap, bloom helpers, median filter, SDF ops) | `.../src/tsl/utils/{color,function,math,sdf}` | 12+ helper files | Medium | 1 day | Good baseline for `@tsl/utils`. |
| React components for inspector/debug (`components/canvas/*`, `components/debug/*`) | `.../src/components` | Canvas wrappers, Leva panels | Medium | 2 days | Provide ready-made playground UIs. |

### 1.3 `tsl-textures-main`

- **Location:** `TSLKit/RESOURCE_SNAPSHOTS/portfolio_examples/tsl-textures-main/src/`
- **Inventory:** 60+ procedural texture recipes (`karst-rock.js`, `gas-giant.js`, `protozoa.js`, `dalmatian-spots.js`, `marble.js`, `turbulent-smoke.js`, `wood.js`, etc.) plus shared `tsl-textures.js` and `tsl-utils.js`.
- **Use:** Each file exports a fully parameterized node graph mixing noise, palette math, and layering. Perfect source for the “50+ material presets” requirement.
- **Port plan:** Wrap each texture as `createMaterialPreset(name, schema)` referencing the same TSL fragments; ensure seeds/scale parameters become agent-addressable.

### 1.4 `blog.maximeheckel.com-main`

- **Location:** `TSLKit/RESOURCE_SNAPSHOTS/portfolio_examples/blog.maximeheckel.com-main/core/`
- **Highlights:**
  - `core/features/IndexSection` contains complete WebGPU GPGPU demo (particle retargeting) plus ASCII post (`postprocessing/ascii.glsl`).
  - `core/components/MDX/Widgets/VolumetricLighting/*` provides volumetric fog, scattering, and shadow demos in modular JS.
  - Numerous GLSL/JS utilities for raymarching, caustics, volumetric lighting, and article widgets that can be rewritten in TSL.
- **Priority:** Medium—these examples show polished UX and camera choreography that can serve as templates for the “canvas-first” website scenes.

---

## 2. TSLwebgpuExamples Snapshot

### 2.1 `fragments-boilerplate-vanilla-main`

- **Location:** `TSLKit/RESOURCE_SNAPSHOTS/TSLwebgpuExamples/fragments-boilerplate-vanilla-main/src/`
- Contains plain-JS equivalents of the React toolkit above, useful when we need framework-agnostic samples.
- Includes `tsl/post_processing` suite identical to the React repo plus vanilla canvas bootstrapping and shader galleries.

### 2.2 `three.js-tsl-sandbox-master`

- **Location:** `.../TSLwebgpuExamples/three.js-tsl-sandbox-master/`
- Houses 25+ standalone demos (`vfx-tornado`, `procedural-terrain`, `raging-sea`, `sliced-material`, `particles-flow-field`, etc.), each with its own `script.js` and assets.
- **Value:** Provides diverse reference implementations for raymarching, portal compositing, layered post stacks, and instanced NodeMaterials.
- **Plan:** Treat each folder as a porting unit—copy shaders/TSL blocks, wrap them into `examples/` stories, and ensure camera controls align with TSLStudio conventions.

### 2.3 Simulation & Compute Sources

| Repo | Path | Capabilities | Priority | Notes |
|------|------|--------------|----------|-------|
| `roquefort-main` | `.../roquefort-main/src/simulation/*.js` | 2D fluid solver (advect, divergence, pressure, vorticity), emitters, camera UI | **Critical** | Already split into passes—map directly to compute pipelines. |
| `tsl-compute-particles` | `.../tsl-compute-particles/src/script.js` | Storage-buffer particle sim with WGSL & TSL bridges | High | Clean minimal example for base `createParticleSim`. |
| `three.js-tsl-particles-system-master` | `.../src/tsl/*` + `ParticlesSystem.js` | Modular particle forces, GPU buffer layouts, GUI controls | High | Great reference for schema + runtime inspector. |
| `tsl-particle-waves` | `.../tsl-particle-waves/src/` | Wave interference & curl-field attractors | Medium | Emphasizes procedural fields + post fog. |
| `interactwave-main` & `fluidglass-main` | `.../(src|app)` | Interactive ripple/fluids | Medium | Provide UI interactions + pointer feedback loops. |

### 2.4 Screen-Space & Advanced Post

- `ssr-gtao-keio` (`.../src/script.js`): Implements GTAO, SSR, SMAA, multi-pass post composer on WebGPU. Critical for Phase 4.
- `ssgi-ssr-painter` (`.../src/script.js`): Adds SSGI painterly denoise pipeline.
- `threejs-gsap-liquid-morphology-slideshow`: Complex timeline-driven scene transitions blending TSL materials and GSAP curves.
- `raymarching-tsl-main`: React-based signed-distance scenes with modular raymarching components ready for port into our SDF toolkit.
- `fluid-triangle-ANSCII` & `test-webgpu-master`: Lightweight shader toys showcasing ASCII post, MRT masks, and sandboxes.

### 2.5 Companion Docs

- `tsl-webgpu-companion/examples/`: curated collection linking TSL functions to visuals—ideal for documentation screenshots and API references.

---

## 3. Official Three.js r181 & MaterialX

### 3.1 Example Addons (copied wholesale)

| Category | Path | Contents | Port Use |
|----------|------|----------|----------|
| TSL Nodes & helpers | `TSLKit/RESOURCE_SNAPSHOTS/threejs_r181/examples/jsm/tsl/` | Core node definitions (`display/*`, `lighting/*`, `math/*`, `procedural/*`) | Ground truth for API signatures, ensures parity when extending. |
| Materials | `.../examples/jsm/materials/` | NodeMaterial subclasses (LDraw, Line, Water, Sky, etc.) | Reference for structuring custom NodeMaterials + hooking into renderer. |
| Post-processing | `.../examples/jsm/postprocessing/` | Pass implementations (Bloom, Bokeh, Film, SSAO, SSR, ThinFilm, etc.) | Many effects already ported to WebGPU—use as baseline for ours. |
| Utilities | `.../examples/jsm/utils/WebGPUTextureUtils.js`, `.../capabilities/WebGPU.js` | WebGPU capability probing, texture helpers | Reuse for feature gating/device budgets. |

### 3.2 WebGPU HTML Examples

- Copied all `webgpu_*.html` into `TSLKit/RESOURCE_SNAPSHOTS/threejs_r181/examples/webgpu/` (100+ files).
- Coverage spans compute (audio, cloth, fluid, particles), MRT, tiled lighting, post-processing (AO, SSR, SSAO, TRAA, motion blur), instancing, GLTF materials (anisotropy, iridescence, transmission), and XR.
- Each HTML references bundled JS modules under `examples/jsm`; they show canonical renderer init (`new WebGPURenderer`, `await renderer.init()`), async asset loading, and camera setups. Use them to verify we stay compliant with r181 patterns.

### 3.3 MaterialX Assets

- `TSLKit/RESOURCE_SNAPSHOTS/threejs_r181/examples/materialx/` contains MaterialX `.mtlx` test graphs (sheen, thin-film, transmission, IOR tests) plus texture resources.
- `examples/jsm/loaders/MaterialXLoader.js` is included with dependencies—direct template for integrating MaterialX nodes into our Material factory.

---

## 4. Port Priority Matrix

| Capability | Source(s) | Target Package | Priority | Risk & Dependencies |
|------------|-----------|----------------|----------|---------------------|
| Lighting & BRDF nodes | `portfolio-main/src/utils/webgpu/nodes/lighting`, `examples/jsm/tsl/display/LightingModelNode.js` | `packages/tsl-kit/materials/core` | **Critical (Phase 1)** | Ensure API parity with r181 TSL naming; double-check `Fn` signature changes noted in `THREEJSr181-DOCS.txt`. |
| Noise & SDF | `portfolio-main`, `fragments-boilerplate(-vanilla)`, `raymarching-tsl-main`, `tsl-textures-main` | `packages/tsl-kit/noise` & `packages/tsl-kit/sdf` | High | Some source files rely on GLSL string nodes—convert to proper TSL nodes; need tests for domain warp combos. |
| Procedural materials / MaterialX | `tsl-textures-main`, `examples/materialx`, `examples/jsm/loaders/MaterialXLoader.js` | `packages/tsl-kit/presets/materials` | High | Build JSON schema for each preset; ensure MaterialX translation outputs NodeBuilder graph not raw shader strings. |
| Post-processing | `fragments-boilerplate*`, `portfolio lab demos`, `examples/jsm/postprocessing`, `webgpu_postprocessing_*.html` | `packages/tsl-kit/post` | **Critical** | Update passes to new `PassNode` APIs; maintain compatibility with renderer framegraph. |
| Compute & simulations | `roquefort-main`, `tsl-compute-particles`, `three.js-tsl-particles-system`, `webgpu_compute_*.html` | `packages/tsl-kit/compute` | **Critical** | Need storage buffer helpers + barrier management; rely on `three/examples/jsm/utils/WebGPUTextureUtils.js`. |
| Screen-space effects | `ssr-gtao-keio`, `ssgi-ssr-painter`, `webgpu_postprocessing_ss{r,gi,ao}.html` | `packages/tsl-kit/post/gi` | High | Multi-pass dependencies: G-buffer, history textures, TAA. Build underlying framegraph first. |
| Agent-ready APIs & schema | All above + `tsl-webgpu-companion` | `packages/tsl-kit/util/schema.ts` | High | Need TypeScript + Zod definitions; ensure per-module metadata (ranges, defaults) captured while porting. |

---

## 5. Approach & Pattern Recommendations

1. **Adopt Maxime Heckel’s pipeline for authoring** (`portfolio-main`): clean separation between TSL nodes (`src/utils/webgpu`) and demos (`src/app/lab`). Keep this structure so modules stay reusable and demos remain slim.
2. **Use Fragments boilerplates for UI & post stacks:** they already bundle Leva/TanStack router, debug overlays, and a curated post chain. Ideal start for our `packages/studio` playground.
3. **Look to Three.js official examples for API correctness:** all new WebGPU features (async renderer init, `WebGPUTextureUtils`, MaterialX loader) are in `examples/jsm`. When in doubt, mirror those imports exactly to avoid regressions during future r181.x upgrades.
4. **Pull heavy-duty compute from Roquefort & SSR repos:** they expose full pipelines (multiple passes, ping-pong buffers, Stats integration). Reuse their sequencing, only swapping imports/types.
5. **Avoid rewriting older GLSL shaders unless necessary:** if a repo (e.g., `threejs-gsap-liquid-morphology-slideshow`) still uses raw GLSL, first look for equivalent functionality already provided in `examples/jsm/tsl`. Only convert to TSL when no node-based version exists.

---

### Next Actions

1. Log each module above into `TSLStudio_Implementation_Plan` with source → target mappings.
2. Create automated checksums for copied resources (optional) to detect upstream drift.
3. Start tagging “golden” demos (portfolio lab, sandbox vfx) for screenshot-based regression tests once ports land.

