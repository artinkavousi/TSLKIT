# TSLStudio Engine PRD (r181+)

> **Version:** 1.0 (November 8, 2025)  
> **Owner:** TSLStudio Engineering  
> **Reference Assets:** `TSLKit/RESOURCE_SNAPSHOTS/**`, `TSLKit/docs/RESOURCE_port_modules.md`, `RESOURCES/THREEJS_TSL_knowladge_DOCS`

---

## 1. Executive Summary

**Vision:** Deliver a self-contained, production-ready TSL/WebGPU engine built on Three.js r181+ that ships 100+ plug-and-play modules (materials, noise, post, compute, MaterialX) with agent-addressable APIs and reference demos.  
**Mission:** Directly port proven examples (`portfolio-main`, `fragments-boilerplate`, `roquefort`, `three.js-tsl-sandbox`, official `webgpu_*` samples) without rewriting shader logic, while wrapping them in typed TypeScript APIs plus JSON schemas for safe automation.

**Success Metrics**
- **Coverage:** ≥100 TSL modules, 50 material presets, 30 post effects, 10 compute systems.
- **Performance:** 60 FPS @ 1080p on RTX 3060 / M1 Pro; <2.5s time-to-interactive for demo hub.
- **Quality:** 90%+ unit/integration test coverage on critical packages; 100% visual regression coverage for hero scenes; zero console errors.
- **DX:** <5 min “Hello material” onboarding; agent requests resolved via schema-validated JSON; 10+ complete examples.

**North-star Deliverable:** Publish `@tslstudio/tsl-kit` + demo site powered entirely by WebGPU NodeMaterials with reproducible presets and scripted post stacks.

---

## 2. Technical Architecture

### 2.1 Stack & Tooling

- Runtime: **Three.js r181+**, **WebGPURenderer** (`import { WebGPURenderer, MeshPhysicalNodeMaterial } from 'three/webgpu'`).
- Shading: **TSL** (`import { Fn, vec3, texture, pass } from 'three/tsl'`).
- Frameworks: React + React Three Fiber (async `gl` factory), Vite 5, TypeScript 5, Vitest, Playwright, Storybook.
- Tooling: ESLint, Prettier, Changesets, Turbo (monorepo tasks), Zod/TypeBox for schemas.

### 2.2 Package Layout

```
packages/
  tsl-kit/
    materials/          # Core BRDF blocks, presets, MaterialX bridge
    post/               # Pass graph + effects (Bloom, SSR, GTAO, TRAA, etc.)
    compute/            # Ping-pong manager, particles, fluids, cloth
    noise/              # All TSL noise + SDF utilities
    utils/              # Device caps, schemata, diagnostics, frame budgets
    schemas/            # JSON/Zod definitions for agent & UI
  engine/
    renderer/           # Async WebGPURenderer factory, fallback detection
    framegraph/         # `pass()` orchestration, history targets
    loaders/            # MaterialX, GLTF, preset loader
    demo/               # Shared demo scaffolding (R3F, Leva, router)
apps/
  studio/               # Canvas-first documentation & gallery
  sandbox/              # Automated QA & screenshot harness
```

### 2.3 Module Taxonomy

| Layer | Core Contents | Notes |
|-------|---------------|-------|
| **Noise & Procedural** | Simplex, curl, FBM, Voronoi, turbulence, domain warp helpers, raymarching SDF ops | Sources: `portfolio-main`, `fragments-boilerplate`, `raymarching-tsl`, official `examples/jsm/tsl/procedural/*`. |
| **Materials** | Physical BRDF layers (clearcoat, sheen, anisotropy, iridescence, transmission), 60+ procedural textures, MaterialX loader | Sources: `tsl-textures-main`, `examples/materialx`, `webgpu_loader_gltf_*`. |
| **Post-FX Chain** | Bloom (dual & selective), DOF, TAA/TRAA, SSR, GTAO, SSGI, AA passes, film/tone/color pipeline | Sources: `portfolio lab`, `fragments-boilerplate`, `ssr-gtao-keio`, `examples/webgpu_postprocessing_*`. |
| **Compute & Simulation** | Particle systems, flow fields, fluids (Roquefort), cloth, GPGPU utilities, ping-pong textures | Sources: `roquefort-main`, `tsl-compute-particles`, official `webgpu_compute_*`. |
| **Agent & UX** | Schema/metadata, preset registry, inspector hooks, typed commands | Sources: existing TODO/architecture docs + `tsl-webgpu-companion`. |

