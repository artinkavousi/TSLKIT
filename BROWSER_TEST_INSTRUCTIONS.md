# 🌐 Browser Testing Instructions

## 🚀 Quick Test (No Build Required)

**File:** `tslstudio/test-browser.html`

### How to Test:
1. **Open in Browser:**
   - Use Chrome 113+ or Edge 113+
   - Open `tslstudio/test-browser.html`
   - WebGPU must be enabled

2. **What You'll See:**
   - Rotating sphere with procedural material
   - Material selection dropdown
   - Scale and rotation controls
   - FPS counter
   - Status indicators

3. **Test Materials:**
   - Switch between 8 sample materials
   - Adjust scale and rotation
   - Click "Test All Materials" button
   - Verify each material renders correctly

4. **Sample Materials Included:**
   - ✅ Marble - Veined marble pattern
   - ✅ Wood - Wood grain rings
   - ✅ Clouds - Cloud-like noise
   - ✅ Bricks - Brick wall pattern
   - ✅ Caustics - Animated water reflections
   - ✅ Grid - 3D grid pattern
   - ✅ Stars - Starfield effect
   - ✅ Rust - Rusty metal texture

---

## 🏗️ Full Library Test (Requires Build)

To test all 53 materials from the built package:

### Step 1: Build the Package
```bash
cd tslstudio
npm run build
```

### Step 2: Create Test Server
You need a local server to test ES modules:

**Option A: Using Python**
```bash
cd tslstudio
python -m http.server 8000
# Open: http://localhost:8000/test-browser.html
```

**Option B: Using Node**
```bash
cd tslstudio
npx serve .
# Follow the URL shown
```

**Option C: Using VS Code**
- Install "Live Server" extension
- Right-click `test-browser.html`
- Select "Open with Live Server"

### Step 3: Test Full Library
Once you can import from `dist/`, modify the test to:
```html
<script type="module">
    // Import all materials from built package
    import * as Materials from './dist/index.js';
    
    // Test all 53 materials
    console.log('Available materials:', Object.keys(Materials));
    // ... test each one
</script>
```

---

## ✅ What to Verify

### 1. **WebGPU Status** ✅
- Should show: "WebGPU: ✅ Available"
- If not: Update browser or enable WebGPU flags

### 2. **Three.js Loading** ✅
- Should show: "Three.js: ✅ Loaded"
- If not: Check internet connection (CDN)

### 3. **Material Rendering** ✅
- Each material should display on sphere
- Should rotate smoothly
- Should respond to controls
- FPS should be 60 (or close)

### 4. **Visual Verification** ✅
- Marble: White/gray veined pattern
- Wood: Brown concentric rings
- Clouds: Soft white/gray clouds
- Bricks: Red/brown brick pattern
- Caustics: Animated blue water effect
- Grid: White grid lines on black
- Stars: Bright points on black
- Rust: Orange/brown weathered metal

---

## 🐛 Troubleshooting

### "WebGPU Not Available"
**Solution:**
- Use Chrome 113+ or Edge 113+
- Enable WebGPU in `chrome://flags`
- Search for "WebGPU" and enable it
- Restart browser

### "Three.js Not Loading"
**Solution:**
- Check internet connection
- CDN may be blocked
- Try different network

### "Material Not Rendering"
**Solution:**
- Check browser console for errors
- Verify WebGPU is working
- Try different material
- Refresh page

### "Low FPS / Laggy"
**Solution:**
- Reduce sphere geometry detail
- Lower rotation speed
- Check GPU usage
- Close other GPU-intensive apps

---

## 📊 Expected Results

### Performance
- **FPS:** 60 (optimal)
- **Rendering:** Smooth
- **Switching:** Instant
- **Memory:** Stable

### Visual Quality
- **Sphere:** Smooth and round
- **Materials:** Clear patterns
- **Lighting:** Proper shading
- **Colors:** Accurate

---

## 🧪 Advanced Testing

### Test Custom Parameters
Modify the material creation to test parameters:

```javascript
const material = new THREE.MeshStandardNodeMaterial();
material.colorNode = marble({
    scale: 3,        // Change scale
    seed: 42,        // Change seed
    color: new THREE.Color(0xFF0000)  // Change color
});
```

### Test Special Channels
For materials with opacity, normal, etc.:

```javascript
// Clouds with opacity
material.colorNode = clouds({ scale: 1.5 });
material.opacityNode = clouds.opacity({ scale: 1.5 });
material.transparent = true;

// Brain with normal map
material.colorNode = brain({ scale: 2 });
material.normalNode = brain.normal({ scale: 2 });
```

### Test Animated Materials
For caustics, turbulentSmoke, staticNoise:
- Should animate automatically
- Time-based patterns
- Smooth animation

---

## ✅ Success Criteria

**Test is successful if:**
1. ✅ Page loads without errors
2. ✅ WebGPU shows as available
3. ✅ Three.js loads successfully
4. ✅ At least 7/8 sample materials render
5. ✅ FPS is above 30
6. ✅ Materials switch instantly
7. ✅ Controls work properly
8. ✅ No console errors

---

## 📝 Test Report Template

```markdown
## Browser Test Results

**Date:** [Date]
**Browser:** [Chrome/Edge version]
**GPU:** [Your GPU]

### Results:
- [ ] WebGPU Available
- [ ] Three.js Loaded
- [ ] Marble rendered
- [ ] Wood rendered
- [ ] Clouds rendered
- [ ] Bricks rendered
- [ ] Caustics rendered (animated)
- [ ] Grid rendered
- [ ] Stars rendered
- [ ] Rust rendered

**FPS:** [Your FPS]
**Issues:** [Any issues encountered]
**Status:** ✅ PASS / ❌ FAIL
```

---

## 🚀 Next Steps

### If Test Passes ✅
1. Test full material library (all 53)
2. Test special channels
3. Test parameter variations
4. Performance profiling
5. Visual regression tests

### If Test Fails ❌
1. Check browser version
2. Enable WebGPU
3. Check console errors
4. Try simpler materials first
5. Report issues

---

## 💡 Tips

1. **Use DevTools** - Open console to see detailed logs
2. **Test Incrementally** - One material at a time
3. **Check Performance** - Monitor FPS and GPU usage
4. **Compare Visuals** - Materials should match descriptions
5. **Test Edge Cases** - Extreme parameter values

---

## 📞 Support

If you encounter issues:
1. Check console for error messages
2. Verify WebGPU availability
3. Try different browser
4. Check GPU drivers
5. Report detailed error info

---

**Status:** ✅ **READY FOR BROWSER TESTING**

**Open `tslstudio/test-browser.html` in Chrome 113+ to start!** 🚀

