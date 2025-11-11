/**
 * Base Demo Utilities
 * Shared setup code for all individual module demos
 */

import * as THREE from 'three/webgpu';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { GUI } from 'three/addons/libs/lil-gui.module.min.js';

export class DemoBase {
  constructor(canvas, controlsContainer) {
    this.canvas = canvas;
    this.controlsContainer = controlsContainer;
    
    // Setup scene
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0x0a0a0f);
    
    // Setup camera
    this.camera = new THREE.PerspectiveCamera(
      75,
      canvas.clientWidth / canvas.clientHeight,
      0.1,
      1000
    );
    this.camera.position.set(0, 0, 3);
    
    // Setup renderer
    this.renderer = new THREE.WebGPURenderer({ canvas, antialias: true });
    this.renderer.setSize(canvas.clientWidth, canvas.clientHeight);
    this.renderer.setPixelRatio(window.devicePixelRatio);
    
    // Setup controls
    this.controls = new OrbitControls(this.camera, canvas);
    this.controls.enableDamping = true;
    this.controls.dampingFactor = 0.05;
    
    // Setup GUI
    this.gui = new GUI({ container: controlsContainer, width: 300 });
    
    // Animation state
    this.animationId = null;
    this.stats = {
      fps: 0,
      frameTime: 0,
      lastTime: performance.now(),
      frames: 0
    };
    
    // Handle resize
    this.handleResize = this.handleResize.bind(this);
    window.addEventListener('resize', this.handleResize);
  }
  
  handleResize() {
    const width = this.canvas.clientWidth;
    const height = this.canvas.clientHeight;
    
    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
    
    this.renderer.setSize(width, height);
  }
  
  updateStats() {
    const now = performance.now();
    const delta = now - this.stats.lastTime;
    
    this.stats.frames++;
    if (delta >= 1000) {
      this.stats.fps = Math.round((this.stats.frames * 1000) / delta);
      this.stats.frameTime = (delta / this.stats.frames).toFixed(2);
      this.stats.frames = 0;
      this.stats.lastTime = now;
      
      // Update UI
      const fpsEl = document.getElementById('fps');
      const frameTimeEl = document.getElementById('frame-time');
      if (fpsEl) fpsEl.textContent = this.stats.fps;
      if (frameTimeEl) frameTimeEl.textContent = `${this.stats.frameTime}ms`;
    }
  }
  
  async init() {
    await this.renderer.init();
  }
  
  animate(callback) {
    const loop = () => {
      this.animationId = requestAnimationFrame(loop);
      
      if (callback) callback();
      
      this.controls.update();
      this.updateStats();
      this.renderer.render(this.scene, this.camera);
    };
    
    loop();
  }
  
  cleanup() {
    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
    }
    
    window.removeEventListener('resize', this.handleResize);
    
    if (this.gui) {
      this.gui.destroy();
    }
    
    if (this.renderer) {
      this.renderer.dispose();
    }
    
    // Clear scene
    while (this.scene.children.length > 0) {
      const object = this.scene.children[0];
      if (object.geometry) object.geometry.dispose();
      if (object.material) {
        if (Array.isArray(object.material)) {
          object.material.forEach(m => m.dispose());
        } else {
          object.material.dispose();
        }
      }
      this.scene.remove(object);
    }
  }
}

