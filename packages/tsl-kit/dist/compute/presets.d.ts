/**
 * Compute System Presets
 *
 * Ready-to-use force field and particle configurations.
 *
 * @module compute/presets
 */
import { ForceFieldSystem } from './forces';
/**
 * Earth-like gravity preset
 */
export declare function earthGravity(): ForceFieldSystem;
/**
 * Zero gravity with subtle drift
 */
export declare function zeroGravity(): ForceFieldSystem;
/**
 * Tornado/vortex effect
 */
export declare function tornado(): ForceFieldSystem;
/**
 * Orbital system with central attractor
 */
export declare function orbitalSystem(): ForceFieldSystem;
/**
 * Repulsion field (explosion-like)
 */
export declare function explosion(): ForceFieldSystem;
/**
 * Organic flowing motion
 */
export declare function organicFlow(): ForceFieldSystem;
/**
 * Turbulent atmosphere
 */
export declare function turbulentWind(): ForceFieldSystem;
/**
 * Multiple attractors (planet system)
 */
export declare function multiAttractor(): ForceFieldSystem;
/**
 * Gentle floating upward
 */
export declare function floatingUp(): ForceFieldSystem;
/**
 * Chaotic turbulence
 */
export declare function chaosField(): ForceFieldSystem;
/**
 * Magnetic-like attraction and repulsion
 */
export declare function magneticField(): ForceFieldSystem;
/**
 * Underwater current simulation
 */
export declare function underwaterCurrent(): ForceFieldSystem;
/**
 * All compute presets
 */
export declare const computePresets: {
    earthGravity: typeof earthGravity;
    zeroGravity: typeof zeroGravity;
    tornado: typeof tornado;
    orbital: typeof orbitalSystem;
    explosion: typeof explosion;
    organicFlow: typeof organicFlow;
    turbulentWind: typeof turbulentWind;
    multiAttractor: typeof multiAttractor;
    floatingUp: typeof floatingUp;
    chaos: typeof chaosField;
    magnetic: typeof magneticField;
    underwater: typeof underwaterCurrent;
};
//# sourceMappingURL=presets.d.ts.map