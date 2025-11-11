# TSLKit Implementation Roadmap - Phase 1A

## 🎯 Objective
Complete critical missing systems discovered in gap analysis to bring TSLKit to professional production-ready status.

---

## 📋 Phase 1A Overview

**Duration**: 3 weeks  
**Effort**: 46 hours  
**Modules to Add**: 7 critical modules  
**Target Completion**: 62% → 70%

### Success Criteria
- ✅ CSM (Cascaded Shadow Maps) fully working
- ✅ Tiled lighting supporting 1000+ lights
- ✅ Complete SDF/raymarching toolkit
- ✅ Basic lighting system complete
- ✅ Working demos for all new features

---

## 📅 Week-by-Week Breakdown

### Week 1: Cascaded Shadow Maps (CSM)
**Goal**: Industry-standard shadow system  
**Effort**: 20 hours  
**Priority**: CRITICAL

#### Day 1-2: Collection & Study (6h)
- [ ] Copy `CSMShadowNode.js` from `RESOURCES/three.js-r181/examples/jsm/csm/`
- [ ] Copy `CSMFrustum.js` dependency
- [ ] Copy example usage from `webgpu_shadowmap_csm.html`
- [ ] Study cascade splitting algorithms
- [ ] Document API and dependencies

**Deliverables**:
- `COLLECTED_MODULES/shadows/CSMShadowNode.js`
- `COLLECTED_MODULES/shadows/CSMFrustum.js`
- `COLLECTED_MODULES/shadows/_source.json`

#### Day 3-4: Port to TSL-Kit (10h)
- [ ] Create `packages/tsl-kit/src/shadows/` directory
- [ ] Port `CSMShadowNode.ts` with full TypeScript types
- [ ] Port `CSMFrustum.ts` 
- [ ] Update imports for Three.js r181+
- [ ] Add index exports
- [ ] Write unit tests

**Deliverables**:
- `packages/tsl-kit/src/shadows/CSMShadowNode.ts`
- `packages/tsl-kit/src/shadows/CSMFrustum.ts`
- `packages/tsl-kit/src/shadows/index.ts`
- Working TypeScript compilation

#### Day 5: Demo & Integration (4h)
- [ ] Create `apps/showcase/src/demos/CSMShadowDemo.js`
- [ ] Implement 3-cascade setup
- [ ] Add cascade visualization
- [ ] Add debug controls (fade, split mode)
- [ ] Performance testing
- [ ] Browser testing

**Deliverables**:
- Working CSM demo in showcase
- Performance metrics
- Documentation

**Files Created**:
```
COLLECTED_MODULES/shadows/
├── CSMShadowNode.js
├── CSMFrustum.js
└── _source.json

packages/tsl-kit/src/shadows/
├── CSMShadowNode.ts
├── CSMFrustum.ts
└── index.ts

apps/showcase/src/demos/
└── CSMShadowDemo.js
```

---

### Week 2: Tiled Lighting System
**Goal**: High-performance lighting for 1000+ lights  
**Effort**: 16 hours  
**Priority**: HIGH

#### Day 1: Collection & Study (4h)
- [ ] Copy `TiledLightsNode.js` from `RESOURCES/three.js-r181/examples/jsm/tsl/lighting/`
- [ ] Copy example from `webgpu_lights_tiled.html`
- [ ] Study compute shader implementation
- [ ] Study screen-space tiling algorithm
- [ ] Document `circleIntersectsAABB` utility

**Deliverables**:
- `COLLECTED_MODULES/lighting/TiledLightsNode.js`
- Update `COLLECTED_MODULES/lighting/_source.json`

#### Day 2-3: Port to TSL-Kit (8h)
- [ ] Port `TiledLightsNode.ts` to `packages/tsl-kit/src/lighting/`
- [ ] Port `circleIntersectsAABB` utility
- [ ] Implement compute pipeline setup
- [ ] Add TypeScript types
- [ ] Update lighting index exports
- [ ] Write tests

