import React, { createContext, useCallback, useContext, useMemo, useState } from 'react';
import { coresClaro, coresEscuro, ThemeColors } from '../../theme';

interface ThemeContextValue {
  cores: ThemeColors;
  isDark: boolean;
  alternarTema: () => void;
}

const ThemeContext = createContext<ThemeContextValue>({
  cores: coresClaro,
  isDark: false,
  alternarTema: () => {},
});

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  // Inicia no tema claro (direção visual principal com fundo cinza claro e azul-marinho institucional)
  const [isDark, setIsDark] = useState(false);

  const alternarTema = useCallback(() => {
    setIsDark((prev) => !prev);
  }, []);

  const value = useMemo(
    () => ({
      cores: isDark ? coresEscuro : coresClaro,
      isDark,
      alternarTema,
    }),
    [isDark, alternarTema],
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme(): ThemeContextValue {
  return useContext(ThemeContext);
}
