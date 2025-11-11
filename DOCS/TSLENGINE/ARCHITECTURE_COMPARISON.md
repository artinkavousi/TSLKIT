# Architecture Comparison: Current vs. Proposed

Visual guide to the transformation from current TSL-Kit to proposed Engine architecture.

---

## 🔄 Transformation Overview

```
CURRENT STATE                          PROPOSED STATE
(What We Have)                         (What We're Building)

┌─────────────────────┐               ┌─────────────────────────────────┐
│   TSL-Kit Library   │               │   TSL Engine (Full Stack)       │
│   150+ Modules      │  ──────────>  │   Engine Core + LABS + Docs     │
│   Modular Exports   │               │   Schema-Driven + Presets       │
└─────────────────────┘               └─────────────────────────────────┘

     Direct Imports                     Engine Context + Registry
     Class-Based API                    + Direct Imports (backward compat)
     5 Material Presets                 + 70+ Presets
     Basic DSL                          + Enhanced DSL with Validation
     Monolithic Showcase                + Modular LABS Structure
     No Introspection                   + Module Metadata & Discovery
```

---

## 📦 Package Structure Comparison

### Current Structure

```
packages/tsl-kit/
├── src/
│   ├── core/                    Device capabilities
│   ├── noise/                   12 noise functions ✅
│   ├── lighting/                8 lighting modules ✅
│   ├── materials/               PBR + 5 presets ✅
│   │   ├── api/
│   │   ├── pbr/
│   │   ├── presets/             5 presets only
│   │   └── procedural/
│   ├── postfx/                  25+ effects ✅
│   │   ├── core/                PostChain, PostPass
│   │   └── passes/              Bloom, DOF, GTAO, etc.
│   ├── compute/                 Particles, fluids ✅
│   │   ├── fluids/
│   │   └── forces/
│   ├── sdf/                     SDF primitives ✅
│   ├── shadows/                 CSM ✅
│   ├── utils/                   15+ utilities ✅
│   ├── wgsl/                    WGSL helpers ✅
│   ├── math/                    Bayer ✅
│   └── dsl/                     Basic compiler ✅
└── package.json

apps/showcase/
└── src/
    ├── demos/                   70+ demos (monolithic)
    ├── components/              UI components
    └── utils/                   Scene management

Total: 150+ modules, no engine layer, limited presets
```

### Proposed Structure

```
packages/tsl-kit/
├── src/
│   ├── engine/                  🆕 NEW: Engine Core
│   │   ├── core/
│   │   │   ├── types.ts             Core type definitions
│   │   │   ├── EngineContext.ts     Central context
│   │   │   ├── ModuleRegistry.ts    Module registration
│   │   │   └── index.ts
│   │   ├── api/
│   │   │   ├── engineAPI.ts         High-level API
│   │   │   └── schemas.ts           Enhanced Zod schemas
│   │   └── presets/
│   │       ├── materials.ts         🆕 40 material presets
│   │       ├── postfx.ts            🆕 20 post-FX presets
│   │       ├── compute.ts           🆕 10 compute presets
│   │       ├── registerAll.ts       🆕 Register all modules
│   │       └── index.ts
│   ├── [ALL EXISTING MODULES]   ✅ UNCHANGED (backward compat)
│   │   ├── core/
│   │   ├── noise/                   + metadata
│   │   ├── lighting/                + metadata
│   │   ├── materials/               + metadata
│   │   ├── postfx/                  + metadata
│   │   ├── compute/                 + metadata
│   │   ├── sdf/                     + metadata
│   │   ├── shadows/                 + metadata
│   │   ├── utils/                   + metadata
│   │   ├── wgsl/                    + metadata
│   │   ├── math/                    + metadata
│   │   └── dsl/                     🔄 enhanced
│   └── index.ts                 🔄 exports engine + modules
└── package.json                 🔄 adds engine exports

LABS/                            🆕 NEW: Interactive Examples
└── web/
    ├── app/
    │   ├── labs/                    75+ modular labs
    │   │   ├── materials/           15 material labs
    │   │   ├── postfx/              20 post-FX labs
    │   │   ├── compute/             10 compute labs
    │   │   ├── lighting/            8 lighting labs
    │   │   ├── noise/               12 noise labs
    │   │   └── sdf/                 10 SDF labs
    │   ├── components/
    │   │   ├── EngineCanvas.tsx     R3F canvas
    │   │   ├── LabControlPanel.tsx  Tweakpane integration
    │   │   └── layouts/
    │   │       └── LabPage.tsx      MDX layout
    │   └── schemas/
    │       └── engineSchemas.ts     Lab schemas
    ├── content/
    │   └── labs/                    MDX documentation
    └── contentlayer.config.ts       Contentlayer setup

Total: 150+ modules + engine layer + 70 presets + 75 labs
```

