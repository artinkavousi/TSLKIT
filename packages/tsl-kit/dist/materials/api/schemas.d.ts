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
export declare const baseMaterialSchema: z.ZodObject<{
    type: z.ZodEnum<{
        custom: "custom";
        physical: "physical";
        standard: "standard";
        basic: "basic";
        pbr: "pbr";
    }>;
    name: z.ZodOptional<z.ZodString>;
    side: z.ZodDefault<z.ZodEnum<{
        front: "front";
        back: "back";
        double: "double";
    }>>;
    transparent: z.ZodDefault<z.ZodBoolean>;
    opacity: z.ZodDefault<z.ZodNumber>;
    depthWrite: z.ZodDefault<z.ZodBoolean>;
    depthTest: z.ZodDefault<z.ZodBoolean>;
}, z.core.$strip>;
/**
 * Color configuration (hex, rgb, or vec3)
 */
export declare const colorSchema: z.ZodUnion<readonly [z.ZodString, z.ZodArray<z.ZodNumber>, z.ZodObject<{
    r: z.ZodNumber;
    g: z.ZodNumber;
    b: z.ZodNumber;
}, z.core.$strip>]>;
/**
 * Texture configuration
 */
export declare const textureSchema: z.ZodObject<{
    url: z.ZodOptional<z.ZodString>;
    texture: z.ZodOptional<z.ZodAny>;
    repeat: z.ZodDefault<z.ZodTuple<[z.ZodNumber, z.ZodNumber], null>>;
    offset: z.ZodDefault<z.ZodTuple<[z.ZodNumber, z.ZodNumber], null>>;
    wrapS: z.ZodDefault<z.ZodEnum<{
        repeat: "repeat";
        clampToEdge: "clampToEdge";
        mirroredRepeat: "mirroredRepeat";
    }>>;
    wrapT: z.ZodDefault<z.ZodEnum<{
        repeat: "repeat";
        clampToEdge: "clampToEdge";
        mirroredRepeat: "mirroredRepeat";
    }>>;
}, z.core.$strip>;
/**
 * PBR material configuration
 */
