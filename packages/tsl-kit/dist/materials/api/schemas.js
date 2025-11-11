/**
 * Material API Schemas
 *
 * Zod schemas for type-safe material configuration.
 *
 * @module materials/api/schemas
 */
import { z } from 'zod';
/**
 * Base material configuration schema
 */
export const baseMaterialSchema = z.object({
    type: z.enum(['physical', 'standard', 'basic', 'pbr', 'custom']),
    name: z.string().optional(),
    side: z.enum(['front', 'back', 'double']).default('front'),
    transparent: z.boolean().default(false),
    opacity: z.number().min(0).max(1).default(1.0),
    depthWrite: z.boolean().default(true),
    depthTest: z.boolean().default(true)
});
/**
 * Color configuration (hex, rgb, or vec3)
 */
export const colorSchema = z.union([
    z.string().regex(/^#[0-9a-fA-F]{6}$/), // Hex color
    z.array(z.number().min(0).max(1)).length(3), // RGB array
    z.object({ r: z.number(), g: z.number(), b: z.number() }) // RGB object
]);
/**
 * Texture configuration
 */
export const textureSchema = z.object({
    url: z.string().optional(),
    texture: z.any().optional(), // THREE.Texture
    repeat: z.tuple([z.number(), z.number()]).default([1, 1]),
    offset: z.tuple([z.number(), z.number()]).default([0, 0]),
    wrapS: z.enum(['repeat', 'clampToEdge', 'mirroredRepeat']).default('repeat'),
    wrapT: z.enum(['repeat', 'clampToEdge', 'mirroredRepeat']).default('repeat')
});
/**
 * PBR material configuration
 */
export const pbrMaterialSchema = baseMaterialSchema.extend({
    type: z.literal('pbr'),
    // Base properties
    color: colorSchema.default([1, 1, 1]),
    roughness: z.number().min(0).max(1).default(0.5),
    metalness: z.number().min(0).max(1).default(0.0),
    // Textures
    map: textureSchema.optional(),
    normalMap: textureSchema.optional(),
    roughnessMap: textureSchema.optional(),
    metalnessMap: textureSchema.optional(),
    aoMap: textureSchema.optional(),
    // Clearcoat layer
    clearcoat: z.number().min(0).max(1).default(0.0),
    clearcoatRoughness: z.number().min(0).max(1).default(0.0),
    clearcoatMap: textureSchema.optional(),
    clearcoatNormalMap: textureSchema.optional(),
    // Sheen layer
    sheen: z.number().min(0).max(1).default(0.0),
    sheenRoughness: z.number().min(0).max(1).default(0.0),
    sheenColor: colorSchema.optional(),
    // Transmission
    transmission: z.number().min(0).max(1).default(0.0),
    thickness: z.number().min(0).default(0.0),
    ior: z.number().min(1).default(1.5),
    // Iridescence
    iridescence: z.number().min(0).max(1).default(0.0),
    iridescenceIOR: z.number().min(1).default(1.3),
    iridescenceThicknessRange: z.tuple([z.number(), z.number()]).default([100, 400]),
    // Emission
    emissive: colorSchema.default([0, 0, 0]),
    emissiveIntensity: z.number().min(0).default(1.0),
    emissiveMap: textureSchema.optional(),
    // Advanced
    envMapIntensity: z.number().min(0).default(1.0),
    normalScale: z.tuple([z.number(), z.number()]).default([1, 1])
});
/**
 * Procedural wood material configuration
 */
export const woodMaterialSchema = baseMaterialSchema.extend({
    type: z.literal('wood'),
    preset: z.enum(['oak', 'walnut', 'pine', 'mahogany', 'cherry', 'bamboo']).optional(),
    // Wood-specific properties
    grainDensity: z.number().min(0).default(20),
    grainVariation: z.number().min(0).max(1).default(0.5),
    ringScale: z.number().min(0).default(30),
    colorVariation: z.number().min(0).max(1).default(0.3),
    baseColor: colorSchema.default([0.6, 0.4, 0.2]),
    darkColor: colorSchema.default([0.3, 0.2, 0.1]),
    // Standard PBR properties
    roughness: z.number().min(0).max(1).default(0.7),
    metalness: z.number().min(0).max(1).default(0.0),
    clearcoat: z.number().min(0).max(1).default(0.3),
    clearcoatRoughness: z.number().min(0).max(1).default(0.1)
});
/**
 * Glass material configuration
 */
export const glassMaterialSchema = baseMaterialSchema.extend({
    type: z.literal('glass'),
    color: colorSchema.default([1, 1, 1]),
    transmission: z.number().min(0).max(1).default(1.0),
    thickness: z.number().min(0).default(0.5),
    roughness: z.number().min(0).max(1).default(0.0),
    ior: z.number().min(1).default(1.5),
    // Optional tint
    attenuationColor: colorSchema.optional(),
    attenuationDistance: z.number().min(0).default(1.0)
});
/**
 * Metal material configuration
 */
export const metalMaterialSchema = baseMaterialSchema.extend({
    type: z.literal('metal'),
    preset: z.enum(['aluminum', 'copper', 'gold', 'silver', 'iron', 'steel', 'bronze']).optional(),
    color: colorSchema.default([0.9, 0.9, 0.9]),
    roughness: z.number().min(0).max(1).default(0.2),
    metalness: z.number().min(0).max(1).default(1.0),
    // Anisotropy for brushed metals
    anisotropy: z.number().min(0).max(1).default(0.0),
    anisotropyRotation: z.number().min(0).max(Math.PI * 2).default(0.0)
});
/**
 * Fabric/cloth material configuration
 */
export const fabricMaterialSchema = baseMaterialSchema.extend({
    type: z.literal('fabric'),
    preset: z.enum(['cotton', 'silk', 'velvet', 'denim', 'leather']).optional(),
    color: colorSchema.default([0.8, 0.8, 0.8]),
    roughness: z.number().min(0).max(1).default(0.8),
    // Sheen for fabrics
    sheen: z.number().min(0).max(1).default(0.5),
    sheenRoughness: z.number().min(0).max(1).default(0.5),
    sheenColor: colorSchema.optional()
});
/**
 * Union of all material schemas
 */
export const materialSchema = z.discriminatedUnion('type', [
    pbrMaterialSchema,
    woodMaterialSchema,
    glassMaterialSchema,
    metalMaterialSchema,
    fabricMaterialSchema
]);
//# sourceMappingURL=schemas.js.map