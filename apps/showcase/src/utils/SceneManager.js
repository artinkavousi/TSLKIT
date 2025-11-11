import * as THREE from 'three/webgpu';
import { Pane } from 'tweakpane';

export class SceneManager {
  constructor(renderer, pane) {
    this.renderer = renderer;
    this.pane = pane;
    this.demos = new Map();
    this.currentScene = null;
    this.currentCamera = null;
    this.currentDemo = null;
    this.currentDemoInstance = null;
  }

  registerDemo(id, config) {
    this.demos.set(id, config);
  }

  switchScene(id) {
    const config = this.demos.get(id);
    if (!config) {
      console.error(`Demo "${id}" not found`);
      return;
    }

    // Cleanup previous demo
    if (this.currentDemoInstance && this.currentDemoInstance.dispose) {
      this.currentDemoInstance.dispose();
    }

    // Clear Tweakpane
    this.pane.dispose();
    this.pane = new Pane({
      container: document.getElementById('controls'),
      title: config.name,
      expanded: true
    });

    // Create new demo
    const demoResult = config.demo(this.pane);
    
    this.currentScene = demoResult.scene;
    this.currentCamera = demoResult.camera;
    this.currentDemoInstance = demoResult;
    this.currentDemo = id;

    // Setup default camera
    if (!this.currentCamera.position.length()) {
      this.currentCamera.position.set(0, 0, 5);
    }
    this.currentCamera.lookAt(0, 0, 0);
  }

  update(delta) {
    if (this.currentDemoInstance && this.currentDemoInstance.update) {
      this.currentDemoInstance.update(delta);
    }
  }

  dispose() {
    if (this.currentDemoInstance && this.currentDemoInstance.dispose) {
      this.currentDemoInstance.dispose();
    }
    this.pane.dispose();
  }
}

