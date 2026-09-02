import React, { useState, useRef } from 'react';
import { CURRENCIES } from '../data/currencies';
import { exportToJson, importFromJson } from '../utils/exportImport';

export function SettingsModal({
  isOpen,
  onClose,
  currency,
  onCurrencyChange,
  theme,
  onThemeChange,
  subscriptions,
  onImportData,
  onRequestReset,
}) {
  const fileInputRef = useRef(null);
  const [importStatus, setImportStatus] = useState(null);

  if (!isOpen) return null;

  const handleExport = () => {
    exportToJson(subscriptions, currency);
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result;
      if (typeof content === 'string') {
        const result = importFromJson(content);
        if (result.success) {
          onImportData(result.subscriptions);
          if (result.currency) {
            onCurrencyChange(result.currency);
          }
          setImportStatus({
            type: 'success',
            message: `Successfully imported ${result.count} subscription${result.count === 1 ? '' : 's'}.`,
          });
        } else {
          setImportStatus({
            type: 'error',
            message: result.error || 'Failed to import backup.',
          });
        }
      }
    };
    reader.onerror = () => {
      setImportStatus({
        type: 'error',
        message: 'Could not read file.',
      });
    };
    reader.readAsText(file);

    // Reset file input value
    e.target.value = '';
  };

  return (
    <div className="modalBackdrop" onClick={onClose} role="presentation">
      <div
        className="modalContainer settingsModal"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="settings-modal-title"
      >
        <div className="modalHeader">
          <div>
            <h2 id="settings-modal-title" className="modalTitle">Settings & Data</h2>
            <p className="modalSubtitle">Preferences, backups, and local storage management</p>
          </div>
          <button
            type="button"
            className="modalCloseBtn"
            onClick={onClose}
            aria-label="Close settings"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        <div className="settingsBody">
          {/* Section 1: Preferences */}
          <div className="settingsSection">
            <h3 className="settingsSectionTitle">Preferences</h3>

            <div className="settingsRow">
              <div className="settingsLabelBlock">
                <span className="settingsItemLabel">Display Currency</span>
                <span className="settingsItemDesc">Used for price calculations and symbol display</span>
              </div>
              <select
                className="formSelect settingsSelect"
                value={currency}
                onChange={(e) => onCurrencyChange(e.target.value)}
              >
                {CURRENCIES.map((c) => (
                  <option key={c.code} value={c.code}>
                    {c.symbol} — {c.name} ({c.code})
                  </option>
                ))}
              </select>
            </div>

            <div className="settingsRow">
              <div className="settingsLabelBlock">
                <span className="settingsItemLabel">Appearance Theme</span>
                <span className="settingsItemDesc">Choose your interface appearance</span>
              </div>
              <div className="themeButtonGroup" role="radiogroup">
                {['dark', 'light', 'system'].map((t) => (
                  <button
                    key={t}
                    type="button"
                    role="radio"
                    aria-checked={theme === t}
                    className={`btnThemeOption ${theme === t ? 'active' : ''}`}
                    onClick={() => onThemeChange(t)}
                  >
                    {t.charAt(0).toUpperCase() + t.slice(1)}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Section 2: Backup & Portability */}
          <div className="settingsSection">
            <h3 className="settingsSectionTitle">Data Portability</h3>

            <div className="portabilityGrid">
              <div className="portabilityCard">
                <div className="portabilityHeader">
                  <span className="portabilityTitle">Export Backup</span>
                  <span className="portabilityDesc">Download your subscriptions as a JSON file</span>
                </div>
                <button
                  type="button"
                  className="btn btnSecondary"
                  onClick={handleExport}
                  disabled={subscriptions.length === 0}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" />
                    <polyline points="7 10 12 15 17 10" />
                    <line x1="12" y1="15" x2="12" y2="3" />
                  </svg>
                  Export JSON ({subscriptions.length})
                </button>
              </div>

              <div className="portabilityCard">
                <div className="portabilityHeader">
                  <span className="portabilityTitle">Import Backup</span>
                  <span className="portabilityDesc">Restore subscriptions from a previously exported JSON</span>
                </div>
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  accept=".json,application/json"
                  style={{ display: 'none' }}
                />
                <button
                  type="button"
                  className="btn btnSecondary"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" />
                    <polyline points="17 8 12 3 7 8" />
                    <line x1="12" y1="3" x2="12" y2="15" />
                  </svg>
                  Import JSON File
                </button>
              </div>
            </div>

            {importStatus && (
              <div className={`statusAlert ${importStatus.type}`}>
                <span>{importStatus.message}</span>
                <button
                  type="button"
                  className="statusAlertClose"
                  onClick={() => setImportStatus(null)}
                >
                  ×
                </button>
              </div>
            )}
          </div>

          {/* Section 3: Reset Data */}
          <div className="settingsSection dangerZone">
            <h3 className="settingsSectionTitle danger">Danger Zone</h3>
            <div className="settingsRow">
              <div className="settingsLabelBlock">
                <span className="settingsItemLabel">Clear All Subscriptions</span>
                <span className="settingsItemDesc">Permanently removes all subscriptions stored in this browser</span>
              </div>
              <button
                type="button"
                className="btn btnDanger"
                onClick={onRequestReset}
                disabled={subscriptions.length === 0}
              >
                Clear All Data
              </button>
            </div>
          </div>

          {/* Privacy Note */}
          <div className="privacyNotice">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
              <path d="M7 11V7a5 5 0 0110 0v4" />
            </svg>
            <span>
              <strong>100% Privacy Focused:</strong> Your subscription and financial data is stored purely locally inside your browser's localStorage. Nothing is ever sent to a server.
            </span>
          </div>
        </div>

        <div className="modalActions">
          <button type="button" className="btn btnPrimary" onClick={onClose}>
            Done
          </button>
        </div>
      </div>
    </div>
  );
}
