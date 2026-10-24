import React from "react";

export default function FilterBar({
  categories,
  selectedCategory,
  onSelectCategory,
  sortOption,
  onSortChange,
  priceRange,
  onPriceChange,
  inStockOnly,
  onToggleInStock,
  viewMode,
  onToggleViewMode,
  activeFilterCount,
  onResetFilters,
  totalResults,
}) {
  return (
    <div className="filter-bar-container">
      {/* Category Pills Bar */}
      <div className="category-scroll-wrapper">
        <div className="category-tabs">
          {categories.map((cat) => (
            <button
              key={cat.name}
              className={`cat-tab-btn ${selectedCategory === cat.name ? 'active' : ''}`}
              onClick={() => onSelectCategory(cat.name)}
            >
              <span className="cat-tab-emoji">{cat.emoji}</span>
              <span className="cat-tab-title">{cat.name}</span>
              <span className="cat-tab-count">{cat.count}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Control Strip */}
      <div className="control-strip">
        <div className="control-left">
          <span className="results-badge">
            <strong>{totalResults}</strong> {totalResults === 1 ? 'Product' : 'Products'} found
          </span>

          {activeFilterCount > 0 && (
            <button className="reset-filter-btn" onClick={onResetFilters}>
              <span>Reset Filters</span>
              <span className="reset-count">({activeFilterCount})</span>
              <span className="reset-icon">✕</span>
            </button>
          )}
        </div>

        <div className="control-right">
          {/* Price Range Slider */}
          <div className="price-filter-control">
            <label htmlFor="price-slider" className="control-label">
              Max Price: <strong>₹{priceRange.toLocaleString("en-IN")}</strong>
            </label>
            <input
              id="price-slider"
              type="range"
              min="500"
              max="5000"
              step="100"
              value={priceRange}
              onChange={(e) => onPriceChange(Number(e.target.value))}
              className="price-slider"
            />
          </div>

          {/* In-Stock Toggle */}
          <label className="toggle-control">
            <input
              type="checkbox"
              checked={inStockOnly}
              onChange={(e) => onToggleInStock(e.target.checked)}
            />
            <span className="toggle-switch"></span>
            <span className="toggle-text">In Stock Only</span>
          </label>

          {/* Sort By Dropdown */}
          <div className="sort-control">
            <span className="sort-icon">⇅</span>
            <select
              value={sortOption}
              onChange={(e) => onSortChange(e.target.value)}
              className="sort-select"
              aria-label="Sort products"
            >
              <option value="featured">Featured Picks</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="rating">Top Rated (★)</option>
              <option value="newest">Newest Arrivals</option>
            </select>
          </div>

          {/* Grid Layout Toggle */}
          <div className="view-mode-toggle" title="Toggle Grid Layout">
            <button
              className={`view-btn ${viewMode === 'comfortable' ? 'active' : ''}`}
              onClick={() => onToggleViewMode('comfortable')}
              aria-label="Comfortable Grid View"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                <rect x="3" y="3" width="8" height="8" rx="2"></rect>
                <rect x="13" y="3" width="8" height="8" rx="2"></rect>
                <rect x="3" y="13" width="8" height="8" rx="2"></rect>
                <rect x="13" y="13" width="8" height="8" rx="2"></rect>
              </svg>
            </button>
            <button
              className={`view-btn ${viewMode === 'compact' ? 'active' : ''}`}
              onClick={() => onToggleViewMode('compact')}
              aria-label="Compact Grid View"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                <rect x="2" y="2" width="5.5" height="5.5" rx="1"></rect>
                <rect x="9.25" y="2" width="5.5" height="5.5" rx="1"></rect>
                <rect x="16.5" y="2" width="5.5" height="5.5" rx="1"></rect>
                <rect x="2" y="9.25" width="5.5" height="5.5" rx="1"></rect>
                <rect x="9.25" y="9.25" width="5.5" height="5.5" rx="1"></rect>
                <rect x="16.5" y="9.25" width="5.5" height="5.5" rx="1"></rect>
                <rect x="2" y="16.5" width="5.5" height="5.5" rx="1"></rect>
                <rect x="9.25" y="16.5" width="5.5" height="5.5" rx="1"></rect>
                <rect x="16.5" y="16.5" width="5.5" height="5.5" rx="1"></rect>
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
