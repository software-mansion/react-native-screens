import * as React from 'react';
import { ThemeContext } from './ThemeContext';
import { ColorPalette } from '../palette';
import type { ThemeType } from './themes';
import { useReactNavigationTheme } from '../adapter/react-navigation';
import { LightTheme } from './themes';

/**
 * Get the current theme from the context. If there is no theme provided, get it from React Navigation theme.
 * If there is no theme provided by React Navigation, return the light theme as default.
 * Use this to get whole color palette current theme is based on.
 */
export function useThemeColorPalette(): {
  theme: ThemeType;
  colors: ColorPalette;
} {
  const providedTheme = React.useContext(ThemeContext);
  const navigationTheme = useReactNavigationTheme();

  if (providedTheme !== undefined) {
    return providedTheme;
  }
  if (navigationTheme !== undefined) {
    return navigationTheme;
  }
  return LightTheme;
}
