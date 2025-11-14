# Port Mapping Matrix

This matrix connects each target package/module to its source implementation and the phase when it should land. Use it to plan pull requests and ensure provenance is tracked.

## Phase 1 — Documentation & Research Assets
| Target Artifact | Source Reference | Purpose |
| --- | --- | --- |
| `TSLENGINE/UNIFIED_PROPOSAL/*.md` | Direct-port planning brief & starter architecture docs.【F:.cursor/proposalchat.md†L14-L167】【F:RESOURCES/DOCS/engine_first_web_gpu_r_3_f_ai_cms_starter_final_merge_r_180.md†L1-L192】 | Establish shared context, inventory, and task breakdowns. |
| Migration Notes | three.js r181 documentation & example listings.【F:RESOURCES/THREEJS_TSL_knowladge_DOCS/THREEJSr181-DOCS.txt†L1-L90】【F:RESOURCES/THREEJS_TSL_knowladge_DOCS/THREEJSr181-WEBGPU_EXAMPLES.txt†L1-L112】 | Capture import path changes, renderer initialization patterns, and example coverage. |

## Phase 2 — Core Engine Skeleton
| Target Module | Source Asset | Integration Surface | Notes |
| --- | --- | --- | --- |
| `packages/tsl-kit/src/noise/simplexNoise3d.ts` | `fragments-boilerplate-main/src/tsl/noise/simplex_noise_3d.ts` | Base noise exports consumed by materials & compute presets.【F:RESOURCES/REPOSITORIES/portfolio examples/fragments-boilerplate-main/src/tsl/noise/simplex_noise_3d.ts†L1-L58】 | Keep helper imports intact; map alias paths. |
| `packages/tsl-kit/src/post/grainTexture.ts` | `fragments-boilerplate-main/src/tsl/post_processing/grain_texture_effect.ts` | Post-processing chain building block with Fn wrapper.【F:RESOURCES/REPOSITORIES/portfolio examples/fragments-boilerplate-main/src/tsl/post_processing/grain_texture_effect.ts†L1-L10】 | Wrap with preset-friendly factory. |
| `packages/tsl-kit/src/presets/textures/*` | `tsl-textures-main/src/*.js` | Ready-to-use procedural textures for presets gallery.【F:RESOURCES/REPOSITORIES/portfolio examples/tsl-textures-main/src/tsl-textures.js†L3-L57】 | Convert to TypeScript modules; attach schema metadata. |
| `apps/studio/app/layout.tsx` | Engine-first starter layout & ThreeRoot pattern.【F:RESOURCES/DOCS/engine_first_web_gpu_r_3_f_ai_cms_starter_final_merge_r_180.md†L43-L192】 | Persistent canvas with async WebGPU init and overlay UI. |

## Phase 3 — Advanced Modules & Guardrails
| Target Module | Source Asset | Integration Surface | Notes |
| --- | --- | --- | --- |
| `packages/tsl-kit/src/compute/{particles,fluid}.ts` | `TSLwebgpuExamples/tsl-compute-particles/src/script.js` & fluid demos | Core particle + fluid simulation presets with WGSL kernels and dispatch metadata.【F:RESOURCES/REPOSITORIES/TSLwebgpuExamples/tsl-compute-particles/src/script.js†L1-L200】 | Wrap kernels in config objects so runtime can orchestrate workgroup sizes and capability checks. |
| `packages/tsl-kit/src/materials/advanced/*` | Portfolio thin-film/transmission examples.【F:RESOURCES/REPOSITORIES/portfolio examples/portfolio-main/src/app/lab/snowflakes/Snowflakes.ts†L1-L200】 | Provide hero-ready physical materials with metadata for CMS exposure. |
| `packages/tsl-kit/src/post/{bloom,motionBlur,depthOfField}.ts` | three.js r181 WebGPU post-processing examples (bloom, motion blur, DOF).【F:RESOURCES/THREEJS_TSL_knowladge_DOCS/THREEJSr181-WEBGPU_EXAMPLES.txt†L71-L94】 | Express post pipelines as declarative chains for agents. |
| `packages/tsl-kit/src/runtime/{deviceCapabilities,initWebGPUScene}.ts` | Compute demo feature guards & lifecycle patterns.【F:RESOURCES/REPOSITORIES/TSLwebgpuExamples/tsl-compute-particles/src/script.js†L71-L154】 | Add capability verification, telemetry, and disposal registries. |

## Phase 4 — Website, CMS, and Ops
| Target Module | Source Asset | Integration Surface | Notes |
| --- | --- | --- | --- |
| `apps/studio/components/{EngineCanvas,PresetSelector,PresetDetails}.tsx` | Engine-first starter inspector overlays & lab controls.【F:RESOURCES/DOCS/engine_first_web_gpu_r_3_f_ai_cms_starter_final_merge_r_180.md†L43-L192】 | Connect runtime telemetry, preset registry, and UI selectors. |
| `apps/studio/app/{portfolio,lab,admin}/page.tsx` | Starter site route templates & CMS flows.【F:RESOURCES/DOCS/engine_first_web_gpu_r_3_f_ai_cms_starter_final_merge_r_180.md†L43-L192】 | Deliver portfolio hero scenes, lab controls, and release checklists backed by presets. |
| `docs/` knowledge base | Planning artifacts + new API references.【F:DOCS/proposal v1/proposal.md†L1-L198】【F:.cursor/proposalchat.md†L14-L167】 | Publish guides for humans and agents; keep citations to source modules. |
| CI/CD workflows | Starter GitHub workflow templates.【F:RESOURCES/DOCS/engine_first_web_gpu_r_3_f_ai_cms_starter_final_merge_r_180.md†L43-L105】 | Enforce lint/test/image diff gates before deploy. |

Track this table in tandem with the resource inventory to schedule sprints and to avoid duplicating port work across teams.
