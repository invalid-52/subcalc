import { BILLING_CYCLE_MAP } from '../data/billingCycles';
import { CATEGORY_MAP } from '../data/categories';

/**
 * Validates a subscription object before adding or updating.
 * @returns {{ isValid: boolean, errors: Record<string, string> }}
 */
export function validateSubscription(data) {
  const errors = {};

  // Name validation
  const name = typeof data.name === 'string' ? data.name.trim() : '';
  if (!name) {
    errors.name = 'Service name is required';
  } else if (name.length > 100) {
    errors.name = 'Service name must be under 100 characters';
  }

  // Price validation
  const priceNum = Number(data.price);
  if (data.price === '' || data.price === null || data.price === undefined) {
    errors.price = 'Price is required';
  } else if (!Number.isFinite(priceNum) || isNaN(priceNum)) {
    errors.price = 'Price must be a valid number';
  } else if (priceNum <= 0) {
    errors.price = 'Price must be greater than 0';
  } else if (priceNum > 10000000) {
    errors.price = 'Price exceeds maximum allowed limit';
  }

  // Billing cycle validation
  if (!data.billingCycle || !BILLING_CYCLE_MAP[data.billingCycle]) {
    errors.billingCycle = 'Please select a valid billing cycle';
  }

  // Next billing date validation (optional)
  if (data.nextBillingDate) {
    const d = new Date(data.nextBillingDate);
    if (isNaN(d.getTime())) {
      errors.nextBillingDate = 'Invalid billing date';
    }
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
}

/**
 * Sanitizes and normalizes subscription data to conform to the schema.
 */
export function sanitizeSubscription(data) {
  const name = typeof data.name === 'string' ? data.name.trim() : 'Unnamed Subscription';
  const price = Math.max(0, Number(data.price) || 0);
  const billingCycle = BILLING_CYCLE_MAP[data.billingCycle] ? data.billingCycle : 'monthly';
  const category = CATEGORY_MAP[data.category] ? data.category : 'other';
  const status = ['active', 'review', 'paused'].includes(data.status) ? data.status : 'active';
  const color = data.color && typeof data.color === 'string' ? data.color : '#3B82F6';
  const serviceId = data.serviceId || null;
  const notes = typeof data.notes === 'string' ? data.notes.slice(0, 500) : '';
  const startDate = data.startDate || null;
  const nextBillingDate = data.nextBillingDate || null;
  const currency = data.currency || 'USD';

  const now = new Date().toISOString();

  return {
    id: data.id || `sub_${Date.now().toString(36)}_${Math.random().toString(36).substr(2, 6)}`,
    name,
    serviceId,
    category,
    price,
    currency,
    billingCycle,
    startDate,
    nextBillingDate,
    status,
    notes,
    color,
    createdAt: data.createdAt || now,
    updatedAt: now,
  };
}