export declare const pbrMaterialSchema: z.ZodObject<{
    name: z.ZodOptional<z.ZodString>;
    side: z.ZodDefault<z.ZodEnum<{
        front: "front";
        back: "back";
        double: "double";
    }>>;
    transparent: z.ZodDefault<z.ZodBoolean>;
    opacity: z.ZodDefault<z.ZodNumber>;
    depthWrite: z.ZodDefault<z.ZodBoolean>;
    depthTest: z.ZodDefault<z.ZodBoolean>;
    type: z.ZodLiteral<"pbr">;
    color: z.ZodDefault<z.ZodUnion<readonly [z.ZodString, z.ZodArray<z.ZodNumber>, z.ZodObject<{
        r: z.ZodNumber;
        g: z.ZodNumber;
        b: z.ZodNumber;
    }, z.core.$strip>]>>;
    roughness: z.ZodDefault<z.ZodNumber>;
    metalness: z.ZodDefault<z.ZodNumber>;
    map: z.ZodOptional<z.ZodObject<{
        url: z.ZodOptional<z.ZodString>;
        texture: z.ZodOptional<z.ZodAny>;
        repeat: z.ZodDefault<z.ZodTuple<[z.ZodNumber, z.ZodNumber], null>>;
        offset: z.ZodDefault<z.ZodTuple<[z.ZodNumber, z.ZodNumber], null>>;
        wrapS: z.ZodDefault<z.ZodEnum<{
            repeat: "repeat";
            clampToEdge: "clampToEdge";
            mirroredRepeat: "mirroredRepeat";
        }>>;
        wrapT: z.ZodDefault<z.ZodEnum<{
            repeat: "repeat";
            clampToEdge: "clampToEdge";
            mirroredRepeat: "mirroredRepeat";
        }>>;
    }, z.core.$strip>>;
    normalMap: z.ZodOptional<z.ZodObject<{
        url: z.ZodOptional<z.ZodString>;
        texture: z.ZodOptional<z.ZodAny>;
        repeat: z.ZodDefault<z.ZodTuple<[z.ZodNumber, z.ZodNumber], null>>;
        offset: z.ZodDefault<z.ZodTuple<[z.ZodNumber, z.ZodNumber], null>>;
        wrapS: z.ZodDefault<z.ZodEnum<{
            repeat: "repeat";
            clampToEdge: "clampToEdge";
            mirroredRepeat: "mirroredRepeat";
        }>>;
        wrapT: z.ZodDefault<z.ZodEnum<{
            repeat: "repeat";
            clampToEdge: "clampToEdge";
            mirroredRepeat: "mirroredRepeat";
        }>>;
    }, z.core.$strip>>;
    roughnessMap: z.ZodOptional<z.ZodObject<{
        url: z.ZodOptional<z.ZodString>;
        texture: z.ZodOptional<z.ZodAny>;
        repeat: z.ZodDefault<z.ZodTuple<[z.ZodNumber, z.ZodNumber], null>>;
        offset: z.ZodDefault<z.ZodTuple<[z.ZodNumber, z.ZodNumber], null>>;
        wrapS: z.ZodDefault<z.ZodEnum<{
            repeat: "repeat";
            clampToEdge: "clampToEdge";
            mirroredRepeat: "mirroredRepeat";
        }>>;
        wrapT: z.ZodDefault<z.ZodEnum<{
            repeat: "repeat";
            clampToEdge: "clampToEdge";
            mirroredRepeat: "mirroredRepeat";
        }>>;
    }, z.core.$strip>>;
    metalnessMap: z.ZodOptional<z.ZodObject<{
        url: z.ZodOptional<z.ZodString>;
        texture: z.ZodOptional<z.ZodAny>;
        repeat: z.ZodDefault<z.ZodTuple<[z.ZodNumber, z.ZodNumber], null>>;
        offset: z.ZodDefault<z.ZodTuple<[z.ZodNumber, z.ZodNumber], null>>;
        wrapS: z.ZodDefault<z.ZodEnum<{
            repeat: "repeat";
            clampToEdge: "clampToEdge";
            mirroredRepeat: "mirroredRepeat";
        }>>;
        wrapT: z.ZodDefault<z.ZodEnum<{
            repeat: "repeat";
            clampToEdge: "clampToEdge";
            mirroredRepeat: "mirroredRepeat";
        }>>;
    }, z.core.$strip>>;
    aoMap: z.ZodOptional<z.ZodObject<{
        url: z.ZodOptional<z.ZodString>;
        texture: z.ZodOptional<z.ZodAny>;
        repeat: z.ZodDefault<z.ZodTuple<[z.ZodNumber, z.ZodNumber], null>>;
        offset: z.ZodDefault<z.ZodTuple<[z.ZodNumber, z.ZodNumber], null>>;
        wrapS: z.ZodDefault<z.ZodEnum<{
            repeat: "repeat";
            clampToEdge: "clampToEdge";
            mirroredRepeat: "mirroredRepeat";
        }>>;
        wrapT: z.ZodDefault<z.ZodEnum<{
            repeat: "repeat";
            clampToEdge: "clampToEdge";
            mirroredRepeat: "mirroredRepeat";
        }>>;
    }, z.core.$strip>>;
    clearcoat: z.ZodDefault<z.ZodNumber>;
    clearcoatRoughness: z.ZodDefault<z.ZodNumber>;
    clearcoatMap: z.ZodOptional<z.ZodObject<{
        url: z.ZodOptional<z.ZodString>;
        texture: z.ZodOptional<z.ZodAny>;
        repeat: z.ZodDefault<z.ZodTuple<[z.ZodNumber, z.ZodNumber], null>>;
        offset: z.ZodDefault<z.ZodTuple<[z.ZodNumber, z.ZodNumber], null>>;
        wrapS: z.ZodDefault<z.ZodEnum<{
            repeat: "repeat";
            clampToEdge: "clampToEdge";
            mirroredRepeat: "mirroredRepeat";
        }>>;
        wrapT: z.ZodDefault<z.ZodEnum<{
            repeat: "repeat";
            clampToEdge: "clampToEdge";
            mirroredRepeat: "mirroredRepeat";
        }>>;
    }, z.core.$strip>>;
    clearcoatNormalMap: z.ZodOptional<z.ZodObject<{
        url: z.ZodOptional<z.ZodString>;
        texture: z.ZodOptional<z.ZodAny>;
        repeat: z.ZodDefault<z.ZodTuple<[z.ZodNumber, z.ZodNumber], null>>;
        offset: z.ZodDefault<z.ZodTuple<[z.ZodNumber, z.ZodNumber], null>>;
        wrapS: z.ZodDefault<z.ZodEnum<{
            repeat: "repeat";
            clampToEdge: "clampToEdge";
            mirroredRepeat: "mirroredRepeat";
        }>>;
        wrapT: z.ZodDefault<z.ZodEnum<{
            repeat: "repeat";
            clampToEdge: "clampToEdge";
            mirroredRepeat: "mirroredRepeat";
        }>>;
    }, z.core.$strip>>;
    sheen: z.ZodDefault<z.ZodNumber>;
    sheenRoughness: z.ZodDefault<z.ZodNumber>;
    sheenColor: z.ZodOptional<z.ZodUnion<readonly [z.ZodString, z.ZodArray<z.ZodNumber>, z.ZodObject<{
        r: z.ZodNumber;
        g: z.ZodNumber;
        b: z.ZodNumber;
    }, z.core.$strip>]>>;
    transmission: z.ZodDefault<z.ZodNumber>;
    thickness: z.ZodDefault<z.ZodNumber>;
    ior: z.ZodDefault<z.ZodNumber>;
    iridescence: z.ZodDefault<z.ZodNumber>;
    iridescenceIOR: z.ZodDefault<z.ZodNumber>;
    iridescenceThicknessRange: z.ZodDefault<z.ZodTuple<[z.ZodNumber, z.ZodNumber], null>>;
    emissive: z.ZodDefault<z.ZodUnion<readonly [z.ZodString, z.ZodArray<z.ZodNumber>, z.ZodObject<{
        r: z.ZodNumber;
        g: z.ZodNumber;
        b: z.ZodNumber;
    }, z.core.$strip>]>>;
    emissiveIntensity: z.ZodDefault<z.ZodNumber>;
    emissiveMap: z.ZodOptional<z.ZodObject<{
        url: z.ZodOptional<z.ZodString>;
        texture: z.ZodOptional<z.ZodAny>;
        repeat: z.ZodDefault<z.ZodTuple<[z.ZodNumber, z.ZodNumber], null>>;
        offset: z.ZodDefault<z.ZodTuple<[z.ZodNumber, z.ZodNumber], null>>;
        wrapS: z.ZodDefault<z.ZodEnum<{
            repeat: "repeat";
            clampToEdge: "clampToEdge";
            mirroredRepeat: "mirroredRepeat";
        }>>;
        wrapT: z.ZodDefault<z.ZodEnum<{
            repeat: "repeat";
            clampToEdge: "clampToEdge";
            mirroredRepeat: "mirroredRepeat";
        }>>;
    }, z.core.$strip>>;
    envMapIntensity: z.ZodDefault<z.ZodNumber>;
    normalScale: z.ZodDefault<z.ZodTuple<[z.ZodNumber, z.ZodNumber], null>>;
}, z.core.$strip>;
/**
 * Procedural wood material configuration
 */
