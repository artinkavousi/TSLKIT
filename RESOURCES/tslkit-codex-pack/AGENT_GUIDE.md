# AGENT_GUIDE.md — TSLKIT / TSLStudio Guide

## Project Pillars
- **Self-contained TSL/Node toolkit** atop Three.js WebGPU renderer.
- **PostFX** pipeline (bloom, color grade, DoF), **compute effects** (particles/fluids), clean APIs.
- **Demos**: minimal but production-grade, reproducible via Makefile.

## Build Targets
- `make setup` — install exact versions (Node 20, Three.js pinned).
- `make dev` — Vite/ESBuild dev server.
- `make test` — unit + smoke render tests (headless).
- `make ui:start && make ui:shots` — capture demo screenshots.
- `make ui:diff` — optional pixel diffs against baselines.

## Rendering QA
- Headless render of a frame to bitmap to ensure pipeline survival without visible canvas.
- Smoke scenes:
  - **PBR** sphere grid with multiple IBLs
  - **TSL** procedural material demo
  - **PostFX** chain toggles (on/off comparisons)
  - **Particles/Compute** sanity

## Common Pitfalls
- Version mismatches (three/webgpu vs node materials).
- Import order / duplicate instances in bundlers.
- WebGPU adapter failures (requestAdapter null). Provide WebGL fallback.

## Visual AC Examples
- `pbr-grid-desktop.png`, `tsl-proc-desktop.png`, `postfx-on-off.png`, `particles-desktop.png`.
