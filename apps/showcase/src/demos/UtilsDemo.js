import * as THREE from 'three/webgpu';
import { vec3, positionLocal, uv, time, sin, cos, Fn } from 'three/tsl';
import { remapNode } from '@tsl-kit/utils/remap';
import { cartesianToPolar, polarToCartesian } from '@tsl-kit/utils/coordinates';
import { compose } from '@tsl-kit/utils/compose';

export class UtilsDemo {
  static createRemapDemo(pane) {
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x0a0a0f);
    
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 100);
    camera.position.set(0, 0, 3);

    const params = {
      inputMin: -1.0,
      inputMax: 1.0,
      outputMin: 0.0,
      outputMax: 1.0,
      animate: true,
      showInput: false
    };

    const light = new THREE.DirectionalLight(0xffffff, 3);
    light.position.set(2, 2, 2);
    scene.add(light);
    scene.add(new THREE.AmbientLight(0x404040, 2));

    const material = new THREE.MeshBasicNodeMaterial();
    
    const updateMaterial = () => {
      const animTime = params.animate ? time.mul(0.5) : 0;
      const pos = positionLocal;
      
      // Create varying input value
      const inputValue = sin(pos.y.mul(3).add(animTime));
      
      if (params.showInput) {
        // Show raw input
        const normalized = inputValue.add(1).div(2);
        material.colorNode = vec3(normalized, normalized.mul(0.5), normalized.mul(1.5));
      } else {
        // Show remapped output
        const remapped = remapNode(
          inputValue,
          params.inputMin,
          params.inputMax,
          params.outputMin,
          params.outputMax
        );
        material.colorNode = vec3(remapped, remapped.mul(0.7), remapped.mul(1.3));
      }
    };

    updateMaterial();

    const geometry = new THREE.CylinderGeometry(0.8, 0.8, 2, 64, 64);
    const mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);

    const inputFolder = pane.addFolder({ title: 'Input Range' });
    inputFolder.addBinding(params, 'inputMin', { min: -5, max: 5, step: 0.1 }).on('change', updateMaterial);
    inputFolder.addBinding(params, 'inputMax', { min: -5, max: 5, step: 0.1 }).on('change', updateMaterial);

    const outputFolder = pane.addFolder({ title: 'Output Range' });
    outputFolder.addBinding(params, 'outputMin', { min: -2, max: 2, step: 0.1 }).on('change', updateMaterial);
    outputFolder.addBinding(params, 'outputMax', { min: -2, max: 2, step: 0.1 }).on('change', updateMaterial);

    pane.addBinding(params, 'animate').on('change', updateMaterial);
    pane.addBinding(params, 'showInput', { label: 'Show Input (Debug)' }).on('change', updateMaterial);

    return {
      scene,
      camera,
      update: (delta) => {
        mesh.rotation.y += delta * 0.3;
      },
      dispose: () => {
        geometry.dispose();
        material.dispose();
      }
    };
  }

  static createCoordinatesDemo(pane) {
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x0a0a0f);
    
    const camera = new THREE.OrthographicCamera(-2, 2, 2, -2, 0.1, 100);
    camera.position.set(0, 0, 5);

    const params = {
      mode: 'polar',
      animate: true,
      segments: 16,
      showGrid: true
    };

    const material = new THREE.MeshBasicNodeMaterial();
    material.side = THREE.DoubleSide;
    
    const updateMaterial = () => {
      const coordinateShader = Fn(() => {
        const uvCoord = uv().mul(4).sub(2); // -2 to 2 range
        const animTime = params.animate ? time.mul(0.5) : 0;
        
        if (params.mode === 'polar') {
          // Convert to polar coordinates
          const polar = cartesianToPolar(uvCoord);
          const r = polar.x;
          const theta = polar.y.add(animTime);
          
          // Create pattern based on polar coords
          const radialPattern = sin(r.mul(5)).add(1).div(2);
          const angularPattern = sin(theta.mul(params.segments)).add(1).div(2);
          
          if (params.showGrid) {
            const grid = radialPattern.mul(0.5).add(angularPattern.mul(0.5));
            return vec3(grid, grid.mul(0.7), grid.mul(1.3));
          } else {
            return vec3(radialPattern, angularPattern, radialPattern.mul(angularPattern));
          }
        } else {
          // Cartesian grid
          const gridX = sin(uvCoord.x.mul(5).add(animTime)).add(1).div(2);
          const gridY = sin(uvCoord.y.mul(5).add(animTime)).add(1).div(2);
          
          return vec3(gridX, gridY, gridX.mul(gridY));
        }
      });

      material.colorNode = coordinateShader();
    };

    updateMaterial();

    const geometry = new THREE.PlaneGeometry(4, 4);
    const mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);

    pane.addBinding(params, 'mode', {
      options: {
        'Polar Coordinates': 'polar',
        'Cartesian Grid': 'cartesian'
      }
    }).on('change', updateMaterial);

    pane.addBinding(params, 'segments', { min: 4, max: 32, step: 1 }).on('change', updateMaterial);
    pane.addBinding(params, 'animate').on('change', updateMaterial);
    pane.addBinding(params, 'showGrid').on('change', updateMaterial);

    return {
      scene,
      camera,
      update: (delta) => {},
      dispose: () => {
        geometry.dispose();
        material.dispose();
      }
    };
  }

  static createComposeDemo(pane) {
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x0a0a0f);
    
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 100);
    camera.position.set(0, 0, 5);

    const params = {
      posX: 0,
      posY: 0,
      posZ: 0,
      rotX: 0,
      rotY: 0,
      rotZ: 0,
      scaleX: 1,
      scaleY: 1,
      scaleZ: 1,
      animate: true,
      showTransformed: true
    };

    const light = new THREE.DirectionalLight(0xffffff, 3);
    light.position.set(2, 2, 2);
    scene.add(light);
    scene.add(new THREE.AmbientLight(0x404040, 2));

    // Create reference object
    const refGeometry = new THREE.BoxGeometry(1, 1, 1);
    const refMaterial = new THREE.MeshBasicMaterial({ 
      color: 0x444444, 
      wireframe: true,
      transparent: true,
      opacity: 0.3
    });
    const refMesh = new THREE.Mesh(refGeometry, refMaterial);
    scene.add(refMesh);

    // Create transformed object
    const geometry = new THREE.BoxGeometry(1, 1, 1);
    const material = new THREE.MeshStandardMaterial({ color: 0x8b5cf6 });
    const mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);

    const updateTransform = () => {
      if (params.showTransformed) {
        mesh.position.set(params.posX, params.posY, params.posZ);
        mesh.rotation.set(params.rotX, params.rotY, params.rotZ);
        mesh.scale.set(params.scaleX, params.scaleY, params.scaleZ);
        mesh.visible = true;
      } else {
        mesh.visible = false;
      }
    };

    updateTransform();

    const posFolder = pane.addFolder({ title: 'Position' });
    posFolder.addBinding(params, 'posX', { min: -3, max: 3, step: 0.1 }).on('change', updateTransform);
    posFolder.addBinding(params, 'posY', { min: -3, max: 3, step: 0.1 }).on('change', updateTransform);
    posFolder.addBinding(params, 'posZ', { min: -3, max: 3, step: 0.1 }).on('change', updateTransform);

    const rotFolder = pane.addFolder({ title: 'Rotation (radians)' });
    rotFolder.addBinding(params, 'rotX', { min: -Math.PI, max: Math.PI, step: 0.1 }).on('change', updateTransform);
    rotFolder.addBinding(params, 'rotY', { min: -Math.PI, max: Math.PI, step: 0.1 }).on('change', updateTransform);
    rotFolder.addBinding(params, 'rotZ', { min: -Math.PI, max: Math.PI, step: 0.1 }).on('change', updateTransform);

    const scaleFolder = pane.addFolder({ title: 'Scale' });
    scaleFolder.addBinding(params, 'scaleX', { min: 0.1, max: 3, step: 0.1 }).on('change', updateTransform);
    scaleFolder.addBinding(params, 'scaleY', { min: 0.1, max: 3, step: 0.1 }).on('change', updateTransform);
    scaleFolder.addBinding(params, 'scaleZ', { min: 0.1, max: 3, step: 0.1 }).on('change', updateTransform);

    pane.addBinding(params, 'animate').on('change', updateTransform);
    pane.addBinding(params, 'showTransformed').on('change', updateTransform);

    pane.addButton({ title: 'Reset Transform' }).on('click', () => {
      params.posX = params.posY = params.posZ = 0;
      params.rotX = params.rotY = params.rotZ = 0;
      params.scaleX = params.scaleY = params.scaleZ = 1;
      pane.refresh();
      updateTransform();
    });

    return {
      scene,
      camera,
      update: (delta) => {
        if (params.animate) {
          mesh.rotation.y += delta * 0.5;
          mesh.rotation.x += delta * 0.3;
        }
      },
      dispose: () => {
        geometry.dispose();
        material.dispose();
        refGeometry.dispose();
        refMaterial.dispose();
      }
    };
  }
}