---

## 3. Resource Inventory (Imported into `TSLKit/RESOURCE_SNAPSHOTS`)

| Bundle | Highlights | Port Targets |
|--------|------------|--------------|
| `portfolio-main` | Lighting + noise nodes (`src/utils/webgpu`), 30+ lab pipelines, pointer helpers | `packages/tsl-kit/noise`, `materials/core`, demo gallery. |
| `fragments-boilerplate(-main/-vanilla)` | Post FX TSL modules, utility suites, React + vanilla playgrounds | Post stack foundation + inspector UI. |
| `tsl-textures-main` | 60+ procedural material recipes with shared utils | Material preset catalog & schema definitions. |
| `blog.maximeheckel.com-main` | Volumetric lighting, ASCII post, GPGPU hero scenes | Canvas-first site features & documentation visuals. |
| `roquefort-main`, `tsl-compute-particles`, `three.js-tsl-particles-system` | Fluid & particle compute pipelines | `packages/tsl-kit/compute`. |
| `ssr-gtao-keio`, `ssgi-ssr-painter` | Advanced SSR/GTAO/SSGI passes | Post GI module. |
| `three.js-tsl-sandbox-master`, `threejs-gsap-liquid-morphology-slideshow`, `raymarching-tsl-main`, `fluid-triangle-ANSCII` | Diverse NodeMaterial effects & transitions | Demo gallery + reference for creative presets. |
| Official `three.js-r181/examples/jsm`, `examples/webgpu_*`, `examples/materialx` | Canonical TSL nodes, MaterialX loader, WebGPU html setups | API contracts, compatibility tests, MaterialX bridge. |

Detailed file-level catalog lives in `TSLKit/docs/RESOURCE_port_modules.md`.

---

## 4. Feature Specifications

### 4.1 Noise & Procedural Toolkit
- **Nodes:** Wrap every noise helper from `portfolio-main` and `fragments-boilerplate` into `createNoiseNode(type, params)` with typed params (scale, seed, octaves, warp).
- **SDF Library:** Expand operations (smooth union/subtract/intersect, bend/twist, displacement). Use `raymarching-tsl-main` components as templates for `raymarchScene(config)`.
- **Outputs:** Provide ready-to-use builders (`noiseField3D`, `signedDistance(scene)`) and inspector metadata (value ranges, recommended units).

### 4.2 Materials & MaterialX
- **Core BRDF:** Implement layered builder `createPhysicalMaterial({ base, coat, sheen, anisotropy, transmission, iridescence })` using `MeshPhysicalNodeMaterial`.
- **Procedural Presets:** Convert each `tsl-textures-main/src/*.js` file into factory functions returning NodeMaterial plus schema metadata (colors, tiling, animation speed).
- **MaterialX Loader:** Embed `MaterialXLoader` from `examples/jsm/loaders/MaterialXLoader.js`, expose `loadMaterialX(url, overrides)` returning NodeMaterial + preset JSON snapshot.

### 4.3 Post-Processing Pipeline
- **Pass Graph:** Implement `createPostChain(passes: PostPassDescriptor[])` using TSL `pass()` helper and `WebGPURenderer` framegraph.
- **Effects Portfolio:** Port modules from fragments, SSR/GTAO repos, and official `webgpu_postprocessing_*`. Provide factory per effect with default settings and schema metadata.
- **Temporal Stack:** Bake-in history textures for TAA/TRAA, Motion Blur, SSR/SSGI; integrate ability to query device caps to downgrade gracefully.

### 4.4 Compute Systems
- **Particles:** Provide `createParticleSim({ forces, emitters, buffers })` built from `tsl-compute-particles` & `three.js-tsl-particles-system`. Support instanced rendering + timeline triggers.
- **Fluids:** Port Roquefort passes (advect/divergence/pressure/vorticity) into modular compute kernels; allow 2D + experimental 3D variants.
- **Utility API:** Offer `createPingPongTexture`, `dispatchCompute({ workgroups, bindings })`, and `StorageBufferHelper` wrappers.