---

## 🔌 API Comparison

### Current API (Direct Imports)

```typescript
// Noise
import { simplexNoise3d } from '@tslstudio/tsl-kit/noise'
const noise = simplexNoise3d(position)

// Lighting
import { fresnel } from '@tslstudio/tsl-kit/lighting'
const fresnelEffect = fresnel(normal, viewDir)

// Materials
import { makeMaterial, presets } from '@tslstudio/tsl-kit/materials'
const material = makeMaterial({
  model: 'pbr',
  layers: [presets.clearcoat({ amount: 0.8 })]
})

// Post-FX
import { PostChain } from '@tslstudio/tsl-kit/postfx/core'
import { BloomPass, ToneMapPass } from '@tslstudio/tsl-kit/postfx/passes'

const chain = new PostChain(renderer, scene, camera)
chain.addPass(new ToneMapPass({ curve: 'ACES' }))
chain.addPass(new BloomPass({ threshold: 1.0 }))

// DSL
import { compileGraph } from '@tslstudio/tsl-kit/dsl'
const result = compileGraph({ kind: 'material', /* ... */ })

// Limitations:
// ❌ No introspection (can't list available modules)
// ❌ No metadata (don't know parameter ranges)
// ❌ Limited presets (only 5 materials)
// ❌ Manual UI setup (Tweakpane requires manual wiring)
```

### Proposed API (Engine + Direct)

```typescript
// ===== NEW: Engine-Based Access =====
import { 
  createEngineContext, 
  registerAllModules 
} from '@tslstudio/tsl-kit/engine'

// Create engine
const engine = createEngineContext({ renderer, scene, camera })
registerAllModules(engine)

// Introspection
console.log(engine.listModules({ kind: 'postfx' }))
// [
//   { id: 'postfx.bloom', label: 'Bloom', params: [...], tags: [...] },
//   { id: 'postfx.dof', label: 'Depth of Field', params: [...] },
//   ...
// ]

// Create via registry
const bloom = engine.createModule('postfx.bloom', { 
  threshold: 1.0, 
  strength: 0.5 
})

// Load presets
const carPaint = engine.createModule('material.preset.carPaint', {
  baseColor: '#1b1f73'
})

// Get module metadata
const bloomMeta = engine.registry.getById('postfx.bloom').meta
console.log(bloomMeta.params)
// [
//   { name: 'threshold', type: 'number', min: 0, max: 5, default: 1.0 },
//   { name: 'strength', type: 'number', min: 0, max: 2, default: 0.5 },
//   ...
// ]

// ===== STILL WORKS: Direct Imports (Backward Compat) =====
import { simplexNoise3d } from '@tslstudio/tsl-kit/noise'
import { BloomPass } from '@tslstudio/tsl-kit/postfx/passes'

// All old code continues to work!

// ===== ENHANCED: Better DSL =====
import { compileGraph } from '@tslstudio/tsl-kit/dsl'

const result = compileGraph({
  kind: 'material',
  preset: 'carPaint',  // 🆕 Can reference presets
  overrides: { baseColor: '#ff0000' }
}, engine)  // 🆕 Can pass engine for registry access

if (!result.success) {
  // 🆕 Better error reporting
  console.error(result.errors)
  // [{ path: 'layers[0].amount', message: 'Must be between 0 and 1' }]
}

// Benefits:
// ✅ Introspection (discover modules at runtime)
// ✅ Metadata (know parameter ranges, types, defaults)
// ✅ 70+ Presets (materials, post-FX, compute)
// ✅ Auto-generated UI (Tweakpane from schemas)
// ✅ Backward compatible (all old imports work)
```

---

## 🎨 Preset Comparison

### Current Presets (5 Total)

```typescript
// packages/tsl-kit/src/materials/presets/

1. carPaint.ts       Car paint material
2. fabric.ts         Fabric material
3. glass.ts          Glass material
4. metal.ts          Metal material
5. skin.ts           Skin material

Total: 5 material presets
       0 post-FX presets
       0 compute presets
```

### Proposed Presets (70+ Total)

