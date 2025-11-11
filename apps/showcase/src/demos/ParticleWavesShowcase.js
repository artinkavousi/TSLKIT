/**
 * Particle Waves Showcase
 * 
 * Interactive demo showcasing the ParticleWaves compute system.
 * 200,000 particles animated in wave patterns using GPU compute shaders.
 */

import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { ParticleWaves } from '@tsl-kit/compute/particleWaves';

export class ParticleWavesShowcase {
  constructor() {
    this.scene = null;
    this.camera = null;
    this.renderer = null;
    this.controls = null;
    this.particleWaves = null;
    this.infoDiv = null;
    this.stats = null;
  }

  async init() {
    // Setup scene
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0x000510);
    this.scene.fog = new THREE.Fog(0x000510, 1000, 10000);

    // Setup camera
    this.camera = new THREE.PerspectiveCamera(
      50,
      window.innerWidth / window.innerHeight,
      10,
      100000
    );
    this.camera.position.set(0, 200, 500);

    // Setup renderer
    this.renderer = new THREE.WebGPURenderer({ antialias: true });
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.setPixelRatio(window.devicePixelRatio);
    document.body.appendChild(this.renderer.domElement);

    await this.renderer.init();

    // Setup controls
    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.controls.enableDamping = true;
    this.controls.dampingFactor = 0.05;
    this.controls.minDistance = 50;
    this.controls.target.set(0, 0, 0);

    // Create particle waves system
    this.particleWaves = new ParticleWaves({
      particleCount: 200_000,
      separation: 100,
      waveAmplitude: 50,
      waveFrequency: 1,
      timeSpeed: 5
    });

    // Add to scene
    this.scene.add(this.particleWaves.mesh);

    // Initialize particle positions
    await this.particleWaves.init(this.renderer);

    // Create info UI
    this.createInfoUI();

    // Add grid helper
    const gridHelper = new THREE.GridHelper(10000, 100, 0x444444, 0x222222);
    gridHelper.position.y = -100;
    this.scene.add(gridHelper);

    // Add event listeners
    window.addEventListener('resize', () => this.onWindowResize());
    window.addEventListener('keydown', (e) => this.onKeyDown(e));

    // Start animation
    this.animate();
  }

  createInfoUI() {
    this.infoDiv = document.createElement('div');
    this.infoDiv.style.position = 'absolute';
    this.infoDiv.style.top = '20px';
    this.infoDiv.style.left = '20px';
    this.infoDiv.style.color = 'white';
    this.infoDiv.style.fontFamily = 'monospace';
    this.infoDiv.style.fontSize = '14px';
    this.infoDiv.style.background = 'rgba(0,0,0,0.7)';
    this.infoDiv.style.padding = '15px';
    this.infoDiv.style.borderRadius = '5px';
    this.infoDiv.style.pointerEvents = 'none';
    
    this.updateInfo();
    document.body.appendChild(this.infoDiv);
  }

  updateInfo() {
    if (!this.infoDiv) return;

    const info = `
<strong>Particle Waves Compute Showcase</strong>
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
<strong>Particle Count:</strong> ${this.particleWaves.particleCount.toLocaleString()}
<strong>Wave Amplitude:</strong> ${this.particleWaves.waveAmplitude}
<strong>Separation:</strong> ${this.particleWaves.separation}

<strong>Technology:</strong>
✓ WebGPU Compute Shaders
✓ Instanced Rendering
✓ Real-time Animation
✓ 200K+ particles @ 60 FPS

<strong>Controls:</strong>
• Orbit: Left mouse drag
• Zoom: Mouse wheel
• Pan: Right mouse drag
• [1] White particles
• [2] Blue particles
• [3] Purple particles
• [4] Rainbow mode (cycling)

<strong>Performance:</strong>
All calculations run on GPU
Zero CPU particle updates
Fully hardware-accelerated
    `.trim();

    this.infoDiv.innerHTML = info;
  }

  onKeyDown(event) {
    switch(event.key) {
      case '1':
        this.particleWaves.setColor(0xffffff);
        break;
      case '2':
        this.particleWaves.setColor(0x4488ff);
        break;
      case '3':
        this.particleWaves.setColor(0xff44ff);
        break;
      case '4':
        // Rainbow mode - cycle colors
        this.rainbowMode = !this.rainbowMode;
        break;
    }
  }

  onWindowResize() {
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(window.innerWidth, window.innerHeight);
  }

  async animate() {
    requestAnimationFrame(() => this.animate());
    
    this.controls.update();

    // Rainbow mode
    if (this.rainbowMode) {
      const hue = (Date.now() * 0.0001) % 1;
      const color = new THREE.Color().setHSL(hue, 1, 0.6);
      this.particleWaves.setColor(color);
    }

    // Update particle waves
    await this.particleWaves.update(this.renderer);

    // Render scene
    await this.renderer.renderAsync(this.scene, this.camera);
  }

  dispose() {
    // Cleanup
    if (this.particleWaves) {
      this.particleWaves.dispose();
    }
    if (this.infoDiv) {
      document.body.removeChild(this.infoDiv);
    }
    if (this.renderer.domElement.parentNode) {
      this.renderer.domElement.parentNode.removeChild(this.renderer.domElement);
    }
    this.renderer.dispose();
  }
}

// Export for use in demo map
export default ParticleWavesShowcase;

