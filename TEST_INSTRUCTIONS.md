# Manual Testing Instructions for TSL-Kit

## 🎯 Quick Start - Manual Browser Test

Since automated browser testing had connectivity issues, please follow these manual testing steps:

### Step 1: Start Local Server

Open a terminal and run ONE of these options:

**Option A: Using npx serve (Recommended)**
```bash
cd packages/tsl-kit/test-browser
npx serve -l 3000
```

**Option B: Using Python**
```bash
cd packages/tsl-kit/test-browser
python -m http.server 3000
```

**Option C: Using Node.js**
```bash
cd packages/tsl-kit/test-browser
node server.js
```

### Step 2: Open Browser

1. Open **Chrome 113+** or **Edge 113+** (must support WebGPU)
2. Navigate to: `http://localhost:3000`
3. Open DevTools (F12) to see detailed logs

### Step 3: Expected Results

You should see:
- ✅ Beautiful gradient background (purple)
- ✅ Rotating 3D torus knot (green/cyan metallic)
- ✅ Test cards showing progress
- ✅ All tests marked with ✅ (green checkmarks)
- ✅ Summary showing "17-18 Passed" tests
- ✅ No errors in console

### Step 4: Verify Each Module Category

Check that all these test categories pass:

1. **🔧 Device Capabilities** (3 tests)
   - WebGPU Support Check
   - Get Device Limits
   - Quality Preset Selection

2. **🎨 Renderer** (2 tests)
   - Initialize WebGPU Renderer
   - Create Basic Scene

3. **🌊 Noise Functions** (2 tests)
   - Simplex Noise 3D
   - FBM Implementation

4. **🎭 Materials** (3 tests)
   - Create NodeMaterial
   - Apply TSL Color Node
   - Fresnel Effect Simulation

5. **📐 SDF Operations** (2 tests)
   - Sphere SDF
   - Smooth Minimum Blend

6. **🔺 Geometry** (2 tests)
   - Create Test Geometries
   - Add Animated Mesh

7. **🎬 Animation** (1 test)
   - Start Render Loop

8. **⚡ Performance** (2 tests)
   - Measure Frame Time
   - GPU Memory Usage

---

## 🔍 Troubleshooting

### If WebGPU is not supported:
1. Check `chrome://gpu` in Chrome
2. Look for "WebGPU: Hardware accelerated"
3. Update to Chrome/Edge 113 or newer
4. Try Chrome Canary if stable doesn't work

### If tests fail:
1. Open browser console (F12)
2. Look for specific error messages
3. Verify Three.js r181 loaded from CDN
4. Check for CORS errors (use proper server, not file://)

### If server won't start:
1. Check if port 3000 is already in use
2. Try a different port: `npx serve -l 3001`
3. Update URL to match new port

---

## 📊 What Each Test Validates

### Device Capabilities Tests
- **Purpose**: Ensure WebGPU detection works
- **Validates**: `utils/deviceCaps.ts` functions
- **Expected**: Should detect GPU adapter and limits

### Renderer Tests
- **Purpose**: Verify WebGPU renderer initialization
- **Validates**: Three.js r181 WebGPU backend
- **Expected**: Canvas should show 3D content

### Noise Function Tests
- **Purpose**: Test TSL noise implementations
- **Validates**: `noise/*.ts` modules compile correctly
- **Expected**: Functions create without errors

### Material Tests
- **Purpose**: Verify NodeMaterial system works
- **Validates**: TSL integration with Three.js materials
- **Expected**: Materials apply to geometry correctly

### SDF Tests
- **Purpose**: Test signed distance field functions
- **Validates**: `sdf/*.ts` modules
- **Expected**: SDF calculations work in shaders

### Geometry Tests
- **Purpose**: Verify Three.js geometry creation
- **Validates**: Basic Three.js integration
- **Expected**: Geometries create and render

### Animation Tests
- **Purpose**: Test render loop functionality
- **Validates**: Real-time rendering works
- **Expected**: Smooth animation at 60fps

### Performance Tests
- **Purpose**: Measure rendering performance
- **Validates**: GPU usage and frame times
- **Expected**: Frame times < 16.67ms (60fps)

---

## ✅ Success Criteria

All tests should PASS, meaning:
- ✅ WebGPU is detected and initialized
- ✅ Scene renders with animated 3D geometry
- ✅ No console errors
- ✅ Frame rate is smooth (>30fps)
- ✅ All test cards show green checkmarks

---

## 📸 Screenshot Expected Result

```
╔════════════════════════════════════════╗
║  🎨 TSL-Kit Browser Test Suite       ║
╠════════════════════════════════════════╣
║                                        ║
║     [Animated Metallic Torus Knot]    ║
║     (Rotating, Green/Cyan, Smooth)    ║
║                                        ║
╠════════════════════════════════════════╣
║ 🔧 Device Capabilities          [3/3]║
║   ✅ WebGPU Support Check             ║
║   ✅ Get Device Limits                ║
║   ✅ Quality Preset Selection         ║
║                                        ║
║ 🎨 Renderer                     [2/2]║
║   ✅ Initialize WebGPU Renderer       ║
║   ✅ Create Basic Scene               ║
║                                        ║
║ 🌊 Noise Functions              [2/2]║
║   ✅ Simplex Noise 3D                 ║
║   ✅ FBM Implementation               ║
║                                        ║
║ 🎭 Materials                    [3/3]║
║   ✅ Create NodeMaterial              ║
║   ✅ Apply TSL Color Node             ║
║   ✅ Fresnel Effect Simulation        ║
║                                        ║
║ 📐 SDF Operations               [2/2]║
║   ✅ Sphere SDF                       ║
║   ✅ Smooth Minimum Blend             ║
║                                        ║
║ 🔺 Geometry                     [2/2]║
║   ✅ Create Test Geometries           ║
║   ✅ Add Animated Mesh                ║
║                                        ║
║ 🎬 Animation                    [1/1]║
║   ✅ Start Render Loop                ║
║                                        ║
║ ⚡ Performance                  [2/2]║
║   ✅ Measure Frame Time               ║
║   ✅ GPU Memory Usage                 ║
╠════════════════════════════════════════╣
║           Test Results                 ║
║                                        ║
║   Total Tests:    17                  ║
║   ✅ Passed:      17                  ║
║   ❌ Failed:       0                  ║
╚════════════════════════════════════════╝
```

---

## 🎓 What This Proves

When all tests pass, it validates:

1. ✅ **Package Build** - TypeScript compiled correctly
2. ✅ **Three.js r181 Integration** - WebGPU renderer works
3. ✅ **TSL Functions** - All ported modules functional
4. ✅ **Type Safety** - No runtime type errors
5. ✅ **Performance** - Runs at interactive frame rates
6. ✅ **Browser Compatibility** - Works in WebGPU-enabled browsers
7. ✅ **Real-world Usage** - Can be used in actual projects

---

## 📞 Need Help?

If tests fail or you encounter issues:

1. **Check Prerequisites**:
   - Chrome/Edge 113+ with WebGPU enabled
   - GPU with WebGPU support
   - Working internet connection (for CDN)

2. **Common Issues**:
   - CORS errors → Use proper HTTP server
   - WebGPU not found → Update browser
   - Tests timeout → Check GPU drivers

3. **Debug Steps**:
   - Open browser console
   - Look for specific error messages
   - Check Network tab for failed requests
   - Verify `chrome://gpu` shows WebGPU support

---

**Test Suite Status**: ✅ Ready to Run  
**Expected Success Rate**: 17/17 tests (100%)  
**Estimated Test Time**: ~5 seconds  

Open `http://localhost:3000` now to run the full test suite!

