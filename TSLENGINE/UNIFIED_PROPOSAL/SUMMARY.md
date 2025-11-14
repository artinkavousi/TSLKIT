# Executive Summary

## Vision
Deliver a self-contained Three.js r181+ WebGPU + TSL toolkit that can be dropped into the engine-first Next.js website starter, preserving the proven rendering shell while exposing agent-friendly APIs for materials, post-processing, and compute workflows.【F:DOCS/proposal v1/proposal.md†L1-L126】【F:RESOURCES/DOCS/engine_first_web_gpu_r_3_f_ai_cms_starter_final_merge_r_180.md†L1-L192】

## Guiding Principles
- **Direct-port first:** keep shaders, nodes, and pipeline glue verbatim from working examples to avoid regressions and shorten QA.【F:DOCS/proposal v1/proposal.md†L19-L126】【F:.cursor/proposalchat.md†L35-L167】
- **WebGPU-native stack:** favor the async WebGPU renderer initialization flow and r181 module imports when wiring the baseline application shell.【F:DOCS/proposal v1/proposal.md†L65-L126】【F:RESOURCES/DOCS/engine_first_web_gpu_r_3_f_ai_cms_starter_final_merge_r_180.md†L132-L192】
- **Agent-operable APIs:** expose JSON-schema validated factories so prompts can safely assemble materials, post chains, and compute graphs.【F:DOCS/proposal v1/proposal.md†L137-L158】

## Four-Phase Outcome Roadmap
1. **Phase 1 – Research & Foundations:** Audit resource repositories, capture migration notes, and scaffold documentation/automation assets required for reproducible ports.【F:.cursor/proposalchat.md†L14-L167】
2. **Phase 2 – Core Skeleton:** Lift the fragments boilerplate as the R3F host, port the minimum viable TSL modules (noise, materials, post) and prove WebGPU init across the starter website structure.【F:DOCS/proposal v1/proposal.md†L32-L126】【F:RESOURCES/DOCS/engine_first_web_gpu_r_3_f_ai_cms_starter_final_merge_r_180.md†L43-L192】
3. **Phase 3 – Feature Expansion:** Integrate high-priority compute, advanced materials, and extended post effects from portfolio/TSL example repos with proper guardrails and disposal semantics.【F:.cursor/proposalchat.md†L84-L167】【F:RESOURCES/REPOSITORIES/TSLwebgpuExamples/tsl-compute-particles/src/script.js†L1-L200】
4. **Phase 4 – Website Integration & Polish:** Compose the remaining site pages, CMS wiring, and agent workflows atop the engine-first starter while finalizing docs, QA budgets, and rollout gates.【F:RESOURCES/DOCS/engine_first_web_gpu_r_3_f_ai_cms_starter_final_merge_r_180.md†L1-L192】

## Success Criteria
- Complete resource inventory with clear port priorities and risk notes per module family.【F:.cursor/proposalchat.md†L14-L110】
- Validated async WebGPU renderer path in Next.js + R3F host with fallback strategy documented.【F:DOCS/proposal v1/proposal.md†L65-L126】【F:RESOURCES/DOCS/engine_first_web_gpu_r_3_f_ai_cms_starter_final_merge_r_180.md†L132-L192】
- Shipping TSL presets covering textures, PBR stacks, post FX, and compute utilities demonstrably ported from the inventory sources.【F:RESOURCES/REPOSITORIES/portfolio examples/tsl-textures-main/src/tsl-textures.js†L3-L57】【F:RESOURCES/REPOSITORIES/portfolio examples/fragments-boilerplate-main/src/tsl/noise/simplex_noise_3d.ts†L1-L58】【F:RESOURCES/REPOSITORIES/TSLwebgpuExamples/tsl-compute-particles/src/script.js†L35-L155】
- Website + engine docs aligned so agents and humans can iterate without hunting for provenance.【F:RESOURCES/DOCS/engine_first_web_gpu_r_3_f_ai_cms_starter_final_merge_r_180.md†L43-L105】

## Current Status Snapshot
- ✅ Compute, advanced materials, and post pipelines are packaged under `packages/tsl-kit/src/{compute,materials,post}` with deterministic tests validating kernel wiring and preset metadata.
- ✅ Next.js workspace now exposes `/`, `/portfolio`, `/lab`, and `/admin` routes with preset selectors, telemetry overlays, and operational checklists driven by the engine runtime.
- ✅ Runtime guardrails (`initWebGPUScene`, `deviceCapabilities`, `DisposalBin`, telemetry store) enforce capability checks and lifecycle hygiene across the expanded feature set.
