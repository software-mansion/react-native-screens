import { useTheme, DefaultTheme } from '@react-navigation/native';

export function useReactNavigationTheme() {
  try {
    const theme = useTheme();
    return theme;
  } catch (error) {
    console.log('Returning default theme from useReactNavigationTheme');
  }
  return DefaultTheme;
}
