# TSL Engine Architecture & Planning Documents

This directory contains comprehensive planning documents for transforming TSL-Kit into a production-ready, engine-first architecture.

## 📚 Document Overview

### 1. **ADOPTION_ENHANCEMENT_PLAN.md** (Main Document)
**Status**: ✅ Complete (Updated v2.0)  
**Purpose**: Comprehensive migration plan from current implementation to engine architecture with **production-grade showcases**

**What it covers**:
- Current state analysis (150+ modules)
- **Current showcase limitations** (critical gap identified)
- Gap analysis (what we need to add)
- Step-by-step migration strategy
- 6-phase implementation roadmap (20 weeks)
- **Production showcase standards** (detailed requirements)
- Code examples for each phase
- Success metrics and timeline

**Key Findings**:
- ✅ **Current state is strong**: 150+ production-ready modules
- ⚠️ **Critical gap**: Current showcases are basic, need **AAA-quality visuals**
- ✅ **Zero rewrites needed**: All current code stays intact
- 🆕 **Add engine layer**: Wrap existing modules with registry
- 🆕 **Production showcases**: Cinematic quality, professional lighting, dynamic cameras
- 🆕 **Enhance systematically**: Phase-by-phase enhancements
- 🎯 **Timeline**: 20 weeks to production-ready engine with stunning visuals

### 2. **engine_vision.md** (Proposal)
**Purpose**: Comprehensive vision for the engine architecture

**Key concepts**:
- Module map with 16 categories
- 150+ module taxonomy
- Self-contained, plug-and-play design
- Production-ready requirements

### 3. **engine_artitechture.md** (Proposal)
**Purpose**: Technical architecture skeleton

**Key concepts**:
- Engine core structure (EngineContext, ModuleRegistry)
- Module registration patterns
- Type definitions and interfaces

### 4. **LAB showcase implementation.md** (Proposal)
**Purpose**: LABS structure for examples

**Key concepts**:
- LABS mirrors engine modules
- Schema-driven design with Tweakpane
- MDX documentation with Contentlayer
- R3F/Drei canvas integration

### 5. **PRODUCTION_SHOWCASE_REQUIREMENTS.md** (NEW — Critical)
**Status**: ✅ Complete  
**Purpose**: Detailed requirements for production-grade showcase quality

**What it covers**:
- Quality gap analysis (current vs. target)
- Visual quality standards (AAA-game level)
- Lighting, post-FX, camera, animation standards
- Bad vs. Good code examples
- Production checklist (every lab must pass)
- Lab categories with specific examples
- Success criteria and effort estimates

**Key Requirements**:
- 🎬 **Cinematic quality** (not basic demos)
- 💡 **Professional lighting** (3-point or HDRI)
- 🎨 **Art direction** (composition, color theory)
- 📷 **Dynamic cameras** (animated, DOF, framing)
- ✨ **Portfolio-worthy** (shareable quality)

## 🎯 Quick Start: What To Do Next

Based on the analysis, here's the recommended path forward:

### Option A: Full Engine Migration (Recommended)
**Timeline**: 20 weeks  
**Outcome**: Production-ready engine with **AAA-quality LABS**

Follow the 6-phase plan in `ADOPTION_ENHANCEMENT_PLAN.md`:
1. **Phase 1** (Weeks 1-2): Engine Foundation
2. **Phase 2** (Weeks 3-4): Module Adaptation
3. **Phase 3** (Weeks 5-6): Schema Layer
4. **Phase 4** (Weeks 7-9): Preset Expansion
5. **Phase 5** (Weeks 10-14): LABS with **Production-Grade Showcases**
6. **Phase 6** (Weeks 15-20): Visual QA, Documentation & Launch

**Key Focus**: Production showcases (240 hours) — cinematic quality, not basic demos

### Option B: Incremental Enhancement (Flexible)
**Timeline**: Variable  
**Outcome**: Cherry-pick specific enhancements

Choose specific phases based on priority:
- **Need introspection?** → Phase 1-2 (Engine + Registry)
- **Need more presets?** → Phase 4 (Preset Expansion)
- **Need better examples?** → Phase 5 (LABS Structure)
- **Need schema validation?** → Phase 3 (Schema Layer)

### Option C: Current State + Quick Wins (Fast)
**Timeline**: 2-4 weeks  
**Outcome**: Enhanced current implementation

Quick enhancements without full migration:
- Add 30+ more presets (expand existing preset files)
- Improve showcase organization
- Add more DSL schemas
- Better documentation

