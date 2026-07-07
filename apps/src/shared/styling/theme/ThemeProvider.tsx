import * as React from 'react';

import { ThemeContext } from './ThemeContext';
import { LightTheme, DarkTheme } from './themes';
import type { ThemeType } from './themes';

type Props = {
  theme: ThemeType;
  children: React.ReactNode;
};

export function ThemeProvider({ theme, children }: Props) {
  const value = theme === 'light' ? LightTheme : DarkTheme;
  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
}
