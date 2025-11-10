# Refined Prompt: TSLStudio WebGPU Engine Development Plan

## Objective
Analyze existing resources and create comprehensive PRD + planning documentation for building a **self-contained, plug-and-play TSL/WebGPU/matrrialx engine** on Three.js r181+ with pre-built modules ready for production use.

---

## Core Requirements

### 1. Resource Analysis & Port Strategy
**Analyze these resource directories:** (all folders/subfolders/projects/files)
- `RESOURCES/REPOSITORIES/portfolio examples/` (priority)
- `RESOURCES/REPOSITORIES/TSLwebgpuExamples/`
- `RESOURCES/three.js-r181/examples/`(webgpu examples)

**Task:** Identify and catalog:
- Working WebGPU pipelines
- TSL nodes and modules .passes(noise, materials, post-FX, compute)
- Utility functions and helpers
- Effect implementations
- Complete component systems
-materialx and advance materials 
-shaders
-physics/sims/rendering/systems tsl/webgpu modules
-raymarching/sdf
-lighting/shadows
-effects /transitions
and any other related items 


**Port Philosophy:** Direct port existing working code—do NOT rewrite or reinvent. Adopt and adapt only (imports, types, paths). Minimize new bugs by keeping proven implementations intact.


 Resource Inventory
> **Purpose**: Complete catalog of available modules a detailed inventory of all modules, utilities, and systems available for porting from example repositories.
---

### 2. Engine Scope & Features
Build a complete TSL/Node toolkit delivering:
- **Noise & Procedural**: All noise types, SDFs, structures, forms
- **Materials**: Advanced PBR (clearcoat, sheen, anisotropy, iridescence, transmission)
- **Post-FX**: Realistic pipeline (bloom, DOF, TAA, SSR, GTAO, SSGI, color grading)
- **Compute**: Particles, fluids, simulations
- **Agent-Ready APIs**: Clean, typed, JSON-schema validated interfaces

---

### 3. Three.js r181 Migration Research
**Online research required:**
- Study Three.js r181 changelog and breaking changes
- Review TSL/WebGPU migration guides
- Document API changes from r170-r180 → r181
- Identify porting considerations for legacy examples

**Reference documents:**
- `RESOURCES/THREEJS_TSL_knowladge_DOCS/THREEJSr181-DOCS.txt`
- `RESOURCES/THREEJS_TSL_knowladge_DOCS/THREEJSr181-WEBGPU_EXAMPLES.txt`

---

### 4. Context Documents (Review & Synthesize)
Existing proposals and architecture docs:
DOCS\proposal v1
- `.cursor\proposalchat.md` — Original requirements
- `# 📚 TSLStudio readme comprewhensive plan.md` — 20-week roadmap
- `TSLStudio — Comprehensive Development Plan v1.0.md` — Phased approach
- `tsl-toolkit-architecture.md` — Technical architecture
- `tsl-toolkit-plan.md` — Implementation plan
DOCS\proposal v1\RESOURCE_INVENTORY.md and DOCS\proposal v1\TODO.md  an examples of repository inventory docs
**Task:** Synthesize these into ONE unified, actionable plan.

---

## Deliverables Required

### Document 1: PRD (Product Requirements Document)
**Structure:**
1. **Executive Summary** — Vision, scope, success metrics
2. **Technical Architecture** — Stack, packages, module taxonomy
3. **Resource Inventory** — What we're porting from where
4. **Feature Specifications** — Detailed specs per module category
5. **API Design** — TypeScript APIs + Agent JSON DSL schemas
6. **Quality Standards** — Testing, performance, visual parity requirements
7. **Migration Strategy** — Three.js r181 compatibility checklist
8. **Risk Assessment** — Technical risks + mitigation plans

### Document 2: Planning & TODO
**Structure:**
1. **Phase Breakdown** (5 phases, 20 weeks)
2. **Sprint-by-Sprint Tasks** — Granular, day-by-day breakdown
3. **Port Mapping Table** — Source → Target for every module
4. **Dependency Graph** — What must be built first
5. **Acceptance Criteria** — Per-phase & per-module success definitions
6. **Progress Tracking** — Checklist format with status indicators

---

## Analysis Requirements

### A. Codebase Exploration
For each resource folder:
1. **List available modules** by category
2. **Assess port priority** (High/Medium/Low)
3. **Identify dependencies** between modules
4. **Estimate effort** (hours per module)
5. **Flag risks** (API changes, missing deps, performance)

### B. Best Approach Determination
Compare web-gpu pipeline approaches from:
- Maxime Heckel's portfolio examples (clean, modern TSL)
-RESOURCES/REPOSITORIES/portfolio examples/fragments-boilerplate-main
-RESOURCES/REPOSITORIES/portfolio examples/portfolio-main
- TSL sandbox projects (variety of techniques)
- Official Three.js examples (canonical patterns)

**Recommend:** Which patterns to follow, which to avoid, why.

### C. Three.js r181 Compatibility
Research and document:
- Import path changes (`three/tsl`, `three/webgpu`)
- TSL function signature changes
- Deprecated APIs and replacements
- New features we should leverage
- WebGPU renderer initialization patterns (async init)

---

## Output Format

** comprehensive markdown documents:**

RESOURCE_port_modules
Available Resources Analysis


`TSLStudio engine PRD`
   - Technical specification
   - Architecture decisions
   - API contracts
   - Quality gates

`TSLStudio_Implementation_Plan`
   - Actionable task lists
   - Sprint planning
   - Resource mapping
   - Progress tracking

all  should be:
- ✅ Detailed and specific (no vague descriptions)
- ✅ Actionable (clear next steps)
- ✅ Realistic (achievable timelines)
- ✅ Comprehensive (covers all aspects)
- ✅ Reference-linked (cite sources for decisions)

---

## Key Principles

1. **Direct Port First** — Use working code as-is
2. **Minimize Risk** — Don't rewrite proven implementations
3. **Three.js r181 Native** — Follow latest patterns
4. **Agent-Addressable** — Clean APIs with JSON schemas
5. **Production-Ready** — Complete, tested, documented

---

**Begin by exploring the resource directories and creating the inventory, then synthesize all context documents into the unified PRD + Implementation Plan.**