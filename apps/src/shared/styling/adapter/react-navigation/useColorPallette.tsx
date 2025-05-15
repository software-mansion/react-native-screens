import { Theme, useTheme } from '@react-navigation/native';
import { ColorPallette, DarkColors, LightColors } from '../../Colors';

/**
 * Requires `ThemeContext` (from react-navigation) presence.
 * Use this to get whole collor pallete current theme is based on.
 */
export default function useThemeColorPallette(): { theme: Theme, colors: ColorPallette } {
  const theme = useTheme();
  return {
    theme,
    colors: theme.dark ? DarkColors : LightColors,
  };
}
