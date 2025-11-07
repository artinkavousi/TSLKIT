# @tslstudio/tsl-kit

Foundational package for the TSLStudio WebGPU engine. The implementation follows
the PRD and implementation plan contained under `DOCS/proposal v2/`. This repo
currently exposes:

- a JSON schema describing Codex automation tasks (`src/schema/codexTask.schema.json`)
- TypeScript utilities for validating Codex tasks at runtime
- scaffolding for materials, noise, post-processing, compute, presets, and utility modules

Future commits will populate the placeholders with direct ports from the
referenced resource repositories.
