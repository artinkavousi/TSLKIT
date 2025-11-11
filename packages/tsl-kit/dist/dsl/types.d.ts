/**
 * JSON DSL Type Definitions
 *
 * Type-safe schema for defining TSL graphs via JSON.
 *
 * @module dsl/types
 */
/**
 * Node types available in the DSL
 */
export type NodeType = 'add' | 'sub' | 'mul' | 'div' | 'mod' | 'pow' | 'sqrt' | 'min' | 'max' | 'clamp' | 'mix' | 'step' | 'smoothstep' | 'abs' | 'sign' | 'floor' | 'ceil' | 'fract' | 'sin' | 'cos' | 'tan' | 'asin' | 'acos' | 'atan' | 'dot' | 'cross' | 'length' | 'normalize' | 'reflect' | 'refract' | 'float' | 'vec2' | 'vec3' | 'vec4' | 'color' | 'uniform' | 'attribute' | 'varying' | 'positionLocal' | 'positionWorld' | 'positionView' | 'normalLocal' | 'normalWorld' | 'normalView' | 'uv' | 'uv2' | 'time' | 'texture' | 'textureLoad' | 'textureCube' | 'simplexNoise2d' | 'simplexNoise3d' | 'simplexNoise4d' | 'voronoiNoise' | 'cellularNoise' | 'fbm' | 'output' | 'emissive' | 'roughness' | 'metalness' | 'clearcoat' | 'if' | 'switch' | 'loop';
/**
 * Value types in the DSL
 */
export type ValueType = 'float' | 'vec2' | 'vec3' | 'vec4' | 'mat3' | 'mat4' | 'sampler2D' | 'samplerCube';
/**
 * Node definition in the graph
 */
export interface NodeDefinition {
    /** Unique identifier for this node */
    id: string;
    /** Type of operation */
    type: NodeType;
    /** Input connections (node ID or constant value) */
    inputs?: Record<string, string | number | number[]>;
    /** Node-specific parameters */
    params?: Record<string, any>;
    /** Output value type (inferred if not specified) */
    valueType?: ValueType;
}
/**
 * Graph definition
 */
export interface GraphDefinition {
    /** Graph metadata */
    name?: string;
    description?: string;
    version?: string;
    /** Nodes in the graph */
    nodes: NodeDefinition[];
    /** Output node ID */
    output: string;
    /** External uniforms */
    uniforms?: Record<string, {
        type: ValueType;
        value?: any;
    }>;
}
/**
 * Compiled graph result
 */
export interface CompiledGraph {
    /** The compiled TSL node */
    node: any;
    /** Uniform references for runtime updates */
    uniforms: Record<string, any>;
    /** Graph metadata */
    metadata: {
        name?: string;
        nodeCount: number;
        outputType: ValueType;
    };
}
//# sourceMappingURL=types.d.ts.map