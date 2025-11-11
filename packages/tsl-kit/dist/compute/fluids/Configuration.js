/**
 * Configuration management for fluid simulation
 * @module compute/fluids/Configuration
 */
/**
 * Configuration manager with localStorage persistence
 */
export class Configuration {
    constructor(defaults = {}) {
        this.config = {
            // Camera defaults
            camPosRadius: 3.5,
            camPosTheta: Math.PI / 2 - 0.3,
            camPosPhi: Math.PI * 0.25,
            // Grid defaults
            gridSize: 128,
            gridScale: 1.0,
            // Physics defaults
            viscosity: 0.001,
            dissipation: 0.99,
            vorticityScale: 0.5,
            // Simulation defaults
            pressureIterations: 40,
            timeStep: 0.016,
            // Rendering defaults
            densityScale: 1.0,
            velocityScale: 1.0,
            // Override with provided defaults
            ...defaults,
        };
        this.userConfigs = {};
        this.listeners = {};
        this.storedConfig = typeof window !== 'undefined'
            ? window.localStorage.getItem('fluidConfig')
            : null;
        this.autosave = true;
    }
    /**
     * Add a listener for configuration changes
     */
    addListener(key, fn) {
        if (!this.listeners[key]) {
            this.listeners[key] = [];
        }
        this.listeners[key].push(fn);
    }
    /**
     * Update a configuration value
     */
    update(key, value) {
        if (this.config[key] === value)
            return;
        this.config[key] = value;
        // Notify listeners
        if (this.listeners[key]) {
            for (const fn of this.listeners[key]) {
                fn(value);
            }
        }
        // Autosave if this is a user config
        if (this.autosave && key in this.userConfigs) {
            this.saveConfig();
        }
    }
    /**
     * Update a number value with validation
     */
    updateNumber(key, value) {
        const n = Number(value);
        if (isFinite(n)) {
            this.update(key, n);
        }
    }
    /**
     * Add theta (camera vertical angle)
     */
    addTheta(value) {
        let theta = this.config.camPosTheta + value;
        theta = Math.max(0.01, Math.min(Math.PI * 0.99, theta));
        this.updateNumber('camPosTheta', theta);
    }
    /**
     * Add phi (camera horizontal angle)
     */
    addPhi(value) {
        let phi = this.config.camPosPhi + value;
        while (phi > Math.PI)
            phi -= Math.PI * 2;
        while (phi < -Math.PI)
            phi += Math.PI * 2;
        this.updateNumber('camPosPhi', phi);
    }
    /**
     * Add radius (camera distance)
     */
    addRadius(value) {
        let radius = this.config.camPosRadius + value;
        radius = Math.max(0.1, Math.min(6.0, radius));
        this.updateNumber('camPosRadius', radius);
    }
    /**
     * Register a user-configurable value
     */
    addUserConfig(key, defaultValue) {
        this.userConfigs[key] = defaultValue;
        this.update(key, defaultValue);
    }
    /**
     * Register a user-configurable number
     */
    addUserConfigNumber(key, defaultValue) {
        this.userConfigs[key] = defaultValue;
        this.updateNumber(key, defaultValue);
    }
    /**
     * Reset all user configs to defaults
     */
    resetConfig() {
        this.autosave = false;
        Object.entries(this.userConfigs).forEach(([key, value]) => {
            this.update(key, value);
        });
        this.autosave = true;
        this.saveConfig();
    }
    /**
     * Save configuration to localStorage
     */
    saveConfig() {
        if (typeof window === 'undefined')
            return;
        const config = Object.fromEntries(Object.entries(this.config).filter(([key]) => key in this.userConfigs));
        window.localStorage.setItem('fluidConfig', JSON.stringify(config));
    }
    /**
     * Load configuration from localStorage
     */
    loadConfig() {
        if (!this.storedConfig)
            return;
        try {
            const parsedConfig = JSON.parse(this.storedConfig);
            const isValid = Object.keys(this.userConfigs).every(key => key in parsedConfig);
            if (isValid) {
                Object.entries(parsedConfig).forEach(([key, value]) => {
                    this.update(key, value);
                });
            }
            else {
                console.warn('Loaded config is missing some required fields. Reverting to defaults.');
                this.saveConfig();
            }
        }
        catch (e) {
            console.error('Failed to parse the stored config. Reverting to defaults.', e);
            this.saveConfig();
        }
    }
}
/**
 * Preset manager for fluid configurations
 */
export class ConfigurationPresets {
    constructor(configuration, presetConfigs, onChange) {
        /**
         * Handle configuration updates
         */
        this.onUpdate = () => {
            for (const preset of Object.values(this.presets)) {
                if (this.isPresetActive(preset)) {
                    this.onChange(preset);
                    return;
                }
            }
            this.onChange(this.noMatching);
        };
        /**
         * Apply a preset by label
         */
        this.apply = (label) => {
            if (!this.presets.hasOwnProperty(label)) {
                this.onUpdate();
                return;
            }
            const props = this.presets[label].props;
            if (!props)
                return;
            for (const [key, value] of Object.entries(props)) {
                this.configuration.update(key, value);
            }
        };
        this.configuration = configuration;
        this.presets = {};
        this.onChange = onChange;
        this.noMatching = presetConfigs[0];
        const affectedKeys = new Set();
        presetConfigs.forEach(preset => {
            if (preset.props) {
                Object.keys(preset.props).forEach(k => affectedKeys.add(k));
                this.presets[preset.label] = preset;
            }
        });
        affectedKeys.forEach(key => configuration.addListener(key, () => this.onUpdate()));
        this.onUpdate();
    }
    /**
     * Check if a preset is currently active
     */
    isPresetActive(preset) {
        if (!preset.props)
            return false;
        for (const [key, value] of Object.entries(preset.props)) {
            if (this.configuration.config[key] !== value) {
                return false;
            }
        }
        return true;
    }
}
//# sourceMappingURL=Configuration.js.map