```typescript
// packages/tsl-kit/src/engine/presets/

// === Material Presets (40) ===

// PBR (10)
'pbr/metal-brushed'
'pbr/metal-polished'
'pbr/glass-clear'
'pbr/glass-frosted'
'pbr/plastic-matte'
'pbr/plastic-glossy'
'pbr/ceramic'
'pbr/concrete'
'pbr/rubber'
'pbr/leather'

// Surface (10)
'surface/car-paint-metallic'
'surface/car-paint-pearlescent'
'surface/fabric-velvet'
'surface/fabric-silk'
'surface/fabric-denim'
'surface/skin-caucasian'
'surface/skin-subsurface'
'surface/hair-blonde'
'surface/wood-oak'
'surface/marble-white'

// Stylized (10)
'stylized/toon-cel'
'stylized/toon-outline'
'stylized/hologram'
'stylized/neon-glass'
'stylized/crystal'
'stylized/watercolor'
'stylized/ink'
'stylized/comic'
'stylized/pixel-art'
'stylized/low-poly'

// Procedural (10)
'procedural/marble'
'procedural/wood-oak'
'procedural/wood-pine'
'procedural/stone-granite'
'procedural/lava'
'procedural/clouds'
'procedural/terrain'
'procedural/noise-abstract'
'procedural/voronoi-cells'
'procedural/hexagon-pattern'

// === Post-FX Presets (20) ===

// Cinematic (5)
'cinematic/film-standard'
'cinematic/dark-moody'
'cinematic/bright-commercial'
'cinematic/vintage-film'
'cinematic/anamorphic'

// Game (5)
'game/competitive'
'game/stylized'
'game/realistic'
'game/mobile-optimized'
'game/high-end'

// Stylized (5)
'stylized/retro-crt'
'stylized/arcade-neon'
'stylized/comic-book'
'stylized/anime'
'stylized/watercolor-painted'

// Tech/Architectural (5)
'tech/architectural'
'tech/product-viz'
'tech/scientific'
'tech/technical-draw'
'tech/blueprint'

// === Compute Presets (10) ===

// Particles (5)
'particles/magic-sparks'
'particles/rain'
'particles/snow'
'particles/fire-embers'
'particles/swarm-boids'

// Fluids (3)
'fluids/smoke-simulation'
'fluids/ink-drop'
'fluids/water-surface'

// Forces (2)
'forces/vortex-field'
'forces/turbulence-field'

Total: 40 material presets
       20 post-FX presets
       10 compute presets
       = 70 presets
```

---

## 🧪 Showcase vs. LABS Comparison

### Current: Monolithic Showcase

```
apps/showcase/
└── src/
    ├── demos/
    │   ├── individual/                  70+ individual demos
    │   │   ├── _demoBase.js            Shared base
    │   │   ├── bloom.js                One file per module
    │   │   ├── dof.js
    │   │   ├── simplexNoise3d.js
    │   │   └── [67 more...]
    │   ├── AllFeaturesShowcase.js      Mega showcase
    │   ├── ComprehensivePostFXShowcase.js
    │   ├── ComprehensiveSDFShowcase.js
    │   └── [more showcases]
    ├── components/
    │   ├── CategoryFilter.js
    │   └── ModuleStats.js
    └── utils/
        └── SceneManager.js

Structure: Flat list of demos
UI: Manual Tweakpane setup per demo
Documentation: Code comments only
Navigation: Dropdown selector
```

### Proposed: Modular LABS

```
LABS/web/
├── app/
│   ├── labs/
│   │   ├── materials/
│   │   │   ├── pbr-basic/
│   │   │   │   ├── page.mdx            Interactive docs
│   │   │   │   └── schema.ts           Lab config + UI schema
│   │   │   ├── car-paint/
│   │   │   │   ├── page.mdx
│   │   │   │   └── schema.ts
│   │   │   └── [13 more]
│   │   ├── postfx/
│   │   │   ├── cinematic/
│   │   │   │   ├── page.mdx
│   │   │   │   └── schema.ts
│   │   │   ├── bloom/
│   │   │   ├── dof/
│   │   │   └── [17 more]
│   │   ├── compute/
│   │   │   ├── particles/
│   │   │   │   ├── page.mdx
│   │   │   │   └── schema.ts
│   │   │   └── [9 more]
│   │   └── [more categories]
│   ├── components/
│   │   ├── EngineCanvas.tsx            R3F canvas
│   │   ├── LabControlPanel.tsx         Auto-generated Tweakpane
│   │   └── layouts/
│   │       └── LabPage.tsx             MDX layout
│   └── schemas/
│       └── engineSchemas.ts            Schema definitions
└── content/
    └── labs/
        └── [mdx files]                 Markdown documentation

Structure: Category-based hierarchy
UI: Auto-generated from schemas
Documentation: MDX with live examples
Navigation: File-based routing
```

