import React from 'react';
import { FilterBar } from './FilterBar';
import { SubscriptionItem } from './SubscriptionItem';
import { EmptyState } from './EmptyState';

export function SubscriptionList({
  subscriptions,
  filteredSubscriptions,
  currency,
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
  onOpenAddModal,
  onEdit,
  onDelete,
  onToggleStatus,
  onDuplicate,
  onQuickAddSample,
}) {
  const totalCount = subscriptions.length;
  const filteredCount = filteredSubscriptions.length;

  if (totalCount === 0) {
    return (
      <EmptyState
        onOpenAddModal={onOpenAddModal}
        onQuickAddSample={onQuickAddSample}
      />
    );
  }

  return (
    <section className="card listContainerCard" aria-label="Subscriptions Management">
      <div className="cardHeader listHeader">
        <div className="listHeaderTitle">
          <h2 className="cardTitle">Your Subscriptions</h2>
          <span className="badgeCount">{totalCount} total</span>
        </div>

        <button
          type="button"
          className="btn btnPrimarySm"
          onClick={onOpenAddModal}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path d="M12 5v14M5 12h14" />
          </svg>
          <span>Add</span>
        </button>
      </div>

      {/* Filter and Search Controls */}
      <FilterBar
        searchQuery={searchQuery}
        onSearchChange={onSearchChange}
        categoryFilter={categoryFilter}
        onCategoryChange={onCategoryChange}
        cycleFilter={cycleFilter}
        onCycleChange={onCycleChange}
        statusFilter={statusFilter}
        onStatusChange={onStatusChange}
        sortBy={sortBy}
        onSortChange={onSortChange}
        totalCount={totalCount}
        filteredCount={filteredCount}
      />

      {/* List or Filtered Empty State */}
      {filteredCount === 0 ? (
        <div className="noResultsCard">
          <div className="noResultsIcon" aria-hidden="true">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
              <line x1="8" y1="11" x2="14" y2="11" />
            </svg>
          </div>
          <h3 className="noResultsTitle">No matching subscriptions</h3>
          <p className="noResultsDesc">
            No subscriptions matched your current search and filter criteria.
          </p>
          <button
            type="button"
            className="btn btnSecondary"
            onClick={() => {
              onSearchChange('');
              onCategoryChange('all');
              onCycleChange('all');
              onStatusChange('all');
            }}
          >
            Clear all filters
          </button>
        </div>
      ) : (
        <ul className="subListGrid">
          {filteredSubscriptions.map((sub) => (
            <SubscriptionItem
              key={sub.id}
              subscription={sub}
              currency={currency}
              onEdit={onEdit}
              onDelete={onDelete}
              onToggleStatus={onToggleStatus}
              onDuplicate={onDuplicate}
            />
          ))}
        </ul>
      )}
    </section>
  );
}
