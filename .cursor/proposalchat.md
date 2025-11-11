

# TSLStudio WebGPU Engine Development Plan

## Objective
Build a **self-contained, plug-and-play TSL/WebGPU/MaterialX engine** on Three.js r181+ with pre-built modules ready for production use.

---

## 🎯 PHASE 0: Collection & Research (FIRST PRIORITY)

### Step 1: Comprehensive Resource Discovery & Collection

**BEFORE any planning or documentation**, perform exhaustive exploration and collection of ALL available code, modules, and examples.

#### Target Directories for Deep Scan
Explore EVERY folder, subfolder, and file in:
- ✅ `RESOURCES/REPOSITORIES/portfolio examples/`
  - `portfolio examples/fragments-boilerplate-main/`
  - `portfolio examples/portfolio-main/`
  - All subdirectories and projects
- ✅ `RESOURCES/REPOSITORIES/TSLwebgpuExamples/`
  - All example files and utilities
- ✅ `RESOURCES/three.js-r181/examples/`
  - Focus on `webgpu_*` examples
  - Collect all TSL-related utilities
- ✅ `RESOURCES/tsl/` (if exists)
- ✅ `RESOURCES/materialx/` (if exists)
- ✅ Any other TSL/WebGPU related folders in RESOURCES

#### What to Collect (Exhaustive List)
Identify and catalog EVERYTHING:

**Core TSL Modules:**
- All TSL node definitions and custom nodes
- TSL helper functions and utilities
- TSL composition patterns
- Node graph systems

**Materials & Shading:**
- PBR materials (clearcoat, sheen, anisotropy, iridescence, transmission)
- MaterialX implementations
- Custom shader materials
- Procedural materials
- Advanced lighting models

**Noise & Procedurals:**
- All noise types (Perlin, Simplex, Worley, Voronoi, etc.)
- SDF functions (raymarching, signed distance fields)
- Procedural patterns and structures
- Fractal systems (FBM, domain warping)

**Post-Processing:**
- Bloom/Glow effects
- Depth of Field (DOF)
- Temporal Anti-Aliasing (TAA)
- Screen Space Reflections (SSR)
- Ground Truth Ambient Occlusion (GTAO)
- Screen Space Global Illumination (SSGI)
- Color grading and tone mapping
- Motion blur
- Chromatic aberration
- Vignette and film grain
- Any other post-processing passes

**Compute & Simulation:**
- Particle systems (GPU-based)
- Fluid simulations
- Physics simulations
- Cloth simulation
- Hair/fur systems
- Crowd/agent systems

**Rendering Pipelines:**
- Custom render passes
- Multi-pass rendering systems
- Deferred rendering setups
- Forward+ rendering
- Compute-based rendering

**Effects & Transitions:**
- Visual effects (VFX)
- Transition effects
- Distortion effects
- Particle effects

**Lighting & Shadows:**
- Custom lighting systems
- Shadow mapping techniques
- Volumetric lighting
- Light probes
- Area lights

**Utilities & Helpers:**
- Math utilities
- Geometry utilities
- Buffer management
- Texture utilities
- Performance tools
- Debug tools

**Complete Systems:**
- Working WebGPU pipelines
- Scene management systems
- Camera controls
- Input handlers
- Performance monitoring

#### Collection Process

**1. Deep Scan & Inventory**
- Recursively explore ALL directories and subdirectories
- List every `.js`, `.ts`, `.tsx`, `.glsl`, `.wgsl` file
- Document file paths, purpose, dependencies
- Identify module categories and relationships
- Note which examples are complete vs. partial
- Flag priority items (working, production-ready code)

**2. Physical File Collection**
Create a centralized collection folder:
```
/COLLECTED_MODULES/
  ├── /noise/              # All noise functions
  ├── /materials/          # Material implementations
  ├── /postfx/             # Post-processing effects
  ├── /compute/            # Compute shaders & simulations
  ├── /sdf/                # SDF and raymarching
  ├── /lighting/           # Lighting systems
  ├── /effects/            # Visual effects
  ├── /utils/              # Utilities and helpers
  ├── /pipelines/          # Complete rendering pipelines
  ├── /nodes/              # TSL node definitions
  └── /inventory.md        # Complete catalog with metadata
```

