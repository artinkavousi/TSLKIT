# Honest Demo Testing Results
**Date**: November 11, 2025

## ✅ **WORKING DEMOS (2/6 confirmed functional)**

### 1. Tiled Lighting Demo - ✅ FULLY FUNCTIONAL
**Status**: ACTUALLY WORKS AS INTENDED

**Visual Evidence**: Screenshot shows:
- 500 point lights rendering in dark scene
- Objects clearly illuminated with colored lighting (green, pink, purple, yellow, blue)
- Dark background with proper light falloff
- GUI confirms "Mode: Tiled" is active

**Code Fixes Applied**:
- Added `renderer.lightsNode = tiledLightsNode` to apply tiled system
- Fixed toggle function to properly switch between tiled/standard

**What it demonstrates**: Efficient rendering of 500+ dynamic point lights using tiled deferred lighting system

---

### 2. Lighting Utilities Example - ✅ FULLY FUNCTIONAL  
**Status**: ACTUALLY WORKS AS INTENDED

**Visual Evidence**: Screenshot shows:
- Beautiful cyan/turquoise sphere with fresnel rim lighting effect
- Bright cyan glow around edges (fresnel effect)
- Dark blue core
- Smooth gradation from center to edges

**What it demonstrates**: Fresnel lighting utility function working correctly in TSL

---

## ⚠️ **PARTIALLY WORKING (1/6)**

### 3. CSM Shadow Demo - ⚠️ RENDERING BUT BUGGY
**Status**: RENDERS BUT HAS ERRORS

**Visual Evidence**:
- 3D objects render and animate correctly
- Sky gradient and ground plane visible
- GUI controls work

**Problems**:
```
TypeError: Cannot read properties of undefined (reading 'set')
at CSMShadowNode._setLightBreaks
at CSMShadowNode.updateFrustums
```

**Root Cause**: Bug in `packages/tsl-kit/src/shadows/CSMShadowNode.ts` line 182
- Trying to call `.set()` on undefined property
- Likely an issue with how CSM frustums or shadow camera is initialized

**Code Fixes Applied**:
- Added `renderer.shadowNode = csm` ✅
- Added `csm.updateFrustums()` in animation loop ✅
- But CSMShadowNode.ts has implementation bug ❌

**What needs fixing**: CSMShadowNode._setLightBreaks() method

---

## ❌ **NOT YET TESTED (3/6)**

### 4. CSM Shadow Example
### 5. Tiled Lighting Example  
### 6. Post-FX Example (known to have gtao import error)

---

## 📊 **SUMMARY**

| Demo | Status | TSLKit Module Used | Actually Works? |
|------|--------|-------------------|-----------------|
| Tiled Lighting Demo | ✅ WORKING | `tiledLights()` | YES - 500 lights visible |
| Lighting Utils Example | ✅ WORKING | `fresnel()` | YES - rim lighting visible |
| CSM Shadow Demo | ⚠️ BUGGY | `CSMShadowNode` | NO - runtime errors |
| CSM Shadow Example | ❓ UNTESTED | `CSMShadowNode` | Unknown |
| Tiled Lighting Example | ❓ UNTESTED | `tiledLights()` | Unknown |
| Post-FX Example | ❌ ERROR | postfx modules | NO - import errors |

---

## 🔧 **REQUIRED FIXES**

### High Priority
1. **Fix CSMShadowNode._setLightBreaks()** - Line 182 bug causing undefined property access
2. **Test remaining 3 demos** to verify they work
3. **Fix Post-FX gtao import** error

### What's Actually Working
- ✅ Tiled lighting system (500+ lights rendering efficiently)
- ✅ Fresnel lighting utility
- ✅ WebGPU renderer initialization
- ✅ GUI controls and stats displays
- ✅ Object rendering and animation

### What's NOT Working
- ❌ CSM shadow system (implementation bug)
- ❌ Post-FX examples (import errors)

---

## 🎯 **NEXT STEPS**

1. Fix `CSMShadowNode._setLightBreaks()` bug
2. Test CSMShadowExample and TiledLightingExample
3. Fix Post-FX gtao dependency
4. Verify all demos show what they're supposed to

---

**Conclusion**: 2 out of 6 tested demos are ACTUALLY working and demonstrating their intended TSLKit features. The others need bug fixes in the TSLKit source code, not just the demo code.

