# Compute utilities

This module collects helpers for orchestrating WebGPU compute workloads and CPU reference kernels that match the samples in `PORT_MODULES/03_Compute`.

## Ping-pong helpers

- `createPingPongTargets` wraps any resource pair (textures, buffers, etc.) with a `swap()` helper.
- `createPingPongTextures` and `createPingPongTextureViews` create WebGPU textures/views with mirrored labels such as `example:read` and `example:write`.

## Storage buffers

- `createStorageBuffer` normalises descriptor defaults to `STORAGE | COPY_SRC | COPY_DST` usage and optionally stages initial data.
- `writeStorageBuffer` queues buffer uploads without exposing command-encoder plumbing.

## Dispatch orchestration

`ComputeOrchestrator` assembles compute passes in submission order, applying bind groups and workgroup counts before emitting a command buffer.

## Simulation kernels

Both kernels expose CPU fallbacks (useful for tests and offline validation) and schema metadata describing the storage layout expected by their WGSL shaders.

### Particle kernel bindings

| Bind group | Binding | Name               | Format            | Description |
|------------|---------|--------------------|-------------------|-------------|
| 0          | 0       | `particlePositions` | `array<vec3<f32>>` | Read/write world-space positions. |
| 0          | 1       | `particleVelocities` | `array<vec3<f32>>` | Read/write velocities used by the integrator. |
| 0          | 2       | `particleColors`    | `array<vec3<f32>>` | Optional render colours updated during initialisation. |

### Fluid kernel bindings

| Bind group | Binding | Name            | Format            | Description |
|------------|---------|-----------------|-------------------|-------------|
| 0          | 0       | `fluidPositions` | `array<vec3<f32>>` | Grid-aligned particle positions. |
| 0          | 1       | `fluidSizes`     | `array<vec3<f32>>` | Sprite scales derived from the wave simulation. |

Preset specs (`particleKernelPresets`, `fluidKernelPresets`) mirror the original demos and can be used as drop-in configuration templates.