**Deliverables**:
- `packages/tsl-kit/src/lighting/tiledLights.ts`
- `packages/tsl-kit/src/lighting/spatialUtils.ts`
- Working TypeScript compilation

#### Day 4: Demo & Optimization (4h)
- [ ] Create `apps/showcase/src/demos/TiledLightingDemo.js`
- [ ] Implement 500-1000 light demo
- [ ] Add performance comparison (standard vs tiled)
- [ ] Add tile visualization
- [ ] Optimize tile size
- [ ] Browser performance testing

**Deliverables**:
- Working tiled lighting demo
- Performance comparison data
- Best practices documentation

**Files Created**:
```
COLLECTED_MODULES/lighting/
└── TiledLightsNode.js

packages/tsl-kit/src/lighting/
├── tiledLights.ts
└── spatialUtils.ts

apps/showcase/src/demos/
└── TiledLightingDemo.js
```

---

### Week 3: Complete SDF & Lighting Systems
**Goal**: Finalize basic rendering toolkit  
**Effort**: 10 hours  
**Priority**: HIGH

#### Day 1: Raymarching Utilities (6h)
- [ ] Copy `Raymarching.js` from `RESOURCES/three.js-r181/examples/jsm/tsl/utils/`
- [ ] Study `RaymarchingBox` function
- [ ] Study `hitBox` AABB intersection
- [ ] Port to `packages/tsl-kit/src/sdf/raymarching.ts`
- [ ] Add TypeScript types
- [ ] Update SDF examples to use official utilities

**Deliverables**:
- `COLLECTED_MODULES/sdf/Raymarching.js`
- `packages/tsl-kit/src/sdf/raymarching.ts`
- Updated `SDFDemo.js`

#### Day 2: Missing Basic Modules (4h)

**Sphere SDF** (1h):
- [ ] Copy `sphere.ts` from collection
- [ ] Port to `packages/tsl-kit/src/sdf/primitives.ts`
- [ ] Add to SDF shapes

**Directional Lighting** (2h):
- [ ] Copy `directional.ts` from collection
- [ ] Port to `packages/tsl-kit/src/lighting/directional.ts`
- [ ] Add shadow support
- [ ] Update `LightingDemo.js`

**Lighting Utils** (1h):
- [ ] Copy `lighting-utils.ts` from collection
- [ ] Port to `packages/tsl-kit/src/lighting/utils.ts`
- [ ] Add helper functions

**Deliverables**:
- Complete lighting system (7 types)
- Complete SDF toolkit
- Updated demos

**Files Created**:
```
COLLECTED_MODULES/sdf/
└── Raymarching.js

packages/tsl-kit/src/sdf/
└── raymarching.ts

packages/tsl-kit/src/lighting/
├── directional.ts
└── utils.ts
```

---

## 📊 Phase 1A Metrics

### Module Count Progress

| Category | Before Phase 1A | After Phase 1A | Change |
|----------|----------------|----------------|--------|
| Shadows | 0 | 2 (CSM + Frustum) | +2 |
| Lighting | 4 | 7 (+ Tiled, Directional, Utils) | +3 |
| SDF | 2 | 4 (+ Raymarching, Sphere) | +2 |
| **TOTAL** | **59** | **66** | **+7** |

### Completion Progress

| Metric | Before | After | Change |
|--------|--------|-------|--------|
| Total Modules | 107 | 107 | — |
| Ported Modules | 59 | 66 | +7 |
| Completion % | 55% | 62% | +7% |

### Feature Coverage

| System | Before | After |
|--------|--------|-------|
| Shadows | ❌ Basic only | ✅ CSM (industry standard) |
| Lighting | ⚠️ Incomplete (4/7) | ✅ Complete (7/7) + Tiled |
| SDF/Raymarching | ⚠️ Incomplete | ✅ Complete toolkit |

---

## 🎯 Success Criteria Checklist

### Technical Requirements
- [ ] All TypeScript compilation successful
- [ ] No linter errors
- [ ] Unit tests passing
- [ ] Browser tests passing (Chrome, Firefox, Safari)
- [ ] Performance benchmarks met:
  - [ ] CSM shadows: <5ms overhead per cascade
  - [ ] Tiled lighting: 1000 lights at 60fps
  - [ ] Raymarching: 60fps for 128 steps

