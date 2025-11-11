/**
 * JSON DSL Compiler
 *
 * Compiles JSON graph definitions into executable TSL nodes.
 *
 * @module dsl/compiler
 */
import { float, vec2, vec3, vec4, color, add, sub, mul, div, mod, pow, sqrt, min, max, clamp, mix, step, smoothstep, abs, sign, floor, ceil, fract, sin, cos, tan, dot, cross, length, normalize, reflect, positionLocal, positionWorld, positionView, normalLocal, normalWorld, normalView, uv, uv2, time, uniform, texture, textureCube } from 'three/tsl';
/**
 * Graph compiler
 */
export class GraphCompiler {
    constructor() {
        this.nodeCache = new Map();
        this.uniforms = new Map();
    }
    /**
     * Compile a graph definition into a TSL node
     */
    compile(graph) {
        // Reset state
        this.nodeCache.clear();
        this.uniforms.clear();
        // Create uniforms
        if (graph.uniforms) {
            for (const [name, def] of Object.entries(graph.uniforms)) {
                const uniformNode = uniform(def.value !== undefined ? def.value : this.getDefaultValue(def.type));
                this.uniforms.set(name, uniformNode);
                this.nodeCache.set(name, uniformNode);
            }
        }
        // Compile nodes
        for (const nodeDef of graph.nodes) {
            this.compileNode(nodeDef);
        }
        // Get output node
        const outputNode = this.nodeCache.get(graph.output);
        if (!outputNode) {
            throw new Error(`Output node "${graph.output}" not found`);
        }
        return {
            node: outputNode,
            uniforms: Object.fromEntries(this.uniforms),
            metadata: {
                name: graph.name,
                nodeCount: graph.nodes.length,
                outputType: this.inferType(outputNode)
            }
        };
    }
    /**
     * Compile a single node
     */
    compileNode(nodeDef) {
        // Check cache
        if (this.nodeCache.has(nodeDef.id)) {
            return this.nodeCache.get(nodeDef.id);
        }
        // Resolve inputs
        const inputs = this.resolveInputs(nodeDef.inputs || {});
        // Create node based on type
        let node;
        switch (nodeDef.type) {
            // Math operations
            case 'add':
                node = add(inputs.a, inputs.b);
                break;
            case 'sub':
                node = sub(inputs.a, inputs.b);
                break;
            case 'mul':
                node = mul(inputs.a, inputs.b);
                break;
            case 'div':
                node = div(inputs.a, inputs.b);
                break;
            case 'mod':
                node = mod(inputs.a, inputs.b);
                break;
            case 'pow':
                node = pow(inputs.base, inputs.exponent);
                break;
            case 'sqrt':
                node = sqrt(inputs.value);
                break;
            case 'min':
                node = min(inputs.a, inputs.b);
                break;
            case 'max':
                node = max(inputs.a, inputs.b);
                break;
            case 'clamp':
                node = clamp(inputs.value, inputs.min, inputs.max);
                break;
            case 'mix':
                node = mix(inputs.a, inputs.b, inputs.t);
                break;
            case 'step':
                node = step(inputs.edge, inputs.value);
                break;
            case 'smoothstep':
                node = smoothstep(inputs.edge0, inputs.edge1, inputs.value);
                break;
            case 'abs':
                node = abs(inputs.value);
                break;
            case 'sign':
                node = sign(inputs.value);
                break;
            case 'floor':
                node = floor(inputs.value);
                break;
            case 'ceil':
                node = ceil(inputs.value);
                break;
            case 'fract':
                node = fract(inputs.value);
                break;
            case 'sin':
                node = sin(inputs.angle);
                break;
            case 'cos':
                node = cos(inputs.angle);
                break;
            case 'tan':
                node = tan(inputs.angle);
                break;
            // Vector operations
            case 'dot':
                node = dot(inputs.a, inputs.b);
                break;
            case 'cross':
                node = cross(inputs.a, inputs.b);
                break;
            case 'length':
                node = length(inputs.value);
                break;
            case 'normalize':
                node = normalize(inputs.value);
                break;
            case 'reflect':
                node = reflect(inputs.incident, inputs.normal);
                break;
            // Constants
            case 'float':
                node = float(nodeDef.params?.value || 0);
                break;
            case 'vec2':
                node = vec2(...(nodeDef.params?.value || [0, 0]));
                break;
            case 'vec3':
                node = vec3(...(nodeDef.params?.value || [0, 0, 0]));
                break;
            case 'vec4':
                node = vec4(...(nodeDef.params?.value || [0, 0, 0, 0]));
                break;
            case 'color':
                node = color(...(nodeDef.params?.value || [1, 1, 1]));
                break;
            // Built-in attributes
            case 'positionLocal':
                node = positionLocal;
                break;
            case 'positionWorld':
                node = positionWorld;
                break;
            case 'positionView':
                node = positionView;
                break;
            case 'normalLocal':
                node = normalLocal;
                break;
            case 'normalWorld':
                node = normalWorld;
                break;
            case 'normalView':
                node = normalView;
                break;
            case 'uv':
                node = uv();
                break;
            case 'uv2':
                node = uv2;
                break;
            case 'time':
                node = time;
                break;
            // Textures
            case 'texture':
                node = texture(inputs.sampler, inputs.uv || uv());
                break;
            case 'textureCube':
                node = textureCube(inputs.sampler, inputs.direction);
                break;
            // Uniforms (reference existing)
            case 'uniform':
                if (this.uniforms.has(nodeDef.params?.name)) {
                    node = this.uniforms.get(nodeDef.params.name);
                }
                else {
                    throw new Error(`Uniform "${nodeDef.params?.name}" not defined`);
                }
                break;
            default:
                throw new Error(`Unknown node type: ${nodeDef.type}`);
        }
        // Cache and return
        this.nodeCache.set(nodeDef.id, node);
        return node;
    }
    /**
     * Resolve input references
     */
    resolveInputs(inputs) {
        const resolved = {};
        for (const [key, value] of Object.entries(inputs)) {
            if (typeof value === 'string') {
                // Reference to another node
                const refNode = this.nodeCache.get(value);
                if (!refNode) {
                    throw new Error(`Referenced node "${value}" not found`);
                }
                resolved[key] = refNode;
            }
            else if (typeof value === 'number') {
                // Constant float
                resolved[key] = float(value);
            }
            else if (Array.isArray(value)) {
                // Constant vector
                if (value.length === 2) {
                    resolved[key] = vec2(...value);
                }
                else if (value.length === 3) {
                    resolved[key] = vec3(...value);
                }
                else if (value.length === 4) {
                    resolved[key] = vec4(...value);
                }
            }
            else {
                resolved[key] = value;
            }
        }
        return resolved;
    }
    /**
     * Get default value for a type
     */
    getDefaultValue(type) {
        switch (type) {
            case 'float': return 0;
            case 'vec2': return [0, 0];
            case 'vec3': return [0, 0, 0];
            case 'vec4': return [0, 0, 0, 0];
            default: return 0;
        }
    }
    /**
     * Infer value type from a node
     */
    inferType(node) {
        // Simplified type inference
        // In a real implementation, would inspect node.type or similar
        return 'vec3';
    }
}
/**
 * Compile a JSON graph into a TSL node
 *
 * @param graph - Graph definition
 * @returns Compiled graph with TSL node and uniforms
 */
export function compileGraph(graph) {
    const compiler = new GraphCompiler();
    return compiler.compile(graph);
}
//# sourceMappingURL=compiler.js.map