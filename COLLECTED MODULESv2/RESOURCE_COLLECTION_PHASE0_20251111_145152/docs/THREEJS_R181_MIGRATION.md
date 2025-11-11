# Three.js r181 Migration Notes

## 1. Renderer & Device Layer

- `src/renderers/webgpu/WebGPURenderer.js` now owns bind group layout caching and enforces `maxStorageBufferBindingSize`. Ported demos must respect the renderer’s `initCompute()` helpers instead of touching the GPU device directly.
- Descriptor classes (`BindGroupNode.js`, `StorageBufferNode.js`, `SampledTextureNode.js`) formalize how buffers/textures get registered. Update any legacy `renderer.bindingLayouts` references to instantiate these nodes instead.
- `ClippingGroup` (see docs copy in `THREEJSr181-DOCS.txt`, search for “Note: ClippingGroup can only be used with WebGPURenderer”) is WebGPU-only; we must guard usages when running on WebGL.
- WebGPU renderer expects color spaces to be declared explicitly. Use `renderer.setRenderTarget( target, colorSpace )` or the `ColorSpaceNode` adapters rather than relying on global `THREE.ColorManagement` state.

## 2. TSL Core & MaterialX

- The entire TSL runtime lives in `src/nodes/**` and should be imported wholesale (no cherry-picking) to keep tree-shaking intact.
- MaterialX adapters under `src/nodes/materialx/**` mirror one-to-one JS nodes (e.g., `StandardSurface.js`). Keep both sides wired so MaterialX graphs can down-compile to TSL when MaterialX is unavailable at runtime.
- The new transpiler utilities (`examples/jsm/transpiler/TSLEncoder.js`, `TSLParser.js`) replace bespoke build steps. Use them to translate domain-specific DSLs (JSON graphs, GLSL snippets) into TSL ASTs.

## 3. Post-Processing & Display

- Official passes such as `examples/jsm/tsl/display/TRAANode.js`, `TransitionNode.js`, and `AnamorphicNode.js` are now authored as nodes. Do not port shader chunks directly; wire them as node graphs so they work on both WebGL and WebGPU.
- Docs highlight that classic WebGL-only utilities have WebGPU counterparts (e.g., `AnaglyphPassNode` vs. `AnaglyphEffect`). When using `WebGPURenderer`, prefer the node version (documented around line 1556 in `THREEJSr181-DOCS.txt`).
- For SSGI/SSR/Afterimage, the history buffers are implemented with `StorageTextureNode` instead of raw `WebGLRenderTarget`. Maintain this pattern for deterministic resource lifetimes.

## 4. Compute & WGSL

- Compute nodes (`src/nodes/gpgpu/*.js`) expect structured binding descriptions; they automatically create pipelines via `WebGPUComputePipelines`. Import them before porting demo-specific kernels.
- Official WGSL kernels (Bitonic sort, tiled lights) live under `examples/jsm/gpgpu` and `TSLwebgpuExamples`. Each kernel declares the struct layout at the top—keep those definitions synchronized with the corresponding TS wrappers.
- `WebGPUStorageBuffer.js` enforces alignment to 256-byte chunks. Pad custom structs accordingly or dispatches will fail validation.

## 5. Migration Checklist

1. Add `WebGPURenderer` + `WebGPUStorageBufferNode` to the engine bootstrap before touching compute demos.
2. Replace legacy `NodeMaterial` imports with `TSL.js` entry points (the file exposes the canonical exports for r181).
3. Verify each post-processing pass through both `EffectComposer` (WebGL) and `NodePass` (WebGPU). Several passes contain renderer-specific guards.
4. Update MaterialX pipelines so they import from `three/examples/jsm/nodes/materialx/*.js` and keep original XML/JSON graphs versioned next to them.
5. Run the `webgpu_tsl_*` examples as smoke tests once modules are wired; they cover most features we intend to ship (angular slicing, terrain, volumetrics, linked particles).