**Copy (don't move) ALL relevant files into this folder**, organized by category.

**3. Create Detailed Inventory**
For each collected item, document:
- **Source Path**: Original location
- **Category**: Type of module/utility
- **Dependencies**: What it requires
- **Complexity**: Simple/Medium/Complex
- **Status**: Complete/Partial/Needs-Work
- **Priority**: High/Medium/Low for porting
- **Three.js Version**: Which version it's from
- **Notes**: Special considerations, risks, etc.

### Step 2: Three.js r181 Migration Research

**Online research required:**
- Study Three.js r181 changelog and breaking changes
- Review TSL/WebGPU migration guides
- Document API changes from r170-r180 → r181
- Identify porting considerations for legacy examples
- Note new features and patterns to leverage

**Reference Documents:**
- `RESOURCES/THREEJS_TSL_knowladge_DOCS/THREEJSr181-DOCS.txt`
- `RESOURCES/THREEJS_TSL_knowladge_DOCS/THREEJSr181-WEBGPU_EXAMPLES.txt`
- Three.js GitHub changelog
- Three.js migration guides

### Step 3: Port Strategy Analysis

**For each collected module**, determine:
- Direct port feasibility (can we use as-is?)
- Required adaptations (imports, types, paths)
- Dependencies that need porting first
- Estimated effort (hours)
- Risk level (Low/Medium/High)
- Target integration point in our engine

**Port Philosophy:**
- ✅ Direct port existing working code—do NOT rewrite or reinvent
- ✅ Adopt and adapt only (imports, types, paths)
- ✅ Minimize new bugs by keeping proven implementations intact
- ✅ Preserve original patterns and techniques
- ❌ Do NOT simplify or "improve" working code
- ❌ Do NOT merge different approaches without testing

---

## 📋 PHASE 1: Planning & Documentation (After Collection)

**Only begin this phase AFTER Phase 0 collection is 100% complete.**

### Context Documents Review
Synthesize these existing documents with collected modules:
- `proposal.md` — Original requirements
- `# 📚 TSLStudio readme comprewhensive plan.md` — 20-week roadmap
- `TSLStudio — Comprehensive Development Plan v1.0.md` — Phased approach
- `tsl-toolkit-architecture.md` — Technical architecture
- `tsl-toolkit-plan.md` — Implementation plan

### Engine Scope Definition
Based on collected modules, define complete TSL/Node toolkit:
- **Noise & Procedural**: All collected noise types, SDFs, structures, forms
- **Materials**: Advanced PBR implementations found in resources
- **Post-FX**: Complete post-processing pipeline from examples
- **Compute**: Particle systems, fluids, simulations from collection
- **Agent-Ready APIs**: Clean, typed, JSON-schema validated interfaces

---

## 📄 Final Deliverables (Based on Collection)

### Document 1: TSLStudio_Engine_PRD.md
**Created AFTER Phase 0 collection is complete**

**Structure:**
1. **Executive Summary** 
   - Vision, scope, success metrics
   - Overview of collected modules

2. **Resource Inventory** 
   - Complete catalog from `/COLLECTED_MODULES/`
   - Source-to-target mapping for every module
   - Module categorization and relationships

3. **Technical Architecture** 
   - Stack decisions based on collected patterns
   - Package dependencies
   - Module taxonomy derived from collection
   - Integration points

4. **Feature Specifications** 
   - Detailed specs per module category
   - Based on actual collected implementations
   - Feature completeness assessment

5. **API Design** 
   - TypeScript APIs derived from collected code
   - Agent JSON DSL schemas
   - Interface contracts

6. **Port Strategy** 
   - Module-by-module adaptation requirements
   - Three.js r181 compatibility checklist
   - Import/type/path changes needed

7. **Quality Standards** 
   - Testing requirements
   - Performance benchmarks
   - Visual parity requirements

8. **Risk Assessment** 
   - Technical risks per module
   - Dependency conflicts
   - Mitigation plans

### Document 2: TSLStudio_Implementation_Plan.md
**Created AFTER Phase 0 collection and PRD are complete**

**Structure:**
1. **Port Mapping Table**
   - Source → Target for EVERY collected module
   - Effort estimates (hours)
   - Dependency chains
   - Priority levels

2. **Phase Breakdown** 
   - Phase 2: Foundation (core utilities, base systems)
   - Phase 3: Core Modules (materials, noise, compute)
   - Phase 4: Advanced Features (post-FX, effects, pipelines)
   - Phase 5: Integration & Polish

3. **Sprint Planning** 
   - Week-by-week breakdown
   - Module-by-module tasks
   - Concrete acceptance criteria

4. **Dependency Graph** 
   - What must be ported first
   - Module interdependencies
   - Blocking vs. parallel work

5. **Adaptation Checklist** 
   - Per-module adaptations needed
   - Import path updates
   - Type fixes
   - API compatibility changes

6. **Progress Tracking** 
   - Checklist format with status indicators
   - Per-module completion status
   - Blockers and risks log

---

## 🔍 Phase 0 Execution Strategy

### Systematic Collection Approach

**Step-by-Step Process:**

1. **Scan & Catalog** (Days 1-2)
   - Use file system tools to list ALL files recursively
   - Create initial categorization spreadsheet
   - Identify patterns and common utilities

2. **Best Practices Analysis** (Day 3)
   - Study Maxime Heckel's portfolio examples
     - `RESOURCES/REPOSITORIES/portfolio examples/fragments-boilerplate-main`
     - `RESOURCES/REPOSITORIES/portfolio examples/portfolio-main`
   - Identify preferred patterns and architectures
   - Document TSL composition approaches
   - Note WebGPU pipeline structures

3. **File Collection** (Days 4-5)
   - Copy ALL relevant files to `/COLLECTED_MODULES/`
   - Organize by category (noise, materials, postfx, etc.)
   - Preserve original folder structure in metadata
   - Include example files that demonstrate usage

4. **Detailed Documentation** (Days 6-7)
   - Create `inventory.md` with full metadata
   - Document dependencies for each module
   - Note Three.js version compatibility
   - Flag integration challenges
   - Estimate porting effort per module

5. **Three.js r181 Research** (Days 7-8)
   - Document breaking changes
   - List import path migrations needed
   - Identify new features to leverage
   - Create compatibility checklist

6. **Priority Assessment** (Day 9)
   - Rank modules by importance
   - Identify "must-have" vs. "nice-to-have"
   - Determine optimal porting order
   - Calculate total effort estimate

7. **Validation** (Day 10)
   - Review completeness of collection
   - Ensure no modules missed
   - Verify categorization accuracy
   - Get stakeholder approval to proceed to Phase 1

---

## 📦 Phase 0 Output Artifacts

### Immediate Deliverable: COLLECTED_MODULES Folder
Physical folder structure with ALL collected code:
```
/COLLECTED_MODULES/
  ├── /noise/
  │   ├── perlin.js
  │   ├── simplex.js
  │   ├── worley.js
  │   └── ...
  ├── /materials/
  │   ├── pbr-advanced.js
  │   ├── materialx-implementations/
  │   └── ...
  ├── /postfx/
  │   ├── bloom.js
  │   ├── dof.js
  │   ├── ssr.js
  │   └── ...
  ├── /compute/
  │   ├── particles/
  │   ├── fluids/
  │   └── ...
  ├── /sdf/
  │   ├── raymarching.js
  │   ├── primitives.js
  │   └── ...
  ├── /lighting/
  ├── /effects/
  ├── /utils/
  ├── /pipelines/
  ├── /nodes/
  └── inventory.md  # ← Master catalog
```

### Immediate Deliverable: inventory.md
Comprehensive spreadsheet-style document with columns:
```markdown
| Module Name | Category | Source Path | Status | Priority | Complexity | Est. Hours | Dependencies | Three.js Version | Notes |
|-------------|----------|-------------|--------|----------|------------|------------|--------------|------------------|-------|
| Perlin Noise | Noise | portfolio-main/src/noise/perlin.ts | Complete | High | Simple | 2 | None | r170 | Needs import updates |
| ... | ... | ... | ... | ... | ... | ... | ... | ... | ... |
```

---

## 🎯 Success Criteria for Phase 0

**Phase 0 is complete when:**
- ✅ ALL target directories fully explored (100% coverage)
- ✅ Every relevant file copied to `/COLLECTED_MODULES/`
- ✅ `inventory.md` contains complete metadata for every module
- ✅ Best practices documented from portfolio examples
- ✅ Three.js r181 compatibility research completed
- ✅ Priority rankings assigned to all modules
- ✅ Total effort estimate calculated
- ✅ No "unknown" or "TBD" items remaining

**Only then proceed to Phase 1 (PRD + Implementation Plan).**

---

## 🔑 Key Principles

1. **Collection Before Planning** — Can't plan what you don't know exists
2. **Physical File Collection** — Copy everything to centralized location
3. **Exhaustive Discovery** — Leave no file unexplored
4. **Direct Port First** — Use working code as-is
5. **Minimize Risk** — Don't rewrite proven implementations
6. **Three.js r181 Native** — Follow latest patterns
7. **Agent-Addressable** — Clean APIs with JSON schemas
8. **Production-Ready** — Complete, tested, documented
9. **Metadata-Driven** — Every module fully documented before porting
10. **Dependency-Aware** — Understand all relationships before integration

---

## 🚀 Next Steps

### Immediate Action Required:
**START PHASE 0 NOW**

1. Begin systematic scan of all resource directories
2. Create `/COLLECTED_MODULES/` folder structure
3. Start copying files and building inventory
4. Document findings in `inventory.md` as you go
5. Do NOT proceed to planning until collection is 100% complete

### Timeline:
- **Phase 0**: 10 days (collection & research)
- **Phase 1**: 5 days (PRD + Implementation Plan creation)
- **Phase 2+**: Implementation (based on Phase 1 plan)

---

**🎯 CURRENT TASK: Execute Phase 0 - Comprehensive Resource Collection & Cataloging**