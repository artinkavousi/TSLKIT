/**
 * Tiled Lighting Demo
 * 
 * Demonstrates the power of tiled deferred lighting by rendering
 * 500-1500 dynamic point lights with high performance.
 * 
 * **Features**:
 * - Adjustable light count (100-1500 lights)
 * - Performance comparison (tiled vs standard)
 * - Tile visualization overlay
 * - Real-time FPS monitoring
 * - Light animation controls
 * - Tile size adjustment
 * 
 * Tiled lighting can handle 10-100x more lights than standard forward
 * rendering by using a compute shader to cull lights per screen tile.
 */

import * as THREE from 'three';
import WebGPU from 'three/addons/capabilities/WebGPU.js';
import WebGPURenderer from 'three/addons/renderers/webgpu/WebGPURenderer.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { GUI } from 'three/addons/libs/lil-gui.module.min.js';
import { tiledLights } from '../packages/tsl-kit/src/lighting/TiledLightsNode';

// Check WebGPU support
if (WebGPU.isAvailable() === false) {
  document.body.appendChild(WebGPU.getErrorMessage());
  throw new Error('No WebGPU support');
}

// Scene setup
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x050510);
scene.fog = new THREE.Fog(0x050510, 50, 200);

// Camera
const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 300);
camera.position.set(0, 20, 40);
camera.lookAt(0, 0, 0);

// Renderer
const renderer = new WebGPURenderer({ antialias: true });
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.0;
document.body.appendChild(renderer.domElement);

// Controls
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.05;
controls.minDistance = 10;
controls.maxDistance = 150;
controls.maxPolarAngle = Math.PI / 2 - 0.05;

// Tiled Lighting Setup
const tiledLightsNode = tiledLights(2048, 32); // 2048 max lights, 32px tiles
renderer.lightsNode = tiledLightsNode;

// Ground and environment
const groundGeometry = new THREE.PlaneGeometry(200, 200, 50, 50);
const groundMaterial = new THREE.MeshStandardNodeMaterial({
  color: 0x1a1a2e,
  roughness: 0.8,
  metalness: 0.2,
});

const ground = new THREE.Mesh(groundGeometry, groundMaterial);
ground.rotation.x = -Math.PI / 2;
ground.receiveShadow = true;
scene.add(ground);

// Add some test geometry
const objects = [];

function createTestGeometry() {
  const geometries = [
    new THREE.BoxGeometry(2, 2, 2),
    new THREE.SphereGeometry(1.5, 32, 32),
    new THREE.CylinderGeometry(1, 1, 3, 32),
    new THREE.TorusGeometry(1.5, 0.5, 16, 32),
  ];

  const material = new THREE.MeshStandardNodeMaterial({
    color: 0x404050,
    roughness: 0.6,
    metalness: 0.3,
  });

  // Create a grid of objects
  const gridSize = 8;
  const spacing = 8;

  for (let x = 0; x < gridSize; x++) {
    for (let z = 0; z < gridSize; z++) {
      const geometry = geometries[Math.floor(Math.random() * geometries.length)];
      const mesh = new THREE.Mesh(geometry, material);

      mesh.position.x = (x - gridSize / 2) * spacing;
      mesh.position.z = (z - gridSize / 2) * spacing;
      mesh.position.y = 1.5;

      mesh.castShadow = true;
      mesh.receiveShadow = true;

      scene.add(mesh);
      objects.push(mesh);
    }
  }
}

createTestGeometry();

// Dynamic Point Lights
const lights = [];
const lightHelpers = [];
const MAX_LIGHTS = 1500;

