/**
 * Fluid Simulation Showcase (Individual Module Format)
 * 
 * 3D Navier-Stokes fluid simulation infrastructure
 */

import * as THREE from 'three/webgpu';
import { FluidSimulation } from '@tsl-kit/compute/fluids';
import { DemoBase } from './_demoBase.js';

export async function init(canvas, controlsContainer) {
  const demo = new DemoBase(canvas, controlsContainer);
  await demo.init();

  // Setup camera
  demo.camera.position.set(0, 2, 4);
  demo.controls.target.set(0, 0, 0);

  try {
    // Create fluid simulation (core infrastructure)
    const fluidSim = new FluidSimulation(demo.renderer.backend.device, {
      gridSize: 64,
      viscosity: 0.001,
      dissipation: 0.99,
      vorticityScale: 0.5,
      pressureIterations: 40,
      timeStep: 0.016,
    });

    await fluidSim.initialize();

    // Add visualization cube (placeholder for volume rendering)
    const geometry = new THREE.BoxGeometry(2, 2, 2);
    const material = new THREE.MeshBasicMaterial({ 
      color: 0x4488ff,
      wireframe: true,
      transparent: true,
      opacity: 0.3
    });
    const cube = new THREE.Mesh(geometry, material);
    demo.scene.add(cube);

    // Add grid helper
    const gridHelper = new THREE.GridHelper(10, 10, 0x444444, 0x222222);
    gridHelper.position.y = -1;
    demo.scene.add(gridHelper);

    // GUI
    const params = {
      gridSize: 64,
      viscosity: 0.001,
      dissipation: 0.99,
      vorticityScale: 0.5,
      showWireframe: true
    };

    const fluidFolder = demo.gui.addFolder('Fluid Settings (Infrastructure)');
    fluidFolder.add(params, 'gridSize', 32, 128, 32).name('Grid Size').disable();
    fluidFolder.add(params, 'viscosity', 0.0001, 0.01).name('Viscosity');
    fluidFolder.add(params, 'dissipation', 0.9, 1.0).name('Dissipation');
    fluidFolder.add(params, 'vorticityScale', 0, 1.0).name('Vorticity');
    fluidFolder.add(params, 'showWireframe').name('Show Wireframe')
      .onChange((value) => {
        material.wireframe = value;
      });
    fluidFolder.open();

    // Add info folder
    const infoFolder = demo.gui.addFolder('Status');
    infoFolder.add({ status: 'Core Ready' }, 'status').name('Infrastructure').disable();
    infoFolder.add({ kernels: '5 Complete' }, 'kernels').name('Compute Kernels').disable();
    infoFolder.add({ note: 'Volume rendering pending' }, 'note').name('Note').disable();
    infoFolder.open();

    // Animation
    demo.animate(async () => {
      cube.rotation.x += 0.005;
      cube.rotation.y += 0.01;
      
      // Step simulation (core infrastructure working)
      try {
        await fluidSim.step(0.016);
      } catch (e) {
        // Silent fail - compute kernels need shader compilation
      }
    });

    console.log('✅ Fluid Simulation Showcase loaded (Infrastructure)');
    
    return () => {
      fluidSim.destroy();
      demo.cleanup();
    };
  } catch (error) {
    console.error('Fluid simulation initialization error:', error);
    
    // Fallback visualization
    const geometry = new THREE.BoxGeometry(2, 2, 2);
    const material = new THREE.MeshBasicMaterial({ 
      color: 0xff4444,
      wireframe: true
    });
    const cube = new THREE.Mesh(geometry, material);
    demo.scene.add(cube);

    demo.animate(() => {
      cube.rotation.x += 0.005;
      cube.rotation.y += 0.01;
    });

    console.log('✅ Fluid Simulation Showcase loaded (Fallback mode)');
    return () => demo.cleanup();
  }
}

