import { sanitizeSubscription } from './validation';
import { DEFAULT_CURRENCY, CURRENCY_MAP } from '../data/currencies';

export const SCHEMA_VERSION = '2.0.0';

/**
 * Prepares and downloads the subscriptions data as a formatted JSON file.
 */
export function exportToJson(subscriptions, currency = DEFAULT_CURRENCY) {
  const exportData = {
    schemaVersion: SCHEMA_VERSION,
    app: 'SUBCALC - Subscription Calculator',
    exportedAt: new Date().toISOString(),
    currency,
    subscriptionsCount: subscriptions.length,
    subscriptions,
  };

  const jsonString = JSON.stringify(exportData, null, 2);
  const blob = new Blob([jsonString], { type: 'application/json' });
  const url = URL.createObjectURL(blob);

  const dateStr = new Date().toISOString().split('T')[0];
  const a = document.createElement('a');
  a.href = url;
  a.download = `subscriptions-backup-${dateStr}.json`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

/**
 * Validates and imports raw JSON text into clean subscription objects.
 * Handles both v2 backup format and legacy v1 array format seamlessly.
 */
export function importFromJson(jsonString) {
  try {
    if (!jsonString || typeof jsonString !== 'string') {
      return { success: false, error: 'Empty or invalid file content.' };
    }

    const parsed = JSON.parse(jsonString);
    let rawSubs = [];
    let importedCurrency = null;

    if (Array.isArray(parsed)) {
      // Legacy v1 format
      rawSubs = parsed;
    } else if (parsed && typeof parsed === 'object') {
      // V2 format or standard object wrapper
      if (Array.isArray(parsed.subscriptions)) {
        rawSubs = parsed.subscriptions;
        if (parsed.currency && CURRENCY_MAP[parsed.currency]) {
          importedCurrency = parsed.currency;
        }
      } else {
        return { success: false, error: 'File format is missing a subscriptions list.' };
      }
    } else {
      return { success: false, error: 'Unrecognized JSON structure.' };
    }

    if (rawSubs.length === 0) {
      return { success: true, count: 0, subscriptions: [], currency: importedCurrency };
    }

    // Process and sanitize each item
    const seenIds = new Set();
    const cleanSubs = [];

    for (const raw of rawSubs) {
      if (!raw || typeof raw !== 'object') continue;

      // Handle legacy v1 field names (cycle -> billingCycle, appId -> serviceId)
      const adapted = {
        id: raw.id,
        name: raw.name || raw.customName || 'Subscription',
        serviceId: raw.serviceId || (raw.appId && raw.appId !== 'other' ? raw.appId : null),
        category: raw.category || 'other',
        price: raw.price,
        billingCycle: raw.billingCycle || raw.cycle || 'monthly',
        currency: raw.currency || importedCurrency || DEFAULT_CURRENCY,
        startDate: raw.startDate || null,
        nextBillingDate: raw.nextBillingDate || null,
        status: raw.status || 'active',
        notes: raw.notes || '',
        color: raw.color || '#3B82F6',
        createdAt: raw.createdAt,
        updatedAt: raw.updatedAt,
      };

      const sanitized = sanitizeSubscription(adapted);

      // Prevent duplicate IDs
      if (seenIds.has(sanitized.id)) {
        sanitized.id = `sub_${Date.now().toString(36)}_${Math.random().toString(36).substr(2, 6)}`;
      }
      seenIds.add(sanitized.id);

      cleanSubs.push(sanitized);
    }

    return {
      success: true,
      count: cleanSubs.length,
      subscriptions: cleanSubs,
      currency: importedCurrency,
    };
  } catch (err) {
    return {
      success: false,
      error: `JSON parsing failed: ${err.message || 'Malformed file'}`,
    };
  }
}
