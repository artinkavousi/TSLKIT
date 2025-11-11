/**
 * Force Field
 *
 * Base class for particle force fields.
 *
 * @module compute/forces/ForceField
 */
import * as THREE from 'three/webgpu';
/**
 * Base force field class
 */
export class ForceField {
    constructor(config) {
        this.type = config.type;
        this.strength = config.strength;
        this.enabled = config.enabled !== undefined ? config.enabled : true;
    }
    /**
     * Update force field state
     */
    update(deltaTime) {
        // Override in subclasses if needed
    }
    /**
     * Set strength
     */
    setStrength(strength) {
        this.strength = strength;
    }
    /**
     * Enable/disable force field
     */
    setEnabled(enabled) {
        this.enabled = enabled;
    }
}
/**
 * Gravity force field
 */
export class GravityForce extends ForceField {
    constructor(direction, strength = 9.8) {
        super({ type: 'gravity', strength });
        this.direction = direction.clone().normalize();
    }
    calculateForce(position, velocity, time) {
        if (!this.enabled)
            return new THREE.Vector3();
        return this.direction.clone().multiplyScalar(this.strength);
    }
    setDirection(direction) {
        this.direction.copy(direction).normalize();
    }
}
/**
 * Attractor force field
 */
export class AttractorForce extends ForceField {
    constructor(position, strength = 1.0, radius = 100, falloff = 2) {
        super({ type: 'attractor', strength, radius });
        this.position = position.clone();
        this.radius = radius;
        this.falloff = falloff;
    }
    calculateForce(position, velocity, time) {
        if (!this.enabled)
            return new THREE.Vector3();
        const direction = this.position.clone().sub(position);
        const distance = direction.length();
        if (distance > this.radius)
            return new THREE.Vector3();
        direction.normalize();
        // Apply inverse square law with falloff
        const forceMagnitude = this.strength * Math.pow(1.0 - distance / this.radius, this.falloff);
        return direction.multiplyScalar(forceMagnitude);
    }
    setPosition(position) {
        this.position.copy(position);
    }
}
/**
 * Repulsor force field (negative attractor)
 */
export class RepulsorForce extends AttractorForce {
    constructor(position, strength = 1.0, radius = 100, falloff = 2) {
        super(position, -Math.abs(strength), radius, falloff);
        this.type = 'repulsor';
    }
}
/**
 * Vortex force field
 */
export class VortexForce extends ForceField {
    constructor(position, axis, strength = 1.0, radius = 100) {
        super({ type: 'vortex', strength, radius });
        this.position = position.clone();
        this.axis = axis.clone().normalize();
        this.radius = radius;
    }
    calculateForce(position, velocity, time) {
        if (!this.enabled)
            return new THREE.Vector3();
        const toPoint = position.clone().sub(this.position);
        const distance = toPoint.length();
        if (distance > this.radius)
            return new THREE.Vector3();
        // Project onto vortex axis
        const axisDistance = toPoint.dot(this.axis);
        const radialVector = toPoint.clone().sub(this.axis.clone().multiplyScalar(axisDistance));
        const radialDistance = radialVector.length();
        if (radialDistance < 0.001)
            return new THREE.Vector3();
        // Tangential force (perpendicular to radial)
        const tangent = new THREE.Vector3().crossVectors(this.axis, radialVector).normalize();
        // Inward force (toward axis)
        const radialForce = radialVector.clone().normalize().multiplyScalar(-this.strength * 0.5);
        // Combined vortex force
        const falloff = 1.0 - distance / this.radius;
        const force = tangent.multiplyScalar(this.strength * falloff).add(radialForce);
        return force;
    }
    setPosition(position) {
        this.position.copy(position);
    }
    setAxis(axis) {
        this.axis.copy(axis).normalize();
    }
}
/**
 * Curl noise force field
 */
export class CurlNoiseForce extends ForceField {
    constructor(strength = 1.0, scale = 0.01, timeScale = 0.1) {
        super({ type: 'curl', strength });
        this.time = 0;
        this.scale = scale;
        this.timeScale = timeScale;
    }
    calculateForce(position, velocity, time) {
        if (!this.enabled)
            return new THREE.Vector3();
        // Simplified curl noise approximation using multiple octaves of sine/cosine
        const p = position.clone().multiplyScalar(this.scale);
        const t = time * this.timeScale;
        const x = Math.sin(p.y + t) * Math.cos(p.z + t);
        const y = Math.sin(p.z + t) * Math.cos(p.x + t);
        const z = Math.sin(p.x + t) * Math.cos(p.y + t);
        return new THREE.Vector3(x, y, z).multiplyScalar(this.strength);
    }
    update(deltaTime) {
        this.time += deltaTime * this.timeScale;
    }
    setScale(scale) {
        this.scale = scale;
    }
    setTimeScale(timeScale) {
        this.timeScale = timeScale;
    }
}
/**
 * Wind force field
 */
export class WindForce extends ForceField {
    constructor(direction, strength = 1.0, turbulence = 0.5) {
        super({ type: 'wind', strength });
        this.time = 0;
        this.direction = direction.clone().normalize();
        this.turbulence = turbulence;
    }
    calculateForce(position, velocity, time) {
        if (!this.enabled)
            return new THREE.Vector3();
        // Base wind force
        const force = this.direction.clone().multiplyScalar(this.strength);
        // Add turbulence
        if (this.turbulence > 0) {
            const turb = new THREE.Vector3(Math.sin(position.x * 0.1 + time) * this.turbulence, Math.sin(position.y * 0.1 + time * 1.3) * this.turbulence, Math.sin(position.z * 0.1 + time * 0.7) * this.turbulence);
            force.add(turb);
        }
        return force;
    }
    update(deltaTime) {
        this.time += deltaTime;
    }
    setDirection(direction) {
        this.direction.copy(direction).normalize();
    }
    setTurbulence(turbulence) {
        this.turbulence = turbulence;
    }
}
//# sourceMappingURL=ForceField.js.map