### 4.5 Agent & API Surface
- JSON schema registry (`packages/tsl-kit/schemas`) describing every module parameter (type, min/max, step, units, default, tags).
- Command API endpoints:
  - `tslKit.makeMaterial(spec: MaterialSpec): MaterialHandle`
  - `tslKit.makePostChain(spec: PostChainSpec): PostComposer`
  - `tslKit.runCompute(spec: ComputeSpec): ComputeJob`
  - `tslKit.applyPreset(type: 'material' | 'post' | 'compute', name: string, overrides?)`
- Provide `AgentBridge.request(command: AgentCommand)` returning typed results; validate via Zod before mutating runtime.

### 4.6 Demo & Website Expectations
- Canvas-first site (React + Next) using `engine/renderer` for persistence, with sections for Lab, Gallery, Tutorials, Inspector.
- Each demo references modules from packages (no custom shader code) to prove drop-in story.

---

## 5. API Design

### 5.1 TypeScript APIs (draft)

```ts
type NoiseType = 'simplex' | 'curl' | 'fbm' | 'voronoi' | 'noiseTexture2D';

interface NoiseSpec {
  type: NoiseType;
  frequency?: number;
  amplitude?: number;
  seed?: number;
  octaves?: number;
  warp?: number;
}

function makeNoiseNode(spec: NoiseSpec): TSL.Node<vec3>;

interface MaterialLayerSpec {
  baseColor?: ColorInput;
  normal?: Node;
  mask?: Node;
  params?: Record<string, number>;
}

function createMaterial(spec: {
  layers: MaterialLayerSpec[];
  shadingModel?: 'physical' | 'toon' | 'matcap';
}): MeshPhysicalNodeMaterial;

function makePostChain(passes: PostPassDescriptor[], options?: FramegraphOptions): PostComposer;

function createParticleSim(config: ParticleSimConfig): {
  update(dt: number): void;
  mesh: THREE.Points;
};

function registerPreset(kind: 'material' | 'post' | 'compute', preset: PresetDescriptor): void;
```

### 5.2 Agent JSON DSL

- Every module/preset exports a JSON schema (Zod + TypeBox) with metadata:
  ```json
  {
    "id": "tsl.materials.carPaint",
    "version": "1.0.0",
    "params": {
      "flakeDensity": { "type": "number", "min": 0, "max": 1, "default": 0.35, "ui": "slider" },
      "coatColor": { "type": "color", "default": "#ff3300" }
    }
  }
  ```
- Agent sends `{"command":"makeMaterial","preset":"tsl.materials.carPaint","params":{"flakeDensity":0.5}}`.
- Engine validates payload, logs change, emits state snapshot for undo/redo.

---

## 6. Quality Standards

| Area | Requirement |
|------|-------------|
| **Testing** | Vitest unit tests for every module; Playwright + headless WebGPU screenshot diffs for hero scenes; automated compute benchmarks (particles/fluid). |
| **Performance** | Frame budget instrumentation (GPU + CPU) with warnings when >16ms; ability to downscale quality automatically via `deviceCaps`. |
| **Visual Parity** | Each ported module includes before/after capture referencing original repo commit; we store golden PNG/GIF assets. |
| **Docs & DX** | TypeDoc-generated reference, MDX recipes, live parameter inspector, code samples for every API. |
| **Compliance** | No console warnings/errors; TypeScript strict mode; ESLint clean; semantic versioning with Changesets. |

---

## 7. Migration Strategy (Three.js r181)

**Key Considerations (per `RESOURCES/THREEJS_TSL_knowladge_DOCS/THREEJSr181-DOCS.txt`):**

1. **Import Paths:**  
   - Renderer + Node materials now live under `three/webgpu`.  
   - All TSL primitives under `three/tsl` (e.g., `import { Fn, pass, hash } from 'three/tsl'`).  
   - Update all legacy `three/examples/jsm/...` imports to new scoped ones whenever possible.

