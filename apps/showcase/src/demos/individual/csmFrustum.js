/**
 * CSM Frustum Demo
 * Visualize Cascaded Shadow Map frustum splits
 */

import * as THREE from 'three/webgpu';
import { CSMFrustum } from '@tsl-kit/shadows';
import { DemoBase } from './_demoBase.js';

export async function init(canvas, controlsContainer) {
  const demo = new DemoBase(canvas, controlsContainer);
  await demo.init();

  const params = { 
    cascades: 3, 
    maxFar: 50,
    showFrustum: true,
    split1: 0.15,
    split2: 0.45
  };

  // Scene setup
  const groundGeometry = new THREE.PlaneGeometry(100, 100);
  const groundMaterial = new THREE.MeshStandardNodeMaterial({ color: 0x333333 });
  const ground = new THREE.Mesh(groundGeometry, groundMaterial);
  ground.rotation.x = -Math.PI / 2;
  demo.scene.add(ground);

  // Add some objects to show shadows would be cast on
  for (let i = 0; i < 5; i++) {
    const geometry = new THREE.BoxGeometry(1, 2, 1);
    const material = new THREE.MeshStandardNodeMaterial({ color: 0x00aaff });
    const mesh = new THREE.Mesh(geometry, material);
    mesh.position.set(
      (Math.random() - 0.5) * 20,
      1,
      (Math.random() - 0.5) * 20
    );
    demo.scene.add(mesh);
  }

  const light = new THREE.DirectionalLight(0xffffff, 2);
  light.position.set(10, 20, 10);
  demo.scene.add(light);
  demo.scene.add(new THREE.AmbientLight(0x444444));

  // Frustum visualization helpers
  let frustumHelpers = [];

  function updateFrustumVisualization() {
    // Clear previous helpers
    frustumHelpers.forEach(helper => demo.scene.remove(helper));
    frustumHelpers = [];

    if (!params.showFrustum) return;

    // Create main frustum
    const frustum = new CSMFrustum({ webGL: false });
    frustum.setFromProjectionMatrix(demo.camera.projectionMatrix, params.maxFar);

    // Create child frustums for cascades
    const breaks = params.cascades === 2 ? 
      [params.split1] : 
      [params.split1, params.split2];
    
    const childFrustums = [];
    for (let i = 0; i < params.cascades; i++) {
      childFrustums.push(new CSMFrustum({ webGL: false }));
    }
    
    frustum.split(breaks, childFrustums);

    // Visualize each cascade with different colors
    const colors = [0xff0000, 0x00ff00, 0x0000ff, 0xffff00];
    
    childFrustums.forEach((cascadeFrustum, idx) => {
      const points = [];
      // Near plane
      cascadeFrustum.vertices.near.forEach(v => points.push(v));
      // Far plane
      cascadeFrustum.vertices.far.forEach(v => points.push(v));

      // Create wireframe box for each cascade
      const geometry = new THREE.BufferGeometry();
      const indices = [
        // Near plane
        0, 1, 1, 2, 2, 3, 3, 0,
        // Far plane
        4, 5, 5, 6, 6, 7, 7, 4,
        // Connecting edges
        0, 4, 1, 5, 2, 6, 3, 7
      ];
      
      const positions = new Float32Array(points.length * 3);
      points.forEach((p, i) => {
        positions[i * 3] = p.x;
        positions[i * 3 + 1] = p.y;
        positions[i * 3 + 2] = p.z;
      });
      
      geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
      geometry.setIndex(indices);

      const material = new THREE.LineBasicMaterial({ color: colors[idx % colors.length] });
      const helper = new THREE.LineSegments(geometry, material);
      
      demo.scene.add(helper);
      frustumHelpers.push(helper);
    });
  }

  updateFrustumVisualization();

  const gui = demo.gui.addFolder('CSM Frustum');
  gui.add(params, 'cascades', 2, 3, 1).onChange(updateFrustumVisualization);
  gui.add(params, 'maxFar', 10, 100).onChange(updateFrustumVisualization);
  gui.add(params, 'split1', 0.05, 0.4).onChange(updateFrustumVisualization).name('Split 1');
  gui.add(params, 'split2', 0.3, 0.8).onChange(updateFrustumVisualization).name('Split 2');
  gui.add(params, 'showFrustum').onChange(updateFrustumVisualization).name('Show Frustum');
  gui.open();

  demo.animate(() => {
    // Update on camera movement
    if (demo.camera.projectionMatrixVersion !== (demo.camera._lastVersion || 0)) {
      updateFrustumVisualization();
      demo.camera._lastVersion = demo.camera.projectionMatrixVersion;
    }
  });

  return () => demo.cleanup();
}

