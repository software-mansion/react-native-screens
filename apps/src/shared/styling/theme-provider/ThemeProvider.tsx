import * as React from 'react';

import { ThemeContext } from './ThemeContext';
import type { ThemeName } from './ThemeContext';

type Props = {
  theme: ThemeName;
  children: React.ReactNode;
};

export function ThemeProvider({ theme, children }: Props) {
  return (
    <ThemeContext.Provider value={theme}>{children}</ThemeContext.Provider>
  );
}
