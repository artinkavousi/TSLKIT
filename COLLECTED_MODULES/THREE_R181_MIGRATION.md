# Three.js r181 Migration Guide

> **Purpose**: Complete migration guide for porting collected TSL/WebGPU modules from r170-r180 to r181+  
> **Date**: November 10, 2025  
> **Target Version**: Three.js r181+

---

## Table of Contents

1. [Critical Changes Overview](#critical-changes-overview)
2. [Import Path Changes](#import-path-changes)
3. [Async Renderer Initialization](#async-renderer-initialization)
4. [TSL Function Updates](#tsl-function-updates)
5. [PostProcessing API Changes](#postprocessing-api-changes)
6. [Compute Pipeline Updates](#compute-pipeline-updates)
7. [MRT (Multiple Render Targets) Setup](#mrt-multiple-render-targets-setup)
8. [Device Capability Detection](#device-capability-detection)
9. [Material System Updates](#material-system-updates)
10. [Breaking Changes Checklist](#breaking-changes-checklist)

---

## Critical Changes Overview

### What's New in r181+

✅ **New Features:**
- Async renderer initialization (prevents init errors)
- Enhanced TSL function helpers (`Fn`, `wgslFn`)
- Improved PostProcessing API with `pass()` nodes
- Better MRT (Multiple Render Targets) support
- Storage texture improvements
- Compute pipeline enhancements
- New TSL display nodes (TRAA, SSGI, SSR improvements)

⚠️ **Breaking Changes:**
- Import paths restructured (`three/webgpu`, `three/tsl`)
- NodeMaterials are WebGPU-first (WebGL node support removed)
- Must await `renderer.init()` before first render
- Old TSL function patterns deprecated
- PostProcessing composer API updated
- Compute shader storage API changed

---

## Import Path Changes

### OLD (r170-r180)

```typescript
// ❌ DEPRECATED - Do not use
import { NodeMaterial } from 'three/examples/jsm/nodes/Nodes.js'
import { color, vec3 } from 'three/examples/jsm/nodes/shadernode/ShaderNode.js'
import { tslFn } from 'three/examples/jsm/nodes/core/Node.js'
```

### NEW (r181+)

```typescript
// ✅ CORRECT - Use these imports
import { MeshPhysicalNodeMaterial, MeshStandardNodeMaterial } from 'three/webgpu'
import { WebGPURenderer } from 'three/webgpu'
import { PostProcessing } from 'three/webgpu'

import { color, vec3, vec4, uv, texture, uniform, attribute } from 'three/tsl'
import { Fn, wgslFn, glslFn } from 'three/tsl'
import { pass, mrt } from 'three/tsl'
import { storage, instancedArray } from 'three/tsl'
```

### Import Mapping Table

| Old Import | New Import | Category |
|------------|------------|----------|
| `three/examples/jsm/nodes/Nodes.js` | `three/webgpu` | Materials |
| `three/examples/jsm/nodes/shadernode/ShaderNode.js` | `three/tsl` | TSL Primitives |
| `three/examples/jsm/nodes/core/Node.js` | `three/tsl` | TSL Functions |
| `three/examples/jsm/tsl/display/*.js` | `three/tsl` | Display Nodes |
| `WebGPURenderer` from examples | `three/webgpu` | Renderer |

### Migration Script Example

```typescript
// Before (r170-r180)
import {
  color,
  vec3,
  uv,
  texture
} from 'three/examples/jsm/nodes/shadernode/ShaderNode.js'

// After (r181+)
import {
  color,
  vec3,
  uv,
  texture
} from 'three/tsl'
```

---

## Async Renderer Initialization

### The Problem

In r180 and earlier, WebGPURenderer could be initialized synchronously, but this caused race conditions and "render() called before backend is initialized" errors.

### The Solution (r181+)

**Always use async initialization:**

```typescript
// ✅ CORRECT - Async pattern
import { WebGPURenderer } from 'three/webgpu'

const renderer = new WebGPURenderer({ 
  antialias: true,
  trackTimestamp: true  // For performance profiling
})

// CRITICAL: Must await init before first render
await renderer.init()

// Now safe to render
renderer.render(scene, camera)
```

### React Three Fiber Integration

```tsx
import { Canvas } from '@react-three/fiber'

function App() {
  return (
    <Canvas
      gl={async () => {
        const { WebGPURenderer } = await import('three/webgpu')
        const renderer = new WebGPURenderer({ 
          antialias: true,
          trackTimestamp: true
        })
        
        // ⚠️ CRITICAL: Must await before returning
        await renderer.init()
        
        return renderer
      }}
    >
      {/* Your scene */}
    </Canvas>
  )
}
```

### Vanilla JavaScript/TypeScript

```typescript
async function initRenderer() {
  const canvas = document.getElementById('canvas')
  const renderer = new WebGPURenderer({ 
    canvas,
    antialias: true 
  })
  
  try {
    await renderer.init()
    console.log('WebGPU renderer initialized successfully')
    return renderer
  } catch (error) {
    console.error('WebGPU not supported:', error)
    // Fallback to WebGLRenderer
    return new THREE.WebGLRenderer({ canvas })
  }
}

// Usage
const renderer = await initRenderer()
```

---

## TSL Function Updates

### Function Declaration Changes

#### OLD (r170-r180)

```typescript
// ❌ DEPRECATED
const myShader = tslFn(() => {
  // function body
})
```

#### NEW (r181+)

```typescript
// ✅ CORRECT - Use Fn()
import { Fn } from 'three/tsl'

const myShader = Fn(() => {
  // function body
})
```

### WGSL Integration

```typescript
import { wgslFn } from 'three/tsl'

const customKernel = wgslFn(`
  fn myKernel(input: vec3<f32>, time: f32) -> vec3<f32> {
    let result = input * sin(time);
    return result;
  }
`)

// Use in material
material.colorNode = customKernel({ input: color(1, 0, 0), time: uniform(0) })
```

### GLSL Integration

```typescript
import { glslFn } from 'three/tsl'

const customShader = glslFn(`
  vec3 myShader(vec3 input, float time) {
    vec3 result = input * sin(time);
    return result;
  }
`)

// Use in material
material.colorNode = customShader({ input: color(1, 0, 0), time: uniform(0) })
```

### Common TSL Patterns

#### Noise Function (Updated)

```typescript
// OLD
const noise = tslFn(([uv]) => {
  // implementation
})

// NEW
import { Fn, uv, float } from 'three/tsl'

const noise = Fn(([uvCoord]) => {
  // Use uvCoord parameter
  const value = /* noise calculation */
  return float(value)
})
```

#### Material Color Node (Updated)

```typescript
// OLD
material.colorNode = tslFn(() => {
  return color(1, 0, 0)
})()

// NEW
import { Fn, color } from 'three/tsl'

material.colorNode = Fn(() => {
  return color(1, 0, 0)
})()
```

---

## PostProcessing API Changes

### Old PostProcessing (r170-r180)

```typescript
// ❌ DEPRECATED
const composer = new EffectComposer(renderer)
const renderPass = new RenderPass(scene, camera)
const bloomPass = new BloomPass(...)
composer.addPass(renderPass)
composer.addPass(bloomPass)
composer.render()
```

### New PostProcessing (r181+)

```typescript
// ✅ CORRECT
import { PostProcessing } from 'three/webgpu'
import { pass } from 'three/tsl'
import { BloomNode } from 'three/tsl'

const postProcessing = new PostProcessing(renderer)

// Create scene pass
const scenePass = pass(scene, camera)
const scenePassColor = scenePass.getTextureNode()

// Add bloom
const bloom = new BloomNode(scenePassColor)

// Set output
postProcessing.outputNode = bloom

// Render
function animate() {
  postProcessing.render()
}
```

### Multi-Pass Setup

```typescript
import { pass, mrt, BloomNode, GTAONode } from 'three/tsl'

// Scene pass with MRT
const scenePass = pass(scene, camera)
scenePass.setMRT(
  mrt({
    output: scenePassColor,
    normal: normalPass,
    depth: depthPass
  })
)

// GTAO using MRT data
const gtao = new GTAONode(normalPass, depthPass, camera)

// Bloom on color
const bloom = new BloomNode(scenePassColor)

// Combine
const combined = scenePassColor.mul(gtao).add(bloom)
postProcessing.outputNode = combined
```

---

## Compute Pipeline Updates

### OLD (r170-r180)

```typescript
// ❌ DEPRECATED - Old compute patterns
const computeShader = /* shader code */
renderer.compute(computeShader, workgroupX, workgroupY, workgroupZ)
```

### NEW (r181+)

```typescript
// ✅ CORRECT - New compute API
import { Fn, storage, instancedArray, uniform } from 'three/tsl'

// Define storage buffers
const particleCount = 512 * 512
const positionBuffer = storage(new THREE.InstancedBufferAttribute(new Float32Array(particleCount * 3), 3), 'vec3', particleCount)
const velocityBuffer = storage(new THREE.InstancedBufferAttribute(new Float32Array(particleCount * 3), 3), 'vec3', particleCount)

// Define compute shader
const computeShader = Fn(() => {
  const position = positionBuffer.element(instanceIndex)
  const velocity = velocityBuffer.element(instanceIndex)
  
  // Update velocity
  velocity.addAssign(vec3(0, -0.01, 0)) // Gravity
  
  // Update position
  position.addAssign(velocity)
  
  // Boundary check
  if (position.y.lessThan(0)) {
    position.y = 0
    velocity.y = velocity.y.negate().mul(0.8)
  }
})()

// Execute compute
await renderer.computeAsync(computeShader)
```

### Particle System Pattern

```typescript
import { Fn, storage, instancedArray, instanceIndex } from 'three/tsl'

class ParticleCompute {
  constructor(count) {
    this.count = count
    
    // Create storage buffers
    this.positionBuffer = storage(
      new THREE.InstancedBufferAttribute(
        new Float32Array(count * 3), 
        3
      ), 
      'vec3', 
      count
    )
    
    // Create compute node
    this.computeNode = Fn(() => {
      const position = this.positionBuffer.element(instanceIndex)
      // Update logic
      position.addAssign(vec3(0, 0.01, 0))
    })()
  }
  
  async update(renderer) {
    await renderer.computeAsync(this.computeNode)
  }
}
```

---

## MRT (Multiple Render Targets) Setup

### Basic MRT

```typescript
import { pass, mrt } from 'three/tsl'

const scenePass = pass(scene, camera)

// Define multiple render targets
scenePass.setMRT(
  mrt({
    output: vec4(),      // Color output
    normal: vec4(),      // Normal buffer
    depth: float(),      // Depth buffer
    velocity: vec2()     // Motion vectors
  })
)

// Access MRT textures
const colorTexture = scenePass.getTextureNode('output')
const normalTexture = scenePass.getTextureNode('normal')
const depthTexture = scenePass.getTextureNode('depth')
```

### MRT for SSR/GTAO

```typescript
// Setup scene with MRT
const scenePass = pass(scene, camera)
scenePass.setMRT(
  mrt({
    output: scenePassColor,
    normal: normalPass.getTextureNode(),
    depth: depthPass.getTextureNode()
  })
)

// Use MRT data for screen-space effects
const ssr = new SSRNode(scenePassColor, normalTexture, depthTexture, camera)
const gtao = new GTAONode(normalTexture, depthTexture, camera)
```

---

## Device Capability Detection

### Check WebGPU Support

```typescript
async function checkWebGPUSupport() {
  if (!navigator.gpu) {
    console.warn('WebGPU not supported in this browser')
    return false
  }
  
  try {
    const adapter = await navigator.gpu.requestAdapter()
    if (!adapter) {
      console.warn('No WebGPU adapter found')
      return false
    }
    
    return true
  } catch (error) {
    console.error('Error requesting WebGPU adapter:', error)
    return false
  }
}
```

### Query Adapter Limits

```typescript
async function getDeviceLimits() {
  const adapter = await navigator.gpu.requestAdapter()
  const device = await adapter.requestDevice()
  
  const limits = {
    maxTextureDimension2D: adapter.limits.maxTextureDimension2D,
    maxStorageBufferBindingSize: adapter.limits.maxStorageBufferBindingSize,
    maxComputeWorkgroupSizeX: adapter.limits.maxComputeWorkgroupSizeX,
    maxComputeWorkgroupSizeY: adapter.limits.maxComputeWorkgroupSizeY,
    maxComputeWorkgroupSizeZ: adapter.limits.maxComputeWorkgroupSizeZ,
    maxColorAttachments: adapter.limits.maxColorAttachments,
    maxColorAttachmentBytesPerSample: adapter.limits.maxColorAttachmentBytesPerSample
  }
  
  return limits
}
```

### Feature Gates for Advanced Effects

```typescript
async function getDeviceCapabilities() {
  const adapter = await navigator.gpu.requestAdapter()
  
  const caps = {
    supportsFloat16: adapter.features.has('shader-f16'),
    supportsTimestamp: adapter.features.has('timestamp-query'),
    supportsDepthClipControl: adapter.features.has('depth-clip-control'),
    maxMRTAttachments: adapter.limits.maxColorAttachments,
    maxMRTBytesPerSample: adapter.limits.maxColorAttachmentBytesPerSample
  }
  
  // Feature-gate advanced effects
  if (caps.maxMRTAttachments >= 4 && caps.maxMRTBytesPerSample >= 32) {
    console.log('SSR/GTAO/SSGI supported')
  } else {
    console.log('Fallback to simpler post-FX')
  }
  
  return caps
}
```

### Adaptive Quality

```typescript
async function selectQualityPreset() {
  const limits = await getDeviceLimits()
  
  // High-end GPU
  if (limits.maxStorageBufferBindingSize >= 1024 * 1024 * 512) {
    return {
      particleCount: 512 * 512,
      postFX: ['bloom', 'dof', 'ssr', 'gtao', 'ssgi', 'traa'],
      fluidResolution: 512
    }
  }
  
  // Mid-range GPU
  if (limits.maxStorageBufferBindingSize >= 1024 * 1024 * 256) {
    return {
      particleCount: 256 * 256,
      postFX: ['bloom', 'dof', 'gtao', 'fxaa'],
      fluidResolution: 256
    }
  }
  
  // Low-end GPU
  return {
    particleCount: 128 * 128,
    postFX: ['bloom', 'fxaa'],
    fluidResolution: 128
  }
}
```

---

## Material System Updates

### NodeMaterial Patterns

```typescript
// ✅ CORRECT - r181+ NodeMaterial
import { MeshPhysicalNodeMaterial } from 'three/webgpu'
import { color, vec3, Fn, uv } from 'three/tsl'

const material = new MeshPhysicalNodeMaterial({
  colorNode: color(0.5, 0.5, 1.0),
  roughnessNode: 0.2,
  metalnessNode: 0.8,
  clearcoatNode: 0.5,
  clearcoatRoughnessNode: 0.1
})

// Custom color logic
material.colorNode = Fn(() => {
  const uvCoord = uv()
  return color(uvCoord.x, uvCoord.y, 0.5)
})()
```

### Advanced Material Features

```typescript
import { MeshPhysicalNodeMaterial } from 'three/webgpu'
import { color, vec3, texture, Fn } from 'three/tsl'

const material = new MeshPhysicalNodeMaterial({
  // Base PBR
  colorNode: color(1, 1, 1),
  roughnessNode: 0.5,
  metalnessNode: 0.0,
  
  // Clearcoat
  clearcoatNode: 0.8,
  clearcoatRoughnessNode: 0.05,
  
  // Sheen (fabric)
  sheenNode: vec3(1, 1, 1),
  sheenRoughnessNode: 0.5,
  
  // Iridescence
  iridescenceNode: 1.0,
  iridescenceIORNode: 1.5,
  iridescenceThicknessRange: vec3(100, 400, 1),
  
  // Anisotropy
  anisotropyNode: 0.7,
  anisotropyRotationNode: 0.0
})
```

---

## Breaking Changes Checklist

### Pre-Migration Checklist

- [ ] Backup current codebase
- [ ] Update Three.js to r181+
- [ ] Review all import statements
- [ ] Identify all NodeMaterial usage
- [ ] Locate all PostProcessing code
- [ ] Find all compute shader implementations
- [ ] Document custom TSL functions

### Migration Steps

#### 1. Update Imports (30 min)

- [ ] Replace `three/examples/jsm/nodes/*` → `three/webgpu` or `three/tsl`
- [ ] Update all TSL function imports
- [ ] Update renderer imports

#### 2. Update Renderer (15 min)

- [ ] Make renderer initialization async
- [ ] Add `await renderer.init()`
- [ ] Update R3F Canvas pattern (if using React)

#### 3. Update TSL Functions (1-2 hours)

- [ ] Replace `tslFn` → `Fn`
- [ ] Update function signatures
- [ ] Test each function individually

#### 4. Update PostProcessing (2-4 hours)

- [ ] Replace old EffectComposer
- [ ] Migrate to new PostProcessing API
- [ ] Update pass composition
- [ ] Test visual parity

#### 5. Update Compute Shaders (3-6 hours)

- [ ] Update storage buffer patterns
- [ ] Replace old compute dispatch
- [ ] Update instancedArray usage
- [ ] Test compute output

#### 6. Test & Validate (2-4 hours)

- [ ] Visual regression tests
- [ ] Performance benchmarks
- [ ] Device compatibility tests
- [ ] Error handling tests

### Post-Migration Validation

- [ ] All modules render correctly
- [ ] No console errors or warnings
- [ ] Performance matches or exceeds baseline
- [ ] Visual parity confirmed (ΔE < 2)
- [ ] Compute shaders produce correct output
- [ ] PostProcessing chain works as expected
- [ ] Device capability detection working
- [ ] Fallbacks function correctly

---

## Quick Reference Card

### Essential Imports

```typescript
// Renderer & Materials
import { WebGPURenderer, MeshPhysicalNodeMaterial } from 'three/webgpu'

// TSL Primitives
import { color, vec3, vec4, uv, texture, uniform } from 'three/tsl'

// TSL Functions
import { Fn, wgslFn, glslFn } from 'three/tsl'

// PostProcessing
import { PostProcessing } from 'three/webgpu'
import { pass, mrt } from 'three/tsl'

// Compute
import { storage, instancedArray, instanceIndex } from 'three/tsl'

// Display Nodes
import { BloomNode, DepthOfFieldNode, GTAONode, SSRNode } from 'three/tsl'
```

### Common Patterns

```typescript
// Async Renderer
const renderer = new WebGPURenderer()
await renderer.init()

// TSL Function
const myFunc = Fn(() => { /* logic */ })()

// PostProcessing
const postProcessing = new PostProcessing(renderer)
postProcessing.outputNode = /* output */

// Compute
const compute = Fn(() => { /* compute logic */ })()
await renderer.computeAsync(compute)
```

---

**Status**: ✅ Ready for use  
**Last Updated**: November 10, 2025  
**Version**: 1.0

