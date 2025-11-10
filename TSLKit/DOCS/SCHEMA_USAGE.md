# Schema Usage Guide

TSLKit now exposes a unified Zod schema surface for all agent-accessible modules. This document outlines the primary entry points and how they are consumed by the Studio app.

## Available schema modules

| Module | Export | Description |
| --- | --- | --- |
| Materials | `materialPresetSchema`, `materialPresetCollectionSchema` | Validates material preset metadata and parameter payloads, including noise references and provenance details. |
| Post stacks | `postStackPresetSchema`, `postStackPresetCollectionSchema` | Captures staged post-processing pipelines plus scheduling hints such as render scale, async passes, and realtime suitability. |
| Compute specs | `computeSpecSchema`, `computeSpecCollectionSchema` | Describes compute workloads, bindings, and dispatch dimensions for automation and scheduling. |
| Tutorials | `tutorialSchema`, `tutorialCollectionSchema` | Tracks learning content linked to presets and schemas to keep assistants in sync. |
| Noise | `noiseSpecSchema` | Shared with preset schemas to guarantee consistent procedural defaults. |

All schema modules are re-exported via `@tslstudio/tsl-kit/schemas`.

## Registry schema accessors

Two registries expose schema retrieval helpers for agent consumers:

- `getNoiseSchema()` returns the canonical noise spec schema used across materials and post-processing modules.
- `getMaterialSchema(type?: string)` returns either the schema for a specific preset (`tsl.material.concrete`, etc.) or an object mapping preset ids to schemas when no type is provided.

These helpers complement the existing metadata accessors and ensure downstream agents can fetch validation logic alongside descriptive tags.

## Studio integration

The Studio app now validates JSON datasets at runtime before rendering UI controls:

```ts
import {
  materialPresetCollectionSchema,
  postStackPresetCollectionSchema,
  tutorialCollectionSchema
} from '@tslstudio/tsl-kit/schemas';

const presets = materialPresetCollectionSchema.parse(await response.json());
```

Invalid datasets surface console errors and fall back to empty collections, preventing corrupt controls from reaching Leva or the inspector.

### Dataset enrichments

- Material and post JSON entries include `schema` references, semantic versioning, suitability tags, feature flags, and timestamps so agents can reason about compatibility.
- Tutorials link back to schema modules via `focus` and `schema` fields, keeping learning content synchronized with module capabilities.

Refer to the updated datasets under `apps/studio/public/data` for canonical examples.
