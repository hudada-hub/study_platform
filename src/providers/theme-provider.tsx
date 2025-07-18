'use client';

import React, { createContext, useContext, useState, useCallback } from 'react';
import { ThemeConfig, defaultTheme } from '@/theme/theme.config';

interface ThemeContextType {
  theme: ThemeConfig;
  updateTheme: (newTheme: Partial<ThemeConfig>) => void;
  resetTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

/**
 * 主题 Provider 组件
 */
export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<ThemeConfig>(defaultTheme);

  // 更新主题
  const updateTheme = useCallback((newTheme: Partial<ThemeConfig>) => {
    setTheme(prevTheme => ({
      ...prevTheme,
      ...newTheme,
    }));
  }, []);

  // 重置主题
  const resetTheme = useCallback(() => {
    setTheme(defaultTheme);
  }, []);

  return (
    <ThemeContext.Provider value={{ theme, updateTheme, resetTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

/**
 * 使用主题的 Hook
 */
export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}

/**
 * CSS 变量生成器
 */
export function generateCssVariables(theme: ThemeConfig) {
  return {
    '--primary-color': theme.primaryColor,
    '--secondary-color': theme.secondaryColor,
    '--success-color': theme.successColor,
    '--warning-color': theme.warningColor,
    '--error-color': theme.errorColor,
    '--info-color': theme.infoColor,
    '--text-color-primary': theme.textColor.primary,
    '--text-color-secondary': theme.textColor.secondary,
    '--text-color-disabled': theme.textColor.disabled,
    '--background-color-primary': theme.backgroundColor.primary,
    '--background-color-secondary': theme.backgroundColor.secondary,

    '--border-color-primary': theme.borderColor.primary,
    '--border-color-secondary': theme.borderColor.secondary,
   
  } as React.CSSProperties;
} 