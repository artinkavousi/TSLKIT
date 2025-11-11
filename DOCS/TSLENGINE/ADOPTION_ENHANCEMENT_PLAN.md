# TSL-Kit Adoption & Enhancement Plan
## From Current Implementation to Engine Architecture

> **Version**: 1.0  
> **Date**: November 11, 2025  
> **Status**: Analysis Complete, Ready for Implementation

---

## Table of Contents

1. [Executive Summary](#1-executive-summary)
2. [Current State Analysis](#2-current-state-analysis)
3. [Proposed Architecture Analysis](#3-proposed-architecture-analysis)
4. [Gap Analysis](#4-gap-analysis)
5. [Migration Strategy](#5-migration-strategy)
6. [Enhancement Roadmap](#6-enhancement-roadmap)
7. [Implementation Phases](#7-implementation-phases)
8. [Technical Specifications](#8-technical-specifications)
9. [Success Metrics](#9-success-metrics)

---

## 1. Executive Summary

### 1.1 Current State

**TSL-Kit** is a mature, well-organized library with **150+ production-ready modules**:

- ✅ **Core Systems**: Device capabilities, type definitions
- ✅ **Noise Library**: 12+ noise functions (Simplex, Perlin, Curl, FBM, Turbulence, Voronoi)
- ✅ **Lighting**: 6 lighting utilities + advanced tiled lighting
- ✅ **Materials**: Complete PBR stack with presets (car paint, fabric, glass, metal, skin)
- ✅ **Post-FX**: 25+ effects including SSR, GTAO, SSGI, TAA, Bloom, DOF
- ✅ **Compute**: Particles, waves, fluids (Navier-Stokes solver), force fields
- ✅ **SDF**: Shapes, operations, raymarching
- ✅ **Shadows**: Cascaded Shadow Maps (CSM)
- ✅ **Utils**: 15+ utility functions
- ✅ **WGSL**: Matrix and noise utilities
- ✅ **DSL**: JSON schema compiler for agent-addressable APIs

**Strengths:**
- Production-ready code with proven implementations
- Well-structured package with clear exports
- TypeScript with strict typing
- Modular architecture
- Already has DSL foundation

**Current Gaps:**
- No unified engine context or module registry
- Limited preset system
- No schema-driven UI generation
- Showcase is monolithic, not LABS-based
- Missing MDX documentation system
- No introspection/metadata layer

### 1.2 Proposed Enhancements

Transform TSL-Kit into a **self-contained, plug-and-play engine** with:

1. **Engine Core**: Context, lifecycle, module registry
2. **LABS Structure**: Example-driven showcases mirroring engine modules
3. **Schema-Driven Design**: Automated UI generation via Tweakpane
4. **MDX Documentation**: Interactive docs with Contentlayer
5. **Preset System**: Curated presets for materials, post-FX, compute
6. **Agent APIs**: Enhanced JSON DSL with validation
7. **Introspection**: Module metadata for discoverability
8. **🎨 PRODUCTION-GRADE SHOWCASES**: Professional, cinematic, visually stunning examples that demonstrate real-world usage

### 1.3 Migration Philosophy

**Preserve Everything, Enhance Systematically**

- ✅ **Keep existing code** — all current modules remain intact
- ✅ **Add engine layer** — wrap existing modules with registry
- ✅ **Enhance gradually** — phase-by-phase enhancements
- ✅ **Maintain compatibility** — existing imports continue to work
- ✅ **Zero rewrites** — leverage what works

---

## 2. Current State Analysis

### 2.1 Package Structure

```
packages/tsl-kit/
├── src/
│   ├── core/                    # ✅ Device capabilities
│   ├── noise/                   # ✅ 12 noise functions
│   ├── lighting/                # ✅ 8 lighting modules
│   ├── materials/               # ✅ PBR + presets
│   │   ├── api/                 # ✅ makeMaterial API
│   │   ├── pbr/                 # ✅ Disney PBR layers
│   │   ├── presets/             # ✅ 5 material presets
│   │   └── procedural/          # ✅ Wood material
│   ├── postfx/                  # ✅ 25+ effects
│   │   ├── core/                # ✅ PostChain, PostPass
│   │   └── passes/              # ✅ Typed pass implementations
│   ├── compute/                 # ✅ Particles, fluids, forces
│   │   ├── fluids/              # ✅ Full Navier-Stokes
│   │   └── forces/              # ✅ Force field system
│   ├── sdf/                     # ✅ SDF primitives + ops
│   ├── shadows/                 # ✅ CSM implementation
│   ├── utils/                   # ✅ 15+ utilities
│   ├── wgsl/                    # ✅ WGSL helpers
│   ├── math/                    # ✅ Bayer dithering
│   └── dsl/                     # ✅ JSON compiler
└── package.json                 # ✅ Proper exports
```

### 2.2 Module Inventory

| Category | Modules | Status | Notes |
|----------|---------|--------|-------|
| **Core** | 2 | ✅ Complete | Capabilities, types |
| **Noise** | 12 | ✅ Complete | Simplex, Perlin, Curl, FBM, Turbulence, Voronoi |
| **Lighting** | 8 | ✅ Complete | Ambient, diffuse, directional, fresnel, hemisphere, tiled |
| **Materials** | 20+ | ✅ Complete | PBR stack + 5 presets + procedural |
| **Post-FX** | 25+ | ✅ Complete | Full pipeline with passes |
| **Compute** | 10+ | ✅ Complete | Particles, fluids, forces |
| **SDF** | 15+ | ✅ Complete | Primitives + operations |
| **Shadows** | 3 | ✅ Complete | CSM frustum + node |
| **Utils** | 15+ | ✅ Complete | Math, coordinates, patterns |
| **WGSL** | 3 | ✅ Complete | Matrices, noise |
| **Math** | 2 | ✅ Complete | Bayer |
| **DSL** | 4 | ✅ Foundation | Compiler, types, presets |

**Total**: **150+ modules** across **12 categories**

### 2.3 Showcase Structure

```
apps/showcase/
├── src/
│   ├── demos/                   # Category showcases
│   │   ├── individual/          # 70+ individual demos
│   │   ├── AllFeaturesShowcase.js
│   │   ├── ComprehensivePostFXShowcase.js
│   │   ├── ComprehensiveSDFShowcase.js
│   │   ├── ComprehensiveUtilsShowcase.js
│   │   ├── FluidSimulationShowcase.js
│   │   └── [more showcases]
│   ├── components/              # UI components
│   └── utils/                   # Scene management
└── index.html
```

**Current Approach**: Monolithic showcase with categorized demos

### 2.4 Existing APIs

#### Material API
```typescript
import { makeMaterial, presets } from '@tslstudio/tsl-kit/materials'

const material = makeMaterial({
  model: 'pbr',
  layers: [
    presets.clearcoat({ amount: 0.8 }),
    presets.sheen({ intensity: 0.5 })
  ]
})
```

#### Post-FX API
```typescript
import { PostChain } from '@tslstudio/tsl-kit/postfx/core'
import { BloomPass, ToneMapPass } from '@tslstudio/tsl-kit/postfx/passes'

const chain = new PostChain(renderer, scene, camera)
chain.addPass(new ToneMapPass({ curve: 'ACES' }))
chain.addPass(new BloomPass({ threshold: 1.0 }))
```

#### DSL API
```typescript
import { compileGraph } from '@tslstudio/tsl-kit/dsl'

const result = compileGraph({
  kind: 'material',
  model: 'pbr',
  layers: [/* ... */]
})
```

### 2.5 Current Showcase Limitations ⚠️

**Critical Gap**: Current showcases are functional but **not production-grade**

| Aspect | Current State | Required Level |
|--------|--------------|----------------|
| **Visual Quality** | Basic demos | 🎯 **Cinematic, AAA-game quality** |
| **Scene Composition** | Simple geometry | 🎯 **Professional art direction** |
| **Lighting** | Basic setups | 🎯 **Studio lighting, HDRI environments** |
| **Post-Processing** | Minimal effects | 🎯 **Full cinematic pipelines** |
| **Camera Work** | Static views | 🎯 **Dynamic camera movements, depth** |
| **Context** | Isolated modules | 🎯 **Real-world scenarios** |
| **Polish** | Rough edges | 🎯 **Museum-quality presentation** |
| **Inspiration** | Technical | 🎯 **Evoke emotion, wow factor** |

**Problems with Current Showcases:**
- ❌ Too basic — doesn't showcase true potential
- ❌ Poor lighting — flat, uninteresting
- ❌ Simple geometry — cubes and spheres only
- ❌ Minimal post-processing — missing cinematic feel
- ❌ No storytelling — just tech demos
- ❌ Static camera — no sense of depth or drama
- ❌ No context — abstract examples only
- ❌ Not inspiring — doesn't make you say "wow!"

**Target Showcase Quality** (Industry Standards):
- ✅ **Three.js examples quality** — https://threejs.org/examples/
- ✅ **Maxime Heckel portfolio** — Production-grade visuals
- ✅ **Bruno Simon portfolio** — Storytelling + tech
- ✅ **Codrops demos** — Creative + polished
- ✅ **WebGL Awards winners** — Award-winning quality
- ✅ **AAA game promotional material** — High visual bar

**Required Improvements:**
1. **🎨 Art Direction**: Professional composition, color theory, visual hierarchy
2. **💡 Lighting Design**: Multi-light setups, HDRI environments, volumetric effects
3. **📷 Camera Work**: Dynamic movements, depth of field, cinematic framing
4. **🎬 Post-Production**: Full cinematic pipeline (ACES, bloom, lens effects, grading)
5. **🎭 Storytelling**: Each demo tells a story or evokes emotion
6. **🏗️ Real-World Context**: Practical scenarios (product viz, architectural, game assets)
7. **✨ Polish**: Smooth animations, refined details, professional UI
8. **🎯 Wow Factor**: First 3 seconds should impress

---

## 3. Proposed Architecture Analysis

### 3.1 Engine Core Structure

From proposal documents, the engine should have:

```
packages/tsl-kit/
├── src/
│   ├── engine/                  # 🆕 NEW: Engine core
│   │   ├── core/
│   │   │   ├── EngineContext.ts     # Central context
│   │   │   ├── ModuleRegistry.ts    # Module registration
│   │   │   ├── lifecycle.ts         # Init/update/dispose
│   │   │   └── types.ts             # Core types
│   │   ├── presets/
│   │   │   ├── materials.ts         # Material presets
│   │   │   ├── postfx.ts            # Post-FX pipelines
│   │   │   └── compute.ts           # Compute presets
│   │   └── api/
│   │       ├── engineAPI.ts         # High-level API
│   │       └── schemas.ts           # Zod schemas
│   ├── [existing modules]       # ✅ KEEP: All current modules
│   └── index.ts                 # 🔄 UPDATE: Export engine
```

### 3.2 LABS Structure

```
LABS/
└── web/                         # 🆕 NEW: Next.js app
    ├── app/
    │   ├── labs/                # Lab examples
    │   │   ├── materials/       # Material labs
    │   │   ├── lighting/        # Lighting labs
    │   │   ├── postfx/          # Post-FX labs
    │   │   ├── compute/         # Compute labs
    │   │   └── [categories]
    │   ├── components/
    │   │   ├── EngineCanvas.tsx # R3F canvas
    │   │   ├── LabControlPanel.tsx # Tweakpane UI
    │   │   └── layouts/
    │   │       └── LabPage.tsx  # MDX layout
    │   └── schemas/
    │       └── engineSchemas.ts # Schema definitions
    ├── content/                 # 🆕 MDX content
    │   └── labs/
    │       └── [lab MDX files]
    └── contentlayer.config.ts   # Contentlayer config
```

### 3.3 Schema-Driven Design

```typescript
// Lab schema example
interface LabSchema {
  id: string
  title: string
  description: string
  engineConfig: EngineConfig  // Default setup
  controls: UIControl[]       // Auto-generate Tweakpane
  tags: string[]
}

interface UIControl {
  path: string           // e.g., "material.roughness"
  label: string
  type: ControlType      // number, color, select, boolean
  min?: number
  max?: number
  step?: number
  options?: string[]
  category?: string      // For grouping
}
```

### 3.4 Module Registration Pattern

```typescript
interface EngineModule<TConfig = any, THandle = any> {
  meta: EngineModuleMeta
  defaultConfig?: TConfig
  create: (ctx: EngineContext, config?: Partial<TConfig>) => THandle
  destroy?: (ctx: EngineContext, handle: THandle) => void
}

// Register modules
engine.register({
  meta: {
    id: 'postfx.bloom',
    kind: 'postfx',
    label: 'Bloom',
    params: [/* parameter schemas */]
  },
  create: (ctx, config) => new BloomPass(config)
})
```

---

## 4. Gap Analysis

### 4.1 What We Have ✅

| Feature | Status | Quality |
|---------|--------|---------|
| Core modules (150+) | ✅ Complete | High |
| TypeScript typing | ✅ Complete | High |
| Modular exports | ✅ Complete | High |
| Material API | ✅ Complete | High |
| Post-FX pipeline | ✅ Complete | High |
| Compute systems | ✅ Complete | High |
| DSL foundation | ✅ Complete | Medium |
| Device capabilities | ✅ Complete | High |

### 4.2 What We Need 🆕

| Feature | Priority | Effort | Complexity |
|---------|----------|--------|------------|
| **Engine Context** | High | 2 weeks | Medium |
| **Module Registry** | High | 2 weeks | Medium |
| **Preset System** | High | 3 weeks | Medium |
| **Schema Layer** | High | 2 weeks | Medium |
| **LABS Structure** | Medium | 4 weeks | Medium |
| **MDX Documentation** | Medium | 4 weeks | Low |
| **Tweakpane Integration** | Medium | 2 weeks | Low |
| **Introspection API** | Low | 1 week | Low |

### 4.3 Critical Gaps

**1. Engine Context & Registry** (Blocks other features)
```typescript
// MISSING: Central engine context
const engine = createEngineContext({ renderer, scene, camera })
engine.register(module)
engine.listModules()
```

**2. Module Metadata** (Needed for introspection)
```typescript
// MISSING: Parameter metadata
{
  id: 'postfx.bloom',
  params: [
    { name: 'threshold', type: 'number', min: 0, max: 5, default: 1.0 }
  ]
}
```

**3. Preset Catalog** (Needed for quick setup)
```typescript
// LIMITED: Only 5 material presets
// NEED: 50+ presets across materials, post-FX, compute
```

**4. Schema-Driven UI** (Manual Tweakpane setup currently)
```typescript
// MISSING: Auto-generate UI from schemas
<LabControlPanel schema={labSchema} state={config} onChange={setConfig} />
```

**5. LABS Structure** (Current showcase is monolithic)
```
// NEED: Labs mirror engine modules
/LABS/web/app/labs/materials/pbr-basic/
/LABS/web/app/labs/postfx/cinematic/
```

---

## 5. Migration Strategy

### 5.1 Migration Principles

1. **Preserve Existing** — No breaking changes to current API
2. **Add Engine Layer** — Wrap modules, don't rewrite
3. **Gradual Enhancement** — Phase-by-phase implementation
4. **Backward Compatibility** — Old imports continue to work
5. **Zero Downtime** — Existing showcases keep working

### 5.2 Compatibility Approach

```typescript
// OLD: Direct imports (still work)
import { simplexNoise3d } from '@tslstudio/tsl-kit/noise'
import { BloomPass } from '@tslstudio/tsl-kit/postfx/passes'

// NEW: Engine-based access (additional option)
const engine = createEngine()
const bloom = engine.createModule('postfx.bloom', { threshold: 1.0 })

// BOTH APIs WORK SIMULTANEOUSLY
```

### 5.3 Migration Phases

**Phase 1: Engine Foundation** (Weeks 1-2)
- Add `engine/core/` without breaking existing code
- Implement EngineContext and ModuleRegistry
- Keep all current modules unchanged

**Phase 2: Module Adaptation** (Weeks 3-4)
- Add metadata to existing modules
- Create registration adapters
- Test dual-API compatibility

**Phase 3: Schema Layer** (Weeks 5-6)
- Expand DSL schemas
- Add parameter metadata
- Implement validation

**Phase 4: Preset Expansion** (Weeks 7-9)
- Create 50+ presets
- Organize by category
- Add preview images

**Phase 5: LABS Structure** (Weeks 10-13)
- Set up Next.js app
- Migrate showcases to LABS
- Add MDX documentation

**Phase 6: Polish & Launch** (Weeks 14-16)
- Complete documentation
- Automated testing
- Public release

---

## 6. Enhancement Roadmap

### 6.1 Phase 1: Engine Foundation (Weeks 1-2)

**Goal**: Add engine core without breaking existing code

#### Step 1.1: Create Engine Core Structure

```typescript
// packages/tsl-kit/src/engine/core/types.ts
export type EngineModuleKind =
  | 'material' | 'postfx' | 'compute' 
  | 'noise' | 'lighting' | 'sdf' | 'shadow'

export interface EngineModuleMeta {
  id: string                    // e.g., 'postfx.bloom'
  kind: EngineModuleKind
  label: string
  description: string
  category: string
  tags: string[]
  params: EngineParamSchema[]
}

export interface EngineParamSchema {
  name: string
  label: string
  type: 'number' | 'color' | 'boolean' | 'select'
  default: any
  min?: number
  max?: number
  step?: number
  options?: string[]
  group?: string
}

export interface EngineContext {
  renderer: any
  scene: any
  camera: any
  registries: {
    registerModule: (module: EngineModule) => void
    getModuleById: (id: string) => EngineModule | undefined
    getModulesByKind: (kind: EngineModuleKind) => EngineModule[]
  }
  data: Map<string, unknown>
}

export interface EngineModule<TConfig = any, THandle = any> {
  meta: EngineModuleMeta
  defaultConfig?: TConfig
  create: (ctx: EngineContext, config?: Partial<TConfig>) => THandle
  destroy?: (ctx: EngineContext, handle: THandle) => void
}
```

#### Step 1.2: Implement Module Registry

```typescript
// packages/tsl-kit/src/engine/core/ModuleRegistry.ts
export class ModuleRegistry {
  private modulesById = new Map<string, EngineModule>()
  private modulesByKind = new Map<EngineModuleKind, EngineModule[]>()

  register(module: EngineModule): void {
    const { id, kind } = module.meta
    this.modulesById.set(id, module)
    
    const list = this.modulesByKind.get(kind) ?? []
    list.push(module)
    this.modulesByKind.set(kind, list)
  }

  getById(id: string): EngineModule | undefined {
    return this.modulesById.get(id)
  }

  getByKind(kind: EngineModuleKind): EngineModule[] {
    return this.modulesByKind.get(kind) ?? []
  }

  getMeta(filter?: { kind?: string; tag?: string }): EngineModuleMeta[] {
    const all = Array.from(this.modulesById.values())
    return all
      .filter(m => {
        if (filter?.kind && m.meta.kind !== filter.kind) return false
        if (filter?.tag && !m.meta.tags?.includes(filter.tag)) return false
        return true
      })
      .map(m => m.meta)
  }
}
```

#### Step 1.3: Implement Engine Context

```typescript
// packages/tsl-kit/src/engine/core/EngineContext.ts
export class TSLEngine {
  private registry: ModuleRegistry
  private ctx: EngineContext

  constructor(opts: { renderer: any; scene: any; camera: any }) {
    this.registry = new ModuleRegistry()
    
    this.ctx = {
      renderer: opts.renderer,
      scene: opts.scene,
      camera: opts.camera,
      registries: {
        registerModule: (m) => this.registry.register(m),
        getModuleById: (id) => this.registry.getById(id),
        getModulesByKind: (kind) => this.registry.getByKind(kind)
      },
      data: new Map()
    }
  }

  get context(): EngineContext {
    return this.ctx
  }

  register(module: EngineModule): void {
    this.registry.register(module)
  }

  listModules(filter?: { kind?: string; tag?: string }): EngineModuleMeta[] {
    return this.registry.getMeta(filter)
  }

  createModule<T>(id: string, config?: any): T {
    const module = this.registry.getById(id)
    if (!module) throw new Error(`Module not found: ${id}`)
    return module.create(this.ctx, config)
  }
}

export function createEngineContext(opts: {
  renderer: any
  scene: any
  camera: any
}): TSLEngine {
  return new TSLEngine(opts)
}
```

#### Step 1.4: Update Package Exports

```typescript
// packages/tsl-kit/src/engine/index.ts
export * from './core/types'
export * from './core/ModuleRegistry'
export * from './core/EngineContext'

// packages/tsl-kit/src/index.ts
// Add new export
export * from './engine'

// Existing exports unchanged
export * from './core'
export * from './noise'
// ... rest unchanged
```

**Deliverables:**
- ✅ Engine core types
- ✅ Module registry implementation
- ✅ Engine context with lifecycle
- ✅ No breaking changes to existing code

---

### 6.2 Phase 2: Module Adaptation (Weeks 3-4)

**Goal**: Add metadata to existing modules and create registration adapters

#### Step 2.1: Add Metadata to Noise Modules

```typescript
// packages/tsl-kit/src/noise/index.ts
import { EngineModule } from '../engine/core/types'

// Existing export (unchanged)
export { simplexNoise3d } from './simplexNoise3d'

// NEW: Module metadata & registration
export const simplexNoise3dModule: EngineModule = {
  meta: {
    id: 'noise.simplexNoise3d',
    kind: 'noise',
    label: 'Simplex Noise 3D',
    description: '3D Simplex noise function for procedural generation',
    category: 'Noise',
    tags: ['noise', 'procedural', '3d'],
    params: [
      {
        name: 'position',
        label: 'Position',
        type: 'vec3',
        description: '3D position to sample'
      },
      {
        name: 'scale',
        label: 'Scale',
        type: 'number',
        default: 1.0,
        min: 0.01,
        max: 10.0,
        step: 0.01
      }
    ]
  },
  create: (ctx, config) => {
    const { scale = 1.0 } = config || {}
    return (position: any) => simplexNoise3d(position.mul(scale))
  }
}

// Register all noise modules
export function registerNoiseModules(engine: TSLEngine): void {
  engine.register(simplexNoise3dModule)
  engine.register(simplexNoise2dModule)
  engine.register(perlinNoise3dModule)
  // ... all noise modules
}
```

#### Step 2.2: Add Metadata to Post-FX Modules

```typescript
// packages/tsl-kit/src/postfx/passes/BloomPass.ts
import { EngineModule } from '../../engine/core/types'

// Existing class (unchanged)
export class BloomPass { /* ... */ }

// NEW: Module metadata
export const bloomPassModule: EngineModule<BloomConfig, BloomPass> = {
  meta: {
    id: 'postfx.bloom',
    kind: 'postfx',
    label: 'Bloom',
    description: 'Multi-scale bloom/glow effect',
    category: 'Post-Processing',
    tags: ['postfx', 'glow', 'bloom'],
    params: [
      {
        name: 'threshold',
        label: 'Threshold',
        type: 'number',
        default: 1.0,
        min: 0.0,
        max: 5.0,
        step: 0.1,
        group: 'Bloom'
      },
      {
        name: 'strength',
        label: 'Strength',
        type: 'number',
        default: 0.5,
        min: 0.0,
        max: 2.0,
        step: 0.01,
        group: 'Bloom'
      },
      {
        name: 'radius',
        label: 'Radius',
        type: 'number',
        default: 0.85,
        min: 0.0,
        max: 1.0,
        step: 0.01,
        group: 'Bloom'
      }
    ]
  },
  defaultConfig: {
    threshold: 1.0,
    strength: 0.5,
    radius: 0.85
  },
  create: (ctx, config) => {
    return new BloomPass({
      ...bloomPassModule.defaultConfig,
      ...config
    })
  },
  destroy: (ctx, handle) => {
    handle.dispose?.()
  }
}
```

#### Step 2.3: Create Registration Presets

```typescript
// packages/tsl-kit/src/engine/presets/registerAll.ts
import { TSLEngine } from '../core/EngineContext'
import { registerNoiseModules } from '../../noise'
import { registerPostFXModules } from '../../postfx/passes'
import { registerMaterialModules } from '../../materials'
import { registerComputeModules } from '../../compute'
import { registerLightingModules } from '../../lighting'
import { registerSDFModules } from '../../sdf'

export function registerAllModules(engine: TSLEngine): void {
  registerNoiseModules(engine)
  registerPostFXModules(engine)
  registerMaterialModules(engine)
  registerComputeModules(engine)
  registerLightingModules(engine)
  registerSDFModules(engine)
}

// Usage:
const engine = createEngineContext({ renderer, scene, camera })
registerAllModules(engine)

// Now introspectable:
console.log(engine.listModules({ kind: 'postfx' }))
// [
//   { id: 'postfx.bloom', label: 'Bloom', ... },
//   { id: 'postfx.dof', label: 'Depth of Field', ... },
//   ...
// ]
```

**Deliverables:**
- ✅ Metadata for all 150+ modules
- ✅ Registration functions per category
- ✅ `registerAllModules()` convenience function
- ✅ Backward compatibility maintained

---

### 6.3 Phase 3: Schema Layer (Weeks 5-6)

**Goal**: Expand DSL schemas and add validation

#### Step 3.1: Enhanced Schema Definitions

```typescript
// packages/tsl-kit/src/engine/api/schemas.ts
import { z } from 'zod'

// Parameter schema
export const EngineParamSchema = z.object({
  name: z.string(),
  label: z.string(),
  type: z.enum(['number', 'color', 'boolean', 'select', 'vec2', 'vec3']),
  default: z.any().optional(),
  min: z.number().optional(),
  max: z.number().optional(),
  step: z.number().optional(),
  options: z.array(z.string()).optional(),
  group: z.string().optional(),
  description: z.string().optional()
})

// Module config schema
export const MaterialConfigSchema = z.object({
  kind: z.literal('material'),
  model: z.enum(['pbr', 'stylized', 'procedural']),
  layers: z.array(z.object({
    type: z.string(),
    // Layer-specific params
  })),
  mapping: z.object({
    type: z.enum(['uv', 'triplanar', 'spherical']),
    scale: z.number().positive()
  }).optional()
})

export const PostFXConfigSchema = z.object({
  kind: z.literal('postfx'),
  passes: z.array(z.tuple([
    z.string(), // pass name
    z.record(z.any()) // pass config
  ]))
})

export const ComputeConfigSchema = z.object({
  kind: z.literal('compute'),
  type: z.enum(['particles', 'fluids', 'forces']),
  count: z.number().int().positive(),
  fields: z.array(z.object({
    type: z.string(),
    // Field-specific params
  }))
})

// Unified config schema
export const EngineConfigSchema = z.discriminatedUnion('kind', [
  MaterialConfigSchema,
  PostFXConfigSchema,
  ComputeConfigSchema
])
```

#### Step 3.2: Enhanced DSL Compiler

```typescript
// packages/tsl-kit/src/dsl/compiler.ts
import { EngineConfigSchema } from '../engine/api/schemas'
import { TSLEngine } from '../engine/core/EngineContext'

export interface CompileResult {
  success: boolean
  data?: any
  errors?: Array<{ path: string; message: string }>
}

export function compileGraph(
  config: unknown,
  engine?: TSLEngine
): CompileResult {
  // Validate schema
  const parsed = EngineConfigSchema.safeParse(config)
  
  if (!parsed.success) {
    return {
      success: false,
      errors: parsed.error.errors.map(e => ({
        path: e.path.join('.'),
        message: e.message
      }))
    }
  }

  const validated = parsed.data

  try {
    // Compile based on kind
    switch (validated.kind) {
      case 'material':
        return compileMaterial(validated, engine)
      case 'postfx':
        return compilePostFX(validated, engine)
      case 'compute':
        return compileCompute(validated, engine)
    }
  } catch (error) {
    return {
      success: false,
      errors: [{ path: '', message: error.message }]
    }
  }
}

function compileMaterial(config: MaterialConfig, engine?: TSLEngine) {
  if (engine) {
    // Use engine to create material
    const material = engine.createModule('material.' + config.model, config)
    return { success: true, data: material }
  } else {
    // Fall back to direct API
    const material = makeMaterial(config)
    return { success: true, data: material }
  }
}
```

**Deliverables:**
- ✅ Comprehensive Zod schemas
- ✅ Enhanced DSL compiler with validation
- ✅ Error reporting with paths
- ✅ Engine integration

---

### 6.4 Phase 4: Preset Expansion (Weeks 7-9)

**Goal**: Create 50+ curated presets across all categories

#### Step 4.1: Material Presets

```typescript
// packages/tsl-kit/src/engine/presets/materials.ts
export const materialPresets = {
  // PBR Materials (10)
  'pbr/metal-brushed': {
    model: 'pbr',
    layers: [
      { type: 'baseColor', hex: '#c0c0c0' },
      { type: 'metalness', value: 1.0 },
      { type: 'roughness', value: 0.4 },
      { type: 'anisotropy', strength: 0.8 }
    ]
  },
  'pbr/glass-clear': {
    model: 'pbr',
    layers: [
      { type: 'baseColor', hex: '#ffffff' },
      { type: 'transmission', value: 1.0 },
      { type: 'roughness', value: 0.0 },
      { type: 'ior', value: 1.5 }
    ]
  },
  // ... 8 more PBR presets

  // Surface Materials (10)
  'surface/car-paint-metallic': {
    model: 'pbr',
    layers: [
      { type: 'baseColor', hex: '#1b1f73' },
      { type: 'clearcoat', amount: 0.85, gloss: 0.45 },
      { type: 'anisotropy', strength: 0.7 },
      { type: 'iridescence', ior: 1.6, thickness: [250, 900] }
    ]
  },
  'surface/fabric-velvet': {
    model: 'pbr',
    layers: [
      { type: 'baseColor', hex: '#8b1a3d' },
      { type: 'sheen', intensity: 0.8, tint: '#ff6b9d' },
      { type: 'roughness', value: 0.9 }
    ]
  },
  // ... 8 more surface presets

  // Stylized (10)
  'stylized/toon-cel': { /* ... */ },
  'stylized/hologram': { /* ... */ },
  // ... 8 more stylized presets

  // Procedural (10)
  'procedural/marble': { /* ... */ },
  'procedural/wood-oak': { /* ... */ },
  // ... 8 more procedural presets
}
```

#### Step 4.2: Post-FX Presets

```typescript
// packages/tsl-kit/src/engine/presets/postfx.ts
export const postfxPresets = {
  // Cinematic (5)
  'cinematic/film-standard': {
    passes: [
      ['tonemap', { curve: 'ACES' }],
      ['bloom', { threshold: 1.0, strength: 0.45, radius: 0.85 }],
      ['dof', { aperture: 0.018, focus: 2.8 }],
      ['vignette', { intensity: 0.4 }],
      ['grain', { amount: 0.025 }]
    ]
  },
  'cinematic/dark-moody': {
    passes: [
      ['tonemap', { curve: 'Filmic', exposure: 0.6 }],
      ['colorgrading', { lift: [0, 0, 0.05], gamma: [1, 1, 1.2] }],
      ['bloom', { threshold: 1.5, strength: 0.3 }],
      ['vignette', { intensity: 0.7 }]
    ]
  },
  // ... 3 more cinematic

  // Game/Real-time (5)
  'game/competitive': {
    passes: [
      ['tonemap', { curve: 'Reinhard' }],
      ['fxaa', {}],
      ['vignette', { intensity: 0.2 }]
    ]
  },
  // ... 4 more game presets

  // Stylized (5)
  'stylized/retro-crt': {
    passes: [
      ['pixellation', { scale: 3 }],
      ['lcdEffect', {}],
      ['canvasWeave', { intensity: 0.5 }],
      ['vignette', { intensity: 0.5 }]
    ]
  },
  // ... 4 more stylized

  // Tech/Production (5)
  'tech/architectural': {
    passes: [
      ['tonemap', { curve: 'ACES' }],
      ['gtao', { radius: 0.5, intensity: 1.5 }],
      ['ssr', { maxDistance: 10, thickness: 0.5 }],
      ['traa', {}]
    ]
  },
  // ... 4 more tech presets
}
```

#### Step 4.3: Compute Presets

```typescript
// packages/tsl-kit/src/engine/presets/compute.ts
export const computePresets = {
  // Particle Systems (5)
  'particles/magic-sparks': {
    type: 'particles',
    count: 65536,
    fields: [
      { type: 'curlNoise', amplitude: 0.6, frequency: 0.8 },
      { type: 'gravity', direction: [0, 1, 0], strength: 0.1 },
      { type: 'turbulence', intensity: 0.4 }
    ],
    spawn: { rate: 1000, lifetime: [2, 4] }
  },
  // ... 4 more particle presets

  // Fluids (3)
  'fluids/smoke-simulation': {
    type: 'fluids',
    resolution: [128, 128, 128],
    viscosity: 0.001,
    diffusion: 0.0001,
    vorticity: 0.5
  },
  // ... 2 more fluid presets

  // Forces (2)
  'forces/vortex-field': {
    type: 'forces',
    fields: [
      { type: 'vortex', strength: 2.0, axis: [0, 1, 0] },
      { type: 'noise', amplitude: 0.3 }
    ]
  },
  // ... 1 more force preset
}
```

**Deliverables:**
- ✅ 40 material presets
- ✅ 20 post-FX presets
- ✅ 10 compute presets
- ✅ Preview images for all presets

---

### 6.5 Phase 5: LABS Structure — Production-Grade Showcases (Weeks 10-13)

**Goal**: Create LABS structure with **cinematic, production-grade showcases** that set industry standards

**Quality Bar**: Every lab must be **portfolio-worthy** and **production-grade**

#### Step 5.1: LABS Directory Structure

```
LABS/
└── web/
    ├── package.json
    ├── next.config.js
    ├── contentlayer.config.ts
    ├── app/
    │   ├── layout.tsx
    │   ├── page.tsx
    │   ├── labs/
    │   │   ├── layout.tsx
    │   │   ├── materials/
    │   │   │   ├── pbr-basic/
    │   │   │   │   ├── page.mdx
    │   │   │   │   └── schema.ts
    │   │   │   ├── car-paint/
    │   │   │   ├── glass/
    │   │   │   └── [10 more]
    │   │   ├── postfx/
    │   │   │   ├── cinematic/
    │   │   │   ├── bloom/
    │   │   │   ├── dof/
    │   │   │   └── [15 more]
    │   │   ├── compute/
    │   │   │   ├── particles/
    │   │   │   ├── fluids/
    │   │   │   └── [5 more]
    │   │   ├── lighting/
    │   │   ├── noise/
    │   │   └── sdf/
    │   ├── components/
    │   │   ├── EngineCanvas.tsx
    │   │   ├── LabControlPanel.tsx
    │   │   └── layouts/
    │   │       └── LabPage.tsx
    │   └── schemas/
    │       └── engineSchemas.ts
    ├── content/
    │   └── labs/
    │       └── [mdx files]
    └── public/
        └── assets/
```

#### Step 5.2: Lab Schema Implementation

```typescript
// LABS/web/app/schemas/engineSchemas.ts
import { EngineConfig } from '@tslstudio/tsl-kit/engine'

export type ControlType = 'number' | 'color' | 'select' | 'boolean'

export interface UIControl {
  path: string          // e.g., "material.roughness"
  label: string
  type: ControlType
  min?: number
  max?: number
  step?: number
  options?: string[]
  category?: string
}

export interface LabSchema {
  id: string
  title: string
  description: string
  engineConfig: EngineConfig
  controls: UIControl[]
  tags?: string[]
}
```

#### Step 5.3: Example Lab

```typescript
// LABS/web/app/labs/materials/pbr-basic/schema.ts
import { LabSchema } from '../../../schemas/engineSchemas'

export const pbrBasicLab: LabSchema = {
  id: 'materials/pbr-basic',
  title: 'PBR Basics',
  description: 'Explore physically-based rendering fundamentals',
  engineConfig: {
    kind: 'material',
    model: 'pbr',
    layers: [
      { type: 'baseColor', hex: '#ffffff' },
      { type: 'metalness', value: 0.7 },
      { type: 'roughness', value: 0.2 }
    ]
  },
  controls: [
    {
      path: 'layers[1].value',
      label: 'Metalness',
      type: 'number',
      min: 0,
      max: 1,
      step: 0.01,
      category: 'Material'
    },
    {
      path: 'layers[2].value',
      label: 'Roughness',
      type: 'number',
      min: 0,
      max: 1,
      step: 0.01,
      category: 'Material'
    }
  ],
  tags: ['pbr', 'fundamentals']
}
```

```mdx
{/* LABS/web/app/labs/materials/pbr-basic/page.mdx */}
import { LabPage } from '@/components/layouts/LabPage'
import { pbrBasicLab } from './schema'

<LabPage schema={pbrBasicLab}>

# {pbrBasicLab.title}

{pbrBasicLab.description}

## What is PBR?

Physically-Based Rendering (PBR) simulates how light interacts with surfaces
based on real-world physics principles.

## Key Parameters

### Metalness
Controls whether the surface behaves like a metal (1.0) or dielectric (0.0).

### Roughness
Controls surface microsurface detail. Lower values = smoother/glossier.

## Try It

Use the controls on the right to experiment with metalness and roughness values.

</LabPage>
```

#### Step 5.4: LabPage Component

```tsx
// LABS/web/app/components/layouts/LabPage.tsx
'use client'

import { useState } from 'react'
import { EngineCanvas } from '../EngineCanvas'
import { LabControlPanel } from '../LabControlPanel'
import { LabSchema } from '../../schemas/engineSchemas'

interface LabPageProps {
  schema: LabSchema
  children: React.ReactNode
}

export function LabPage({ schema, children }: LabPageProps) {
  const [config, setConfig] = useState(schema.engineConfig)

  return (
    <div className="lab-page">
      {/* Full-screen canvas */}
      <div className="lab-canvas">
        <EngineCanvas config={config} />
      </div>

      {/* Control panel overlay */}
      <aside className="lab-controls">
        <LabControlPanel
          schema={schema}
          state={config}
          onChange={setConfig}
        />
      </aside>

      {/* MDX content overlay */}
      <section className="lab-content">
        {children}
      </section>
    </div>
  )
}
```

#### Step 5.5: Tweakpane Integration

```tsx
// LABS/web/app/components/LabControlPanel.tsx
'use client'

import { useEffect, useRef } from 'react'
import { Pane } from 'tweakpane'
import { LabSchema } from '../schemas/engineSchemas'

interface LabControlPanelProps {
  schema: LabSchema
  state: any
  onChange: (state: any) => void
}

export function LabControlPanel({ schema, state, onChange }: LabControlPanelProps) {
  const paneRef = useRef<Pane | null>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!containerRef.current) return

    // Create Tweakpane
    const pane = new Pane({ container: containerRef.current })
    paneRef.current = pane

    // Group controls by category
    const groups = new Map<string, any>()

    schema.controls.forEach(control => {
      const category = control.category || 'Parameters'
      let folder = groups.get(category)
      if (!folder) {
        folder = pane.addFolder({ title: category })
        groups.set(category, folder)
      }

      // Get value from state using path
      const getValue = (obj: any, path: string) => {
        return path.split('.').reduce((o, k) => o?.[k], obj)
      }

      const setValue = (obj: any, path: string, value: any) => {
        const keys = path.split('.')
        const lastKey = keys.pop()!
        const target = keys.reduce((o, k) => o[k], obj)
        target[lastKey] = value
      }

      // Create control
      const params = { [control.label]: getValue(state, control.path) }

      const binding = folder.addBinding(params, control.label, {
        min: control.min,
        max: control.max,
        step: control.step,
        options: control.options?.reduce((acc, opt) => {
          acc[opt] = opt
          return acc
        }, {} as Record<string, string>)
      })

      // Update state on change
      binding.on('change', (ev) => {
        const newState = { ...state }
        setValue(newState, control.path, ev.value)
        onChange(newState)
      })
    })

    return () => {
      pane.dispose()
    }
  }, [schema, state, onChange])

  return <div ref={containerRef} className="control-panel" />
}
```

**Deliverables:**
- ✅ LABS directory structure
- ✅ 50+ lab examples
- ✅ Schema-driven UI generation
- ✅ MDX documentation system
- ✅ Tweakpane integration

#### Step 5.6: Production-Grade Showcase Standards

**Every lab must meet these quality requirements:**

##### 5.6.1 Visual Quality Standards

**Lighting Requirements:**
```typescript
// Bad: Flat ambient light only
scene.add(new THREE.AmbientLight(0xffffff, 0.5))

// Good: Professional 3-point lighting + HDRI
const keyLight = new THREE.DirectionalLight(0xffeedd, 2.5)
keyLight.position.set(5, 10, 7.5)
keyLight.castShadow = true

const fillLight = new THREE.DirectionalLight(0xddeeff, 0.8)
fillLight.position.set(-5, 5, -5)

const rimLight = new THREE.DirectionalLight(0xffffff, 1.2)
rimLight.position.set(0, 3, -10)

// + HDRI environment
const hdrTexture = await loadHDRI('studio.hdr')
scene.environment = hdrTexture
scene.background = hdrTexture
```

**Post-Processing Pipeline (Cinematic):**
```typescript
// Bad: No post-processing
renderer.render(scene, camera)

// Good: Full cinematic pipeline
const postChain = new PostChain(renderer, scene, camera)
postChain.addPass(new ToneMapPass({ curve: 'ACES', exposure: 1.2 }))
postChain.addPass(new BloomPass({ 
  threshold: 1.0, 
  strength: 0.5, 
  radius: 0.85,
  lens: 'anamorphic'
}))
postChain.addPass(new DOFPass({ 
  aperture: 0.018, 
  focus: 2.8, 
  maxBlur: 7.5,
  bokeh: 'hexagonal'
}))
postChain.addPass(new ColorGradingPass({
  lift: [0, 0, 0.05],
  gamma: [1, 1, 1.1],
  gain: [1, 1, 1]
}))
postChain.addPass(new VignettePass({ intensity: 0.4 }))
postChain.addPass(new FilmGrainPass({ amount: 0.025 }))
postChain.addPass(new ChromaticAberrationPass({ intensity: 0.002 }))
```

**Camera Work:**
```typescript
// Bad: Static orthographic camera
const camera = new THREE.OrthographicCamera(-5, 5, 5, -5, 0.1, 100)
camera.position.set(0, 0, 10)

// Good: Dynamic perspective with depth + animation
const camera = new THREE.PerspectiveCamera(35, aspect, 0.1, 1000)

// Cinematic framing (rule of thirds)
camera.position.set(8, 6, 12)
camera.lookAt(new THREE.Vector3(2, 1, 0))

// Smooth camera animation
gsap.to(camera.position, {
  x: 5,
  y: 8,
  z: 10,
  duration: 8,
  ease: 'power1.inOut',
  repeat: -1,
  yoyo: true
})

// Camera shake for impact
function addCameraShake(intensity = 0.05, duration = 0.1) {
  gsap.to(camera.position, {
    x: camera.position.x + (Math.random() - 0.5) * intensity,
    y: camera.position.y + (Math.random() - 0.5) * intensity,
    duration: duration,
    ease: 'power2.out'
  })
}
```

##### 5.6.2 Scene Composition Standards

**Geometry Complexity:**
```typescript
// Bad: Single primitive
const sphere = new THREE.Mesh(
  new THREE.SphereGeometry(1),
  material
)
scene.add(sphere)

// Good: Complex scene with context
// Import detailed GLTF models
const carModel = await loadGLTF('porsche_911.glb')
const studioFloor = createStudioFloor({
  size: 50,
  reflectivity: 0.7,
  material: 'concrete'
})

// Add environmental elements
const backdrop = createCurvedBackdrop({
  width: 20,
  height: 15,
  curve: 3,
  material: 'studio_white'
})

// Compositional elements (foreground/background)
const foregroundElements = createDepthElements()
const particles = createAtmosphericParticles(5000)

scene.add(carModel, studioFloor, backdrop, foregroundElements, particles)
```

**Material Richness:**
```typescript
// Bad: Single flat color
material.color = new THREE.Color(0xff0000)

// Good: Layered, realistic material
const material = makeMaterial({
  model: 'pbr',
  layers: [
    // Base with color variation
    { 
      type: 'baseColor', 
      map: colorTexture,
      triplanar: true,
      scale: 2.0
    },
    // Surface detail
    {
      type: 'normal',
      map: normalTexture,
      strength: 1.5,
      blend: 'reorientedNormal'
    },
    // Roughness variation
    {
      type: 'roughness',
      map: roughnessTexture,
      min: 0.2,
      max: 0.8
    },
    // Metallic flakes
    {
      type: 'metalness',
      value: 0.9,
      mask: flakePattern
    },
    // Clearcoat layer
    {
      type: 'clearcoat',
      amount: 0.85,
      gloss: 0.45,
      normalMap: clearcoatNormal
    },
    // Iridescent film
    {
      type: 'iridescence',
      ior: 1.6,
      thickness: [250, 900],
      mask: edgeMask
    },
    // Edge wear
    {
      type: 'roughness',
      value: 0.9,
      mask: edgeWear,
      blend: 'overlay'
    }
  ],
  mapping: { type: 'triplanar', scale: 2.0 },
  ibl: { 
    environment: studioHDRI,
    intensity: 1.2,
    rotation: Math.PI * 0.25
  }
})
```

##### 5.6.3 Animation & Motion Standards

**Smooth, Professional Animations:**
```typescript
// Bad: Linear tweens, no easing
gsap.to(object.position, { y: 5, duration: 1 })

// Good: Organic motion with physics
// Use easing curves for natural movement
gsap.to(object.position, {
  y: 5,
  duration: 2.5,
  ease: 'power2.out',
  onUpdate: () => {
    // Secondary motion (follow-through)
    object.rotation.z = object.position.y * 0.1
  }
})

// Add micro-interactions
gsap.to(object.scale, {
  x: 1.05,
  y: 1.05,
  z: 1.05,
  duration: 0.3,
  ease: 'back.out(1.7)',
  repeat: -1,
  yoyo: true,
  repeatDelay: 3
})

// Parallax for depth
function onMouseMove(event) {
  const x = (event.clientX / window.innerWidth) * 2 - 1
  const y = -(event.clientY / window.innerHeight) * 2 + 1
  
  gsap.to(camera.position, {
    x: x * 2,
    y: y * 2,
    duration: 1.5,
    ease: 'power2.out'
  })
}
```

##### 5.6.4 Performance Standards

**Target Performance (Even with Cinematic Quality):**
- ✅ **60 FPS @ 1080p** on RTX 2070-class GPU
- ✅ **30 FPS @ 4K** on RTX 2070-class GPU
- ✅ **Frame time < 16.67ms** (95th percentile)
- ✅ **Load time < 3s** (initial interaction)
- ✅ **Memory < 1GB** (typical scene)
- ✅ **Graceful degradation** on lower-end hardware

**Optimization Techniques:**
```typescript
// Adaptive quality based on frame time
class AdaptiveQuality {
  constructor(targetFPS = 60) {
    this.targetFrameTime = 1000 / targetFPS
    this.frameTimes = []
  }

  update(deltaTime) {
    this.frameTimes.push(deltaTime)
    if (this.frameTimes.length > 60) this.frameTimes.shift()

    const avgFrameTime = this.frameTimes.reduce((a, b) => a + b) / this.frameTimes.length

    if (avgFrameTime > this.targetFrameTime * 1.2) {
      // Reduce quality
      this.reducePostFXQuality()
      this.reduceShadowResolution()
      this.reduceParticleCount()
    } else if (avgFrameTime < this.targetFrameTime * 0.8) {
      // Increase quality
      this.increaseQuality()
    }
  }
}
```

##### 5.6.5 Lab Example Categories (All Production-Grade)

**Material Showcases:**
1. **"Hypercar Studio"** — Car paint with clearcoat, iridescence, studio lighting
2. **"Luxury Watch"** — Metal, glass, complex reflections, macro photography
3. **"Fashion Fabric"** — Velvet sheen, silk subsurface, procedural weave
4. **"Architectural Concrete"** — Weathered materials, realistic imperfections
5. **"Sci-Fi Hologram"** — Emissive, interference patterns, volumetric effects

**Post-FX Showcases:**
1. **"Cyberpunk Night"** — Neon bloom, chromatic aberration, rain effects
2. **"Film Noir"** — High contrast, dramatic vignette, grain
3. **"Product Commercial"** — Clean ACES, subtle bloom, shallow DOF
4. **"Retro Arcade"** — CRT effect, scanlines, color bleeding
5. **"Cinematic Trailer"** — Anamorphic flares, letterbox, color grading

**Compute Showcases:**
1. **"Magic Particle Storm"** — 500k particles, curl noise fields, beautiful trails
2. **"Fluid Ink Drop"** — High-res fluid sim, subsurface scattering, caustics
3. **"Boid Swarm"** — Emergent behavior, realistic flocking, thousands of agents
4. **"Procedural Fire"** — Volumetric flames, heat distortion, embers
5. **"Ocean Waves"** — FFT waves, foam, underwater caustics

**Lighting Showcases:**
1. **"Golden Hour"** — HDRI outdoor, god rays, atmospheric scattering
2. **"Studio Product"** — Multi-light setup, perfect reflections, key/fill/rim
3. **"Night Scene"** — Moonlight, practical lights, volumetric fog
4. **"Neon City"** — Colored lights, reflections on wet surfaces, bloom
5. **"Museum Interior"** — Soft ambient, accent lighting, subtle shadows

##### 5.6.6 Showcase Checklist (Every Lab)

**Visual Quality:**
- [ ] Professional lighting (3-point or HDRI)
- [ ] Full post-processing pipeline (≥5 passes)
- [ ] Dynamic camera work (not static)
- [ ] Complex geometry (not primitives)
- [ ] Rich materials (≥3 layers)
- [ ] Environmental context (floor, backdrop, atmosphere)
- [ ] Depth elements (foreground/background)
- [ ] Color grading (professional palette)

**Technical Quality:**
- [ ] 60 FPS @ 1080p (target hardware)
- [ ] Smooth animations (proper easing)
- [ ] Responsive controls (immediate feedback)
- [ ] No visual glitches or artifacts
- [ ] Proper disposal (no memory leaks)
- [ ] Loading state (progress indication)
- [ ] Error handling (graceful failures)

**Presentation Quality:**
- [ ] Clean UI (professional design)
- [ ] Organized controls (logical grouping)
- [ ] Helpful tooltips (explain parameters)
- [ ] Preset examples (quick start)
- [ ] Performance stats (FPS, GPU time)
- [ ] Export/share options (screenshot, settings)
- [ ] Responsive layout (mobile-friendly)

**Documentation Quality:**
- [ ] Clear title and description
- [ ] Real-world use case explained
- [ ] Key parameters documented
- [ ] Code examples provided
- [ ] Performance notes included
- [ ] Credits and attribution
- [ ] Related labs linked

**Wow Factor:**
- [ ] First 3 seconds are impressive
- [ ] Evokes emotional response
- [ ] Demonstrates real-world value
- [ ] Shows off engine capabilities
- [ ] Makes you want to explore
- [ ] Portfolio-worthy quality
- [ ] Shareable on social media

**Deliverables (Updated):**
- ✅ LABS directory structure
- ✅ 75+ **production-grade** lab examples (not basic demos)
- ✅ Schema-driven UI generation
- ✅ MDX documentation system with tutorials
- ✅ Tweakpane integration with organized controls
- ✅ **Every lab meets quality checklist** (non-negotiable)
- ✅ Performance profiling for all labs
- ✅ Preview images/videos for showcase gallery

---

## 7. Implementation Phases

### 7.1 Timeline Overview

```
Week 1-2:   Engine Foundation
Week 3-4:   Module Adaptation
Week 5-6:   Schema Layer
Week 7-9:   Preset Expansion
Week 10-14: LABS Infrastructure + Production Showcases
Week 15-16: Visual QA & Performance Optimization
Week 17-18: Documentation & Testing
Week 19-20: Marketing & Launch

Total: 20 weeks (5 months)
```

### 7.2 Detailed Schedule

| Week | Phase | Tasks | Deliverables |
|------|-------|-------|--------------|
| 1 | Foundation | Engine core types, ModuleRegistry | Engine context working |
| 2 | Foundation | EngineContext, lifecycle, exports | No breaking changes |
| 3 | Adaptation | Add metadata to noise, lighting | 30 modules registered |
| 4 | Adaptation | Add metadata to postfx, compute, materials | 150 modules registered |
| 5 | Schema | Enhanced Zod schemas | Validation working |
| 6 | Schema | DSL compiler improvements | Error reporting |
| 7 | Presets | Material presets (40) | Preset catalog |
| 8 | Presets | Post-FX presets (20) | Preview images |
| 9 | Presets | Compute presets (10) | Documentation |
| 10 | LABS | Set up Next.js app, structure | LABS scaffold |
| 11 | LABS | **Production-grade showcases** (materials) | 15 cinematic labs |
| 12 | LABS | **Production-grade showcases** (post-FX) | 20 cinematic labs |
| 13 | LABS | **Production-grade showcases** (compute) | 10 cinematic labs |
| 14 | LABS | **Production-grade showcases** (lighting/noise) | 20 cinematic labs |
| 15 | LABS | Tweakpane + MDX + polish | Schema-driven UI + docs |
| 16 | Quality | Visual QA, performance profiling | All labs meet checklist |
| 17 | Quality | Bug fixes, optimization | 60 FPS @ 1080p |
| 18 | Documentation | Complete docs, tutorials | Production-ready docs |
| 19 | Marketing | Preview images/videos, website | Showcase gallery |
| 20 | Launch | Final testing, release prep | **PUBLIC RELEASE** 🚀 |

### 7.3 Resource Requirements

**Development Time**: 20 weeks @ 40 hours/week = 800 hours

**Breakdown**:
- Engine Core: 80 hours
- Module Adaptation: 80 hours
- Schema Layer: 80 hours
- Preset Creation: 120 hours
- LABS Infrastructure: 40 hours
- **Production-Grade Showcases**: 240 hours (⚠️ HIGH QUALITY REQUIREMENT)
- Visual QA & Polish: 80 hours
- Testing & Performance: 80 hours
- Documentation: 40 hours

**Team**: 1-2 developers (can parallelize some work)

**Critical Note**: Production-grade showcases require **3x more effort** than basic demos:
- Art direction & composition
- Professional lighting setups
- Complex materials with multiple layers
- Cinematic post-processing
- Smooth animations & camera work
- Performance optimization
- Polish & refinement

---

## 8. Technical Specifications

### 8.1 Directory Structure (Final)

```
packages/tsl-kit/
├── src/
│   ├── engine/                  # 🆕 Engine core
│   │   ├── core/
│   │   │   ├── types.ts
│   │   │   ├── EngineContext.ts
│   │   │   ├── ModuleRegistry.ts
│   │   │   └── index.ts
│   │   ├── api/
│   │   │   ├── engineAPI.ts
│   │   │   └── schemas.ts
│   │   ├── presets/
│   │   │   ├── materials.ts     # 40 presets
│   │   │   ├── postfx.ts        # 20 presets
│   │   │   ├── compute.ts       # 10 presets
│   │   │   ├── registerAll.ts
│   │   │   └── index.ts
│   │   └── index.ts
│   ├── [existing modules]       # ✅ All current modules unchanged
│   │   ├── core/
│   │   ├── noise/
│   │   ├── lighting/
│   │   ├── materials/
│   │   ├── postfx/
│   │   ├── compute/
│   │   ├── sdf/
│   │   ├── shadows/
│   │   ├── utils/
│   │   ├── wgsl/
│   │   ├── math/
│   │   └── dsl/
│   └── index.ts                 # 🔄 Updated exports
└── package.json                 # 🔄 Updated exports

LABS/
└── web/
    ├── package.json
    ├── next.config.js
    ├── contentlayer.config.ts
    ├── app/
    │   ├── labs/
    │   │   ├── materials/       # 15 labs
    │   │   ├── postfx/          # 20 labs
    │   │   ├── compute/         # 10 labs
    │   │   ├── lighting/        # 8 labs
    │   │   ├── noise/           # 12 labs
    │   │   └── sdf/             # 10 labs
    │   ├── components/
    │   │   ├── EngineCanvas.tsx
    │   │   ├── LabControlPanel.tsx
    │   │   └── layouts/
    │   │       └── LabPage.tsx
    │   └── schemas/
    │       └── engineSchemas.ts
    ├── content/
    │   └── labs/
    │       └── [75+ mdx files]
    └── public/
        └── assets/
            └── [preset previews]
```

### 8.2 API Compatibility Matrix

| API Level | Usage | Compatibility |
|-----------|-------|---------------|
| **Direct Import** | `import { simplexNoise3d } from '@tslstudio/tsl-kit/noise'` | ✅ Unchanged |
| **Class-Based** | `new BloomPass({ threshold: 1.0 })` | ✅ Unchanged |
| **Engine-Based** | `engine.createModule('postfx.bloom', { threshold: 1.0 })` | 🆕 New |
| **DSL-Based** | `compileGraph({ kind: 'postfx', passes: [...] })` | 🔄 Enhanced |
| **Preset-Based** | `loadPreset('materials', 'carPaint')` | 🆕 New |

**All levels work simultaneously** — choose based on use case.

### 8.3 Performance Impact

**Engine Overhead**: < 1ms
- Module registry lookup: O(1)
- Context initialization: One-time
- Metadata storage: ~100KB total

**No Runtime Performance Impact** on existing code paths.

---

## 9. Success Metrics

### 9.1 Technical Metrics

| Metric | Target | Measurement |
|--------|--------|-------------|
| Module Count | 150+ | Count registered modules |
| Preset Count | 70+ | Material + Post + Compute |
| Lab Count | 75+ | Interactive examples |
| API Compatibility | 100% | All old imports work |
| Performance | 0 regression | Frame time unchanged |
| Type Coverage | 100% | All TypeScript |
| Documentation | 100% | All modules documented |

### 9.2 Visual Quality Metrics (NEW — Critical)

| Metric | Target | Measurement |
|--------|--------|-------------|
| **Showcase Quality** | AAA-game level | Expert review + user feedback |
| **Lighting Quality** | Professional | 3-point or HDRI in every lab |
| **Post-FX Pipeline** | Cinematic | ≥5 passes per lab |
| **Camera Work** | Dynamic | Animated camera in 80%+ of labs |
| **Material Complexity** | Layered | ≥3 layers per material |
| **Scene Composition** | Contextual | Real-world scenarios, not primitives |
| **Animation Polish** | Smooth | Proper easing, no linear tweens |
| **First Impression** | "Wow" factor | 80%+ positive feedback on first view |
| **Portfolio Quality** | Shareable | Can be used in portfolios |
| **Social Media Ready** | High engagement | Preview images get likes/shares |

### 9.3 Code Quality Metrics

| Metric | Target | Measurement |
|--------|--------|-------------|
| Test Coverage | 80%+ | Jest/Vitest reports |
| Linter Errors | 0 | ESLint |
| Build Errors | 0 | TypeScript |
| Bundle Size | < 2MB | Rollup analysis |

### 9.4 Adoption Metrics

| Metric | Target | Measurement |
|--------|--------|-------------|
| Migration Complete | Week 20 | All phases done |
| Production Showcases | Week 16 | 75 cinematic labs |
| Documentation Complete | Week 18 | All docs written |
| LABS Launch | Week 15 | Site live |
| Presets Available | Week 9 | Catalog published |

---

## Appendix A: Module Registration Examples

### Example 1: Simple Noise Function

```typescript
// packages/tsl-kit/src/noise/simplexNoise3d.ts

// Existing implementation (unchanged)
export function simplexNoise3d(position: ShaderNode): ShaderNode {
  // ... implementation
}

// NEW: Module metadata
export const simplexNoise3dModule: EngineModule = {
  meta: {
    id: 'noise.simplexNoise3d',
    kind: 'noise',
    label: 'Simplex Noise 3D',
    description: '3D Simplex noise',
    category: 'Noise',
    tags: ['noise', '3d'],
    params: [
      { name: 'position', type: 'vec3', label: 'Position' }
    ]
  },
  create: (ctx) => simplexNoise3d
}
```

### Example 2: Post-FX Pass

```typescript
// packages/tsl-kit/src/postfx/passes/BloomPass.ts

// Existing class (unchanged)
export class BloomPass extends PostPass {
  constructor(config: BloomConfig) {
    // ... implementation
  }
}

// NEW: Module metadata
export const bloomPassModule: EngineModule<BloomConfig, BloomPass> = {
  meta: {
    id: 'postfx.bloom',
    kind: 'postfx',
    label: 'Bloom',
    description: 'Multi-scale bloom effect',
    category: 'Post-FX',
    tags: ['postfx', 'bloom'],
    params: [
      { name: 'threshold', type: 'number', min: 0, max: 5, default: 1.0 },
      { name: 'strength', type: 'number', min: 0, max: 2, default: 0.5 }
    ]
  },
  defaultConfig: { threshold: 1.0, strength: 0.5 },
  create: (ctx, config) => new BloomPass({ ...bloomPassModule.defaultConfig, ...config }),
  destroy: (ctx, handle) => handle.dispose()
}
```

### Example 3: Material Preset

```typescript
// packages/tsl-kit/src/engine/presets/materials.ts

export const carPaintModule: EngineModule = {
  meta: {
    id: 'material.preset.carPaint',
    kind: 'material',
    label: 'Car Paint',
    description: 'Metallic car paint with clearcoat',
    category: 'Presets',
    tags: ['material', 'preset', 'car'],
    params: [
      { name: 'baseColor', type: 'color', default: '#1b1f73' },
      { name: 'metallic', type: 'number', min: 0, max: 1, default: 0.9 }
    ]
  },
  create: (ctx, config) => makeMaterial({
    model: 'pbr',
    layers: [
      { type: 'baseColor', hex: config?.baseColor || '#1b1f73' },
      { type: 'clearcoat', amount: 0.85, gloss: 0.45 },
      { type: 'anisotropy', strength: 0.7 },
      { type: 'iridescence', ior: 1.6, thickness: [250, 900] }
    ]
  })
}
```

---

## Appendix B: Migration Checklist

### Phase 1: Engine Foundation ✅
- [ ] Create `src/engine/core/types.ts`
- [ ] Create `src/engine/core/ModuleRegistry.ts`
- [ ] Create `src/engine/core/EngineContext.ts`
- [ ] Add exports to `src/engine/index.ts`
- [ ] Update `src/index.ts` to export engine
- [ ] Test: Engine context creation works
- [ ] Test: No breaking changes to existing imports

### Phase 2: Module Adaptation ✅
- [ ] Add metadata to all noise modules (12)
- [ ] Add metadata to all lighting modules (8)
- [ ] Add metadata to all postfx modules (25+)
- [ ] Add metadata to all compute modules (10+)
- [ ] Add metadata to all material modules (20+)
- [ ] Add metadata to remaining modules (75+)
- [ ] Create `registerAllModules()` function
- [ ] Test: All 150+ modules registered
- [ ] Test: Introspection works

### Phase 3: Schema Layer ✅
- [ ] Expand Zod schemas in `src/engine/api/schemas.ts`
- [ ] Enhance DSL compiler with validation
- [ ] Add error reporting
- [ ] Test: Schema validation catches errors
- [ ] Test: Compilation works for all module types

### Phase 4: Preset Expansion ✅
- [ ] Create 40 material presets
- [ ] Create 20 post-FX presets
- [ ] Create 10 compute presets
- [ ] Generate preview images for all presets
- [ ] Document all presets
- [ ] Test: All presets compile correctly

### Phase 5: LABS Structure ✅
- [ ] Set up Next.js app in `LABS/web/`
- [ ] Create lab schema definitions
- [ ] Implement `EngineCanvas` component
- [ ] Implement `LabControlPanel` with Tweakpane
- [ ] Implement `LabPage` layout
- [ ] Set up Contentlayer for MDX
- [ ] Create 75+ lab examples
- [ ] Write MDX documentation for all labs
- [ ] Test: All labs render correctly
- [ ] Test: Tweakpane controls work

### Phase 6: Polish & Launch ✅
- [ ] Complete all documentation
- [ ] Run full test suite
- [ ] Fix all bugs
- [ ] Performance profiling
- [ ] Generate build
- [ ] Create release notes
- [ ] **PUBLIC LAUNCH** 🚀

---

## Conclusion

This adoption and enhancement plan provides a **comprehensive, step-by-step roadmap** to transform TSL-Kit from a collection of excellent modules into a **unified, self-contained engine** with **production-grade showcases**:

✅ **Engine Core** — Module registry, introspection, lifecycle  
✅ **Schema-Driven** — Automated UI generation, validation  
✅ **70+ Presets** — Materials, post-FX, compute  
✅ **75+ Production-Grade Labs** — **Cinematic, AAA-quality showcases** with MDX docs  
✅ **Visual Excellence** — Professional lighting, post-FX, camera work in every lab  
✅ **Backward Compatible** — All existing code continues to work  
✅ **Production-Ready** — Tested, documented, optimized, portfolio-worthy

**Timeline**: 20 weeks (5 months)  
**Effort**: 800 hours  
**Result**: Industry-leading TSL/WebGPU engine with **stunning visuals** 🚀

### Critical Success Factor: Visual Quality

The showcases are **not optional enhancements** — they are the **primary showcase** of engine capabilities. Every lab must meet production-grade standards:

- 🎬 **Cinematic quality** (AAA-game level visuals)
- 💡 **Professional lighting** (studio setups, HDRI environments)
- 🎨 **Art direction** (composition, color theory, storytelling)
- 📷 **Dynamic cameras** (animated, depth of field, cinematic framing)
- ✨ **Polish** (smooth animations, refined details, wow factor)

**Without production-grade showcases, the engine is just code. WITH them, it becomes inspiring.**

---

**Document Version**: 2.0 (Updated for Production Showcases)  
**Last Updated**: November 11, 2025  
**Status**: Ready for Implementation  
**Next Step**: Begin Phase 1 — Engine Foundation  
**Quality Bar**: Every lab must be portfolio-worthy and shareable

