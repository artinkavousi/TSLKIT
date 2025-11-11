<!-- 9013e721-3938-479a-bf04-d10ed0acda5a e8075f70-8d58-418e-a7dc-c63a66b9ab89 -->
# Phase 1: Foundation Module Porting (Weeks 1-4)

## Overview

Port 20 critical foundation modules (~50 hours) in dependency order, establishing the core `packages/tsl-kit` library structure for the TSLStudio engine.

## Part 1: Project Setup & Infrastructure

### 1.1 Create Package Structure

Create the core library structure:

```
packages/
  tsl-kit/
    src/
      index.ts
      noise/
        index.ts
      lighting/
        index.ts
      utils/
        index.ts
      sdf/
        index.ts
      postfx/
        index.ts
    package.json
    tsconfig.json
```

**Files to create**:

- `packages/tsl-kit/package.json` - Dependencies: `three@^0.181.0`, `typescript@^5.0.0`
- `packages/tsl-kit/tsconfig.json` - Target ES2020, moduleResolution: bundler
- `packages/tsl-kit/src/index.ts` - Main barrel export

### 1.2 Configure TypeScript

Set up TypeScript with proper Three.js r181+ types:

- Use `"moduleResolution": "bundler"`
- Enable `"esModuleInterop": true`
- Set `"target": "ES2020"`
- Include `"allowSyntheticDefaultImports": true`

## Part 2: Noise Library (8 modules, ~13 hours)

### 2.1 Port Noise Common (DEPENDENCY - PORT FIRST)

**Source**: `COLLECTED_MODULES/noise/common.ts`

**Target**: `packages/tsl-kit/src/noise/common.ts`

**Migration steps**:

1. Update imports: `three/tsl`, `three/webgpu`
2. Port helper functions: `mod289`, `permute`, `taylorInvSqrt`, `fade`, `grad4`
3. Use `overloadingFn` pattern for type variants
4. Add `/*#__PURE__*/` to all exports
5. Add `.setLayout()` metadata
6. Test: Ensure all functions compile

**Reference**: `COLLECTED_MODULES/BEST_PRACTICES.md` section "Overloaded Function Pattern"

### 2.2 Port Simplex Noise 3D (portfolio-main)

**Source**: `COLLECTED_MODULES/noise/simplexNoise3d.ts`

**Target**: `packages/tsl-kit/src/noise/simplexNoise3d.ts`

**Migration steps**:

1. Import `permute`, `taylorInvSqrt` from `./common`
2. Update `tslFn` → `Fn` (see `THREE_R181_MIGRATION.md`)
3. Keep `_immutable` parameter naming
4. Add `.toVar()` for mutable variables
5. Preserve `.setLayout({ name: 'snoise', type: 'float', inputs: [...] })`

**Pattern**: Complex Function with Metadata (from `BEST_PRACTICES.md`)

### 2.3 Port Perlin Noise 3D

**Source**: `COLLECTED_MODULES/noise/perlin_noise_3d.ts`

**Target**: `packages/tsl-kit/src/noise/perlinNoise3d.ts`

**Dependencies**: `common.ts` (mod289, fade, permute)

### 2.4 Port Curl Noise 3D

**Source**: `COLLECTED_MODULES/noise/curlNoise3d.ts` (portfolio-main version)

**Target**: `packages/tsl-kit/src/noise/curlNoise3d.ts`

**Note**: Compare with `curl_noise_3d.ts` (fragments-boilerplate) - choose best implementation

### 2.5 Port FBM

**Source**: `COLLECTED_MODULES/noise/fbm.ts`

**Target**: `packages/tsl-kit/src/noise/fbm.ts`

**Dependencies**: Noise functions (simplex or perlin)

### 2.6 Create Noise Index

**Target**: `packages/tsl-kit/src/noise/index.ts`

Export all noise functions:

```typescript
export * from './common'
export * from './simplexNoise3d'
export * from './perlinNoise3d'
export * from './curlNoise3d'
export * from './fbm'
```

## Part 3: Lighting System (4 modules, ~5 hours)

