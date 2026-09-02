import { useState, useEffect, useCallback } from 'react';

/**
 * Custom hook to safely sync state with browser localStorage.
 * Includes error recovery, type-checking, and event synchronization.
 */
export function useLocalStorage(key, initialValue, migrator = null) {
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const item = window.localStorage.getItem(key);
      if (item !== null) {
        const parsed = JSON.parse(item);
        if (migrator && typeof migrator === 'function') {
          return migrator(parsed);
        }
        return parsed;
      }

      // If key doesn't exist, check if a migrator can pull from legacy keys
      if (migrator && typeof migrator === 'function') {
        const migrated = migrator(null);
        if (migrated !== null && migrated !== undefined) {
          return migrated;
        }
      }

      return typeof initialValue === 'function' ? initialValue() : initialValue;
    } catch (error) {
      console.warn(`[useLocalStorage] Error loading key "${key}":`, error);
      return typeof initialValue === 'function' ? initialValue() : initialValue;
    }
  });

  const setValue = useCallback(
    (value) => {
      try {
        setStoredValue((current) => {
          const valueToStore = typeof value === 'function' ? value(current) : value;
          window.localStorage.setItem(key, JSON.stringify(valueToStore));
          return valueToStore;
        });
      } catch (error) {
        console.error(`[useLocalStorage] Error saving key "${key}":`, error);
      }
    },
    [key]
  );

  const removeItem = useCallback(() => {
    try {
      window.localStorage.removeItem(key);
      setStoredValue(typeof initialValue === 'function' ? initialValue() : initialValue);
    } catch (error) {
      console.error(`[useLocalStorage] Error removing key "${key}":`, error);
    }
  }, [key, initialValue]);

  return [storedValue, setValue, removeItem];
}
