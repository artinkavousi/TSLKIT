# Best Practices Observed During Collection

## 1. TSL Composition Patterns

- **Modular nodes first** – Every complex effect decomposes into tiny TSL helpers (see `RESOURCES/REPOSITORIES/portfolio examples/portfolio-main/src/utils/webgpu/nodes/noise/curlNoise4d.ts`). Keep individual functions pure and parameterized so they port without side effects.
- **Shared `common.ts` helpers** – Both Fragments and Portfolio use `_source/common.ts`-style helpers (e.g., `fragments-boilerplate-main/src/tsl/noise/common.ts`) to normalize inputs (UVs, transforms). Mirroring this reduces duplicated code and keeps noise/utility functions consistent.
- **Graph-first mindset** – Official nodes such as `RESOURCES/three.js-r181/src/nodes/core/Node.js` and `.../lighting/AnalyticLightNode.js` never reference renderer internals directly; they emit AST fragments that the WebGPU backend consumes. Maintain this separation when wrapping legacy WebGL snippets.

## 2. WebGPU Pipeline Construction

- **Explicit resource layout** – Files inside `RESOURCES/three.js-r181/src/renderers/webgpu/nodes/` (e.g., `BindGroupNode.js`, `StorageBufferNode.js`) declare bind groups and buffer usages up front. When porting compute demos from `TSLwebgpuExamples`, promote ad-hoc buffer bindings into these canonical nodes.
- **WGSL parity** – WGSL shaders in demos (`TSLwebgpuExamples/**/shaders/*.wgsl`) always mirror a TypeScript sidecar that defines struct layouts. Keep those definitions colocated and typed so validation stays trivial.
- **No hidden `device.lost` handling** – Production-ready samples (Splash, Flow, Roquefort) rely on the WebGPU renderer to handle context loss. Avoid sprinkling manual `device` retries; instead, wire into the renderer’s `onDeviceError` hook as shown in `RESOURCES/three.js-r181/src/renderers/webgpu/WebGPURenderer.js`.

## 3. Post-Processing & Effects

- **Layered composers** – Official passes under `examples/jsm/postprocessing` use node-based materials (`AfterimagePassNode`, `BloomNode`, `TRAANode`) instead of raw shader chunks. Adopt the same approach so passes can run identical code paths on WebGL (`EffectComposer`) and WebGPU (`NodePass`).
- **Data-driven color pipelines** – Portfolio’s color grading utilities (`src/app/lab/color-grading/tonemap.ts`, `src/utils/webgpu/nodes/math/cosinePalette.ts`) expose parameters via JSON config. Build a shared schema so the agent API can adjust looks dynamically.
- **Temporal accumulators** – Demos like `TSLwebgpuExamples/ssgi-ssr-painter` and `three.js-r181/examples/jsm/tsl/display/TRAANode.js` rely on history buffers. Always reset accumulators whenever resolution, camera FOV, or sample count changes to avoid ghosting.

## 4. Material & MaterialX Notes

- **Dual-path support** – MaterialX nodes under `RESOURCES/three.js-r181/src/nodes/materialx/**` mirror equivalent `tsl` nodes. When porting MaterialX graphs, keep both JS (TSL) and JSON (MaterialX) definitions side-by-side so engines can swap at runtime.
- **Procedural textures** – `tsl-textures-main` keeps every texture purely procedural (no bitmap fallbacks). Port these nodes intact before touching compute/FX so stylized looks remain deterministic.
- **Consistent unit conventions** – Lighting nodes (e.g., `AnalyticLightNode.js`, `TiledLightsNode.js`) assume **scene units = meters**, intensities in **lux**, and IES profiles in lumens. Normalize upstream data to these units to avoid energy spikes.

## 5. File-System Hygiene

- Each copied module retains the original relative path so diffing upstream updates is painless.
- `_source.json` manifests are not regenerated for this drop—`inventory.json` is now the single source of truth. Keep it updated if you manually add/remove files so downstream planning stays accurate.
