import React from 'react';
import { formatCurrency } from '../utils/currency';

export function SavingsAnalysis({ savings, currency, statusFilter, onSetStatusFilter }) {
  const { reviewCount, monthlySavings, yearlySavings, percentageOfTotal, hasSavingsToReview } = savings;

  return (
    <section className="card savingsCard" aria-label="Savings Analysis and Optimization">
      <div className="cardHeader">
        <div>
          <h2 className="cardTitle">Savings Optimization</h2>
          <p className="cardSubtitle">Identify non-essential subscriptions you can trim</p>
        </div>
        {hasSavingsToReview && (
          <button
            type="button"
            className={`btnFilterPill ${statusFilter === 'review' ? 'active' : ''}`}
            onClick={() => onSetStatusFilter(statusFilter === 'review' ? 'all' : 'review')}
          >
            {statusFilter === 'review' ? 'Show all subscriptions' : `View ${reviewCount} to review`}
          </button>
        )}
      </div>

      <div className="savingsContent">
        {hasSavingsToReview ? (
          <div className="savingsActiveBlock">
            <div className="savingsMetrics">
              <div className="savingsMetricItem">
                <span className="savingsLabel">Potential Monthly Savings</span>
                <span className="savingsNumber highlight">
                  {formatCurrency(monthlySavings, currency)}
                </span>
                <span className="savingsSub">{percentageOfTotal.toFixed(0)}% of your monthly spend</span>
              </div>

              <div className="savingsMetricItem">
                <span className="savingsLabel">Potential Yearly Savings</span>
                <span className="savingsNumber">
                  {formatCurrency(yearlySavings, currency)}
                </span>
                <span className="savingsSub">Across {reviewCount} flagged service{reviewCount > 1 ? 's' : ''}</span>
              </div>
            </div>
            <p className="savingsNote">
              💡 Tip: Click the <strong>Review</strong> badge on any subscription in your list to simulate cutting it from your budget.
            </p>
          </div>
        ) : (
          <div className="savingsEmptyBlock">
            <div className="savingsEmptyIcon" aria-hidden="true">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 2v20M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6" />
              </svg>
            </div>
            <div className="savingsEmptyText">
              <strong>All subscriptions currently marked as "Keep"</strong>
              <p>
                Want to see how much you could save? Mark any subscription as <em>"Review"</em> in the list below to plan potential budget cuts.
              </p>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
