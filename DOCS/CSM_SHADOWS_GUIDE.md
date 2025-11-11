# Cascade Shadow Maps (CSM) - Complete Guide

> **Module**: `@tslstudio/tsl-kit/shadows`  
> **Version**: 1.0.0  
> **Three.js**: r181+  
> **Renderer**: WebGPU only

---

## 📖 Overview

Cascade Shadow Maps (CSM) is an industry-standard technique for rendering high-quality shadows in large outdoor scenes. It solves the problem of shadow resolution by dividing the camera frustum into multiple cascades, each with its own shadow map.

### Why CSM?

**Standard Shadow Maps**: One shadow map covers entire scene
- Poor resolution close to camera
- Wasted resolution far from camera
- Visible shadow pixelation

**Cascade Shadow Maps**: Multiple shadow maps at different distances
- ✅ High resolution close to camera
- ✅ Good coverage at distance
- ✅ Optimal resolution distribution
- ✅ AAA-quality shadows

---

## 🚀 Quick Start

### Basic Setup

```typescript
import WebGPURenderer from 'three/addons/renderers/webgpu/WebGPURenderer.js'
import { DirectionalLight } from 'three/webgpu'
import { CSMShadowNode } from '@tslstudio/tsl-kit/shadows'

// Create scene, camera, renderer
const renderer = new WebGPURenderer()
const scene = new THREE.Scene()
const camera = new THREE.PerspectiveCamera(60, aspect, 0.1, 1000)

// Create directional light
const sun = new DirectionalLight(0xffffff, 1.5)
sun.position.set(100, 100, 50)
sun.castShadow = true

// Configure standard shadow (required)
sun.shadow.mapSize.width = 2048
sun.shadow.mapSize.height = 2048
sun.shadow.camera.near = 0.5
sun.shadow.camera.far = 500

scene.add(sun)

// Create CSM with 3 cascades
const csm = new CSMShadowNode(sun, {
  cascades: 3,
  mode: 'practical',
  maxFar: 500,
  lightMargin: 200
})

// Enable fade between cascades (optional)
csm.fade = true

// Update frustums when camera changes
function animate() {
  csm.updateFrustums()
  renderer.render(scene, camera)
}
```

### Enable Shadow Casting/Receiving

```typescript
// Ground receives shadows
const ground = new THREE.Mesh(groundGeometry, groundMaterial)
ground.receiveShadow = true
scene.add(ground)

// Objects cast shadows
const object = new THREE.Mesh(geometry, material)
object.castShadow = true
object.receiveShadow = true
scene.add(object)
```

---

## 📋 API Reference

### CSMShadowNode

Main class for cascade shadow mapping.

#### Constructor

```typescript
new CSMShadowNode(light: DirectionalLight, config?: CSMShadowNodeData)
```

**Parameters:**
- `light`: DirectionalLight - The sun/directional light to use
- `config`: Optional configuration object

**Config Options:**

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `cascades` | number | 3 | Number of shadow cascades (1-5 recommended) |
| `maxFar` | number | 100000 | Maximum far distance for shadows |
| `mode` | string | 'practical' | Split mode: 'uniform', 'logarithmic', 'practical', 'custom' |
| `lightMargin` | number | 200 | Extra margin for shadow bounds |
| `customSplitsCallback` | function | - | Custom split function (if mode='custom') |

#### Properties

```typescript
// Configuration
csm.cascades: number              // Number of cascades
csm.maxFar: number                // Maximum shadow distance
csm.mode: CSMMode                 // Split mode
csm.lightMargin: number           // Shadow bounds margin
csm.fade: boolean                 // Enable fade between cascades

// Runtime State
csm.camera: Camera | null         // Current scene camera
csm.breaks: number[]              // Cascade split positions (0-1)
csm.frustums: CSMFrustum[]        // Cascade frustums
csm.lights: LwLight[]             // Cascade lights (internal)
```

#### Methods

```typescript
// Update cascade frustums (call when camera changes)
csm.updateFrustums(): void

// Dispose resources
csm.dispose(): void
```

---

## 🎨 Split Modes

CSM supports 4 split modes that determine how the frustum is divided:

### 1. Uniform ('uniform')

Splits frustum into equal-sized sections.

```typescript
const csm = new CSMShadowNode(sun, {
  mode: 'uniform',
  cascades: 3
})
```

