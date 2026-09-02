import React from 'react';
import { CATEGORIES } from '../data/categories';
import { BILLING_CYCLES } from '../data/billingCycles';

export function FilterBar({
  searchQuery,
  onSearchChange,
  categoryFilter,
  onCategoryChange,
  cycleFilter,
  onCycleChange,
  statusFilter,
  onStatusChange,
  sortBy,
  onSortChange,
  totalCount,
  filteredCount,
}) {
  const hasActiveFilters =
    searchQuery.trim() !== '' ||
    categoryFilter !== 'all' ||
    cycleFilter !== 'all' ||
    statusFilter !== 'all' ||
    sortBy !== 'cost-desc';

  const handleResetFilters = () => {
    onSearchChange('');
    onCategoryChange('all');
    onCycleChange('all');
    onStatusChange('all');
    onSortChange('cost-desc');
  };

  return (
    <div className="filterBarContainer" aria-label="Subscription Filters and Controls">
      {/* Search Input Row */}
      <div className="filterTopRow">
        <div className="searchBox">
          <span className="searchIcon" aria-hidden="true">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <circle cx="11" cy="11" r="8" />
              <path d="M21 21l-4.35-4.35" />
            </svg>
          </span>
          <input
            type="text"
            className="searchInput"
            placeholder="Search subscriptions by name, category, notes..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            aria-label="Search subscriptions"
          />
          {searchQuery && (
            <button
              type="button"
              className="searchClearBtn"
              onClick={() => onSearchChange('')}
              aria-label="Clear search"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          )}
        </div>

        {/* Sort Select */}
        <div className="filterSelectWrapper">
          <label htmlFor="sort-select" className="filterLabel">Sort:</label>
          <select
            id="sort-select"
            className="filterSelect"
            value={sortBy}
            onChange={(e) => onSortChange(e.target.value)}
          >
            <option value="cost-desc">Highest Monthly Cost</option>
            <option value="cost-asc">Lowest Monthly Cost</option>
            <option value="name-asc">Name (A–Z)</option>
            <option value="name-desc">Name (Z–A)</option>
            <option value="recent">Recently Added</option>
          </select>
        </div>
      </div>

      {/* Filter Dropdowns / Pills Row */}
      <div className="filterControlsRow">
        {/* Category Filter */}
        <div className="filterSelectWrapper">
          <label htmlFor="category-select" className="filterLabel">Category:</label>
          <select
            id="category-select"
            className="filterSelect"
            value={categoryFilter}
            onChange={(e) => onCategoryChange(e.target.value)}
          >
            <option value="all">All Categories</option>
            {CATEGORIES.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.label}
              </option>
            ))}
          </select>
        </div>

        {/* Billing Cycle Filter */}
        <div className="filterSelectWrapper">
          <label htmlFor="cycle-select" className="filterLabel">Cycle:</label>
          <select
            id="cycle-select"
            className="filterSelect"
            value={cycleFilter}
            onChange={(e) => onCycleChange(e.target.value)}
          >
            <option value="all">All Billing Cycles</option>
            {BILLING_CYCLES.map((cycle) => (
              <option key={cycle.id} value={cycle.id}>
                {cycle.label}
              </option>
            ))}
          </select>
        </div>

        {/* Status Filter */}
        <div className="filterSelectWrapper">
          <label htmlFor="status-select" className="filterLabel">Status:</label>
          <select
            id="status-select"
            className="filterSelect"
            value={statusFilter}
            onChange={(e) => onStatusChange(e.target.value)}
          >
            <option value="all">All Statuses</option>
            <option value="active">Active Only</option>
            <option value="review">Review (Potential Cuts)</option>
            <option value="paused">Paused Only</option>
          </select>
        </div>

        {/* Filter Summary & Reset */}
        {hasActiveFilters && (
          <button
            type="button"
            className="btnFilterReset"
            onClick={handleResetFilters}
            title="Reset all filters and sorting"
          >
            Reset filters
          </button>
        )}

        <div className="filterCount">
          Showing <strong>{filteredCount}</strong> of {totalCount}
        </div>
      </div>
    </div>
  );
}
