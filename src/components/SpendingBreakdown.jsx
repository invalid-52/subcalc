import React from 'react';
import { formatCurrency } from '../utils/currency';

export function SpendingBreakdown({
  categoryBreakdown,
  currency,
  selectedCategory,
  onSelectCategory,
}) {
  const { categories, hasCategories } = categoryBreakdown;

  if (!hasCategories) {
    return null;
  }

  return (
    <section className="card breakdownCard" aria-label="Spending Breakdown by Category">
      <div className="cardHeader">
        <div>
          <h2 className="cardTitle">Spending Breakdown</h2>
          <p className="cardSubtitle">Distribution by category</p>
        </div>
        {selectedCategory !== 'all' && (
          <button
            type="button"
            className="btnText"
            onClick={() => onSelectCategory('all')}
          >
            Clear filter
          </button>
        )}
      </div>

      {/* Stacked Percentage Bar */}
      <div className="stackedBar" role="progressbar" aria-label="Category Distribution Bar">
        {categories.map((cat) => (
          <div
            key={cat.id}
            className={`stackedSegment ${selectedCategory === cat.id ? 'active' : ''}`}
            style={{
              width: `${Math.max(cat.percentage, 2)}%`,
              backgroundColor: cat.color,
            }}
            title={`${cat.label}: ${cat.percentage.toFixed(1)}% (${formatCurrency(cat.monthlyTotal, currency)}/mo)`}
            onClick={() => onSelectCategory(selectedCategory === cat.id ? 'all' : cat.id)}
          />
        ))}
      </div>

      {/* Category Pills / List */}
      <div className="breakdownGrid">
        {categories.map((cat) => {
          const isSelected = selectedCategory === cat.id;
          return (
            <button
              key={cat.id}
              type="button"
              className={`breakdownItem ${isSelected ? 'selected' : ''}`}
              onClick={() => onSelectCategory(isSelected ? 'all' : cat.id)}
              style={{ '--cat-color': cat.color }}
            >
              <div className="breakdownItemHeader">
                <span className="breakdownDot" style={{ backgroundColor: cat.color }} />
                <span className="breakdownLabel">{cat.label}</span>
                <span className="breakdownBadge">{cat.count}</span>
              </div>

              <div className="breakdownValues">
                <span className="breakdownMonthly">{formatCurrency(cat.monthlyTotal, currency)}/mo</span>
                <span className="breakdownPercentage">{cat.percentage.toFixed(0)}%</span>
              </div>

              <div className="breakdownMiniBarWrapper">
                <div
                  className="breakdownMiniBar"
                  style={{
                    width: `${cat.percentage}%`,
                    backgroundColor: cat.color,
                  }}
                />
              </div>
            </button>
          );
        })}
      </div>
    </section>
  );
}