### Feature Requirements
- [ ] CSM shadows with 3 cascades working
- [ ] Cascade fade between levels
- [ ] Tiled lighting supporting 1000+ lights
- [ ] Screen-space tiling visualization
- [ ] Raymarching box constraints working
- [ ] All lighting types functional

### Documentation Requirements
- [ ] API documentation complete
- [ ] Usage examples for each system
- [ ] Performance considerations documented
- [ ] Best practices guide
- [ ] Migration notes (if any breaking changes)

### Demo Requirements
- [ ] CSMShadowDemo working and interactive
- [ ] TiledLightingDemo showing 500+ lights
- [ ] Updated SDFDemo with raymarching
- [ ] Updated LightingDemo with all 7 types
- [ ] All demos mobile-friendly

---

## 🔧 Technical Considerations

### CSM Shadows

**Key Challenges**:
1. Frustum splitting algorithms (uniform, logarithmic, practical)
2. Cascade transitions (hard vs soft)
3. Shadow bias per cascade
4. Performance with multiple cascades

**Solutions**:
- Implement all 3 split modes
- Add cascade fade option
- Adaptive bias scaling
- Compute shader optimization

**Testing**:
- Large outdoor scenes
- Multiple moving objects
- Dynamic camera movement
- Different device capabilities

---

### Tiled Lighting

**Key Challenges**:
1. Compute shader complexity
2. Tile size optimization
3. Light culling efficiency
4. Memory management for 1000+ lights

**Solutions**:
- Screen-space tiling (32x32 tiles)
- AABB intersection culling
- Texture-based light storage
- Instanced compute dispatch

**Testing**:
- Light density variations
- Screen resolution scaling
- Different tile sizes
- Device capability detection

---

### Raymarching

**Key Challenges**:
1. Step count vs performance
2. Bounding box optimization
3. Early ray termination
4. Smooth normal calculation

**Solutions**:
- Adaptive step size
- Box intersection culling
- Distance-based termination
- Gradient-based normals

**Testing**:
- Complex SDF compositions
- Various box sizes
- Different step counts
- Mobile performance

---

## 📚 Dependencies

### Required Three.js Features
- ✅ WebGPU renderer
- ✅ TSL (Three Shading Language)
- ✅ Compute shader support
- ✅ Shadow mapping system
- ✅ Array camera (for CSM)
- ✅ Data textures
- ✅ Storage buffers

### Required TSL-Kit Modules
- ✅ Lighting base (ambient, diffuse, fresnel, hemisphere)
- ✅ SDF operations & shapes
- ✅ Basic utilities (remap, smooth operators)
- ⬜ Device capability detection (needs enhancement)

### External Dependencies
- ✅ Three.js r181+
- ✅ TypeScript 5.0+
- ✅ Vite (for showcase)
- ✅ WebGPU-capable browser

---

## 🚨 Risk Assessment

### High Risk Items

**1. CSM Complexity** (Risk: Medium)
- **Issue**: Complex frustum mathematics
- **Mitigation**: Use proven Three.js implementation
- **Fallback**: Simpler shadow split modes

**2. Tiled Lighting Performance** (Risk: Medium)
- **Issue**: Compute shader overhead
- **Mitigation**: Tile size optimization
- **Fallback**: Reduce max light count

**3. Browser Compatibility** (Risk: Low)
- **Issue**: WebGPU not universal
- **Mitigation**: Feature detection
- **Fallback**: Graceful degradation

### Medium Risk Items

**4. TypeScript Migration Issues** (Risk: Low-Medium)
- **Issue**: Complex types from JS
- **Mitigation**: Incremental typing
- **Fallback**: `@ts-expect-error` with comments

**5. Demo Performance** (Risk: Low)
- **Issue**: Showcase app complexity
- **Mitigation**: Performance budgets
- **Fallback**: Quality presets

---

## 📝 Acceptance Criteria

### Phase 1A Complete When:

