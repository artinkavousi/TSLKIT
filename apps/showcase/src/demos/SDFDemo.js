import * as THREE from 'three/webgpu';
import { Fn, vec2, vec3, uv, abs, length, max, min, sign, step, mix, color, time } from 'three/tsl';
import { sdSphere, sdBox2d, sdHexagon, sdRing } from '@tsl-kit/sdf/shapes';
import { smin } from '@tsl-kit/sdf/operations';

export class SDFDemo {
  static createShapesDemo(pane) {
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x0a0a0f);
    
    const camera = new THREE.OrthographicCamera(-2, 2, 2, -2, 0.1, 100);
    camera.position.set(0, 0, 5);

    const params = {
      shape: 'sphere',
      size: 0.5,
      animate: true,
      showDistance: false,
      backgroundColor: '#0a0a0f',
      shapeColor: '#8b5cf6',
      distanceColor: '#00ffff'
    };

    const material = new THREE.MeshBasicNodeMaterial();
    material.side = THREE.DoubleSide;
    
    const updateMaterial = () => {
      const sdfShader = Fn(() => {
        const uvCoord = uv().mul(4).sub(2); // -2 to 2 range
        const animTime = params.animate ? time.mul(0.5) : 0;
        
        let dist;
        if (params.shape === 'sphere') {
          dist = sdSphere(uvCoord, params.size);
        } else if (params.shape === 'box') {
          dist = sdBox2d(uvCoord, params.size);
        } else if (params.shape === 'hexagon') {
          dist = sdHexagon(uvCoord, params.size);
        } else if (params.shape === 'ring') {
          dist = sdRing(uvCoord, params.size);
        }

        // Animate size
        dist = dist.add(animTime.sin().mul(0.1));

        const bgColor = color(params.backgroundColor);
        const shapeCol = color(params.shapeColor);
        const distCol = color(params.distanceColor);

        if (params.showDistance) {
          // Show distance field
          const distVis = dist.mul(2).add(0.5);
          return mix(shapeCol, distCol, step(0, dist)).mul(distVis.abs());
        } else {
          // Sharp edge
          const edge = step(dist, 0);
          return mix(bgColor, shapeCol, edge);
        }
      });

      material.colorNode = sdfShader();
    };

    updateMaterial();

