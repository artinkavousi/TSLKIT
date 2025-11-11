/**
 * JSON DSL Compiler
 *
 * Compiles JSON graph definitions into executable TSL nodes.
 *
 * @module dsl/compiler
 */
import { GraphDefinition, CompiledGraph } from './types';
/**
 * Graph compiler
 */
export declare class GraphCompiler {
    private nodeCache;
    private uniforms;
    /**
     * Compile a graph definition into a TSL node
     */
    compile(graph: GraphDefinition): CompiledGraph;
    /**
     * Compile a single node
     */
    private compileNode;
    /**
     * Resolve input references
     */
    private resolveInputs;
    /**
     * Get default value for a type
     */
    private getDefaultValue;
    /**
     * Infer value type from a node
     */
    private inferType;
}
/**
 * Compile a JSON graph into a TSL node
 *
 * @param graph - Graph definition
 * @returns Compiled graph with TSL node and uniforms
 */
export declare function compileGraph(graph: GraphDefinition): CompiledGraph;
//# sourceMappingURL=compiler.d.ts.map