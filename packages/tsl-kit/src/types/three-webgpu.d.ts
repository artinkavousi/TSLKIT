declare module 'three/webgpu' {
  export class MeshPhysicalNodeMaterial {
    constructor(params?: any);
    setupPosition(builder: any): any;
    setupDiffuseColor(builder: any): any;
  }
  export type NodeBuilder = any;
  export type PropertyNode = any;
  export type UniformNode<T = any> = any;
}