### 3.1 Port Fresnel

**Source**: `COLLECTED_MODULES/lighting/fresnel.ts`

**Target**: `packages/tsl-kit/src/lighting/fresnel.ts`

**Migration steps**:

1. Update imports
2. Keep simple pattern: `export const createFresnelNode = Fn(([viewDir, normal, power = 1]) => {...})`
3. No `.setLayout()` needed (simple function)

**Pattern**: Pure Function Export Pattern

### 3.2 Port Ambient Light

**Source**: `COLLECTED_MODULES/lighting/ambient.ts`

**Target**: `packages/tsl-kit/src/lighting/ambient.ts`

### 3.3 Port Diffuse Light

**Source**: `COLLECTED_MODULES/lighting/diffuse.ts`

**Target**: `packages/tsl-kit/src/lighting/diffuse.ts`

### 3.4 Port Hemisphere Light

**Source**: `COLLECTED_MODULES/lighting/hemisphere.ts`

**Target**: `packages/tsl-kit/src/lighting/hemisphere.ts`

### 3.5 Create Lighting Index

**Target**: `packages/tsl-kit/src/lighting/index.ts`

## Part 4: Core Utilities (4 modules, ~3.5 hours)

### 4.1 Port Remap

**Source**: `COLLECTED_MODULES/utils/remap.ts`

**Target**: `packages/tsl-kit/src/utils/remap.ts`

**Why first**: Used by many other modules

### 4.2 Port Smooth Min

**Source**: `COLLECTED_MODULES/utils/smooth-min.ts`

**Target**: `packages/tsl-kit/src/utils/smoothMin.ts`

**Note**: Used for SDF operations

### 4.3 Port Compose

**Source**: `COLLECTED_MODULES/utils/compose.ts`

**Target**: `packages/tsl-kit/src/utils/compose.ts`

### 4.4 Port Coordinates

**Source**: `COLLECTED_MODULES/utils/math/coordinates.ts`

**Target**: `packages/tsl-kit/src/utils/coordinates.ts`

## Part 5: SDF System (3 modules, ~8 hours)

### 5.1 Port Sphere SDF

**Source**: `COLLECTED_MODULES/sdf/sphere.ts`

**Target**: `packages/tsl-kit/src/sdf/sphere.ts`

**Dependencies**: `smoothMin` from utils

### 5.2 Port SDF Shapes

**Source**: `COLLECTED_MODULES/sdf/shapes.ts`

**Target**: `packages/tsl-kit/src/sdf/shapes.ts`

**Contains**: Box, torus, cylinder, etc.

### 5.3 Port SDF Operations

**Source**: `COLLECTED_MODULES/sdf/operations.ts`

**Target**: `packages/tsl-kit/src/sdf/operations.ts`

**Contains**: Union, intersection, subtraction, smooth operations

### 5.4 Create SDF Index

**Target**: `packages/tsl-kit/src/sdf/index.ts`

## Part 6: Post-FX Foundation (3 modules, ~7 hours)

### 6.1 Port Bloom Helpers

**Source**: `COLLECTED_MODULES/utils/bloom.ts`

**Target**: `packages/tsl-kit/src/postfx/bloomHelpers.ts`

### 6.2 Port Tonemapping

**Source**: `COLLECTED_MODULES/utils/tonemapping.ts`

**Target**: `packages/tsl-kit/src/postfx/tonemapping.ts`

### 6.3 Port Gaussian Blur (Official)

**Source**: `COLLECTED_MODULES/postfx/official/GaussianBlurNode.js`

**Target**: `packages/tsl-kit/src/postfx/gaussianBlur.ts`

**Note**: This is already r181-compatible, may need minimal changes

## Part 7: Device Capability Detection (1 module, ~4 hours)

### 7.1 Create Device Caps Module

**Target**: `packages/tsl-kit/src/utils/deviceCaps.ts`

**Implement** (based on `THREE_R181_MIGRATION.md` Device Capability Detection):

