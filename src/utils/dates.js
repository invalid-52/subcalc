/**
 * Parses a YYYY-MM-DD date string into a local Date object safely.
 */
export function parseLocalDate(dateStr) {
  if (!dateStr) return null;
  const [year, month, day] = dateStr.split('-').map(Number);
  if (!year || !month || !day) return null;
  return new Date(year, month - 1, day);
}

/**
 * Formats a Date object or YYYY-MM-DD string to standard format (e.g. 'Oct 14, 2026').
 */
export function formatDate(dateInput) {
  if (!dateInput) return '';
  const d = typeof dateInput === 'string' ? parseLocalDate(dateInput) : dateInput;
  if (!d || isNaN(d.getTime())) return '';

  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(d);
}

/**
 * Calculates days remaining until a given target date from today.
 * Returns negative if the date is in the past.
 */
export function getDaysRemaining(targetDateInput) {
  if (!targetDateInput) return null;
  const target = typeof targetDateInput === 'string' ? parseLocalDate(targetDateInput) : targetDateInput;
  if (!target || isNaN(target.getTime())) return null;

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const normalizedTarget = new Date(target);
  normalizedTarget.setHours(0, 0, 0, 0);

  const diffMs = normalizedTarget.getTime() - today.getTime();
  return Math.round(diffMs / (1000 * 60 * 60 * 24));
}

/**
 * Returns a human-friendly string for days remaining (e.g. "Today", "Tomorrow", "In 3 days", "2 days ago").
 */
export function formatDaysRemaining(days) {
  if (days === null || days === undefined) return '';
  if (days === 0) return 'Due today';
  if (days === 1) return 'Due tomorrow';
  if (days > 1 && days <= 7) return `Due in ${days} days`;
  if (days > 7) return `In ${days} days`;
  if (days === -1) return '1 day overdue';
  return `${Math.abs(days)} days overdue`;
}

/**
 * Computes the auto-suggested next billing date given a start date and cycle.
 */
export function calculateNextBillingDate(startDateStr, cycleId) {
  const start = parseLocalDate(startDateStr);
  if (!start) return '';

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  let next = new Date(start);

  // Advance next date until it is on or after today
  while (next < today) {
    if (cycleId === 'weekly') {
      next.setDate(next.getDate() + 7);
    } else if (cycleId === 'monthly') {
      next.setMonth(next.getMonth() + 1);
    } else if (cycleId === 'quarterly') {
      next.setMonth(next.getMonth() + 3);
    } else if (cycleId === 'half-yearly') {
      next.setMonth(next.getMonth() + 6);
    } else if (cycleId === 'yearly') {
      next.setFullYear(next.getFullYear() + 1);
    } else {
      next.setMonth(next.getMonth() + 1);
    }
  }

  const year = next.getFullYear();
  const month = String(next.getMonth() + 1).padStart(2, '0');
  const day = String(next.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}
