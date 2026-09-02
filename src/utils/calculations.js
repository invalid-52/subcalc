import { getBillingCycle } from '../data/billingCycles';
import { getCategory } from '../data/categories';
import { getDaysRemaining } from './dates';
import { formatCurrency } from './currency';

/**
 * Normalizes any subscription's price to an accurate monthly cost.
 * Uses exact annualization to eliminate floating-point drift:
 * - Weekly: price * 52 / 12
 * - Monthly: price
 * - Quarterly: price / 3
 * - Half-yearly: price / 6
 * - Yearly: price / 12
 */
export function normalizeMonthlyCost(subscription) {
  if (!subscription || !Number.isFinite(subscription.price)) return 0;
  const cycle = getBillingCycle(subscription.billingCycle);
  return cycle.toMonthly(subscription.price);
}

/**
 * Normalizes any subscription's price to an accurate annual cost.
 */
export function normalizeAnnualCost(subscription) {
  if (!subscription || !Number.isFinite(subscription.price)) return 0;
  const cycle = getBillingCycle(subscription.billingCycle);
  return cycle.toAnnual(subscription.price);
}

/**
 * Calculates key top-level financial metrics from a list of subscriptions.
 */
export function calculateTotals(subscriptions = []) {
  const activeSubs = subscriptions.filter((s) => s.status !== 'paused');

  let monthlyTotal = 0;
  let yearlyTotal = 0;

  activeSubs.forEach((sub) => {
    monthlyTotal += normalizeMonthlyCost(sub);
    yearlyTotal += normalizeAnnualCost(sub);
  });

  const activeCount = activeSubs.length;
  const totalCount = subscriptions.length;
  const pausedCount = totalCount - activeCount;

  const weeklyEquivalent = yearlyTotal > 0 ? yearlyTotal / 52 : 0;
  const dailyEquivalent = yearlyTotal > 0 ? yearlyTotal / 365 : 0;
  const averageMonthlyCost = activeCount > 0 ? monthlyTotal / activeCount : 0;

  return {
    monthlyTotal,
    yearlyTotal,
    weeklyEquivalent,
    dailyEquivalent,
    activeCount,
    totalCount,
    pausedCount,
    averageMonthlyCost,
  };
}

/**
 * Aggregates monthly spending by category and computes distribution percentages.
 */
export function calculateCategoryBreakdown(subscriptions = []) {
  const activeSubs = subscriptions.filter((s) => s.status !== 'paused');
  const totals = calculateTotals(subscriptions);
  const monthlyTotal = totals.monthlyTotal;

  const catMap = {};

  activeSubs.forEach((sub) => {
    const catId = sub.category || 'other';
    const monthlyCost = normalizeMonthlyCost(sub);

    if (!catMap[catId]) {
      const catMeta = getCategory(catId);
      catMap[catId] = {
        id: catId,
        label: catMeta.label,
        color: catMeta.color,
        icon: catMeta.icon,
        monthlyTotal: 0,
        annualTotal: 0,
        count: 0,
        subscriptions: [],
      };
    }

    catMap[catId].monthlyTotal += monthlyCost;
    catMap[catId].annualTotal += normalizeAnnualCost(sub);
    catMap[catId].count += 1;
    catMap[catId].subscriptions.push(sub);
  });

  const categories = Object.values(catMap).map((cat) => ({
    ...cat,
    percentage: monthlyTotal > 0 ? (cat.monthlyTotal / monthlyTotal) * 100 : 0,
  }));

  // Sort descending by monthly cost
  categories.sort((a, b) => b.monthlyTotal - a.monthlyTotal);

  return {
    categories,
    hasCategories: categories.length > 0,
  };
}

/**
 * Calculates potential savings for subscriptions marked as 'review'.
 */
export function calculatePotentialSavings(subscriptions = []) {
  const reviewSubs = subscriptions.filter((s) => s.status === 'review');
  const totals = calculateTotals(subscriptions);

  let monthlySavings = 0;
  let yearlySavings = 0;

  reviewSubs.forEach((sub) => {
    monthlySavings += normalizeMonthlyCost(sub);
    yearlySavings += normalizeAnnualCost(sub);
  });

  const percentageOfTotal = totals.monthlyTotal > 0 
    ? (monthlySavings / totals.monthlyTotal) * 100 
    : 0;

  return {
    reviewSubs,
    reviewCount: reviewSubs.length,
    monthlySavings,
    yearlySavings,
    percentageOfTotal,
    hasSavingsToReview: reviewSubs.length > 0,
  };
}