## 📊 Current State Summary

### What We Have ✅

| Category | Status | Count |
|----------|--------|-------|
| **Noise Functions** | ✅ Complete | 12 |
| **Lighting** | ✅ Complete | 8 |
| **Materials** | ✅ Complete | 20+ |
| **Post-FX** | ✅ Complete | 25+ |
| **Compute** | ✅ Complete | 10+ |
| **SDF** | ✅ Complete | 15+ |
| **Shadows** | ✅ Complete | 3 |
| **Utils** | ✅ Complete | 15+ |
| **WGSL** | ✅ Complete | 3 |
| **Math** | ✅ Complete | 2 |
| **DSL** | ✅ Foundation | 4 |
| **Total Modules** | ✅ Production-Ready | **150+** |

**Package Quality**:
- ✅ TypeScript with strict typing
- ✅ Modular exports (12 entry points)
- ✅ Well-organized directory structure
- ✅ Working showcase with 70+ demos
- ✅ Material API with presets
- ✅ Post-FX pipeline with passes
- ✅ Compute systems (particles, fluids, forces)
- ✅ DSL compiler for JSON configs

### What We're Adding 🆕

| Feature | Priority | Effort | Impact |
|---------|----------|--------|--------|
| **Engine Context** | High | 2 weeks | Foundation for everything |
| **Module Registry** | High | 2 weeks | Introspection & discovery |
| **70+ Presets** | High | 3 weeks | Rapid prototyping |
| **Schema Layer** | High | 2 weeks | Validation & safety |
| **LABS Structure** | Medium | 4 weeks | Better examples |
| **MDX Docs** | Medium | 4 weeks | Interactive learning |
| **Tweakpane Integration** | Medium | 2 weeks | Auto-generated UI |

## 🏗️ Architecture Overview

### Current Architecture

```
packages/tsl-kit/
└── src/
    ├── core/           # Device capabilities
    ├── noise/          # 12 noise functions
    ├── lighting/       # 8 lighting modules
    ├── materials/      # PBR + presets
    ├── postfx/         # 25+ effects + pipeline
    ├── compute/        # Particles, fluids, forces
    ├── sdf/            # SDF primitives
    ├── shadows/        # CSM
    ├── utils/          # 15+ utilities
    ├── wgsl/           # WGSL helpers
    ├── math/           # Bayer, etc.
    └── dsl/            # JSON compiler
```

### Proposed Architecture (After Migration)

```
packages/tsl-kit/
└── src/
    ├── engine/         # 🆕 Engine core
    │   ├── core/           # Context, Registry, Types
    │   ├── api/            # High-level API, Schemas
    │   └── presets/        # 70+ presets, registerAll()
    ├── [existing modules]  # ✅ All unchanged
    └── index.ts        # 🔄 Export engine + modules

LABS/                   # 🆕 Interactive examples
└── web/
    ├── app/
    │   ├── labs/           # 75+ lab examples
    │   ├── components/     # EngineCanvas, LabControlPanel
    │   └── schemas/        # Lab schemas
    └── content/
        └── labs/           # MDX documentation
```

## 🔧 API Evolution

### Current API (Continues to Work)

```typescript
// Direct imports
import { simplexNoise3d } from '@tslstudio/tsl-kit/noise'
import { BloomPass } from '@tslstudio/tsl-kit/postfx/passes'

// Class-based
const bloom = new BloomPass({ threshold: 1.0 })

// DSL
const material = compileGraph({ kind: 'material', /* ... */ })
```

### New API (After Migration)

```typescript
// Engine-based
import { createEngineContext, registerAllModules } from '@tslstudio/tsl-kit/engine'

const engine = createEngineContext({ renderer, scene, camera })
registerAllModules(engine)

// Introspection
console.log(engine.listModules({ kind: 'postfx' }))
// [{ id: 'postfx.bloom', label: 'Bloom', params: [...] }, ...]

// Creation via registry
const bloom = engine.createModule('postfx.bloom', { threshold: 1.0 })

// Preset loading
const carPaint = engine.createModule('material.preset.carPaint', { 
  baseColor: '#1b1f73' 
})
```

**Both APIs work side-by-side** — no breaking changes!

## 📈 Success Metrics

### Phase Completion Targets