    const geometry = new THREE.PlaneGeometry(4, 4);
    const mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);

    pane.addBinding(params, 'shape', {
      options: {
        'Sphere': 'sphere',
        'Box': 'box',
        'Hexagon': 'hexagon',
        'Ring': 'ring'
      }
    }).on('change', updateMaterial);

    pane.addBinding(params, 'size', { min: 0.1, max: 1.5, step: 0.05 }).on('change', updateMaterial);
    pane.addBinding(params, 'animate').on('change', updateMaterial);
    pane.addBinding(params, 'showDistance', { label: 'Show Distance Field' }).on('change', updateMaterial);
    pane.addBinding(params, 'shapeColor').on('change', updateMaterial);
    pane.addBinding(params, 'distanceColor').on('change', updateMaterial);

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

  static createOperationsDemo(pane) {
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x0a0a0f);
    
    const camera = new THREE.OrthographicCamera(-2, 2, 2, -2, 0.1, 100);
    camera.position.set(0, 0, 5);

    const params = {
      operation: 'smooth-union',
      smoothness: 0.3,
      offset1X: -0.5,
      offset1Y: 0,
      offset2X: 0.5,
      offset2Y: 0,
      size: 0.5,
      animate: true,
      backgroundColor: '#0a0a0f',
      shape1Color: '#8b5cf6',
      shape2Color: '#00ffff'
    };

    const material = new THREE.MeshBasicNodeMaterial();
    material.side = THREE.DoubleSide;
    
    const updateMaterial = () => {
      const sdfShader = Fn(() => {
        const uvCoord = uv().mul(4).sub(2);
        const animTime = params.animate ? time.mul(0.3) : 0;
        
        // Two circles
        const offset1 = vec2(params.offset1X, params.offset1Y).add(vec2(animTime.sin().mul(0.2), animTime.cos().mul(0.2)));
        const offset2 = vec2(params.offset2X, params.offset2Y).add(vec2(animTime.cos().mul(0.2), animTime.sin().mul(0.2).negate()));
        
        const dist1 = sdSphere(uvCoord.sub(offset1), params.size);
        const dist2 = sdSphere(uvCoord.sub(offset2), params.size);

        let dist;
        if (params.operation === 'union') {
          dist = min(dist1, dist2);
        } else if (params.operation === 'smooth-union') {
          dist = smin(dist1, dist2, params.smoothness);
        } else if (params.operation === 'subtraction') {
          dist = max(dist1, dist2.negate());
        } else if (params.operation === 'intersection') {
          dist = max(dist1, dist2);
        }

        const bgColor = color(params.backgroundColor);
        const col1 = color(params.shape1Color);
        const col2 = color(params.shape2Color);
        
        const edge = step(dist, 0);
        const gradient = mix(col1, col2, uvCoord.x.mul(0.5).add(0.5));
        
        return mix(bgColor, gradient, edge);
      });

      material.colorNode = sdfShader();
    };

    updateMaterial();

    const geometry = new THREE.PlaneGeometry(4, 4);
    const mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);

    pane.addBinding(params, 'operation', {
      options: {
        'Union': 'union',
        'Smooth Union': 'smooth-union',
        'Subtraction': 'subtraction',
        'Intersection': 'intersection'
      }
    }).on('change', updateMaterial);

    pane.addBinding(params, 'smoothness', { min: 0, max: 1, step: 0.05 }).on('change', updateMaterial);
    pane.addBinding(params, 'size', { min: 0.1, max: 1, step: 0.05 }).on('change', updateMaterial);

    const pos1Folder = pane.addFolder({ title: 'Shape 1 Position', expanded: false });
    pos1Folder.addBinding(params, 'offset1X', { min: -1.5, max: 1.5, step: 0.1 }).on('change', updateMaterial);
    pos1Folder.addBinding(params, 'offset1Y', { min: -1.5, max: 1.5, step: 0.1 }).on('change', updateMaterial);

    const pos2Folder = pane.addFolder({ title: 'Shape 2 Position', expanded: false });
    pos2Folder.addBinding(params, 'offset2X', { min: -1.5, max: 1.5, step: 0.1 }).on('change', updateMaterial);
    pos2Folder.addBinding(params, 'offset2Y', { min: -1.5, max: 1.5, step: 0.1 }).on('change', updateMaterial);

    pane.addBinding(params, 'animate').on('change', updateMaterial);
    pane.addBinding(params, 'shape1Color').on('change', updateMaterial);
    pane.addBinding(params, 'shape2Color').on('change', updateMaterial);

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

  static createRaymarchingDemo(pane) {
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x0a0a0f);
    
    const camera = new THREE.OrthographicCamera(-2, 2, 2, -2, 0.1, 100);
    camera.position.set(0, 0, 5);

    const params = {
      maxSteps: 64,
      maxDistance: 10,
      surfaceDistance: 0.001,
      rotate: true,
      showSteps: false,
      lightPosX: 2,
      lightPosY: 2,
      lightPosZ: -2
    };

    const material = new THREE.MeshBasicNodeMaterial();
    material.side = THREE.DoubleSide;
    
    const updateMaterial = () => {
      const raymarchShader = Fn(() => {
        // Simple raymarching visualization
        const uvCoord = uv().mul(4).sub(2);
        const animTime = params.rotate ? time.mul(0.5) : 0;
        
        // Create a simple scene with multiple spheres
        const sphere1 = sdSphere(uvCoord.sub(vec2(animTime.sin().mul(0.5), 0)), 0.4);
        const sphere2 = sdSphere(uvCoord.sub(vec2(animTime.cos().mul(0.5), animTime.sin().mul(0.3))), 0.3);
        const sphere3 = sdSphere(uvCoord.sub(vec2(0, animTime.cos().mul(0.5))), 0.35);
        
        const dist = smin(smin(sphere1, sphere2, 0.2), sphere3, 0.2);
        
        const edge = step(dist, 0);
        
        if (params.showSteps) {
          // Visualize distance field as steps
          const steps = abs(dist).mul(10).fract();
          return vec3(steps).mul(edge.add(0.2));
        } else {
          // Normal shading
          const normal = sign(dist);
          const shading = normal.mul(0.5).add(0.7);
          return vec3(0.5, 0.3, 0.8).mul(shading).mul(edge.add(0.1));
        }
      });

      material.colorNode = raymarchShader();
    };

    updateMaterial();

    const geometry = new THREE.PlaneGeometry(4, 4);
    const mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);

    const raymarchFolder = pane.addFolder({ title: 'Raymarching Settings' });
    raymarchFolder.addBinding(params, 'maxSteps', { min: 8, max: 128, step: 8 }).on('change', updateMaterial);
    raymarchFolder.addBinding(params, 'maxDistance', { min: 1, max: 20, step: 1 }).on('change', updateMaterial);
    raymarchFolder.addBinding(params, 'surfaceDistance', { min: 0.0001, max: 0.01, step: 0.0001 }).on('change', updateMaterial);

    pane.addBinding(params, 'rotate').on('change', updateMaterial);
    pane.addBinding(params, 'showSteps', { label: 'Show Distance Steps' }).on('change', updateMaterial);

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
}

