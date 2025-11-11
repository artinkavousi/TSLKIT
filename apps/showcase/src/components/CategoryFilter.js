/**
 * Category Filter Component
 * 
 * Filter modules by category with visual indicators
 */

export class CategoryFilter {
  constructor(container, moduleRegistry, onFilterChange) {
    this.container = container;
    this.moduleRegistry = moduleRegistry;
    this.onFilterChange = onFilterChange;
    this.activeCategory = 'all';
    
    this.render();
  }
  
  render() {
    this.container.innerHTML = '';
    
    // Create filter bar
    const filterBar = document.createElement('div');
    filterBar.className = 'category-filter-bar';
    filterBar.style.cssText = `
      display: flex;
      gap: 8px;
      padding: 16px;
      background: rgba(0, 0, 0, 0.3);
      border-radius: 8px;
      margin-bottom: 16px;
      flex-wrap: wrap;
      overflow-x: auto;
    `;
    
    // Add "All" button
    const allButton = this.createFilterButton('all', '🌟', 'All Modules', true);
    filterBar.appendChild(allButton);
    
    // Add category buttons
    for (const [categoryId, categoryData] of Object.entries(this.moduleRegistry)) {
      const button = this.createFilterButton(
        categoryId,
        categoryData.icon,
        categoryData.name,
        false
      );
      filterBar.appendChild(button);
    }
    
    this.container.appendChild(filterBar);
  }
  
  createFilterButton(categoryId, icon, name, isActive) {
    const button = document.createElement('button');
    button.className = `category-filter-btn ${isActive ? 'active' : ''}`;
    button.dataset.category = categoryId;
    button.innerHTML = `
      <span class="icon">${icon}</span>
      <span class="name">${name}</span>
    `;
    
    button.style.cssText = `
      display: flex;
      align-items: center;
      gap: 6px;
      padding: 8px 16px;
      background: ${isActive ? 'rgba(0, 150, 255, 0.3)' : 'rgba(255, 255, 255, 0.1)'};
      border: 1px solid ${isActive ? 'rgba(0, 150, 255, 0.6)' : 'rgba(255, 255, 255, 0.2)'};
      border-radius: 6px;
      color: white;
      font-family: monospace;
      font-size: 12px;
      cursor: pointer;
      transition: all 0.2s;
      white-space: nowrap;
    `;
    
    button.addEventListener('mouseenter', () => {
      if (!button.classList.contains('active')) {
        button.style.background = 'rgba(255, 255, 255, 0.2)';
        button.style.borderColor = 'rgba(255, 255, 255, 0.4)';
      }
    });
    
    button.addEventListener('mouseleave', () => {
      if (!button.classList.contains('active')) {
        button.style.background = 'rgba(255, 255, 255, 0.1)';
        button.style.borderColor = 'rgba(255, 255, 255, 0.2)';
      }
    });
    
    button.addEventListener('click', () => {
      this.setActiveCategory(categoryId);
    });
    
    return button;
  }
  
  setActiveCategory(categoryId) {
    this.activeCategory = categoryId;
    
    // Update button states
    const buttons = this.container.querySelectorAll('.category-filter-btn');
    buttons.forEach(btn => {
      const isActive = btn.dataset.category === categoryId;
      btn.classList.toggle('active', isActive);
      btn.style.background = isActive ? 'rgba(0, 150, 255, 0.3)' : 'rgba(255, 255, 255, 0.1)';
      btn.style.borderColor = isActive ? 'rgba(0, 150, 255, 0.6)' : 'rgba(255, 255, 255, 0.2)';
    });
    
    // Trigger callback
    if (this.onFilterChange) {
      this.onFilterChange(categoryId);
    }
  }
  
  getActiveCategory() {
    return this.activeCategory;
  }
}

