import React from 'react';
import { formatCurrency } from '../utils/currency';

export function SecondaryMetrics({ totals, currency }) {
  const { yearlyTotal, weeklyEquivalent, dailyEquivalent, averageMonthlyCost } = totals;

  const metrics = [
    {
      id: 'yearly',
      label: 'Yearly Total',
      value: formatCurrency(yearlyTotal, currency),
      subtext: 'Annual commitment',
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <rect x="3" y="4" width="18" height="18" rx="2" />
          <line x1="16" y1="2" x2="16" y2="6" />
          <line x1="8" y1="2" x2="8" y2="6" />
          <line x1="3" y1="10" x2="21" y2="10" />
        </svg>
      ),
    },
    {
      id: 'weekly',
      label: 'Weekly Equivalent',
      value: formatCurrency(weeklyEquivalent, currency),
      subtext: '≈ 52 weeks/year',
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M12 8v4l3 3" />
          <circle cx="12" cy="12" r="9" />
        </svg>
      ),
    },
    {
      id: 'daily',
      label: 'Daily Equivalent',
      value: formatCurrency(dailyEquivalent, currency),
      subtext: '≈ 365 days/year',
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="12" cy="12" r="5" />
          <line x1="12" y1="1" x2="12" y2="3" />
          <line x1="12" y1="21" x2="12" y2="23" />
          <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
          <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
          <line x1="1" y1="12" x2="3" y2="12" />
          <line x1="21" y1="12" x2="23" y2="12" />
          <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
          <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
        </svg>
      ),
    },
    {
      id: 'average',
      label: 'Average Service Cost',
      value: formatCurrency(averageMonthlyCost, currency),
      subtext: 'Per active subscription',
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <line x1="18" y1="20" x2="18" y2="10" />
          <line x1="12" y1="20" x2="12" y2="4" />
          <line x1="6" y1="20" x2="6" y2="14" />
        </svg>
      ),
    },
  ];

  return (
    <section className="secondaryMetricsGrid" aria-label="Secondary Financial Metrics">
      {metrics.map((m) => (
        <div key={m.id} className="metricCard">
          <div className="metricCardHeader">
            <span className="metricLabel">{m.label}</span>
            <div className="metricIcon" aria-hidden="true">
              {m.icon}
            </div>
          </div>
          <div className="metricValue">{m.value}</div>
          <div className="metricSubtext">{m.subtext}</div>
        </div>
      ))}
    </section>
  );
}