function createLights(count) {
  // Remove existing lights
  lights.forEach((light) => {
    scene.remove(light);
  });
  lightHelpers.forEach((helper) => {
    scene.remove(helper);
  });

  lights.length = 0;
  lightHelpers.length = 0;

  // Create new lights
  for (let i = 0; i < count; i++) {
    const color = new THREE.Color();
    color.setHSL(Math.random(), 1.0, 0.5);

    const light = new THREE.PointLight(color, 10, 15, 2);

    // Random position in volume
    light.position.x = (Math.random() - 0.5) * 80;
    light.position.y = Math.random() * 15 + 2;
    light.position.z = (Math.random() - 0.5) * 80;

    // Store animation parameters
    light.userData = {
      baseX: light.position.x,
      baseY: light.position.y,
      baseZ: light.position.z,
      speedX: (Math.random() - 0.5) * 0.5,
      speedY: (Math.random() - 0.5) * 0.2,
      speedZ: (Math.random() - 0.5) * 0.5,
      offsetX: Math.random() * Math.PI * 2,
      offsetY: Math.random() * Math.PI * 2,
      offsetZ: Math.random() * Math.PI * 2,
    };

    scene.add(light);
    lights.push(light);

    // Optional helper (show only a subset when many lights)
    if (settings.showLightHelpers && i < 100) {
      const helper = new THREE.PointLightHelper(light, 0.5);
      scene.add(helper);
      lightHelpers.push(helper);
    }
  }

  console.log(`✅ Created ${count} point lights`);
}

// Settings
const settings = {
  // Lighting
  lightCount: 500,
  animateLights: true,
  animationSpeed: 1.0,
  lightIntensity: 10,
  lightDistance: 15,
  showLightHelpers: false,

  // Tiled Lighting
  useTiledLighting: true,
  tileSize: 32,
  maxLights: 2048,

  // Visualization
  showTiles: false,
  showStats: true,

  // Actions
  recreateLights: function () {
    createLights(settings.lightCount);
  },
};

// GUI Controls
const gui = new GUI({ title: 'Tiled Lighting Demo' });

// Lighting Folder
const lightFolder = gui.addFolder('Lighting');
lightFolder
  .add(settings, 'lightCount', 100, MAX_LIGHTS, 50)
  .name('Light Count')
  .onChange(() => createLights(settings.lightCount));
lightFolder.add(settings, 'animateLights').name('Animate');
lightFolder.add(settings, 'animationSpeed', 0, 5).name('Anim Speed');
lightFolder.add(settings, 'lightIntensity', 1, 50).name('Intensity').onChange(updateLightParams);
lightFolder.add(settings, 'lightDistance', 5, 50).name('Distance').onChange(updateLightParams);
lightFolder.add(settings, 'showLightHelpers').name('Show Helpers').onChange(() => createLights(settings.lightCount));
lightFolder.add(settings, 'recreateLights').name('🔄 Recreate Lights');
lightFolder.open();

// Tiled System Folder
const tiledFolder = gui.addFolder('Tiled System');
tiledFolder.add(settings, 'useTiledLighting').name('Use Tiled').onChange(toggleTiledLighting);
tiledFolder
  .add(settings, 'tileSize', 16, 64, 16)
  .name('Tile Size')
  .onChange(() => {
    tiledLightsNode.tileSize = settings.tileSize;
    // Force recreation
    tiledLightsNode.create(renderer.getDrawingBufferSize().width, renderer.getDrawingBufferSize().height);
  });
tiledFolder.add(settings, 'maxLights', 512, 4096, 256).name('Max Lights').onChange(updateTiledParams);
tiledFolder.open();

// Visualization Folder
const vizFolder = gui.addFolder('Visualization');
vizFolder.add(settings, 'showTiles').name('Show Tiles');
vizFolder.add(settings, 'showStats').name('Show Stats');
vizFolder.open();

function updateLightParams() {
  lights.forEach((light) => {
    light.intensity = settings.lightIntensity;
    light.distance = settings.lightDistance;
  });
}

function updateTiledParams() {
  // Recreate tiled lighting node with new parameters
  const newTiledLights = tiledLights(settings.maxLights, settings.tileSize);
  renderer.lightsNode = newTiledLights;
  console.log(`🔄 Updated tiled lighting: ${settings.maxLights} max, ${settings.tileSize}px tiles`);
}

function toggleTiledLighting(enabled) {
  if (enabled) {
    renderer.lightsNode = tiledLightsNode;
    console.log('✅ Tiled lighting enabled');
  } else {
    renderer.lightsNode = null; // Use default lighting
    console.log('⚠️ Tiled lighting disabled (using standard)');
  }
}