**Key Differences:**

| Feature | Current Showcase | Proposed LABS |
|---------|-----------------|---------------|
| **Structure** | Flat, monolithic | Hierarchical, modular |
| **UI Generation** | Manual Tweakpane | Auto-generated from schemas |
| **Documentation** | Code comments | MDX with live examples |
| **Navigation** | Dropdown selector | File-based routing |
| **Discoverability** | Search/filter | Categories + tags |
| **Maintenance** | Update code + UI | Update schema only |
| **Learning** | Code exploration | Interactive tutorials |

---

## 🔍 Introspection: Before & After

### Before: No Introspection

```typescript
// How many post-FX effects do we have?
// Answer: Count files manually in src/postfx/

// What parameters does BloomPass take?
// Answer: Read the TypeScript file

// What's the valid range for 'threshold'?
// Answer: Look at the implementation

// Which modules support compute shaders?
// Answer: Search codebase manually

// ❌ No programmatic way to discover modules
// ❌ No metadata about parameters
// ❌ No way to generate UI automatically
```

### After: Full Introspection

```typescript
import { createEngineContext, registerAllModules } from '@tslstudio/tsl-kit/engine'

const engine = createEngineContext({ renderer, scene, camera })
registerAllModules(engine)

// How many post-FX effects do we have?
const postfxModules = engine.listModules({ kind: 'postfx' })
console.log(postfxModules.length)  // 25

// What parameters does BloomPass take?
const bloomMeta = engine.registry.getById('postfx.bloom').meta
console.log(bloomMeta.params)
// [
//   { name: 'threshold', type: 'number', min: 0, max: 5, default: 1.0, label: 'Threshold' },
//   { name: 'strength', type: 'number', min: 0, max: 2, default: 0.5, label: 'Strength' },
//   { name: 'radius', type: 'number', min: 0, max: 1, default: 0.85, label: 'Radius' }
// ]

// What's the valid range for 'threshold'?
const thresholdParam = bloomMeta.params.find(p => p.name === 'threshold')
console.log(thresholdParam.min, thresholdParam.max)  // 0, 5

// Which modules support compute shaders?
const computeModules = engine.listModules({ kind: 'compute' })
console.log(computeModules.map(m => m.label))
// ['Particle System', 'Particle Waves', 'Fluid Simulation', ...]

// Which modules have 'noise' tag?
const noiseModules = engine.listModules({ tag: 'noise' })
console.log(noiseModules.map(m => m.label))
// ['Simplex Noise 2D', 'Simplex Noise 3D', 'Curl Noise', ...]

// ✅ Programmatic discovery
// ✅ Parameter metadata with ranges
// ✅ Auto-generate UI controls
// ✅ Filter by kind, category, tags
```

---

## 🎯 Schema-Driven Design

### Before: Manual Tweakpane Setup

```typescript
// Manual Tweakpane setup (current approach)
import { Pane } from 'tweakpane'

const params = {
  threshold: 1.0,
  strength: 0.5,
  radius: 0.85
}

const pane = new Pane()

// Manually create each control
pane.addBinding(params, 'threshold', { min: 0, max: 5, step: 0.1 })
pane.addBinding(params, 'strength', { min: 0, max: 2, step: 0.01 })
pane.addBinding(params, 'radius', { min: 0, max: 1, step: 0.01 })

// Update effect on change
pane.on('change', (ev) => {
  bloomPass.update(params)
})

// Problem:
// - Manual setup for every demo
// - Duplicated min/max values (also in code)
// - No connection to parameter metadata
// - Changes require updating multiple places
```

### After: Schema-Driven UI

```typescript
// Schema-driven approach (proposed)
import { LabControlPanel } from '@/components/LabControlPanel'

const labSchema = {
  id: 'postfx/bloom',
  title: 'Bloom Effect',
  engineConfig: {
    kind: 'postfx',
    passes: [['bloom', { threshold: 1.0, strength: 0.5, radius: 0.85 }]]
  },
  controls: [
    {
      path: 'passes[0][1].threshold',
      label: 'Threshold',
      type: 'number',
      min: 0,
      max: 5,
      step: 0.1,
      category: 'Bloom'
    },
    {
      path: 'passes[0][1].strength',
      label: 'Strength',
      type: 'number',
      min: 0,
      max: 2,
      step: 0.01,
      category: 'Bloom'
    },
    {
      path: 'passes[0][1].radius',
      label: 'Radius',
      type: 'number',
      min: 0,
      max: 1,
      step: 0.01,
      category: 'Bloom'
    }
  ]
}

// UI auto-generated from schema
<LabControlPanel schema={labSchema} state={config} onChange={setConfig} />

// Benefits:
// ✅ Single source of truth (schema)
// ✅ UI generated automatically
// ✅ Consistent across all labs
// ✅ Change schema → UI updates
// ✅ Can export schema for AI agents
```