2. **Async Renderer Init:**  
   - `WebGPURenderer` must call `await renderer.init()` before use. In R3F, return a Promise from `gl` (see docs & `webgpu_*` examples).  
   - Guard non-WebGPU browsers by feature-checking `navigator.gpu` and falling back to `WebGLRenderer` + limited node support.

3. **Pass Graph via `pass()` Helper:**  
   - r181’s TSL introduces `pass({ inputs, outputs, setup })` for framegraph management. When porting old multi-pass code, replace manual `composer.addPass` chains with TSL pass nodes to stay compatible with WebGPU.

4. **NodeMaterial API Adjustments:**  
   - Node uniforms now created via `uniform(float(1.0))` etc; `Fn` wrappers expect explicit return nodes.  
   - Many helpers moved/renamed (`lighting.rim()` now `rimLight`, etc.). Cross-check `examples/jsm/tsl/**` before porting.

5. **Deprecated Patterns:**  
   - `EffectComposer` WebGL-only passes aren’t WebGPU compatible; prefer native TSL passes or `PassNode`.  
   - Raw GLSL chunks should be translated into TSL nodes to benefit from WGSL transpilation.

6. **New Features to Leverage:**  
   - MaterialX loader + tests under `examples/materialx`.  
   - Built-in SSAO/GTAO/SSR nodes (`display/GTAONode.js`, `display/SSRNode.js`).  
   - WebGPU texture utilities for copy/readback (`examples/jsm/utils/WebGPUTextureUtils.js`).  
   - `lines/webgpu/*` modules for fat-line rendering.

7. **Legacy Example Ports (r170→r181):**  
   - Replace `THREE.NodeMaterial()` constructors with `MeshStandardNodeMaterial` etc.  
   - Ensure `renderer.xr` + XR buttons use new `ARButton.createButton(renderer, { requiredFeatures: [...] })` that accepts WebGPU renderers (per docs reference).

**Migration Checklist**
- [ ] Audit every ported module for legacy imports; swap to `three/webgpu`/`three/tsl`.
- [ ] Wrap renderer initialization in async factory; add fallback warnings.
- [ ] Update shader helpers to new TSL signatures (no raw `Node()`, use `Fn` + typed nodes).
- [ ] Replace EffectComposer-only passes with TSL `pass()` equivalents or official nodes.
- [ ] Validate MaterialX assets against `examples/materialx/*.mtlx`.
- [ ] Run official `webgpu_*` examples locally to confirm renderer config before integrating new features.

---

## 8. Risk Assessment

| Risk | Impact | Likelihood | Mitigation |
|------|--------|------------|------------|
| **WebGPU API churn / browser gaps** | Rendering fails on unsupported devices, blocking adoption | Medium | Implement capability detection (`three/examples/jsm/capabilities/WebGPU.js`), provide WebGL fallback for non-critical demos, document requirements upfront. |
| **Shader regressions while porting GLSL → TSL** | Visual mismatch, hard-to-debug nodes | Medium | Port directly from working TSL sources first; when GLSL conversion is unavoidable, add golden images + tests before refactors. |
| **Performance budget overruns (SSR/GTAO/Fluid)** | Drops below 60 FPS, especially on mid-tier GPUs | High | Reuse proven compute pipelines (Roquefort, SSR repos), add dynamic resolution / quality toggles, expose `deviceCaps` gating. |
| **Agent misuse / unstable schema** | Invalid commands crash runtime | Medium | Zod validation + clamped ranges + safe defaults; log/telemetry for agent commands. |
| **Large scope across 20 weeks** | Schedule slip | Medium | Strict phase gates (see Implementation Plan), ship increments every 4 weeks, freeze scope once phase kicks off. |
| **MaterialX parity** | NodeMaterial output diverges from MaterialX reference | Low | Use official `webgpu_loader_materialx.html` scenes as regression tests; implement automated comparisons. |

---

### References
- `TSLKit/docs/RESOURCE_port_modules.md`
- `RESOURCES/THREEJS_TSL_knowladge_DOCS/THREEJSr181-DOCS.txt`
- `RESOURCES/THREEJS_TSL_knowladge_DOCS/THREEJSr181-WEBGPU_EXAMPLES.txt`