**Characteristics:**
- Simple, predictable splits
- Equal distance per cascade
- Not optimal for most scenes

**Use When:**
- Uniform scene depth
- Testing/debugging
- Simple scenes

### 2. Logarithmic ('logarithmic')

Splits based on logarithmic distribution.

```typescript
const csm = new CSMShadowNode(sun, {
  mode: 'logarithmic',
  cascades: 3
})
```

**Characteristics:**
- More resolution near camera
- Less resolution far away
- Follows perspective projection

**Use When:**
- Outdoor scenes
- Large view distances
- Objects mostly near camera

### 3. Practical ('practical') ⭐ Recommended

Blends uniform and logarithmic (lambda = 0.5).

```typescript
const csm = new CSMShadowNode(sun, {
  mode: 'practical',  // Default
  cascades: 3
})
```

**Characteristics:**
- ✅ Best general-purpose option
- Balances near and far quality
- Used in most AAA games

**Use When:**
- Most scenes
- When unsure
- Production use

### 4. Custom ('custom')

User-defined split function.

```typescript
const csm = new CSMShadowNode(sun, {
  mode: 'custom',
  customSplitsCallback: (cascades, near, far, breaks) => {
    // Custom logic to fill breaks array
    for (let i = 1; i < cascades; i++) {
      breaks.push((near + (far - near) * i / cascades) / far)
    }
    breaks.push(1)
  }
})
```

**Use When:**
- Special scene requirements
- Fine-tuning for specific game
- Research/experimentation

---

## 🎯 Configuration Guide

### Cascade Count

**Recommendation**: 3-4 cascades

```typescript
cascades: 3  // ✅ Good for most scenes
cascades: 4  // ✅ Better quality, slight performance cost
cascades: 2  // ⚠️ Lower quality, better performance
cascades: 5  // ⚠️ Diminishing returns, more overhead
```

**Trade-offs:**
- More cascades = better quality, more GPU cost
- Fewer cascades = better performance, visible transitions

### Max Far Distance

Maximum distance to render shadows.

```typescript
maxFar: 500   // ✅ Medium-large scene
maxFar: 1000  // ✅ Large outdoor scene
maxFar: 100   // ✅ Small scene
```

**Tips:**
- Match to your scene scale
- Don't make unnecessarily large
- Should be ≤ camera far plane

### Light Margin

Extra padding around shadow frustum.

```typescript
lightMargin: 200  // ✅ Default, good for most
lightMargin: 400  // Use for very dynamic scenes
lightMargin: 100  // Use if shadows are clipping
```

**Purpose:**
- Prevents shadow clipping when objects move
- Larger = more stable, but wastes resolution

### Fade Between Cascades

Smooth transitions between cascades.

```typescript
csm.fade = true   // ✅ Smooth transitions (recommended)
csm.fade = false  // Visible seams (faster)
```

**Visual Impact:**
- `true`: Smooth, invisible cascade boundaries
- `false`: Sharp visible lines between cascades

---

## 🎮 Usage Patterns

### Standard Setup (Outdoor Scene)

```typescript
const csm = new CSMShadowNode(sun, {
  cascades: 3,
  mode: 'practical',
  maxFar: 500,
  lightMargin: 200
})
csm.fade = true

// In render loop
function animate() {
  csm.updateFrustums()
  renderer.render(scene, camera)
}
```

### High-Quality Setup (Cinematic)

```typescript
const csm = new CSMShadowNode(sun, {
  cascades: 4,
  mode: 'practical',
  maxFar: 1000,
  lightMargin: 300
})
csm.fade = true

// Higher resolution shadow maps
sun.shadow.mapSize.width = 4096
sun.shadow.mapSize.height = 4096
```

### Performance Setup (Mobile)

```typescript
const csm = new CSMShadowNode(sun, {
  cascades: 2,
  mode: 'practical',
  maxFar: 300,
  lightMargin: 150
})
csm.fade = false  // Skip fade for performance

// Lower resolution
sun.shadow.mapSize.width = 1024
sun.shadow.mapSize.height = 1024
```

### Dynamic Time-of-Day

```typescript
// Update sun position over time
function updateTimeOfDay(time: number) {
  const angle = time * Math.PI * 2
  sun.position.x = Math.cos(angle) * 100
  sun.position.y = Math.sin(angle) * 100
  sun.position.z = 50
  
  // CSM automatically updates
  csm.updateFrustums()
}
```