// Stats display
const statsDiv = document.createElement('div');
statsDiv.style.position = 'absolute';
statsDiv.style.top = '10px';
statsDiv.style.left = '10px';
statsDiv.style.color = 'white';
statsDiv.style.backgroundColor = 'rgba(0, 0, 0, 0.8)';
statsDiv.style.padding = '15px';
statsDiv.style.fontFamily = 'monospace';
statsDiv.style.fontSize = '12px';
statsDiv.style.borderRadius = '5px';
statsDiv.style.pointerEvents = 'none';
statsDiv.style.zIndex = '1000';
document.body.appendChild(statsDiv);

let lastTime = performance.now();
let frameCount = 0;
let fps = 0;
let frameTime = 0;

function updateStats() {
  if (!settings.showStats) {
    statsDiv.style.display = 'none';
    return;
  }

  statsDiv.style.display = 'block';

  const now = performance.now();
  frameCount++;

  if (now - lastTime >= 1000) {
    fps = Math.round((frameCount * 1000) / (now - lastTime));
    frameCount = 0;
    lastTime = now;
  }

  frameTime = now - lastTime;

  const info = renderer.info;

  statsDiv.innerHTML = `
    <div style="margin-bottom: 10px; font-size: 14px; font-weight: bold; color: #4CAF50;">
      💡 Tiled Lighting Demo
    </div>
    <div><strong>FPS:</strong> <span style="color: ${fps > 55 ? '#4CAF50' : fps > 30 ? '#FFC107' : '#F44336'}">${fps}</span></div>
    <div><strong>Frame Time:</strong> ${frameTime.toFixed(2)}ms</div>
    <div style="margin-top: 8px; padding-top: 8px; border-top: 1px solid #555;">
      <strong>Lights:</strong>
    </div>
    <div><strong>Point Lights:</strong> ${lights.length}</div>
    <div><strong>Mode:</strong> ${settings.useTiledLighting ? 'Tiled' : 'Standard'}</div>
    <div><strong>Tile Size:</strong> ${settings.tileSize}px</div>
    <div><strong>Max Lights:</strong> ${settings.maxLights}</div>
    <div style="margin-top: 8px; padding-top: 8px; border-top: 1px solid #555;">
      <strong>Render Info:</strong>
    </div>
    <div><strong>Calls:</strong> ${info.render.calls}</div>
    <div><strong>Triangles:</strong> ${info.render.triangles.toLocaleString()}</div>
    <div><strong>Objects:</strong> ${objects.length}</div>
  `;
}

// Animation loop
function animate() {
  requestAnimationFrame(animate);

  const time = performance.now() * 0.001;

  // Animate lights
  if (settings.animateLights) {
    lights.forEach((light, i) => {
      const { baseX, baseY, baseZ, speedX, speedY, speedZ, offsetX, offsetY, offsetZ } = light.userData;

      light.position.x = baseX + Math.sin(time * speedX * settings.animationSpeed + offsetX) * 10;
      light.position.y = baseY + Math.sin(time * speedY * settings.animationSpeed + offsetY) * 3;
      light.position.z = baseZ + Math.cos(time * speedZ * settings.animationSpeed + offsetZ) * 10;
    });

    // Update helpers
    lightHelpers.forEach((helper) => helper.update());
  }

  // Animate objects
  objects.forEach((obj, i) => {
    obj.rotation.y = time * 0.2 + i * 0.1;
    obj.position.y = 1.5 + Math.sin(time + i) * 0.3;
  });

  // Update controls
  controls.update();

  // Update stats
  updateStats();

  // Render
  renderer.render(scene, camera);
}

// Handle window resize
window.addEventListener('resize', onWindowResize);

function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}

// Initialize with default light count
createLights(settings.lightCount);

// Start animation
animate();

// Info banner
console.log('%c💡 Tiled Lighting Demo', 'font-size: 20px; color: #4CAF50; font-weight: bold;');
console.log(
  '%cDemonstrates efficient rendering of 100-1500 dynamic point lights using tiled deferred lighting',
  'font-size: 12px; color: #888;'
);
console.log('%cUse GUI to adjust light count, tile size, and compare performance', 'font-size: 12px; color: #888;');
console.log(
  '%cTry disabling "Use Tiled" to see the performance difference with standard lighting!',
  'font-size: 12px; color: #FFC107;'
);

