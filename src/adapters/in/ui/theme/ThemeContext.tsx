import React, { createContext, useContext, useMemo } from 'react';
import { useColorScheme } from 'react-native';
import { coresClaro, coresEscuro, ThemeColors } from './colors';

interface ThemeContextValue {
  cores: ThemeColors;
  isDark: boolean;
}

const ThemeContext = createContext<ThemeContextValue>({
  cores: coresClaro,
  isDark: false,
});

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const scheme = useColorScheme();
  const isDark = scheme === 'dark';

  const value = useMemo(
    () => ({
      cores: isDark ? coresEscuro : coresClaro,
      isDark,
    }),
    [isDark],
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme(): ThemeContextValue {
  return useContext(ThemeContext);
}
