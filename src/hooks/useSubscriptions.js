import { useState, useMemo, useCallback } from 'react';
import { useLocalStorage } from './useLocalStorage';
import { sanitizeSubscription } from '../utils/validation';
import { normalizeMonthlyCost } from '../utils/calculations';

const STORAGE_KEY_V2 = 'subcalc_v2_subscriptions';
const LEGACY_STORAGE_KEY = 'subs-calculator-data';

// Helper to migrate legacy v1 data to v2
function migrationHelper(data) {
  if (Array.isArray(data) && data.length > 0) {
    return data.map((item) => sanitizeSubscription(item));
  }

  // Check legacy localStorage if v2 is empty
  try {
    const legacy = window.localStorage.getItem(LEGACY_STORAGE_KEY);
    if (legacy) {
      const parsed = JSON.parse(legacy);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed.map((item) =>
          sanitizeSubscription({
            ...item,
            serviceId: item.appId !== 'other' ? item.appId : null,
            billingCycle: item.cycle || 'monthly',
          })
        );
      }
    }
  } catch (e) {
    console.warn('Legacy data migration failed:', e);
  }

  return [];
}

export function useSubscriptions() {
  const [subscriptions, setSubscriptions, removeSubscriptions] = useLocalStorage(
    STORAGE_KEY_V2,
    [],
    migrationHelper
  );

  // Filter & Search states
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [cycleFilter, setCycleFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sortBy, setSortBy] = useState('cost-desc'); // 'cost-desc', 'cost-asc', 'name-asc', 'name-desc', 'recent'

  // CRUD actions
  const addSubscription = useCallback(
    (data) => {
      const sanitized = sanitizeSubscription(data);
      setSubscriptions((prev) => [sanitized, ...prev]);
      return sanitized;
    },
    [setSubscriptions]
  );

  const updateSubscription = useCallback(
    (id, data) => {
      setSubscriptions((prev) =>
        prev.map((item) => {
          if (item.id !== id) return item;
          return sanitizeSubscription({ ...item, ...data, id });
        })
      );
    },
    [setSubscriptions]
  );

  const deleteSubscription = useCallback(
    (id) => {
      setSubscriptions((prev) => prev.filter((item) => item.id !== id));
    },
    [setSubscriptions]
  );

  const toggleStatus = useCallback(
    (id, targetStatus) => {
      setSubscriptions((prev) =>
        prev.map((item) => {
          if (item.id !== id) return item;
          const nextStatus =
            targetStatus || (item.status === 'review' ? 'active' : 'review');
          return { ...item, status: nextStatus, updatedAt: new Date().toISOString() };
        })
      );
    },
    [setSubscriptions]
  );

  const duplicateSubscription = useCallback(
    (id) => {
      const existing = subscriptions.find((s) => s.id === id);
      if (!existing) return;
      const copy = sanitizeSubscription({
        ...existing,
        id: undefined,
        name: `${existing.name} (Copy)`,
      });
      setSubscriptions((prev) => [copy, ...prev]);
    },
    [subscriptions, setSubscriptions]
  );

  const resetSubscriptions = useCallback(() => {
    removeSubscriptions();
  }, [removeSubscriptions]);

  const importSubscriptions = useCallback(
    (newSubsList) => {
      const sanitizedList = newSubsList.map((s) => sanitizeSubscription(s));
      setSubscriptions(sanitizedList);
    },
    [setSubscriptions]
  );

  // Filtered & Sorted Subscriptions
  const filteredSubscriptions = useMemo(() => {
    let result = [...subscriptions];

    // 1. Search filter
    if (searchQuery.trim()) {
      const query = searchQuery.trim().toLowerCase();
      result = result.filter((sub) => {
        const nameMatch = sub.name?.toLowerCase().includes(query);
        const notesMatch = sub.notes?.toLowerCase().includes(query);
        const categoryMatch = sub.category?.toLowerCase().includes(query);
        return nameMatch || notesMatch || categoryMatch;
      });
    }

    // 2. Category filter
    if (categoryFilter !== 'all') {
      result = result.filter((sub) => sub.category === categoryFilter);
    }

    // 3. Billing cycle filter
    if (cycleFilter !== 'all') {
      result = result.filter((sub) => sub.billingCycle === cycleFilter);
    }

    // 4. Status filter
    if (statusFilter !== 'all') {
      result = result.filter((sub) => sub.status === statusFilter);
    }

    // 5. Sorting
    result.sort((a, b) => {
      switch (sortBy) {
        case 'cost-desc':
          return normalizeMonthlyCost(b) - normalizeMonthlyCost(a);
        case 'cost-asc':
          return normalizeMonthlyCost(a) - normalizeMonthlyCost(b);
        case 'name-asc':
          return (a.name || '').localeCompare(b.name || '');
        case 'name-desc':
          return (b.name || '').localeCompare(a.name || '');
        case 'recent':
          return new Date(b.createdAt || 0) - new Date(a.createdAt || 0);
        default:
          return 0;
      }
    });

    return result;
  }, [subscriptions, searchQuery, categoryFilter, cycleFilter, statusFilter, sortBy]);

  return {
    subscriptions,
    filteredSubscriptions,
    totalCount: subscriptions.length,
    filteredCount: filteredSubscriptions.length,
    addSubscription,
    updateSubscription,
    deleteSubscription,
    toggleStatus,
    duplicateSubscription,
    resetSubscriptions,
    importSubscriptions,
    // Filters & Search
    searchQuery,
    setSearchQuery,
    categoryFilter,
    setCategoryFilter,
    cycleFilter,
    setCycleFilter,
    statusFilter,
    setStatusFilter,
    sortBy,
    setSortBy,
  };
}
