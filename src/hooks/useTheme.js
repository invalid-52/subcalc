import { useState, useEffect } from 'react';

const THEME_STORAGE_KEY = 'subcalc_theme';

export function useTheme() {
  const [themePreference, setThemePreference] = useState(() => {
    try {
      return localStorage.getItem(THEME_STORAGE_KEY) || 'dark';
    } catch {
      return 'dark';
    }
  });

  const [resolvedTheme, setResolvedTheme] = useState('dark');

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

    const applyTheme = () => {
      let activeTheme = themePreference;

      if (themePreference === 'system') {
        activeTheme = mediaQuery.matches ? 'dark' : 'light';
      }

      setResolvedTheme(activeTheme);
      document.documentElement.setAttribute('data-theme', activeTheme);
      document.documentElement.style.colorScheme = activeTheme;

      // Update meta theme-color tag
      const metaTheme = document.querySelector('meta[name="theme-color"]');
      if (metaTheme) {
        metaTheme.setAttribute('content', activeTheme === 'dark' ? '#0b0e14' : '#f8fafc');
      }
    };

    applyTheme();

    const handleChange = () => {
      if (themePreference === 'system') {
        applyTheme();
      }
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, [themePreference]);

  const setTheme = (newTheme) => {
    setThemePreference(newTheme);
    try {
      localStorage.setItem(THEME_STORAGE_KEY, newTheme);
    } catch (e) {
      console.warn('Failed to save theme preference:', e);
    }
  };

  return {
    theme: themePreference,
    resolvedTheme,
    setTheme,
    isDark: resolvedTheme === 'dark',
  };
}
