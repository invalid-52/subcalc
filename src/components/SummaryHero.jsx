import React from 'react';
import { formatCurrency } from '../utils/currency';

export function SummaryHero({ totals, savings, currency, onOpenAddModal }) {
  const { monthlyTotal, yearlyTotal, activeCount, pausedCount } = totals;

  return (
    <section className="summaryHeroCard" aria-label="Monthly and Annual Spending Summary">
      <div className="summaryHeroMain">
        <div className="summaryHeroHeader">
          <span className="summaryHeroTag">Total Recurring Spending</span>
          {savings.hasSavingsToReview && (
            <span className="summarySavingsPill" title={`${savings.reviewCount} service(s) marked for review`}>
              <span className="savingsPillDot"></span>
              {formatCurrency(savings.monthlySavings, currency)}/mo potential savings
            </span>
          )}
        </div>

        <div className="summaryHeroAmountRow">
          <div className="summaryHeroAmount">
            <span className="summaryHeroCurrencySymbol">
              {formatCurrency(monthlyTotal, currency).replace(/[0-9.,\s]/g, '')}
            </span>
            <span className="summaryHeroNumber">
              {formatCurrency(monthlyTotal, currency).replace(/[^0-9.,]/g, '')}
            </span>
            <span className="summaryHeroPeriod">/ month</span>
          </div>

          <div className="summaryHeroSecondary">
            <div className="summaryHeroYearly">
              <span className="summaryHeroYearlyLabel">Projected yearly:</span>
              <span className="summaryHeroYearlyValue">{formatCurrency(yearlyTotal, currency)}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="summaryHeroMetaBar">
        <div className="summaryMetaItem">
          <span className="metaDot active"></span>
          <span className="metaText">
            <strong>{activeCount}</strong> active {activeCount === 1 ? 'subscription' : 'subscriptions'}
          </span>
        </div>

        {pausedCount > 0 && (
          <div className="summaryMetaItem">
            <span className="metaDot paused"></span>
            <span className="metaText">
              <strong>{pausedCount}</strong> paused
            </span>
          </div>
        )}

        <div className="summaryHeroQuickActions">
          <button
            type="button"
            className="btnQuickAdd"
            onClick={onOpenAddModal}
            aria-label="Quick add new subscription"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M12 5v14M5 12h14" />
            </svg>
            <span>Quick Add</span>
          </button>
        </div>
      </div>
    </section>
  );
}
