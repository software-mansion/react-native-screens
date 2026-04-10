import * as React from 'react';
import { ThemeContext } from './ThemeContext';
import type { ThemeName } from './ThemeContext';
import { ColorPallette, DarkColors, LightColors } from '../Colors';
import { useReactNavigationTheme } from '../adapter/react-navigation';

/**
 * Get the current theme from the context. If there is no theme provided, get it from React Navigation theme.
 * Use this to get whole collor pallete current theme is based on.
 */
export default function useThemeColorPallette(): {
  theme: ThemeName;
  colors: ColorPallette;
} {
  const navigationTheme = useReactNavigationTheme();

  const providedTheme = React.useContext(ThemeContext);
  if (providedTheme !== undefined) {
    return {
      theme: providedTheme,
      colors: providedTheme === 'dark' ? DarkColors : LightColors,
    };
  }
  return {
    theme: navigationTheme.dark ? 'dark' : 'light',
    colors: navigationTheme.dark ? DarkColors : LightColors,
  };
}