export declare const woodMaterialSchema: z.ZodObject<{
    name: z.ZodOptional<z.ZodString>;
    side: z.ZodDefault<z.ZodEnum<{
        front: "front";
        back: "back";
        double: "double";
    }>>;
    transparent: z.ZodDefault<z.ZodBoolean>;
    opacity: z.ZodDefault<z.ZodNumber>;
    depthWrite: z.ZodDefault<z.ZodBoolean>;
    depthTest: z.ZodDefault<z.ZodBoolean>;
    type: z.ZodLiteral<"wood">;
    preset: z.ZodOptional<z.ZodEnum<{
        walnut: "walnut";
        pine: "pine";
        cherry: "cherry";
        mahogany: "mahogany";
        oak: "oak";
        bamboo: "bamboo";
    }>>;
    grainDensity: z.ZodDefault<z.ZodNumber>;
    grainVariation: z.ZodDefault<z.ZodNumber>;
    ringScale: z.ZodDefault<z.ZodNumber>;
    colorVariation: z.ZodDefault<z.ZodNumber>;
    baseColor: z.ZodDefault<z.ZodUnion<readonly [z.ZodString, z.ZodArray<z.ZodNumber>, z.ZodObject<{
        r: z.ZodNumber;
        g: z.ZodNumber;
        b: z.ZodNumber;
    }, z.core.$strip>]>>;
    darkColor: z.ZodDefault<z.ZodUnion<readonly [z.ZodString, z.ZodArray<z.ZodNumber>, z.ZodObject<{
        r: z.ZodNumber;
        g: z.ZodNumber;
        b: z.ZodNumber;
    }, z.core.$strip>]>>;
    roughness: z.ZodDefault<z.ZodNumber>;
    metalness: z.ZodDefault<z.ZodNumber>;
    clearcoat: z.ZodDefault<z.ZodNumber>;
    clearcoatRoughness: z.ZodDefault<z.ZodNumber>;
}, z.core.$strip>;
/**
 * Glass material configuration
 */
