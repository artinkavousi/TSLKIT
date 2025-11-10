# Automation Bridge and Schema Registry

The schema registry centralises runtime validation for materials, post-processing chains, and compute jobs. The `AgentBridge` utility consumes the registry to expose a JSON-friendly command surface that can be called from tooling or automation pipelines.

## Schema overview

The registry is built from Zod schemas that capture each spec type:

- `materialSpecSchema` — layered surface definitions with generator metadata, uniforms, and author information.
- `postChainSpecSchema` — ordered post-processing passes with shared uniforms and parameter descriptors.
- `computeSpecSchema` — WebGPU-friendly compute kernels including dispatch sizing and resource bindings.
- `presetSchema` — discriminated union wrapping reusable specs.

These schemas provide strong typing at build time and a single source of truth for runtime validation when invoking the registry helpers.

## Command flow examples

### Creating a material

```json
{
  "command": "makeMaterial",
  "payload": {
    "name": "Layered Paint",
    "model": "pbr",
    "layers": [
      {
        "id": "albedo",
        "type": "baseColor",
        "generator": {
          "kind": "texture",
          "ref": "albedo",
          "params": { "uvScale": [1, 1] }
        },
        "inputs": {}
      }
    ]
  }
}
```

`AgentBridge.execute` returns a structured success object:

```json
{
  "ok": true,
  "command": "makeMaterial",
  "issuedAt": "2024-05-15T12:30:12.382Z",
  "summary": "makeMaterial → Layered Paint (pbr) · 1 layer",
  "handle": {
    "kind": "material",
    "id": "material-1"
  },
  "spec": { "name": "Layered Paint", "model": "pbr", "layers": [...] }
}
```

### Applying a preset with overrides

```json
{
  "command": "applyPreset",
  "preset": "tsl.compute.integrate",
  "overrides": {
    "dispatch": [64, 32, 1],
    "constants": { "deltaTime": 0.016 }
  }
}
```

The registry merges overrides, validates the merged spec, and produces a compute handle annotated with the originating preset identifier.

## Validation feedback

Invalid payloads return `ok: false` with machine-readable issue metadata:

```json
{
  "ok": false,
  "issuedAt": "2024-05-15T12:31:05.129Z",
  "errors": [
    {
      "path": ["payload", "layers"],
      "message": "Material specs require at least one layer to produce output.",
      "code": "too_small"
    }
  ]
}
```

These errors originate from the same schemas used to validate registry calls, ensuring consistent messaging across direct API usage and automation flows.

## Suggested workflow

1. Construct commands that target the registry helpers (`makeMaterial`, `makePostChain`, `runCompute`, `applyPreset`).
2. Send commands through `AgentBridge.execute` to receive typed handles.
3. Persist the `handle.id` and `summary` fields for downstream orchestration or UI updates.

Because the bridge shares schema definitions with the runtime helpers, any change to the specification automatically propagates to command validation and automation tooling.
