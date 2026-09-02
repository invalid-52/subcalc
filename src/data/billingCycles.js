export const BILLING_CYCLES = [
  {
    id: 'weekly',
    label: 'Weekly',
    shortLabel: '/wk',
    description: 'Every 7 days',
    toMonthly: (price) => (price * 52) / 12,
    toAnnual: (price) => price * 52,
    days: 7,
  },
  {
    id: 'monthly',
    label: 'Monthly',
    shortLabel: '/mo',
    description: 'Every month',
    toMonthly: (price) => price,
    toAnnual: (price) => price * 12,
    days: 30.4375,
  },
  {
    id: 'quarterly',
    label: 'Quarterly',
    shortLabel: '/qtr',
    description: 'Every 3 months',
    toMonthly: (price) => price / 3,
    toAnnual: (price) => price * 4,
    days: 91.25,
  },
  {
    id: 'half-yearly',
    label: 'Half-Yearly',
    shortLabel: '/6mo',
    description: 'Every 6 months',
    toMonthly: (price) => price / 6,
    toAnnual: (price) => price * 2,
    days: 182.5,
  },
  {
    id: 'yearly',
    label: 'Yearly',
    shortLabel: '/yr',
    description: 'Every 12 months',
    toMonthly: (price) => price / 12,
    toAnnual: (price) => price,
    days: 365,
  },
];

export const DEFAULT_BILLING_CYCLE = 'monthly';

export const BILLING_CYCLE_MAP = BILLING_CYCLES.reduce((acc, cycle) => {
  acc[cycle.id] = cycle;
  return acc;
}, {});

export function getBillingCycle(id) {
  return BILLING_CYCLE_MAP[id] || BILLING_CYCLE_MAP[DEFAULT_BILLING_CYCLE];
}
