import { useState } from 'react';
import { DEFAULT_CURRENCY, getCurrency, CURRENCY_MAP } from '../data/currencies';

const CURRENCY_STORAGE_KEY = 'subcalc_currency';

export function useCurrency() {
  const [currency, setCurrencyState] = useState(() => {
    try {
      const saved = localStorage.getItem(CURRENCY_STORAGE_KEY);
      return saved && CURRENCY_MAP[saved] ? saved : DEFAULT_CURRENCY;
    } catch {
      return DEFAULT_CURRENCY;
    }
  });

  const setCurrency = (newCurrencyCode) => {
    if (!CURRENCY_MAP[newCurrencyCode]) return;
    setCurrencyState(newCurrencyCode);
    try {
      localStorage.setItem(CURRENCY_STORAGE_KEY, newCurrencyCode);
    } catch (e) {
      console.warn('Failed to save currency preference:', e);
    }
  };

  return {
    currency,
    setCurrency,
    currencyConfig: getCurrency(currency),
  };
}
