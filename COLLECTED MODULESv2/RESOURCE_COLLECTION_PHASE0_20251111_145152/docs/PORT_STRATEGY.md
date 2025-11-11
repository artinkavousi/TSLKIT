# Port Strategy (Phase 0 Output → Engine Integration)

## 1. Recommended Order of Operations

| Phase | Scope | Prerequisites | Notes |
|-------|-------|---------------|-------|
| A. Node Core | `COLLECTED_MODULES/nodes/threejs-r181-src-nodes/**` | None | Bring over core math/accessor nodes first so every downstream module can compile. Tie in the transpiler shims from `examples/jsm/transpiler` immediately after. |
| B. Noise & Math | `noise/portfolio-main`, `noise/fragments-boilerplate-main`, `noise/tsl-textures-main` | Node Core | Locks in procedural primitives for materials + SDF. Keep both implementations per function to compare performance. |
| C. Materials & MaterialX | `materials/**`, `nodes/**/materialx` | A + B | Wire MaterialX nodes only after math/noise exists, otherwise the MaterialX graphs cannot reduce to TSL nodes. |
| D. Lighting & Pipelines | `lighting/**`, `pipelines/**` | A + C | Port WebGPU renderer + bind group nodes before hooking advanced lighting (tiled lights, volumetrics). |
| E. Compute/Sim | `compute/**` (TSLwebgpuExamples, three.js gpgpu) | A + D | Requires renderer interfaces for storage buffers + compute dispatch. Start with official gpgpu nodes, then layer in the demo-specific logic. |
| F. Post FX & Effects | `postfx/**`, `effects/**` | A–E | Post-processing depends on renderer history buffers and compute utilities. Port official passes first, then stylized fragments. |

## 2. Dependency Highlights

- **Noise → Materials → Pipelines** – Procedural materials in `portfolio-main` import both noise and lighting helpers. Breakage anywhere in noise will cascade through 200+ downstream files.
- **Renderer → Compute** – Every compute demo expects the WebGPU renderer abstraction from `src/renderers/webgpu`. Without it, WGSL kernels will not bind resources (no fallback to WebGL).
- **MaterialX Bridge** – MaterialX nodes under `src/nodes/materialx/**` rely on `TSL.js` transpiler APIs. Keep those bunded as a single package to avoid circular import issues.

## 3. Risk Map

| Module Cluster | Risk | Mitigation |
|----------------|------|------------|
| WebGPU renderer nodes (`pipelines/threejs-r181-src-renderers-webgpu`) | High | Port as-is, do not refactor bind group logic. Cover with smoke tests using `webgpu_postprocessing_*` examples. |
| Third-party demos with GSAP/UI glue (`TSLwebgpuExamples/**/src/App.tsx`) | Medium | Strip UI scaffolding, keep compute/material code. Document any dependencies (Leva, Drei) before removing. |
| Post-processing composer (`postfx/threejs-r181-examples-postprocessing`) | Medium | Validate each pass on both WebGL + WebGPU; TRAA/SSGI rely on double-buffer history. |
| Large compute kernels (SSR/GTAO, soft bodies) | High | Maintain WGSL struct layout comments. Add tests that validate dispatch size vs. buffer length before hooking into runtime. |

## 4. Effort Snapshot (from `inventory.json`)

| Category | Files | Est. Hours | Comment |
|----------|-------|------------|---------|
| Nodes | 608 | 1,419 | Mechanical but large: script the import + lint process. |
| Compute | 212 | 491 | Includes every WGSL kernel – plan parallel workstreams. |
| Noise + Materials | 137 | 283 | Direct ports with minimal adaptation beyond path changes. |
| Pipelines | 19 | 77 | Critical path because WebGPU renderer lives here. |
| PostFX | 36 | 141 | Must land after composer/wgpu renderer. |

## 5. Acceptance Checklist

- [ ] Node core builds inside `packages/tsl-runtime` with no type errors.
- [ ] MaterialX graphs render parity scenes (wood, iridescence) on WebGPU.
- [ ] Compute demos (Flow, Splash, SSR/GTAO) push identical buffer sizes vs upstream.
- [ ] Post-processing chain (Bloom, TRAA, SSR, SSGI) composes without artifacts.
- [ ] Inventory + manifest updated after each import wave.
