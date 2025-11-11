/**
 * Configuration management for fluid simulation
 * @module compute/fluids/Configuration
 */
import { FluidConfig, FluidPreset } from './types';
/**
 * Configuration manager with localStorage persistence
 */
export declare class Configuration {
    config: FluidConfig;
    userConfigs: Partial<FluidConfig>;
    listeners: Record<string, Array<(value: any) => void>>;
    storedConfig: string | null;
    autosave: boolean;
    constructor(defaults?: Partial<FluidConfig>);
    /**
     * Add a listener for configuration changes
     */
    addListener(key: keyof FluidConfig, fn: (value: any) => void): void;
    /**
     * Update a configuration value
     */
    update(key: keyof FluidConfig, value: any): void;
    /**
     * Update a number value with validation
     */
    updateNumber(key: keyof FluidConfig, value: number | string): void;
    /**
     * Add theta (camera vertical angle)
     */
    addTheta(value: number): void;
    /**
     * Add phi (camera horizontal angle)
     */
    addPhi(value: number): void;
    /**
     * Add radius (camera distance)
     */
    addRadius(value: number): void;
    /**
     * Register a user-configurable value
     */
    addUserConfig(key: keyof FluidConfig, defaultValue: any): void;
    /**
     * Register a user-configurable number
     */
    addUserConfigNumber(key: keyof FluidConfig, defaultValue: number): void;
    /**
     * Reset all user configs to defaults
     */
    resetConfig(): void;
    /**
     * Save configuration to localStorage
     */
    saveConfig(): void;
    /**
     * Load configuration from localStorage
     */
    loadConfig(): void;
}
/**
 * Preset manager for fluid configurations
 */
export declare class ConfigurationPresets {
    configuration: Configuration;
    presets: Record<string, FluidPreset>;
    onChange: (preset: FluidPreset) => void;
    noMatching: FluidPreset;
    constructor(configuration: Configuration, presetConfigs: FluidPreset[], onChange: (preset: FluidPreset) => void);
    /**
     * Check if a preset is currently active
     */
    isPresetActive(preset: FluidPreset): boolean;
    /**
     * Handle configuration updates
     */
    onUpdate: () => void;
    /**
     * Apply a preset by label
     */
    apply: (label: string) => void;
}
//# sourceMappingURL=Configuration.d.ts.map