export declare const glassMaterialSchema: z.ZodObject<{
    name: z.ZodOptional<z.ZodString>;
    side: z.ZodDefault<z.ZodEnum<{
        front: "front";
        back: "back";
        double: "double";
    }>>;
    transparent: z.ZodDefault<z.ZodBoolean>;
    opacity: z.ZodDefault<z.ZodNumber>;
    depthWrite: z.ZodDefault<z.ZodBoolean>;
    depthTest: z.ZodDefault<z.ZodBoolean>;
    type: z.ZodLiteral<"glass">;
    color: z.ZodDefault<z.ZodUnion<readonly [z.ZodString, z.ZodArray<z.ZodNumber>, z.ZodObject<{
        r: z.ZodNumber;
        g: z.ZodNumber;
        b: z.ZodNumber;
    }, z.core.$strip>]>>;
    transmission: z.ZodDefault<z.ZodNumber>;
    thickness: z.ZodDefault<z.ZodNumber>;
    roughness: z.ZodDefault<z.ZodNumber>;
    ior: z.ZodDefault<z.ZodNumber>;
    attenuationColor: z.ZodOptional<z.ZodUnion<readonly [z.ZodString, z.ZodArray<z.ZodNumber>, z.ZodObject<{
        r: z.ZodNumber;
        g: z.ZodNumber;
        b: z.ZodNumber;
    }, z.core.$strip>]>>;
    attenuationDistance: z.ZodDefault<z.ZodNumber>;
}, z.core.$strip>;
/**
 * Metal material configuration
 */
export declare const metalMaterialSchema: z.ZodObject<{
    name: z.ZodOptional<z.ZodString>;
    side: z.ZodDefault<z.ZodEnum<{
        front: "front";
        back: "back";
        double: "double";
    }>>;
    transparent: z.ZodDefault<z.ZodBoolean>;
    opacity: z.ZodDefault<z.ZodNumber>;
    depthWrite: z.ZodDefault<z.ZodBoolean>;
    depthTest: z.ZodDefault<z.ZodBoolean>;
    type: z.ZodLiteral<"metal">;
    preset: z.ZodOptional<z.ZodEnum<{
        aluminum: "aluminum";
        copper: "copper";
        gold: "gold";
        silver: "silver";
        iron: "iron";
        steel: "steel";
        bronze: "bronze";
    }>>;
    color: z.ZodDefault<z.ZodUnion<readonly [z.ZodString, z.ZodArray<z.ZodNumber>, z.ZodObject<{
        r: z.ZodNumber;
        g: z.ZodNumber;
        b: z.ZodNumber;
    }, z.core.$strip>]>>;
    roughness: z.ZodDefault<z.ZodNumber>;
    metalness: z.ZodDefault<z.ZodNumber>;
    anisotropy: z.ZodDefault<z.ZodNumber>;
    anisotropyRotation: z.ZodDefault<z.ZodNumber>;
}, z.core.$strip>;
/**
 * Fabric/cloth material configuration
 */
