# Phase 0 Resource Collection Drop (r181 Refresh)

This package captures a full snapshot of every TSL/WebGPU/MaterialX artifact that lives under `RESOURCES/` so we can plan and port with confidence before touching any engine code.

## Contents

| Item | Description |
|------|-------------|
| `COLLECTED_MODULES/` | Category-sorted copies of 1,114 shader, node, compute and utility modules ready for offline review. |
| `COLLECTED_MODULES/inventory.md` | Human-readable catalog covering every file, its source path, dependency surface, priority and effort estimate. |
| `inventory.json` | Same catalog in machine-readable form for scripts/agents. |
| `collection_manifest.json` | Run metadata (timestamp, totals, missing roots). |
| `docs/BEST_PRACTICES.md` | Notes captured while skimming each source tree (composition patterns, node graph idioms, shader tips). |
| `docs/THREEJS_R181_MIGRATION.md` | Focused summary of r181-specific API changes and compatibility flags relevant to WebGPU + TSL. |
| `docs/PORT_STRATEGY.md` | Suggested order of operations, risk map, dependency graph derived from the collected modules. |
| `docs/RESOURCE_INDEX.md` | Quick lookup table that maps each upstream path to the mirrored folder and category. |

## Coverage Highlights

- **Sources**: `TSLwebgpuExamples` (482 files), `portfolio-main` (287), `three.js-r181/src/nodes` (171), `tsl-textures-main` (65), `fragments-boilerplate-main` (51) plus the official r181 TSL/MaterialX sample modules.
- **Categories**: Nodes (608), Compute (212), Noise (68), Materials (69), Lighting (40), Post FX (36), SDF (20), Pipelines (19), Effects (42).
- **Formats**: `.ts`, `.tsx`, `.js`, `.glsl`, `.wgsl`.
- **Deduplication policy**: kept every variant (portfolio vs fragments) so we can compare performance/quality during porting.

## How to Use This Drop

1. **Inventory-first** – start with `COLLECTED_MODULES/inventory.md` or `inventory.json` to slice by category, upstream repo, or dependency requirements.
2. **Pull the original context** – all copied files preserve their relative source path under `RESOURCES/...` so tracing back to assets, textures, or UI state is immediate.
3. **Port smart** – `docs/PORT_STRATEGY.md` ranks the modules based on dependency chains (noise → materials → pipelines → postfx). Follow that order to avoid blocking chains.
4. **Validate against r181** – `docs/THREEJS_R181_MIGRATION.md` lists renderer + TSL breaking changes (new bind group layout rules, node API renames, WGSL limits, etc.). Cross-check before wiring modules into `three@0.161.x`.
5. **Share with agents** – the JSON inventory is designed so other automation can answer “where is X?” without reading markdown.

## Next Steps

- Finish tagging screenshots/snippets for the highest-priority demos (see `PORT_STRATEGY.md`).
- Sync with proposal/architecture docs once stakeholders sign off on this refreshed Phase 0 package.
- Keep this drop immutable; create a new timestamped folder for future crawls so diffs stay clean.
