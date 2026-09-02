export const CURRENCIES = [
  { code: 'USD', symbol: '$', name: 'US Dollar', locale: 'en-US', minorDigits: 2 },
  { code: 'INR', symbol: '₹', name: 'Indian Rupee', locale: 'en-IN', minorDigits: 2 },
  { code: 'EUR', symbol: '€', name: 'Euro', locale: 'de-DE', minorDigits: 2 },
  { code: 'GBP', symbol: '£', name: 'British Pound', locale: 'en-GB', minorDigits: 2 },
  { code: 'JPY', symbol: '¥', name: 'Japanese Yen', locale: 'ja-JP', minorDigits: 0 },
  { code: 'CAD', symbol: 'CA$', name: 'Canadian Dollar', locale: 'en-CA', minorDigits: 2 },
  { code: 'AUD', symbol: 'A$', name: 'Australian Dollar', locale: 'en-AU', minorDigits: 2 },
  { code: 'CHF', symbol: 'CHF', name: 'Swiss Franc', locale: 'de-CH', minorDigits: 2 },
];

export const DEFAULT_CURRENCY = 'USD';

export const CURRENCY_MAP = CURRENCIES.reduce((acc, c) => {
  acc[c.code] = c;
  return acc;
}, {});

export function getCurrency(code) {
  return CURRENCY_MAP[code] || CURRENCY_MAP[DEFAULT_CURRENCY];
}