| Phase | Week | Deliverable | Metric |
|-------|------|-------------|--------|
| Phase 1 | 2 | Engine Foundation | Context + Registry working |
| Phase 2 | 4 | Module Adaptation | 150 modules registered |
| Phase 3 | 6 | Schema Layer | Validation working |
| Phase 4 | 9 | Preset Expansion | 70+ presets available |
| Phase 5 | 14 | LABS + **Production Showcases** | 75+ **cinematic labs** live |
| Phase 6 | 20 | Visual QA & Launch | **PUBLIC RELEASE** 🚀 |

### Quality Targets

**Code Quality:**
- ✅ **Backward Compatibility**: 100% (all old imports work)
- ✅ **Test Coverage**: 80%+
- ✅ **Documentation**: 100% of public APIs
- ✅ **Performance**: 0 regression
- ✅ **Type Safety**: Strict TypeScript
- ✅ **Bundle Size**: < 2MB

**Visual Quality (NEW — Critical):**
- ✅ **Showcase Quality**: AAA-game level
- ✅ **Lighting**: Professional (3-point or HDRI in every lab)
- ✅ **Post-Processing**: Cinematic (≥5 passes per lab)
- ✅ **Camera Work**: Dynamic (animated in 80%+ labs)
- ✅ **Material Complexity**: Layered (≥3 layers per material)
- ✅ **First Impression**: "Wow factor" (80%+ positive feedback)
- ✅ **Portfolio Quality**: Shareable on social media

## 💡 Key Decisions

### 1. Preserve Everything ✅
**Decision**: Keep all existing code intact, add engine as wrapper  
**Rationale**: Current code is production-ready, zero risk of breaking changes

### 2. Dual API Support ✅
**Decision**: Support both direct imports and engine-based access  
**Rationale**: Gradual adoption, backward compatibility, flexibility

### 3. Schema-Driven Design ✅
**Decision**: Every module has metadata for introspection  
**Rationale**: Enables auto-generated UIs, documentation, agent access

### 4. LABS Over Monolithic Showcase ✅
**Decision**: Migrate to LABS structure with one lab per module  
**Rationale**: Better organization, MDX docs, schema-driven UI

### 5. Preset-First Approach ✅
**Decision**: Create 70+ curated presets for rapid prototyping  
**Rationale**: Lower barrier to entry, showcase best practices

## 🚀 Getting Started

### 1. Read the Main Document
Start with `ADOPTION_ENHANCEMENT_PLAN.md` for full details.

### 2. Choose Your Path
- **Full Migration**: Follow 6-phase plan (16 weeks)
- **Incremental**: Pick specific phases
- **Quick Wins**: Expand presets and docs

### 3. Begin Phase 1
If doing full migration, start with engine foundation:
```bash
# Create engine core structure
mkdir -p packages/tsl-kit/src/engine/core
mkdir -p packages/tsl-kit/src/engine/api
mkdir -p packages/tsl-kit/src/engine/presets

# Follow step-by-step guide in ADOPTION_ENHANCEMENT_PLAN.md
```

## 📞 Questions & Next Steps

### Common Questions

**Q: Do we need to rewrite existing code?**  
A: No! All current code stays intact. We're adding an engine layer on top.

**Q: Will this break existing projects?**  
A: No! All current imports continue to work. The engine is additive.

**Q: How long will this take?**  
A: Full migration: 16 weeks. Incremental: flexible based on priorities.

**Q: Can we cherry-pick features?**  
A: Yes! Each phase is relatively independent after Phase 1-2.

**Q: What if we just want more presets?**  
A: Skip to Phase 4. You can add presets without the engine layer.

### Next Steps

1. Review `ADOPTION_ENHANCEMENT_PLAN.md`
2. Decide on migration approach (full, incremental, or quick wins)
3. If full migration: Start Phase 1 (Engine Foundation)
4. If incremental: Pick priority phases
5. If quick wins: Focus on presets and documentation

---

**Document Version**: 1.0  
**Last Updated**: November 11, 2025  
**Status**: Ready for Decision & Implementation

---

## 📄 Document Index

- **ADOPTION_ENHANCEMENT_PLAN.md** — Main implementation plan with production showcase standards (read this first!)
- **PRODUCTION_SHOWCASE_REQUIREMENTS.md** — Detailed showcase quality requirements (critical for Phase 5)
- **ARCHITECTURE_COMPARISON.md** — Visual comparison (current vs. proposed)
- **engine_vision.md** — Original vision document
- **engine_artitechture.md** — Technical architecture proposal
- **LAB showcase implementation.md** — LABS structure proposal
- **README.md** (this file) — Overview and quick start guide

