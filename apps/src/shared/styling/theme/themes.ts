import { ColorPalette, LightColors, DarkColors } from '../palette';

export type ThemeType = 'light' | 'dark';

export type Theme = {
  theme: ThemeType;
  colors: ColorPalette;
};

export const LightTheme: Theme = {
  theme: 'light',
  colors: LightColors,
};

export const DarkTheme: Theme = {
  theme: 'dark',
  colors: DarkColors,
};
