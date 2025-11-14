# Resource Inventory & Port Priorities

This inventory enumerates the primary source repositories and examples we will port verbatim. Each entry captures the module categories, notable assets, suggested priority, dependencies, and risks.

## Portfolio Examples — `fragments-boilerplate-main`
| Category | Notable Assets | Priority | Dependencies | Risks/Notes |
| --- | --- | --- | --- | --- |
| Noise & Fields | `tsl/noise/simplex_noise_3d.ts` provides reusable simplex noise with helper imports (`permute`, `taylorInvSqrt`).【F:RESOURCES/REPOSITORIES/portfolio examples/fragments-boilerplate-main/src/tsl/noise/simplex_noise_3d.ts†L1-L58】 | High | Requires `tsl/noise/common` helpers when ported; ensure path aliases map cleanly. | ✅ Ported to `packages/tsl-kit/src/materials/noise` with deterministic tests. |
| Post FX | `tsl/post_processing/grain_texture_effect.ts` and siblings deliver lightweight Fn-wrapped effects that compose easily in node graphs.【F:RESOURCES/REPOSITORIES/portfolio examples/fragments-boilerplate-main/src/tsl/post_processing/grain_texture_effect.ts†L1-L10】 | High | Depends on `three/tsl` Fn utilities; integrate with post composer wrappers. | ✅ Bloom/motion blur/DOF chains now tracked in `packages/tsl-kit/src/post`. |
| Sketch Examples | `sketches/flare-1.ts` demonstrates combining aspect-corrected UVs, loops, and custom palettes for gallery scenes.【F:RESOURCES/REPOSITORIES/portfolio examples/fragments-boilerplate-main/src/sketches/flare-1.ts†L1-L55】 | Medium | Depends on utilities under `src/tsl/utils`; port for demos after core modules. | License is CC BY-NC-SA; ensure attribution in docs. |

## Portfolio Examples — `tsl-textures-main`
| Category | Notable Assets | Priority | Dependencies | Risks/Notes |
| --- | --- | --- | --- | --- |
| Texture Presets | `src/tsl-textures.js` exports >40 procedural textures (brain, marble, caustics, etc.) via named exports for quick composition.【F:RESOURCES/REPOSITORIES/portfolio examples/tsl-textures-main/src/tsl-textures.js†L3-L57】 | High | Some presets reference shared utilities (`tsl-utils.js`); port module tree wholesale. | Validate parameter ranges; wrap with JSON schemas for agent safety. |

## Portfolio Examples — `portfolio-main`
| Category | Notable Assets | Priority | Dependencies | Risks/Notes |
| --- | --- | --- | --- | --- |
| Compute Particles | `Snowflakes.ts` integrates storage buffers, tweakpane controls, and disposal patterns for instanced sprites driven by WebGPU compute.【F:RESOURCES/REPOSITORIES/portfolio examples/portfolio-main/src/app/lab/snowflakes/Snowflakes.ts†L1-L200】 | High | Requires tweakpane UI, storage buffer helpers, and noise modules from shared utils. | ✅ Core compute presets available via `packages/tsl-kit/src/compute`; tweakpane UI optional. |
| WebGPU Utilities | `utils/webgpu/noise/simplexNoise3d.ts` and noise textures extend the compute stack for generative scenes.【F:RESOURCES/REPOSITORIES/portfolio examples/portfolio-main/src/app/lab/snowflakes/Snowflakes.ts†L15-L149】 | Medium | Shares logic with fragments noise; deduplicate via adapters. | Align build tooling (Next.js) with package output. |

## TSL WebGPU Examples Collection
| Category | Notable Assets | Priority | Dependencies | Risks/Notes |
| --- | --- | --- | --- | --- |
| Compute Systems | `tsl-compute-particles/src/script.js` shows 500k sprite compute pipeline with click interactions, instanced arrays, and async compute dispatch.【F:RESOURCES/REPOSITORIES/TSLwebgpuExamples/tsl-compute-particles/src/script.js†L1-L200】 | High | Requires WebGPURenderer, Stats, OrbitControls; ensure async compute wrappers exist. | ✅ Particle + fluid presets translated into declarative configs with capability checks. |
| Additional Demos | Repos like `fluidglass-main`, `roquefort-main`, and `tsl-particle-waves` supply fluids, volumetrics, and wave fields. | Medium | Each has bespoke shaders; port as optional modules after core compute. | Track licensing; some demos may lack explicit reuse terms. |

## three.js r181 Official Examples
| Category | Notable Assets | Priority | Dependencies | Risks/Notes |
| --- | --- | --- | --- | --- |
| Materials & MaterialX | Examples such as `webgpu_clearcoat`, `webgpu_loader_materialx`, `webgpu_materialx_noise` cover advanced BRDFs and MaterialX pipelines.【F:RESOURCES/THREEJS_TSL_knowladge_DOCS/THREEJSr181-WEBGPU_EXAMPLES.txt†L12-L80】 | High | Tie into `three/webgpu` loaders; ensure MaterialX dependencies packaged. | ✅ Thin-film/transmission presets live in `packages/tsl-kit/src/materials/advanced`; MaterialX loaders remain optional backlog. |
| Post Processing | Entries like `webgpu_postprocessing_bloom`, `webgpu_postprocessing_ssgi`, `webgpu_postprocessing_motion_blur` inform the extended FX suite.【F:RESOURCES/THREEJS_TSL_knowladge_DOCS/THREEJSr181-WEBGPU_EXAMPLES.txt†L71-L94】 | High | Many rely on multi-pass render targets; align with engine post chain. | Validate performance budgets; some demos are GPU-intensive. |
| Compute & Simulation | Official `webgpu_compute_particles`, `webgpu_compute_texture_pingpong`, `webgpu_compute_water` show canonical API usage and workgroup sizing.【F:RESOURCES/THREEJS_TSL_knowladge_DOCS/THREEJSr181-WEBGPU_EXAMPLES.txt†L17-L40】 | Medium | Use as secondary reference to confirm port fidelity. | Keep near-upstream to ease future merges. |

## Planning Artifacts
- `DOCS/proposal v1/proposal.md` and `.cursor/proposalchat.md` define the direct-port policy, module taxonomy, and acceptance criteria we must honor.【F:DOCS/proposal v1/proposal.md†L1-L198】【F:.cursor/proposalchat.md†L14-L167】
- `RESOURCES/DOCS/engine_first_web_gpu_r_3_f_ai_cms_starter_final_merge_r_180.md` describes the target website scaffolding and deployment expectations that phases 2–4 must integrate with.【F:RESOURCES/DOCS/engine_first_web_gpu_r_3_f_ai_cms_starter_final_merge_r_180.md†L1-L192】

Use this inventory in tandem with the port mapping table to schedule work across sprints and ensure each asset lands in the correct package namespace without code drift.
