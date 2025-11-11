/**
 * Configuration management for fluid simulation
 * @module compute/fluids/Configuration
 */

import { FluidConfig, FluidPreset } from './types';

/**
 * Configuration manager with localStorage persistence
 */
export class Configuration {
  config: FluidConfig;
  userConfigs: Partial<FluidConfig>;
  listeners: Record<string, Array<(value: any) => void>>;
  storedConfig: string | null;
  autosave: boolean;

  constructor(defaults: Partial<FluidConfig> = {}) {
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
  addListener(key: keyof FluidConfig, fn: (value: any) => void): void {
    if (!this.listeners[key]) {
      this.listeners[key] = [];
    }
    this.listeners[key].push(fn);
  }

  /**
   * Update a configuration value
   */
  update(key: keyof FluidConfig, value: any): void {
    if (this.config[key] === value) return;
    
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
  updateNumber(key: keyof FluidConfig, value: number | string): void {
    const n = Number(value);
    if (isFinite(n)) {
      this.update(key, n);
    }
  }

  /**
   * Add theta (camera vertical angle)
   */
  addTheta(value: number): void {
    let theta = this.config.camPosTheta + value;
    theta = Math.max(0.01, Math.min(Math.PI * 0.99, theta));
    this.updateNumber('camPosTheta', theta);
  }

  /**
   * Add phi (camera horizontal angle)
   */
  addPhi(value: number): void {
    let phi = this.config.camPosPhi + value;
    while (phi > Math.PI) phi -= Math.PI * 2;
    while (phi < -Math.PI) phi += Math.PI * 2;
    this.updateNumber('camPosPhi', phi);
  }

  /**
   * Add radius (camera distance)
   */
  addRadius(value: number): void {
    let radius = this.config.camPosRadius + value;
    radius = Math.max(0.1, Math.min(6.0, radius));
    this.updateNumber('camPosRadius', radius);
  }

  /**
   * Register a user-configurable value
   */
  addUserConfig(key: keyof FluidConfig, defaultValue: any): void {
    this.userConfigs[key] = defaultValue;
    this.update(key, defaultValue);
  }

  /**
   * Register a user-configurable number
   */
  addUserConfigNumber(key: keyof FluidConfig, defaultValue: number): void {
    this.userConfigs[key] = defaultValue;
    this.updateNumber(key, defaultValue);
  }

  /**
   * Reset all user configs to defaults
   */
  resetConfig(): void {
    this.autosave = false;
    Object.entries(this.userConfigs).forEach(([key, value]) => {
      this.update(key as keyof FluidConfig, value);
    });
    this.autosave = true;
    this.saveConfig();
  }

  /**
   * Save configuration to localStorage
   */
  saveConfig(): void {
    if (typeof window === 'undefined') return;
    
    const config = Object.fromEntries(
      Object.entries(this.config).filter(([key]) => key in this.userConfigs)
    );
    
    window.localStorage.setItem('fluidConfig', JSON.stringify(config));
  }

  /**
   * Load configuration from localStorage
   */
  loadConfig(): void {
    if (!this.storedConfig) return;
    
    try {
      const parsedConfig = JSON.parse(this.storedConfig);
      const isValid = Object.keys(this.userConfigs).every(key => key in parsedConfig);
      
      if (isValid) {
        Object.entries(parsedConfig).forEach(([key, value]) => {
          this.update(key as keyof FluidConfig, value);
        });
      } else {
        console.warn('Loaded config is missing some required fields. Reverting to defaults.');
        this.saveConfig();
      }
    } catch (e) {
      console.error('Failed to parse the stored config. Reverting to defaults.', e);
      this.saveConfig();
    }
  }
}

/**
 * Preset manager for fluid configurations
 */
export class ConfigurationPresets {
  configuration: Configuration;
  presets: Record<string, FluidPreset>;
  onChange: (preset: FluidPreset) => void;
  noMatching: FluidPreset;

  constructor(
    configuration: Configuration,
    presetConfigs: FluidPreset[],
    onChange: (preset: FluidPreset) => void
  ) {
    this.configuration = configuration;
    this.presets = {};
    this.onChange = onChange;
    this.noMatching = presetConfigs[0];
    
    const affectedKeys = new Set<keyof FluidConfig>();
    
    presetConfigs.forEach(preset => {
      if (preset.props) {
        Object.keys(preset.props).forEach(k => 
          affectedKeys.add(k as keyof FluidConfig)
        );
        this.presets[preset.label] = preset;
      }
    });
    
    affectedKeys.forEach(key => 
      configuration.addListener(key, () => this.onUpdate())
    );
    
    this.onUpdate();
  }

  /**
   * Check if a preset is currently active
   */
  isPresetActive(preset: FluidPreset): boolean {
    if (!preset.props) return false;
    
    for (const [key, value] of Object.entries(preset.props)) {
      if (this.configuration.config[key as keyof FluidConfig] !== value) {
        return false;
      }
    }
    return true;
  }

  /**
   * Handle configuration updates
   */
  onUpdate = (): void => {
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
  apply = (label: string): void => {
    if (!this.presets.hasOwnProperty(label)) {
      this.onUpdate();
      return;
    }
    
    const props = this.presets[label].props;
    if (!props) return;
    
    for (const [key, value] of Object.entries(props)) {
      this.configuration.update(key as keyof FluidConfig, value);
    }
  };
}