```typescript
export async function checkWebGPUSupport(): Promise<boolean>
export async function getDeviceLimits(): Promise<DeviceLimits>
export async function getDeviceCapabilities(): Promise<DeviceCapabilities>
export async function selectQualityPreset(): Promise<QualityPreset>
```

## Part 8: Main Index & Testing

### 8.1 Create Main Index

**Target**: `packages/tsl-kit/src/index.ts`

Barrel export all categories:

```typescript
export * from './noise'
export * from './lighting'
export * from './utils'
export * from './sdf'
export * from './postfx'
```

### 8.2 Create Simple Test Scene

**Target**: `packages/tsl-kit/test/basic.test.ts`

Test that all modules:

1. Import without errors
2. Can be instantiated
3. Have correct types

## Migration Checklist (Apply to Each Module)

For every ported module:

1. **Imports**:

   - ✅ Replace `three/examples/jsm/nodes/*` → `three/tsl` or `three/webgpu`
   - ✅ Group imports logically

2. **Function Declaration**:

   - ✅ `tslFn` → `Fn`
   - ✅ Add `/*#__PURE__*/` for tree-shaking
   - ✅ Use `_immutable` for parameter names
   - ✅ Add `.toVar()` for mutable variables

3. **Metadata**:

   - ✅ Add `.setLayout()` for complex functions
   - ✅ Include name, type, inputs

4. **Testing**:

   - ✅ Compile without errors
   - ✅ Import in test file
   - ✅ Visual inspection (if applicable)

5. **Documentation**:

   - ✅ Add JSDoc comments for exported functions
   - ✅ Include usage examples

## Porting Order (Dependency-First)

**Week 1** (Priority 1-10):

1. Noise Common ⚠️ MUST BE FIRST
2. Simplex Noise 3D
3. Perlin Noise 3D
4. Curl Noise 3D
5. FBM
6. Fresnel
7. Ambient Light
8. Diffuse Light
9. Hemisphere Light
10. Remap

**Week 2** (Priority 11-20):

11. Smooth Min
12. Compose
13. Coordinates
14. Sphere SDF
15. SDF Shapes
16. SDF Operations
17. Bloom Helpers
18. Tonemapping
19. Gaussian Blur
20. Device Caps Detection

## Acceptance Criteria

Phase 1 complete when:

- ✅ All 20 Tier 1 modules ported to `packages/tsl-kit/src/`
- ✅ All modules compile without TypeScript errors
- ✅ All imports use Three.js r181+ paths
- ✅ Basic test file imports all modules successfully
- ✅ Package structure follows best practices
- ✅ All functions use `Fn` instead of deprecated `tslFn`
- ✅ Proper `.setLayout()` metadata where applicable
- ✅ All provenance/license headers preserved

## Key References

- **Migration Guide**: `COLLECTED_MODULES/THREE_R181_MIGRATION.md`
- **Best Practices**: `COLLECTED_MODULES/BEST_PRACTICES.md`
- **Module Inventory**: `COLLECTED_MODULES/inventory.md`
- **Source Files**: `COLLECTED_MODULES/{category}/`

### To-dos

- [ ] Scan portfolio examples directories and create initial file listing
- [ ] Scan TSL WebGPU example repositories and catalog files
- [ ] Scan Three.js r181 official examples focusing on webgpu_* files
- [ ] Study and document best practices from Maxime Heckel examples
- [ ] Create COLLECTED_MODULES/ folder with category subdirectories
- [ ] Copy all noise functions to COLLECTED_MODULES/noise/
- [ ] Copy lighting utilities to COLLECTED_MODULES/lighting/
- [ ] Copy compute/particle systems to COLLECTED_MODULES/compute/
- [ ] Copy post-processing effects to COLLECTED_MODULES/postfx/
- [ ] Copy utility functions to COLLECTED_MODULES/utils/
- [ ] Add provenance metadata (_source.json) to all collected modules
- [ ] Build comprehensive inventory.md with all module metadata
- [ ] Study Three.js r181 docs and create migration guide
- [ ] Create PORTING_PRIORITY.md with ranked modules and phase assignments
- [ ] Validate completeness, review documentation, get stakeholder approval