/**
 * Extracts and chronologically sorts upcoming bills with days remaining.
 */
export function calculateUpcomingBills(subscriptions = []) {
  const subsWithDates = subscriptions
    .filter((s) => s.status !== 'paused' && s.nextBillingDate)
    .map((s) => {
      const days = getDaysRemaining(s.nextBillingDate);
      return {
        ...s,
        daysRemaining: days,
      };
    })
    .filter((s) => s.daysRemaining !== null);

  // Sort: Overdue first (negative days), then upcoming (0, 1, 2...)
  subsWithDates.sort((a, b) => a.daysRemaining - b.daysRemaining);

  return subsWithDates;
}

/**
 * Generates data-driven smart financial insights from active subscriptions.
 */
export function generateSmartInsights(subscriptions = [], currencyCode = 'USD') {
  const activeSubs = subscriptions.filter((s) => s.status !== 'paused');
  if (activeSubs.length === 0) return [];

  const totals = calculateTotals(subscriptions);
  const categoryBreakdown = calculateCategoryBreakdown(subscriptions);
  const savings = calculatePotentialSavings(subscriptions);

  const insights = [];

  // 1. Most expensive subscription
  const sortedByCost = [...activeSubs].sort(
    (a, b) => normalizeMonthlyCost(b) - normalizeMonthlyCost(a)
  );
  const highest = sortedByCost[0];
  if (highest) {
    const highestMonthly = normalizeMonthlyCost(highest);
    const highestAnnual = normalizeAnnualCost(highest);
    const highestPct = totals.monthlyTotal > 0 ? (highestMonthly / totals.monthlyTotal) * 100 : 0;

    insights.push({
      id: 'highest-cost',
      type: 'cost',
      title: 'Top Expense',
      highlight: highest.name,
      description: `${formatCurrency(highestMonthly, currencyCode)}/mo (${highestPct.toFixed(0)}% of recurring spending). That's ${formatCurrency(highestAnnual, currencyCode)}/yr.`,
      badge: `${highestPct.toFixed(0)}% of total`,
      accentColor: highest.color || '#3B82F6',
    });
  }

  // 2. Dominant category
  const topCategory = categoryBreakdown.categories[0];
  if (topCategory && topCategory.percentage >= 25 && categoryBreakdown.categories.length > 1) {
    insights.push({
      id: 'dominant-category',
      type: 'category',
      title: 'Dominant Category',
      highlight: topCategory.label,
      description: `Accounts for ${topCategory.percentage.toFixed(0)}% (${formatCurrency(topCategory.monthlyTotal, currencyCode)}/mo) across ${topCategory.count} service${topCategory.count > 1 ? 's' : ''}.`,
      badge: `${topCategory.percentage.toFixed(0)}%`,
      accentColor: topCategory.color,
    });
  }

  // 3. Potential savings flagged
  if (savings.hasSavingsToReview) {
    insights.push({
      id: 'savings-alert',
      type: 'savings',
      title: 'Potential Savings',
      highlight: `${formatCurrency(savings.monthlySavings, currencyCode)}/mo`,
      description: `You have ${savings.reviewCount} subscription${savings.reviewCount > 1 ? 's' : ''} marked for review (${formatCurrency(savings.yearlySavings, currencyCode)}/yr).`,
      badge: `${savings.reviewCount} to review`,
      accentColor: '#F59E0B',
    });
  } else if (activeSubs.length >= 3) {
    // 4. Average cost insight
    insights.push({
      id: 'average-cost',
      type: 'average',
      title: 'Average Service Cost',
      highlight: `${formatCurrency(totals.averageMonthlyCost, currencyCode)}/mo`,
      description: `Across your ${totals.activeCount} active subscriptions, your average monthly commitment per service is ${formatCurrency(totals.averageMonthlyCost, currencyCode)}.`,
      badge: `${totals.activeCount} active`,
      accentColor: '#10B981',
    });
  }

  return insights;
}