export declare const fabricMaterialSchema: z.ZodObject<{
    name: z.ZodOptional<z.ZodString>;
    side: z.ZodDefault<z.ZodEnum<{
        front: "front";
        back: "back";
        double: "double";
    }>>;
    transparent: z.ZodDefault<z.ZodBoolean>;
    opacity: z.ZodDefault<z.ZodNumber>;
    depthWrite: z.ZodDefault<z.ZodBoolean>;
    depthTest: z.ZodDefault<z.ZodBoolean>;
    type: z.ZodLiteral<"fabric">;
    preset: z.ZodOptional<z.ZodEnum<{
        cotton: "cotton";
        silk: "silk";
        velvet: "velvet";
        denim: "denim";
        leather: "leather";
    }>>;
    color: z.ZodDefault<z.ZodUnion<readonly [z.ZodString, z.ZodArray<z.ZodNumber>, z.ZodObject<{
        r: z.ZodNumber;
        g: z.ZodNumber;
        b: z.ZodNumber;
    }, z.core.$strip>]>>;
    roughness: z.ZodDefault<z.ZodNumber>;
    sheen: z.ZodDefault<z.ZodNumber>;
    sheenRoughness: z.ZodDefault<z.ZodNumber>;
    sheenColor: z.ZodOptional<z.ZodUnion<readonly [z.ZodString, z.ZodArray<z.ZodNumber>, z.ZodObject<{
        r: z.ZodNumber;
        g: z.ZodNumber;
        b: z.ZodNumber;
    }, z.core.$strip>]>>;
}, z.core.$strip>;
/**
 * Union of all material schemas
 */
