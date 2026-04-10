import * as React from 'react';
import { ThemeContext } from './ThemeContext';
import type { ThemeName } from './ThemeContext';
import { ColorPallette, DarkColors, LightColors } from '../Colors';
import { useTheme } from '@react-navigation/native';

/**
 * Requires `ThemeContext` (from react-navigation) presence.
 * However, it is possible to override theme by wrapping part of the app in `ThemeProvider` and passing desired theme as a prop.
 * Use this to get whole collor pallete current theme is based on.
 */
export default function useThemeColorPallette(): {
  theme: ThemeName;
  colors: ColorPallette;
} {
  const navigationTheme = useTheme();
  let theme: ThemeName = navigationTheme.dark ? 'dark' : 'light';

  const providedTheme = React.useContext(ThemeContext);
  if (providedTheme !== undefined) {
    theme = providedTheme;
  }
  return {
    theme: theme,
    colors: theme === 'dark' ? DarkColors : LightColors,
  };
}