---

## 📊 Feature Matrix

| Feature | Current | Proposed | Benefit |
|---------|---------|----------|---------|
| **Module Count** | 150+ | 150+ | ✅ Same (no loss) |
| **Backward Compat** | N/A | ✅ 100% | ✅ All old code works |
| **Engine Context** | ❌ No | ✅ Yes | 🆕 Central management |
| **Module Registry** | ❌ No | ✅ Yes | 🆕 Discovery & introspection |
| **Metadata** | ❌ No | ✅ Yes | 🆕 Parameter info |
| **Introspection** | ❌ No | ✅ Yes | 🆕 List modules, filter, search |
| **Material Presets** | 5 | 40 | 🆕 8x more presets |
| **Post-FX Presets** | 0 | 20 | 🆕 Quick cinematic looks |
| **Compute Presets** | 0 | 10 | 🆕 Ready-to-use sims |
| **Total Presets** | 5 | 70 | 🆕 14x more presets |
| **Schema Validation** | Basic | Enhanced | 🆕 Better error reporting |
| **Auto-Generated UI** | ❌ No | ✅ Yes | 🆕 From schemas |
| **Showcase** | Monolithic | LABS | 🆕 Better organization |
| **Documentation** | Comments | MDX | 🆕 Interactive tutorials |
| **Agent-Addressable** | Partial | Full | 🆕 JSON DSL + schemas |
| **TypeScript** | ✅ Yes | ✅ Yes | ✅ Maintained |
| **Performance** | ✅ Good | ✅ Same | ✅ No regression |

---

## 🚀 Migration Path

```
CURRENT                PHASE 1-2              PHASE 3-4              PHASE 5-6
(Week 0)               (Week 2-4)             (Week 6-9)             (Week 13-16)

┌──────────┐          ┌──────────┐          ┌──────────┐          ┌──────────┐
│ TSL-Kit  │    →     │ + Engine │    →     │ + Schema │    →     │ + LABS   │
│ 150 mods │          │   Core   │          │ + 70     │          │ + MDX    │
│ 5 preset │          │ + 150    │          │   Preset │          │ + Auto   │
│ Showcase │          │   Regist │          │ Enhanced │          │   UI     │
└──────────┘          └──────────┘          └──────────┘          └──────────┘

Direct API            Direct API             Direct API             Direct API
only                  + Engine API           + Engine API           + Engine API
                                             + Presets              + Presets
                                                                    + LABS

Backward              ✅ Compat              ✅ Compat              ✅ Compat
Compat: N/A           100%                   100%                   100%
```

### Phase Breakdown

**Phase 1-2** (Weeks 1-4): Engine Foundation + Module Adaptation
- Add engine core without breaking anything
- Add metadata to all 150+ modules
- Test: All old imports still work

**Phase 3-4** (Weeks 5-9): Schema Layer + Preset Expansion
- Enhanced DSL with validation
- Create 70+ presets
- Test: Schemas validate correctly

**Phase 5-6** (Weeks 10-16): LABS + Polish
- Build LABS structure with 75+ examples
- Add MDX documentation
- Auto-generated Tweakpane UI
- Public launch

---

## 💡 Key Takeaways

### What Stays the Same ✅
- ✅ All 150+ modules (no rewrites)
- ✅ All current APIs (backward compatible)
- ✅ Package structure (additive only)
- ✅ TypeScript typing (maintained)
- ✅ Performance (no regression)

### What Gets Added 🆕
- 🆕 Engine context with lifecycle
- 🆕 Module registry for introspection
- 🆕 65+ additional presets (5 → 70)
- 🆕 Enhanced DSL with validation
- 🆕 Schema-driven UI generation
- 🆕 LABS structure with 75+ examples
- 🆕 MDX documentation system
- 🆕 Auto-generated Tweakpane controls

### What Gets Better 🔄
- 🔄 Discoverability (introspection)
- 🔄 Rapid prototyping (70 presets)
- 🔄 Learning curve (interactive docs)
- 🔄 Maintenance (schema-driven)
- 🔄 Agent-friendliness (metadata)

---

**Document Version**: 1.0  
**Last Updated**: November 11, 2025  
**Status**: Complete

**Read Next**: `ADOPTION_ENHANCEMENT_PLAN.md` for detailed implementation steps

