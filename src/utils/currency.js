import { getCurrency, DEFAULT_CURRENCY } from '../data/currencies';

/**
 * Formats a numeric amount using the specified currency code and locale.
 * @param {number} amount - Numeric monetary value.
 * @param {string} [currencyCode=DEFAULT_CURRENCY] - Currency code (e.g. 'USD', 'INR', 'EUR').
 * @param {object} [options={}] - Custom formatting overrides.
 * @returns {string} Formatted currency string.
 */
export function formatCurrency(amount, currencyCode = DEFAULT_CURRENCY, options = {}) {
  const num = Number(amount);
  const safeAmount = Number.isFinite(num) ? num : 0;
  const config = getCurrency(currencyCode);

  try {
    const fractionDigits = options.fractionDigits !== undefined 
      ? options.fractionDigits 
      : config.minorDigits;

    return new Intl.NumberFormat(config.locale, {
      style: 'currency',
      currency: config.code,
      minimumFractionDigits: fractionDigits,
      maximumFractionDigits: fractionDigits,
      ...options,
    }).format(safeAmount);
  } catch (err) {
    // Fallback if browser throws on unexpected locale/currency
    return `${config.symbol || '$'}${safeAmount.toFixed(config.minorDigits ?? 2)}`;
  }
}

/**
 * Formats a plain number with locale separators (e.g. 12,345.67).
 */
export function formatNumber(amount, currencyCode = DEFAULT_CURRENCY, decimals = 2) {
  const num = Number(amount);
  const safeAmount = Number.isFinite(num) ? num : 0;
  const config = getCurrency(currencyCode);

  try {
    return new Intl.NumberFormat(config.locale, {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
    }).format(safeAmount);
  } catch {
    return safeAmount.toFixed(decimals);
  }
}
