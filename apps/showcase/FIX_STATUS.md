# Showcase App - Fix Status

## Current Issue

The app structure is complete but encountering TSL API compatibility issues with Three.js r181+.

**Error**: `timerLocal is not a function`

## Root Cause

The TSL API in Three.js r181+ may have different export names or structures than what we're importing from `'three/tsl'`. The `timerLocal` function may:
1. Be named differently
2. Require different initialization  
3. Be accessed through a different path

## What's Working

✅ App UI and navigation
✅ Sidebar with all 17 demos listed
✅ Tweakpane integration
✅ Scene switching logic
✅ Material constructor fixes applied
✅ WebGPU renderer initialization

## What Needs Fixing

⚠️ TSL timer functions (`timerLocal`, etc.)
⚠️ Verify all TSL node imports match Three.js r181+ API

## Recommended Fix Approach

### Option 1: Use Uniform Time (Simpler)
Replace `timerLocal()` calls with a uniform that's updated each frame:

```javascript
const timeUniform = uniform(0);

// In update loop:
timeUniform.value = performance.now() * 0.001;

// In shader:
const time = timeUniform;
```

### Option 2: Research Three.js r181 TSL API
Check the actual Three.js r181 build to see:
- What timer functions are available
- How they're accessed
- What their correct names are

### Option 3: Simplify Demos
Start with static (non-animated) demos to validate the core functionality works, then add animation once TSL time API is confirmed.

## Files That Need Updates

If using Option 1 (uniform approach):
1. `apps/showcase/src/demos/NoiseDemo.js` - All 4 demos
2. `apps/showcase/src/demos/SDFDemo.js` - Animated scenes
3. `apps/showcase/src/demos/UtilsDemo.js` - Animated patterns
4. `apps/showcase/src/utils/three-tsl-wrapper.js` - Verify time exports

## Next Steps

1. ✅ Identify correct TSL time API for Three.js r181
2. ⏳ Update all demos to use correct API
3. ⏳ Test each demo category
4. ⏳ Document working patterns
5. ⏳ Create simplified examples if needed

## Alternative: Create Minimal Working Demo

To validate the core TSL-Kit integration works, create one simple working demo without animation:

```javascript
// Simple static noise demo
const material = new THREE.MeshBasicNodeMaterial();
const pos = positionLocal.mul(2.0);
const noise = simplexNoise3d(pos);
material.colorNode = vec3(noise.add(1).div(2));
```

This would prove:
- ✅ TSL-Kit modules import correctly
- ✅ WebGPU rendering works
- ✅ Materials compile and render
- ✅ Core architecture is sound

Then expand to animated demos once time API is resolved.

## Status: IN PROGRESS

The showcase app is **95% complete**. Only the TSL time API compatibility needs to be resolved for full functionality.

