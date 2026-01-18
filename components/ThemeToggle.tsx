
'use client';

import * as React from 'react';
import { Button, Tooltip } from '@fluentui/react-components';
import { WeatherMoonRegular, WeatherSunnyRegular } from '@fluentui/react-icons';

type ThemeMode = 'light' | 'dark';

function getSystemTheme(): ThemeMode {
  if (typeof window === 'undefined') return 'light';
  return window.matchMedia?.('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

export function ThemeToggle() {
  const [theme, setTheme] = React.useState<ThemeMode>('light');

  // Initialize from localStorage -> system
  React.useEffect(() => {
    const saved = localStorage.getItem('theme') as ThemeMode | null;
    const initial = saved ?? getSystemTheme();
    setTheme(initial);
    document.documentElement.setAttribute('data-theme', initial);
  }, []);

  const toggleTheme = () => {
    const next: ThemeMode = theme === 'dark' ? 'light' : 'dark';
    setTheme(next);
    localStorage.setItem('theme', next);
    document.documentElement.setAttribute('data-theme', next);
  };

  const isDark = theme === 'dark';
  const label = isDark ? 'Switch to light theme' : 'Switch to dark theme';

  return (
    <Tooltip content={isDark ? 'Light mode' : 'Dark mode'} relationship="label">
      <Button
        appearance="subtle"
        icon={isDark ? <WeatherSunnyRegular /> : <WeatherMoonRegular />}
        aria-label={label}
        onClick={toggleTheme}
        // Compact icon-only button styling
        style={{
          minWidth: 36,
          width: 36,
          height: 36,
          padding: 0,
          borderRadius: 10,
        }}
      />
    </Tooltip>
  );
}
