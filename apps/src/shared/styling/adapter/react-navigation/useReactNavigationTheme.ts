import { useTheme, DefaultTheme } from '@react-navigation/native';

export function useReactNavigationTheme() {
  try {
    const theme = useTheme();
    return theme;
  } catch (error) {
    console.log(
      "useReactNavigationTheme: Couldn't find a React Navigation theme. Returning default theme.",
    );
  }
  return DefaultTheme;
}
