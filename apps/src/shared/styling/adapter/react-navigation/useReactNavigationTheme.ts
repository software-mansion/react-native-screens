import { useTheme } from '@react-navigation/native';
import { DarkTheme, LightTheme } from '../../Colors';

export function useReactNavigationTheme() {
  try {
    const theme = useTheme();
    return theme.dark ? DarkTheme : LightTheme;
  } catch (error) {
    console.log('Returning undefined from useReactNavigationTheme');
  }
  return undefined;
}