#### Code Quality
- ✅ All TypeScript compiles without errors
- ✅ No linter warnings
- ✅ All tests passing
- ✅ Code coverage >80% for new modules

#### Functionality
- ✅ CSM shadows render correctly
- ✅ Tiled lighting handles 1000 lights
- ✅ Raymarching performs efficiently
- ✅ All lighting types working

#### Performance
- ✅ All demos run at 60fps (desktop)
- ✅ All demos run at 30fps (mobile)
- ✅ No memory leaks
- ✅ Efficient GPU usage

#### Documentation
- ✅ API docs complete
- ✅ Usage examples provided
- ✅ README updated
- ✅ Changelog updated

#### Testing
- ✅ Manual testing complete
- ✅ Browser testing complete
- ✅ Performance benchmarks pass
- ✅ Visual regression tests pass

---

## 🔄 Integration Process

### For Each Module:

#### Step 1: Collection
1. Copy source file from Three.js r181
2. Add to `COLLECTED_MODULES/[category]/`
3. Update `_source.json` with metadata
4. Study implementation

#### Step 2: Port
1. Create TypeScript file in `packages/tsl-kit/src/[category]/`
2. Convert JS → TS
3. Update imports for r181+
4. Add type definitions
5. Update index exports
6. Build and verify

#### Step 3: Test
1. Write unit tests
2. Run tests
3. Fix issues
4. Verify in isolation

#### Step 4: Demo
1. Create or update showcase demo
2. Add UI controls
3. Add documentation
4. Browser test
5. Performance test

#### Step 5: Document
1. Update API reference
2. Add usage examples
3. Update changelog
4. Update main README

---

## 📈 Progress Tracking

### Daily Standup Questions
1. What did I complete yesterday?
2. What am I working on today?
3. Any blockers or issues?
4. Am I on track with the timeline?

### Weekly Review
- Modules completed vs planned
- Time spent vs estimated
- Blockers encountered
- Adjustments needed

### End of Phase Review
- All acceptance criteria met?
- Documentation complete?
- Demos working?
- Ready for Phase 1B?

---

## 🎉 Phase 1A Completion Deliverables

### Code Artifacts
```
COLLECTED_MODULES/
├── shadows/
│   ├── CSMShadowNode.js
│   ├── CSMFrustum.js
│   └── _source.json
├── lighting/
│   └── TiledLightsNode.js (added)
└── sdf/
    └── Raymarching.js (added)

packages/tsl-kit/src/
├── shadows/              (NEW)
│   ├── CSMShadowNode.ts
│   ├── CSMFrustum.ts
│   └── index.ts
├── lighting/
│   ├── tiledLights.ts    (NEW)
│   ├── directional.ts    (NEW)
│   ├── utils.ts          (NEW)
│   └── spatialUtils.ts   (NEW)
└── sdf/
    ├── raymarching.ts    (NEW)
    └── primitives.ts     (updated)

apps/showcase/src/demos/
├── CSMShadowDemo.js      (NEW)
├── TiledLightingDemo.js  (NEW)
├── SDFDemo.js            (updated)
└── LightingDemo.js       (updated)
```

### Documentation
- ✅ API Reference (updated)
- ✅ Usage Examples
- ✅ Performance Guide
- ✅ Migration Notes
- ✅ Changelog Entry

### Metrics
- **Modules Added**: 7
- **Completion**: 62% (55% → 62%)
- **Lines of Code**: ~3000+ (estimated)
- **Demos**: 2 new, 2 updated
- **Time**: 46 hours over 3 weeks

---

## 🚀 Next Steps (Phase 1B Preview)

After Phase 1A completion:
1. **Week 4**: Tile Shadow System (14h)
2. **Week 5**: Procedural Wood Material (12h)
3. **Weeks 6-7**: Complete Post-FX Suite (20h)

---

**Document Status**: ✅ Complete  
**Phase**: 1A - Critical Additions  
**Start Date**: TBD  
**Target End**: TBD +3 weeks  
**Last Updated**: November 11, 2025  
**Version**: 1.0

