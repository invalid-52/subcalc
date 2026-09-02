import React from 'react';
import { formatCurrency } from '../utils/currency';
import { normalizeMonthlyCost, normalizeAnnualCost } from '../utils/calculations';
import { getServicePreset } from '../data/services';
import { getCategory } from '../data/categories';
import { getBillingCycle } from '../data/billingCycles';
import { formatDate } from '../utils/dates';

export function SubscriptionItem({
  subscription,
  currency,
  onEdit,
  onDelete,
  onToggleStatus,
  onDuplicate,
}) {
  const { id, name, price, billingCycle, category: catId, status, notes, nextBillingDate, color, serviceId } = subscription;

  const preset = getServicePreset(serviceId);
  const categoryMeta = getCategory(catId);
  const cycleMeta = getBillingCycle(billingCycle);

  const monthlyCost = normalizeMonthlyCost(subscription);
  const annualCost = normalizeAnnualCost(subscription);

  const isReview = status === 'review';
  const isPaused = status === 'paused';

  return (
    <li className={`subItemCard ${isReview ? 'isReview' : ''} ${isPaused ? 'isPaused' : ''}`}>
      {/* Brand Icon */}
      <div
        className="subItemIcon"
        style={{
          backgroundColor: `${color || '#3B82F6'}18`,
          color: color || '#3B82F6',
          borderColor: `${color || '#3B82F6'}33`,
        }}
      >
        {preset ? preset.logoSvg : (name || 'S').charAt(0).toUpperCase()}
      </div>

      {/* Main Info */}
      <div className="subItemMain">
        <div className="subItemTitleRow">
          <h3 className="subItemName">{name}</h3>
          
          <div className="subItemPills">
            <span
              className="categoryPill"
              style={{
                backgroundColor: `${categoryMeta.color}15`,
                color: categoryMeta.color,
                borderColor: `${categoryMeta.color}30`,
              }}
            >
              {categoryMeta.label}
            </span>

            <span className="cyclePill">
              {cycleMeta.label}
            </span>

            {isReview && (
              <span className="statusPill review">
                Marked for Review
              </span>
            )}

            {isPaused && (
              <span className="statusPill paused">
                Paused
              </span>
            )}
          </div>
        </div>

        {/* Secondary Info: Next date or notes */}
        <div className="subItemMetaRow">
          {nextBillingDate && (
            <span className="subItemNextDate" title="Next scheduled billing date">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="3" y="4" width="18" height="18" rx="2" />
                <line x1="16" y1="2" x2="16" y2="6" />
                <line x1="8" y1="2" x2="8" y2="6" />
                <line x1="3" y1="10" x2="21" y2="10" />
              </svg>
              Next: {formatDate(nextBillingDate)}
            </span>
          )}

          {notes && (
            <span className="subItemNotes" title={notes}>
              "{notes}"
            </span>
          )}
        </div>
      </div>

      {/* Pricing Information */}
      <div className="subItemPricing">
        <div className="subItemEnteredPrice">
          <span className="priceAmount">{formatCurrency(price, currency)}</span>
          <span className="priceCycle">{cycleMeta.shortLabel}</span>
        </div>

        <div className="subItemEquivalents">
          {billingCycle !== 'monthly' ? (
            <span className="equivalentMonthly">
              ≈ {formatCurrency(monthlyCost, currency)}/mo
            </span>
          ) : (
            <span className="equivalentYearly">
              {formatCurrency(annualCost, currency)}/yr
            </span>
          )}
        </div>
      </div>

      {/* Action Controls */}
      <div className="subItemActions">
        {/* Toggle Review / Keep */}
        <button
          type="button"
          className={`btnActionToggle ${isReview ? 'reviewActive' : ''}`}
          onClick={() => onToggleStatus(id)}
          title={isReview ? 'Mark as "Keep" (Essential)' : 'Mark as "Review" (Evaluate cutting)'}
          aria-label={isReview ? 'Mark as keep' : 'Mark as review'}
        >
          {isReview ? 'Reviewing' : 'Keep'}
        </button>

        {/* Edit Button */}
        <button
          type="button"
          className="btnIconAction"
          onClick={() => onEdit(subscription)}
          title="Edit subscription"
          aria-label={`Edit ${name}`}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" />
            <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" />
          </svg>
        </button>

        {/* Duplicate Button */}
        <button
          type="button"
          className="btnIconAction"
          onClick={() => onDuplicate(id)}
          title="Duplicate subscription"
          aria-label={`Duplicate ${name}`}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="9" y="9" width="13" height="13" rx="2" />
            <path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1" />
          </svg>
        </button>

        {/* Delete Button */}
        <button
          type="button"
          className="btnIconAction danger"
          onClick={() => onDelete(subscription)}
          title="Delete subscription"
          aria-label={`Delete ${name}`}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M3 6h18M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2" />
          </svg>
        </button>
      </div>
    </li>
  );
}