export declare const materialSchema: z.ZodDiscriminatedUnion<[z.ZodObject<{
    name: z.ZodOptional<z.ZodString>;
    side: z.ZodDefault<z.ZodEnum<{
        front: "front";
        back: "back";
        double: "double";
    }>>;
    transparent: z.ZodDefault<z.ZodBoolean>;
    opacity: z.ZodDefault<z.ZodNumber>;
    depthWrite: z.ZodDefault<z.ZodBoolean>;
    depthTest: z.ZodDefault<z.ZodBoolean>;
    type: z.ZodLiteral<"pbr">;
    color: z.ZodDefault<z.ZodUnion<readonly [z.ZodString, z.ZodArray<z.ZodNumber>, z.ZodObject<{
        r: z.ZodNumber;
        g: z.ZodNumber;
        b: z.ZodNumber;
    }, z.core.$strip>]>>;
    roughness: z.ZodDefault<z.ZodNumber>;
    metalness: z.ZodDefault<z.ZodNumber>;
    map: z.ZodOptional<z.ZodObject<{
        url: z.ZodOptional<z.ZodString>;
        texture: z.ZodOptional<z.ZodAny>;
        repeat: z.ZodDefault<z.ZodTuple<[z.ZodNumber, z.ZodNumber], null>>;
        offset: z.ZodDefault<z.ZodTuple<[z.ZodNumber, z.ZodNumber], null>>;
        wrapS: z.ZodDefault<z.ZodEnum<{
            repeat: "repeat";
            clampToEdge: "clampToEdge";
            mirroredRepeat: "mirroredRepeat";
        }>>;
        wrapT: z.ZodDefault<z.ZodEnum<{
            repeat: "repeat";
            clampToEdge: "clampToEdge";
            mirroredRepeat: "mirroredRepeat";
        }>>;
    }, z.core.$strip>>;
    normalMap: z.ZodOptional<z.ZodObject<{
        url: z.ZodOptional<z.ZodString>;
        texture: z.ZodOptional<z.ZodAny>;
        repeat: z.ZodDefault<z.ZodTuple<[z.ZodNumber, z.ZodNumber], null>>;
        offset: z.ZodDefault<z.ZodTuple<[z.ZodNumber, z.ZodNumber], null>>;
        wrapS: z.ZodDefault<z.ZodEnum<{
            repeat: "repeat";
            clampToEdge: "clampToEdge";
            mirroredRepeat: "mirroredRepeat";
        }>>;
        wrapT: z.ZodDefault<z.ZodEnum<{
            repeat: "repeat";
            clampToEdge: "clampToEdge";
            mirroredRepeat: "mirroredRepeat";
        }>>;
    }, z.core.$strip>>;
    roughnessMap: z.ZodOptional<z.ZodObject<{
        url: z.ZodOptional<z.ZodString>;
        texture: z.ZodOptional<z.ZodAny>;
        repeat: z.ZodDefault<z.ZodTuple<[z.ZodNumber, z.ZodNumber], null>>;
        offset: z.ZodDefault<z.ZodTuple<[z.ZodNumber, z.ZodNumber], null>>;
        wrapS: z.ZodDefault<z.ZodEnum<{
            repeat: "repeat";
            clampToEdge: "clampToEdge";
            mirroredRepeat: "mirroredRepeat";
        }>>;
        wrapT: z.ZodDefault<z.ZodEnum<{
            repeat: "repeat";
            clampToEdge: "clampToEdge";
            mirroredRepeat: "mirroredRepeat";
        }>>;
    }, z.core.$strip>>;
    metalnessMap: z.ZodOptional<z.ZodObject<{
        url: z.ZodOptional<z.ZodString>;
        texture: z.ZodOptional<z.ZodAny>;
        repeat: z.ZodDefault<z.ZodTuple<[z.ZodNumber, z.ZodNumber], null>>;
        offset: z.ZodDefault<z.ZodTuple<[z.ZodNumber, z.ZodNumber], null>>;
        wrapS: z.ZodDefault<z.ZodEnum<{
            repeat: "repeat";
            clampToEdge: "clampToEdge";
            mirroredRepeat: "mirroredRepeat";
        }>>;
        wrapT: z.ZodDefault<z.ZodEnum<{
            repeat: "repeat";
            clampToEdge: "clampToEdge";
            mirroredRepeat: "mirroredRepeat";
        }>>;
    }, z.core.$strip>>;
    aoMap: z.ZodOptional<z.ZodObject<{
        url: z.ZodOptional<z.ZodString>;
        texture: z.ZodOptional<z.ZodAny>;
        repeat: z.ZodDefault<z.ZodTuple<[z.ZodNumber, z.ZodNumber], null>>;
        offset: z.ZodDefault<z.ZodTuple<[z.ZodNumber, z.ZodNumber], null>>;
        wrapS: z.ZodDefault<z.ZodEnum<{
            repeat: "repeat";
            clampToEdge: "clampToEdge";
            mirroredRepeat: "mirroredRepeat";
        }>>;
        wrapT: z.ZodDefault<z.ZodEnum<{
            repeat: "repeat";
            clampToEdge: "clampToEdge";
            mirroredRepeat: "mirroredRepeat";
        }>>;
    }, z.core.$strip>>;
    clearcoat: z.ZodDefault<z.ZodNumber>;
    clearcoatRoughness: z.ZodDefault<z.ZodNumber>;
    clearcoatMap: z.ZodOptional<z.ZodObject<{
        url: z.ZodOptional<z.ZodString>;
        texture: z.ZodOptional<z.ZodAny>;
        repeat: z.ZodDefault<z.ZodTuple<[z.ZodNumber, z.ZodNumber], null>>;
        offset: z.ZodDefault<z.ZodTuple<[z.ZodNumber, z.ZodNumber], null>>;
        wrapS: z.ZodDefault<z.ZodEnum<{
            repeat: "repeat";
            clampToEdge: "clampToEdge";
            mirroredRepeat: "mirroredRepeat";
        }>>;
        wrapT: z.ZodDefault<z.ZodEnum<{
            repeat: "repeat";
            clampToEdge: "clampToEdge";
            mirroredRepeat: "mirroredRepeat";
        }>>;
    }, z.core.$strip>>;
    clearcoatNormalMap: z.ZodOptional<z.ZodObject<{
        url: z.ZodOptional<z.ZodString>;
        texture: z.ZodOptional<z.ZodAny>;
        repeat: z.ZodDefault<z.ZodTuple<[z.ZodNumber, z.ZodNumber], null>>;
        offset: z.ZodDefault<z.ZodTuple<[z.ZodNumber, z.ZodNumber], null>>;
        wrapS: z.ZodDefault<z.ZodEnum<{
            repeat: "repeat";
            clampToEdge: "clampToEdge";
            mirroredRepeat: "mirroredRepeat";
        }>>;
        wrapT: z.ZodDefault<z.ZodEnum<{
            repeat: "repeat";
            clampToEdge: "clampToEdge";
            mirroredRepeat: "mirroredRepeat";
        }>>;
    }, z.core.$strip>>;
    sheen: z.ZodDefault<z.ZodNumber>;
    sheenRoughness: z.ZodDefault<z.ZodNumber>;
    sheenColor: z.ZodOptional<z.ZodUnion<readonly [z.ZodString, z.ZodArray<z.ZodNumber>, z.ZodObject<{
        r: z.ZodNumber;
        g: z.ZodNumber;
        b: z.ZodNumber;
    }, z.core.$strip>]>>;
    transmission: z.ZodDefault<z.ZodNumber>;
    thickness: z.ZodDefault<z.ZodNumber>;
    ior: z.ZodDefault<z.ZodNumber>;
    iridescence: z.ZodDefault<z.ZodNumber>;
    iridescenceIOR: z.ZodDefault<z.ZodNumber>;
    iridescenceThicknessRange: z.ZodDefault<z.ZodTuple<[z.ZodNumber, z.ZodNumber], null>>;
    emissive: z.ZodDefault<z.ZodUnion<readonly [z.ZodString, z.ZodArray<z.ZodNumber>, z.ZodObject<{
        r: z.ZodNumber;
        g: z.ZodNumber;
        b: z.ZodNumber;
    }, z.core.$strip>]>>;
    emissiveIntensity: z.ZodDefault<z.ZodNumber>;
    emissiveMap: z.ZodOptional<z.ZodObject<{
        url: z.ZodOptional<z.ZodString>;
        texture: z.ZodOptional<z.ZodAny>;
        repeat: z.ZodDefault<z.ZodTuple<[z.ZodNumber, z.ZodNumber], null>>;
        offset: z.ZodDefault<z.ZodTuple<[z.ZodNumber, z.ZodNumber], null>>;
        wrapS: z.ZodDefault<z.ZodEnum<{
            repeat: "repeat";
            clampToEdge: "clampToEdge";
            mirroredRepeat: "mirroredRepeat";
        }>>;
        wrapT: z.ZodDefault<z.ZodEnum<{
            repeat: "repeat";
            clampToEdge: "clampToEdge";
            mirroredRepeat: "mirroredRepeat";
        }>>;
    }, z.core.$strip>>;
    envMapIntensity: z.ZodDefault<z.ZodNumber>;
    normalScale: z.ZodDefault<z.ZodTuple<[z.ZodNumber, z.ZodNumber], null>>;
}, z.core.$strip>, z.ZodObject<{
    name: z.ZodOptional<z.ZodString>;
    side: z.ZodDefault<z.ZodEnum<{
        front: "front";
        back: "back";
        double: "double";
    }>>;
    transparent: z.ZodDefault<z.ZodBoolean>;
    opacity: z.ZodDefault<z.ZodNumber>;
    depthWrite: z.ZodDefault<z.ZodBoolean>;
    depthTest: z.ZodDefault<z.ZodBoolean>;
    type: z.ZodLiteral<"wood">;
    preset: z.ZodOptional<z.ZodEnum<{
        walnut: "walnut";
        pine: "pine";
        cherry: "cherry";
        mahogany: "mahogany";
        oak: "oak";
        bamboo: "bamboo";
    }>>;
    grainDensity: z.ZodDefault<z.ZodNumber>;
    grainVariation: z.ZodDefault<z.ZodNumber>;
    ringScale: z.ZodDefault<z.ZodNumber>;
    colorVariation: z.ZodDefault<z.ZodNumber>;
    baseColor: z.ZodDefault<z.ZodUnion<readonly [z.ZodString, z.ZodArray<z.ZodNumber>, z.ZodObject<{
        r: z.ZodNumber;
        g: z.ZodNumber;
        b: z.ZodNumber;
    }, z.core.$strip>]>>;
    darkColor: z.ZodDefault<z.ZodUnion<readonly [z.ZodString, z.ZodArray<z.ZodNumber>, z.ZodObject<{
        r: z.ZodNumber;
        g: z.ZodNumber;
        b: z.ZodNumber;
    }, z.core.$strip>]>>;
    roughness: z.ZodDefault<z.ZodNumber>;
    metalness: z.ZodDefault<z.ZodNumber>;
    clearcoat: z.ZodDefault<z.ZodNumber>;
    clearcoatRoughness: z.ZodDefault<z.ZodNumber>;
}, z.core.$strip>, z.ZodObject<{
    name: z.ZodOptional<z.ZodString>;
    side: z.ZodDefault<z.ZodEnum<{
        front: "front";
        back: "back";
        double: "double";
    }>>;
    transparent: z.ZodDefault<z.ZodBoolean>;
    opacity: z.ZodDefault<z.ZodNumber>;
    depthWrite: z.ZodDefault<z.ZodBoolean>;
    depthTest: z.ZodDefault<z.ZodBoolean>;
    type: z.ZodLiteral<"glass">;
    color: z.ZodDefault<z.ZodUnion<readonly [z.ZodString, z.ZodArray<z.ZodNumber>, z.ZodObject<{
        r: z.ZodNumber;
        g: z.ZodNumber;
        b: z.ZodNumber;
    }, z.core.$strip>]>>;
    transmission: z.ZodDefault<z.ZodNumber>;
    thickness: z.ZodDefault<z.ZodNumber>;
    roughness: z.ZodDefault<z.ZodNumber>;
    ior: z.ZodDefault<z.ZodNumber>;
    attenuationColor: z.ZodOptional<z.ZodUnion<readonly [z.ZodString, z.ZodArray<z.ZodNumber>, z.ZodObject<{
        r: z.ZodNumber;
        g: z.ZodNumber;
        b: z.ZodNumber;
    }, z.core.$strip>]>>;
    attenuationDistance: z.ZodDefault<z.ZodNumber>;
}, z.core.$strip>, z.ZodObject<{
    name: z.ZodOptional<z.ZodString>;
    side: z.ZodDefault<z.ZodEnum<{
        front: "front";
        back: "back";
        double: "double";
    }>>;
    transparent: z.ZodDefault<z.ZodBoolean>;
    opacity: z.ZodDefault<z.ZodNumber>;
    depthWrite: z.ZodDefault<z.ZodBoolean>;
    depthTest: z.ZodDefault<z.ZodBoolean>;
    type: z.ZodLiteral<"metal">;
    preset: z.ZodOptional<z.ZodEnum<{
        aluminum: "aluminum";
        copper: "copper";
        gold: "gold";
        silver: "silver";
        iron: "iron";
        steel: "steel";
        bronze: "bronze";
    }>>;
    color: z.ZodDefault<z.ZodUnion<readonly [z.ZodString, z.ZodArray<z.ZodNumber>, z.ZodObject<{
        r: z.ZodNumber;
        g: z.ZodNumber;
        b: z.ZodNumber;
    }, z.core.$strip>]>>;
    roughness: z.ZodDefault<z.ZodNumber>;
    metalness: z.ZodDefault<z.ZodNumber>;
    anisotropy: z.ZodDefault<z.ZodNumber>;
    anisotropyRotation: z.ZodDefault<z.ZodNumber>;
}, z.core.$strip>, z.ZodObject<{
    name: z.ZodOptional<z.ZodString>;
    side: z.ZodDefault<z.ZodEnum<{
        front: "front";
        back: "back";
        double: "double";
    }>>;
    transparent: z.ZodDefault<z.ZodBoolean>;
    opacity: z.ZodDefault<z.ZodNumber>;
    depthWrite: z.ZodDefault<z.ZodBoolean>;
    depthTest: z.ZodDefault<z.ZodBoolean>;
    type: z.ZodLiteral<"fabric">;
    preset: z.ZodOptional<z.ZodEnum<{
        cotton: "cotton";
        silk: "silk";
        velvet: "velvet";
        denim: "denim";
        leather: "leather";
    }>>;
    color: z.ZodDefault<z.ZodUnion<readonly [z.ZodString, z.ZodArray<z.ZodNumber>, z.ZodObject<{
        r: z.ZodNumber;
        g: z.ZodNumber;
        b: z.ZodNumber;
    }, z.core.$strip>]>>;
    roughness: z.ZodDefault<z.ZodNumber>;
    sheen: z.ZodDefault<z.ZodNumber>;
    sheenRoughness: z.ZodDefault<z.ZodNumber>;
    sheenColor: z.ZodOptional<z.ZodUnion<readonly [z.ZodString, z.ZodArray<z.ZodNumber>, z.ZodObject<{
        r: z.ZodNumber;
        g: z.ZodNumber;
        b: z.ZodNumber;
    }, z.core.$strip>]>>;
}, z.core.$strip>], "type">;
/**
 * Type inference
 */
export type BaseMaterialConfig = z.infer<typeof baseMaterialSchema>;
export type PBRMaterialConfig = z.infer<typeof pbrMaterialSchema>;
export type WoodMaterialConfig = z.infer<typeof woodMaterialSchema>;
export type GlassMaterialConfig = z.infer<typeof glassMaterialSchema>;
export type MetalMaterialConfig = z.infer<typeof metalMaterialSchema>;
export type FabricMaterialConfig = z.infer<typeof fabricMaterialSchema>;
export type MaterialConfig = z.infer<typeof materialSchema>;
//# sourceMappingURL=schemas.d.ts.map