---

## 🐛 Troubleshooting

### Shadows Not Visible

**Check:**
1. ✅ Is WebGPU renderer used? (CSM is WebGPU-only)
2. ✅ Is `castShadow` enabled on objects?
3. ✅ Is `receiveShadow` enabled on ground?
4. ✅ Is light casting shadows? (`light.castShadow = true`)
5. ✅ Is `csm.updateFrustums()` called each frame?

### Shadow Clipping/Cutting Off

**Solutions:**
- Increase `lightMargin` (e.g., 200 → 400)
- Increase `maxFar` to cover scene
- Check light shadow camera bounds

### Visible Cascade Seams

**Solutions:**
- Enable fade: `csm.fade = true`
- Increase cascade count (3 → 4)
- Adjust split mode (try 'practical')
- Increase shadow map resolution

### Poor Shadow Quality

**Solutions:**
- Increase shadow map resolution (2048 → 4096)
- Increase cascade count (3 → 4)
- Reduce `maxFar` to focus resolution
- Use 'logarithmic' mode for near-camera quality

### Performance Issues

**Solutions:**
- Reduce cascade count (3 → 2)
- Reduce shadow map resolution (2048 → 1024)
- Reduce `maxFar` distance
- Disable fade: `csm.fade = false`
- Limit number of shadow-casting objects

---

## 📊 Performance Considerations

### GPU Cost

| Cascades | Shadow Maps | Relative Cost |
|----------|-------------|---------------|
| 2        | 2x renders  | 1.0x          |
| 3        | 3x renders  | 1.5x          |
| 4        | 4x renders  | 2.0x          |

**Per-frame work:**
- Shadow map rendering (main cost)
- Frustum calculations (minimal)
- Cascade selection (minimal)

### Optimization Tips

1. **Use appropriate cascade count**
   - Desktop: 3-4 cascades
   - Mobile: 2-3 cascades

2. **Match shadow map size to target**
   - Desktop: 2048-4096
   - Mobile: 1024-2048

3. **Reduce shadow-casting objects**
   - Only important objects cast shadows
   - Use LOD for distant objects

4. **Adjust `maxFar` appropriately**
   - Don't shadow entire scene
   - Match to gameplay needs

5. **Consider static shadows**
   - Bake static shadows when possible
   - Use CSM only for dynamic objects

---

## 🎓 Best Practices

### ✅ Do

- ✅ Use 'practical' mode for most scenes
- ✅ Enable fade between cascades
- ✅ Call `updateFrustums()` each frame
- ✅ Match `maxFar` to scene scale
- ✅ Use 3-4 cascades for quality
- ✅ Test on target hardware

### ❌ Don't

- ❌ Use more than 5 cascades
- ❌ Set `maxFar` unnecessarily large
- ❌ Forget to call `updateFrustums()`
- ❌ Use uniform mode in production
- ❌ Enable shadows on all objects
- ❌ Use CSM with WebGL renderer

---

## 📚 Examples

See `demos/CSMShadowDemo.js` for a complete interactive example with:
- 3-cascade setup
- Cascade visualization
- Mode switching
- Fade controls
- Real-time stats

---

## 🔗 Related

- **Three.js CSM**: Original implementation for WebGL
- **MaterialX**: Material/shadow integration
- **TiledLightsNode**: For many point lights
- **SDF Shadows**: Soft shadows for SDFs

---

## 📝 Technical Notes

### How CSM Works

1. **Frustum Split**: Camera frustum divided into cascades
2. **Per-Cascade Shadow Map**: Each cascade gets own shadow map
3. **Tight Fitting**: Each shadow map fits cascade tightly
4. **Runtime Selection**: Shader picks correct cascade per fragment
5. **Optional Fade**: Blend between cascades at boundaries

### Cascade Selection

Fragment shader selects cascade based on view-space depth:
- Near fragments → Cascade 0 (highest resolution)
- Mid fragments → Cascade 1
- Far fragments → Cascade 2 (lowest resolution)

### Memory Usage

**Example** (3 cascades, 2048×2048 per cascade):
- Shadow maps: 3 × 2048 × 2048 × 4 bytes = 48 MB
- CPU overhead: < 1 MB

---

**Last Updated**: November 11, 2025  
**Version**: 1.0.0  
**Author**: TSLKit Contributors

