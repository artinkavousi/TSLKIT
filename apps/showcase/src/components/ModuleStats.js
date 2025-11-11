/**
 * Module Statistics Component
 * 
 * Display stats about available modules
 */

export class ModuleStats {
  constructor(container, moduleRegistry) {
    this.container = container;
    this.moduleRegistry = moduleRegistry;
    
    this.render();
  }
  
  render() {
    this.container.innerHTML = '';
    
    // Calculate stats
    const totalModules = Object.values(this.moduleRegistry).reduce(
      (sum, cat) => sum + cat.modules.length,
      0
    );
    
    const categoryCount = Object.keys(this.moduleRegistry).length;
    
    // Create stats display
    const statsContainer = document.createElement('div');
    statsContainer.className = 'module-stats';
    statsContainer.style.cssText = `
      display: flex;
      gap: 16px;
      padding: 12px 16px;
      background: rgba(0, 0, 0, 0.2);
      border-radius: 6px;
      margin-bottom: 16px;
      font-family: monospace;
      font-size: 11px;
      color: rgba(255, 255, 255, 0.7);
    `;
    
    statsContainer.innerHTML = `
      <div class="stat">
        <span class="label">📦 Total Modules:</span>
        <span class="value" style="color: #4CAF50; font-weight: bold;">${totalModules}</span>
      </div>
      <div class="stat">
        <span class="label">🗂️ Categories:</span>
        <span class="value" style="color: #2196F3; font-weight: bold;">${categoryCount}</span>
      </div>
      <div class="stat">
        <span class="label">⚡ Engine:</span>
        <span class="value" style="color: #FF9800; font-weight: bold;">WebGPU</span>
      </div>
    `;
    
    this.container.appendChild(statsContainer);
  }
}

