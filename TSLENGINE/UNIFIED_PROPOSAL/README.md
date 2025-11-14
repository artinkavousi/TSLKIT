# TSLStudio Unified Implementation Hub

This folder consolidates the execution plan for building the TSLStudio WebGPU engine and the companion website experience. The strategy merges the direct-port mandate from the latest planning prompts with the engine-first WebGPU CMS starter architecture so we can iteratively deliver a production-ready stack without diverging from proven code paths.【F:.cursor/proposalchat.md†L15-L99】【F:RESOURCES/DOCS/engine_first_web_gpu_r_3_f_ai_cms_starter_final_merge_r_180.md†L1-L105】

## Document Map
- `SUMMARY.md` — executive overview of objectives, constraints, and success metrics.
- `TABLE_OF_CONTENTS.md` — navigable outline of every planning artifact.
- `QUICK_START.md` — environment/bootstrap instructions for the Next.js + R3F WebGPU starter.
- `IMPLEMENTATION_ROADMAP.md` — four-phase delivery plan with acceptance criteria.
- `RESOURCE_INVENTORY.md` — catalog of port candidates with priorities and risks.
- `PORT_MAPPING.md` — phase-by-phase adoption matrix linking source assets to target modules.

Each file is designed to be agent-operable: sections are modular, richly linked, and cite the upstream assets that informed the decision so follow-on automation can trace provenance quickly.【F:.cursor/proposalchat.md†L133-L167】

## Current Build Snapshot
- **Phase 1** deliverables now live in the repo: workspace scaffolding, capability probes, and resourcing docs are merged and ready for downstream agents.
- **Phase 2** introduced the runnable `apps/studio` Next.js host plus the `@tsl/kit` package with noise, lighting, material, and inspector primitives that render via WebGPU out of the box.
- **Phase 3** layers compute pipelines, advanced material presets, and filmic post-processing chains with deterministic tests protecting each surface.
- **Phase 4** completes the website integration: preset-driven scenes across `/`, `/portfolio`, `/lab`, `/admin`, runtime telemetry dashboards, and deployment checklists documented for release operations.
