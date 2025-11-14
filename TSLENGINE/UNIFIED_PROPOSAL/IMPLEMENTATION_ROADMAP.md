# Implementation Roadmap (Four Phases)

The roadmap balances research, direct ports, and website integration so every phase ends with a verifiable, production-ready milestone. Tasks are grouped into agent-sized work packets with explicit entry/exit criteria.

## Phase Execution Status (Updated through Phase 4)
| Phase | Status | Evidence |
| --- | --- | --- |
| Phase 1 – Research & Prep | ✅ Complete | Monorepo scaffolding (`package.json`, `tsconfig.base.json`), module inventory committed in `RESOURCE_INVENTORY.md`, and capability probes implemented in `packages/tsl-kit/src/runtime/deviceCapabilities.ts`. |
| Phase 2 – Core Skeleton | ✅ Complete | `packages/tsl-kit` publishes noise, lighting, material APIs with tests, and `apps/studio` Next.js shell renders the WebGPU canvas via `EngineCanvas`. |
| Phase 3 – Feature Expansion | ✅ Complete | Compute presets (`packages/tsl-kit/src/compute`), advanced material catalogue, post-processing chains, and deterministic coverage tests in `packages/tsl-kit/src/__tests__`. |
| Phase 4 – Website Integration | ✅ Complete | Multi-route Next.js site (`apps/studio/app/{portfolio,lab,admin}`) with preset selector UI and telemetry overlays wired into `initWebGPUScene`. |

## Phase 1 — Research, Alignment, and Infrastructure Prep
**Objective:** Build shared understanding of available assets, migration constraints, and automation scaffolding before touching runtime code.

### Key Tasks
- Inventory all WebGPU/TSL assets inside `RESOURCES/REPOSITORIES` and `RESOURCES/three.js-r181/examples`, tagging each with port priority, dependencies, and risk notes.【F:.cursor/proposalchat.md†L14-L110】【F:RESOURCES/THREEJS_TSL_knowladge_DOCS/THREEJSr181-WEBGPU_EXAMPLES.txt†L1-L112】
- Document Three.js r181 import changes, async renderer patterns, and fallback requirements informed by the planning brief.【F:.cursor/proposalchat.md†L52-L167】
- Stand up the planning workspace (this folder) including summary, quick start, inventory, and port mapping docs to enable parallel execution.【F:.cursor/proposalchat.md†L131-L167】
- Confirm baseline website architecture from the engine-first starter and note integration seams for the engine packages.【F:RESOURCES/DOCS/engine_first_web_gpu_r_3_f_ai_cms_starter_final_merge_r_180.md†L1-L192】

### Deliverables
- Completed `RESOURCE_INVENTORY.md` and `PORT_MAPPING.md` checklists with effort estimates.
- Captured migration notes and risks appended to each module family.

### Exit Criteria
- Every targeted module has a source path, target namespace, priority tag, and known blockers.
- Async WebGPU init expectations and fallback policy are documented.

## Phase 2 — Core Skeleton and Minimal Engine Slice
**Objective:** Establish the runnable host app and port the minimal feature set (noise, base materials, essential post-FX) to prove the workflow end-to-end.

### Key Tasks
- Lift `fragments-boilerplate-main` as the rendering shell, keeping its WebGPU-friendly utilities (noise, post effects) intact while wrapping exports under `packages/tsl-kit` namespaces.【F:DOCS/proposal v1/proposal.md†L32-L126】【F:RESOURCES/REPOSITORIES/portfolio examples/fragments-boilerplate-main/src/tsl/noise/simplex_noise_3d.ts†L1-L58】【F:RESOURCES/REPOSITORIES/portfolio examples/fragments-boilerplate-main/src/tsl/post_processing/grain_texture_effect.ts†L1-L10】
- Implement async WebGPU initialization in the persistent `<Canvas>` and verify WebGL fallback path matches the starter layout.【F:DOCS/proposal v1/proposal.md†L65-L126】【F:RESOURCES/DOCS/engine_first_web_gpu_r_3_f_ai_cms_starter_final_merge_r_180.md†L109-L192】
- Port the texture/pattern library from `tsl-textures-main` to seed presets and validate schema wrappers for agent access.【F:RESOURCES/REPOSITORIES/portfolio examples/tsl-textures-main/src/tsl-textures.js†L3-L57】
- Produce golden tests (image diff or shader unit harness) for at least one noise node, one material preset, and one post chain per acceptance criteria in the brief.【F:DOCS/proposal v1/proposal.md†L84-L126】

