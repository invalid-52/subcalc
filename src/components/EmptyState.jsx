import React from 'react';

export function EmptyState({ onOpenAddModal, onQuickAddSample }) {
  const quickStarters = [
    { name: 'Netflix', serviceId: 'netflix', price: 15.49, category: 'streaming', color: '#E50914' },
    { name: 'Spotify', serviceId: 'spotify', price: 11.99, category: 'music', color: '#1DB954' },
    { name: 'ChatGPT Plus', serviceId: 'chatgpt', price: 20.00, category: 'ai', color: '#10A37F' },
    { name: 'iCloud+', serviceId: 'icloud', price: 2.99, category: 'cloud', color: '#3693F3' },
  ];

  return (
    <div className="emptyStateCard" aria-label="No subscriptions added yet">
      <div className="emptyStateIcon">
        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <rect x="2" y="5" width="20" height="14" rx="3" />
          <line x1="2" y1="10" x2="22" y2="10" />
          <circle cx="7" cy="15" r="1.5" fill="currentColor" />
        </svg>
      </div>

      <h3 className="emptyStateTitle">No subscriptions yet</h3>
      <p className="emptyStateDesc">
        Add your recurring services to compute your exact monthly and annual spending, optimize potential savings, and see renewal schedules.
      </p>

      <div className="emptyStateAction">
        <button
          type="button"
          className="btn btnPrimary"
          onClick={onOpenAddModal}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path d="M12 5v14M5 12h14" />
          </svg>
          <span>Add your first subscription</span>
        </button>
      </div>

      {/* Quick sample add helpers */}
      <div className="emptyStateQuickStarters">
        <span className="quickStarterLabel">Or quick start with:</span>
        <div className="quickStarterChips">
          {quickStarters.map((starter) => (
            <button
              key={starter.serviceId}
              type="button"
              className="btnStarterChip"
              onClick={() => onQuickAddSample(starter)}
            >
              + {starter.name}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
