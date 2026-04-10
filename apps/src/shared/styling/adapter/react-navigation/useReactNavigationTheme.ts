import * as React from 'react';
import { ThemeContext } from '@react-navigation/core';
import { DarkTheme, LightTheme } from '../../Colors';

export function useReactNavigationTheme() {
  const theme = React.useContext(ThemeContext);
  if (theme == null) {
    console.log('Returning undefined from useReactNavigationTheme');
    return undefined;
  }
  return theme.dark ? DarkTheme : LightTheme;
}
