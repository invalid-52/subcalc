import React from 'react';
import { formatCurrency } from '../utils/currency';
import { formatDate, formatDaysRemaining } from '../utils/dates';
import { getServicePreset } from '../data/services';
import { getCategory } from '../data/categories';

export function UpcomingBills({ upcomingBills, currency }) {
  if (!upcomingBills || upcomingBills.length === 0) {
    return null;
  }

  return (
    <section className="card upcomingCard" aria-label="Upcoming Payment Schedule">
      <div className="cardHeader">
        <div>
          <h2 className="cardTitle">Upcoming Payments</h2>
          <p className="cardSubtitle">Next scheduled renewals</p>
        </div>
        <span className="badgeCount">{upcomingBills.length} scheduled</span>
      </div>

      <div className="upcomingList">
        {upcomingBills.map((sub) => {
          const preset = getServicePreset(sub.serviceId);
          const category = getCategory(sub.category);
          const isOverdue = sub.daysRemaining < 0;
          const isDueSoon = sub.daysRemaining >= 0 && sub.daysRemaining <= 3;

          return (
            <div key={sub.id} className="upcomingItem">
              <div
                className="upcomingIcon"
                style={{
                  backgroundColor: `${sub.color || '#3B82F6'}18`,
                  color: sub.color || '#3B82F6',
                }}
              >
                {preset ? preset.logoSvg : (sub.name || 'S').charAt(0).toUpperCase()}
              </div>

              <div className="upcomingInfo">
                <span className="upcomingName">{sub.name}</span>
                <span className="upcomingDate">
                  {formatDate(sub.nextBillingDate)}
                </span>
              </div>

              <div className="upcomingDueBadge">
                <span
                  className={`daysBadge ${
                    isOverdue ? 'overdue' : isDueSoon ? 'dueSoon' : 'normal'
                  }`}
                >
                  {formatDaysRemaining(sub.daysRemaining)}
                </span>
              </div>

              <div className="upcomingPrice">
                <span className="upcomingAmount">{formatCurrency(sub.price, currency)}</span>
                <span className="upcomingCycle">/{sub.billingCycle}</span>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
