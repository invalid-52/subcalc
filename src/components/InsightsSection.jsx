import React from 'react';

export function InsightsSection({ insights }) {
  if (!insights || insights.length === 0) {
    return null;
  }

  return (
    <section className="card insightsCard" aria-label="Smart Financial Insights">
      <div className="cardHeader">
        <div>
          <h2 className="cardTitle">Spending Insights</h2>
          <p className="cardSubtitle">Calculated from your active subscriptions</p>
        </div>
      </div>

      <div className="insightsGrid">
        {insights.map((insight) => (
          <div
            key={insight.id}
            className="insightItem"
            style={{ '--insight-accent': insight.accentColor }}
          >
            <div className="insightHeader">
              <span className="insightTitle">{insight.title}</span>
              {insight.badge && (
                <span className="insightBadge">{insight.badge}</span>
              )}
            </div>
            <div className="insightHighlight">{insight.highlight}</div>
            <p className="insightDesc">{insight.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
