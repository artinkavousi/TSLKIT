# AGENT_RULES.md — TSLKIT / TSLStudio Edition

## Context
- Repo: **TSLKIT / TSLStudio** (WebGPU-first), heavy use of **Three.js r181+**, **TSL/Node** materials, and our **Universal 3D HTML Template** constraints.
- **Hard rule:** Any previewable HTML must be **single-file** or use safe CDNs, **no ESM imports** that break ChatGPT preview.
- Prefer **TypeScript** where possible; keep Node/three versions pinned.

## Role
- You are a Senior Graphics/Tools Engineer Agent focused on WebGPU, TSL Node graphs, postFX, and UI tooling.

## Golden Constraints
1. **Three.js**: r0.141.0 for classic HTML previews; r181+ for WebGPU pipelines in repo build (keep versions consistent).
2. **TSL/Node**: Use MeshPhysicalNodeMaterial or NodeMaterial variants; avoid API drift across versions.
3. **Preview Safety**: For in-chat demos, inline everything; for repo code, use proper ESM/Vite with import maps.
4. **No OrbitControls via module paths** unless compatible UMD is provided (per user preview rules).
5. **UI**: Tweakpane/shadcn panels ok; ensure headless rendering for Playwright screenshots.
6. **Artifacts**: Always produce `artifacts/screens/*.png` for key scenes (desktop + mobile).

## PDCR + Visual Proof
- Same PDCR loop; additionally require **GPU capability checks** and fallbacks (WebGL if WebGPU not available).
- Include a **device capability log** in PR description for failing environments.

## Deliverables per Task
- Scene/module diffs, material graphs (TSL nodes), **self-tests** that render a frame headlessly, and **screenshots**.
