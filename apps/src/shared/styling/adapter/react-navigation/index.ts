import { DarkTheme, DefaultTheme } from '@react-navigation/native';
import { DarkColors, LightColors } from '../../Colors';

export const ScreensLightTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: LightColors.primary as string,
    background: LightColors.background as string,
    card: LightColors.cardBackground as string,
    border: LightColors.cardBorder as string,
  },
};

export const ScreensDarkTheme = {
  ...DarkTheme,
  colors: {
    ...DarkTheme.colors,
    primary: DarkColors.primary as string,
    background: DarkColors.background as string,
    card: DarkColors.cardBackground as string,
    border: DarkColors.cardBorder as string,
  },
};

