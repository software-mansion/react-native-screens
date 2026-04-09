import * as React from 'react';

export type ThemeName = 'light' | 'dark';

export const ThemeContext = React.createContext<ThemeName | undefined>(
  undefined,
);

ThemeContext.displayName = 'ThemeContext';
