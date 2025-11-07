# @tslstudio/tsl-kit

Foundational package for the TSLStudio WebGPU engine. The implementation follows
the PRD and implementation plan contained under `DOCS/proposal v2/`. This repo
currently exposes:

- a JSON schema describing Codex automation tasks (`src/schema/codexTask.schema.json`)
- TypeScript utilities for validating Codex tasks at runtime
- a growing library of direct ports:
  - noise nodes (`perlin`, `simplex3d/4d`, `curl`, `fbm`, `turbulence`)
  - lighting helpers (ambient, diffuse, directional, fresnel, hemisphere)
  - post-processing effects (grain, vignette, pixellation, LCD, speckled noise)
  - compute blueprints (radial initializer, instanced particle field)
  - utility helpers (screen-aspect UV transforms, signed distance shapes, smoothing)

Future commits will continue to port the remaining modules referenced in the
PRD with provenance preserved in registry descriptors.