### Deliverables
- `packages/tsl-kit` skeleton with `noise`, `materials`, `post`, `util`, and `presets` directories.
- Working Next.js page embedding the canvas + baseline scene using ported modules.
- Automated regression harness for the initial presets.

### Exit Criteria
- Engine packages build and run inside the website skeleton with WebGPU renderer initialized asynchronously.
- Baseline presets render within expected bounds on reference hardware without shader modifications.

## Phase 3 — Feature Expansion and Systems Hardening
**Objective:** Broaden the engine feature set with compute, advanced materials, and control surfaces while tightening guardrails.

### Key Tasks
- Port compute simulations (particles, fluids) from TSL examples, preserving WGSL kernels and instanced storage buffer flows.【F:.cursor/proposalchat.md†L131-L158】【F:RESOURCES/REPOSITORIES/TSLwebgpuExamples/tsl-compute-particles/src/script.js†L1-L200】
- Integrate portfolio lab modules (e.g., Snowflakes) as reference implementations for storage buffers, tweakpane controls, and disposal flows.【F:RESOURCES/REPOSITORIES/portfolio examples/portfolio-main/src/app/lab/snowflakes/Snowflakes.ts†L1-L200】
- Expand post-processing suite (bloom variants, DOF, motion blur) using the curated three.js r181 examples list to prioritize parity with upstream demos.【F:.cursor/proposalchat.md†L84-L167】【F:RESOURCES/THREEJS_TSL_knowladge_DOCS/THREEJSr181-WEBGPU_EXAMPLES.txt†L12-L90】
- Finalize JSON-schema DSL, capability detection, and fail-safe disposers across the module surface.【F:DOCS/proposal v1/proposal.md†L39-L170】

### Deliverables
- Extended `compute`, `post`, and `materials` packages with agent-ready factories and schema validation.
- Demo scenes exercising each module category with performance telemetry hooks via `createSceneFromPreset`.
- Guardrail utilities (caps detection, disposal registry, fallback materials) and new inspector telemetry store.

### Exit Criteria
- All high-priority modules demonstrate feature completeness with deterministic tests.
- Capability gating and disposal utilities prevent crashes/leaks during sustained use.

## Phase 4 — Website Integration, Content, and Release Ops
**Objective:** Finish the website, CMS, and agent workflows while preparing deployment and documentation assets for public release.

### Key Tasks
- Wire CMS routes, admin dashboards, and AI assistants from the engine-first starter so creative and dev modes can control the engine presets.【F:RESOURCES/DOCS/engine_first_web_gpu_r_3_f_ai_cms_starter_final_merge_r_180.md†L43-L105】
- Populate content templates (home, portfolio, lab) with engine-powered scenes and ensure progressive enhancement/fallback messaging.
- Execute performance sweeps, accessibility reviews, and integration tests across page types before enabling CI/CD pipelines.【F:DOCS/proposal v1/proposal.md†L88-L198】【F:RESOURCES/DOCS/engine_first_web_gpu_r_3_f_ai_cms_starter_final_merge_r_180.md†L1-L192】
- Finalize docs (MDX knowledge base, API reference, agent guides) and publish release playbooks.

### Deliverables
- Production-ready Next.js site with integrated TSL engine, admin tooling, and content pipeline across `/`, `/portfolio`, `/lab`, and `/admin`.
- Deployment automation configured (quality/build/deploy workflows) and documented runbooks (tests, capability gates noted in docs).
- Comprehensive documentation set for users and agents, including preset registries and telemetry coverage notes.

### Exit Criteria
- All website routes render with WebGPU engine features and documented fallbacks.
- CI/CD gates enforce linting, testing, and image diff baselines before deployment.
- Release notes and onboarding guides are published.
