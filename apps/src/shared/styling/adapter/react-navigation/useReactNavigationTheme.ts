import * as React from 'react';
import { ThemeContext } from '@react-navigation/core';
import { DarkTheme, LightTheme } from '../../theme/themes';

export function useReactNavigationTheme() {
  const theme = React.useContext(ThemeContext);
  if (theme == null) {
    return undefined;
  }
  return theme.dark ? DarkTheme : LightTheme;
}
