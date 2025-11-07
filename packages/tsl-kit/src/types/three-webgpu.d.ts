declare module 'three/webgpu' {
  export type Node = any;
  export type NodeBuilder = any;
  export type PropertyNode = any;
  export type UniformNode<T = any> = any;

  export class MeshPhysicalNodeMaterial {
    constructor(params?: any);
    setupPosition(builder: any): any;
    setupDiffuseColor(builder: any): any;
  }

  export class SpriteNodeMaterial {
    colorNode: any;
    positionNode: any;
    scaleNode: any;
    alphaTestNode: any;
    alphaToCoverage: boolean;
    transparent: boolean;
  }

  export class ComputeNode {
    compute(count: number): ComputeNode;
  }
}
