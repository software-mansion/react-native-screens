import { ColorValue } from 'react-native';

export const Palette = {
  NavyLight100: '#001a72',
  NavyLight80: '#33488e',
  NavyLight60: '#6676aa',
  NavyLight40: '#919fcf',
  NavyLight20: '#c1c6e5',
  NavyLight10: '#eef0ff',
  NavyLightTransparent: '#33488e40',

  NavyDark140: '#1b2445',
  NavyDark120: '#122154',
  NavyDark100: '#001a72',
  NavyDark80: '#0a2688',
  NavyDark70: '#33488e',
  NavyDark60: '#7485bd',
  NavyDark40: '#abbcf5',
  NavyDark20: '#c1c6e5',

  PurpleLight100: '#782aeb',
  PurpleLight80: '#b58df1',
  PurpleLight60: '#d1bbf3',
  PurpleLight40: '#e8dafc',
  PurpleLight20: '#f5eeff',
  PurpleLightTtransparent: '#f5eeff40',

  PurpleDark140: '#473d68',
  PurpleDark120: '#6a539a',
  PurpleDark100: '#b07eff',
  PurpleDark80: '#c49ffe',
  PurpleDark60: '#d0b2ff',
  PurpleDark40: '#e9dbff',
  PurpleDarkTransparent: '#473d6840',

  BlueLight100: '#38acdd',
  BlueLight80: '#5bb9e0',
  BlueLight60: '#87cce8',
  BlueLight40: '#b5e1f1',
  BlueLight20: '#e1f3fa',

  BlueDark140: '#1b4865',
  BlueDark120: '#126893',
  BlueDark100: '#00a9f0',
  BlueDark80: '#6fcef5',
  BlueDark60: '#a8dbf0',
  BlueDark40: '#d7f0fa',

  GreenLight100: '#57b495',
  GreenLight80: '#82cab2',
  GreenLight60: '#b1dfd0',
  GreenLight40: '#dff2ec',
  GreenLight20: '#ebfcf7',

  GreenDark140: '#2a4f4a',
  GreenDark120: '#31775d',
  GreenDark100: '#3fc684',
  GreenDark80: '#7adead',
  GreenDark60: '#a0dfc0',
  GreenDark40: '#d3f5e4',

  RedLight100: '#ff6259',
  RedLight80: '#fa7f7c',
  RedLight60: '#ffa3a1',
  RedLight40: '#ffd2d7',
  RedLight20: '#ffedf0',

  RedDark140: '#5a3b46',
  RedDark120: '#914f55',
  RedDark110: '#c86364',
  RedDark100: '#ff7774',
  RedDark80: '#ff8b88',
  RedDark60: '#ffb4b2',
  RedDark40: '#ffdcdb',

  YellowLight100: '#ffd61e',
  YellowLight80: '#ffe04b',
  YellowLight60: '#ffe780',
  YellowLight40: '#fff1b2',
  YellowLight20: '#fffae1',

  YellowDark140: '#5a553a',
  YellowDark120: '#91823d',
  YellowDark100: '#ffdd44',
  YellowDark80: '#ffe678',
  YellowDark60: '#fff1b2',
  YellowDark40: '#fff9db',

  OffWhite: '#f8f9ff',
  White: '#fcfcff',
  WhiteTransparentLight: '#fcfcff40',
  WhiteTransparentDark: '#fcfcff80',

  LightOffNavy: '#30354a',
  OffNavy: '#272b3c',
  Navy: '#32736',
} as const;

export type ColorPallette = typeof Palette & {
  background: ColorValue,
  offBackground: ColorValue,
  primary: ColorValue,
  cardBackground: ColorValue,
  cardBorder: ColorValue,
};

export const Colors: ColorPallette = {
  ...Palette,
  background: Palette.White,
  offBackground: Palette.OffWhite,
  primary: Palette.NavyLight100,
  cardBackground: Palette.White,
  cardBorder: Palette.NavyLight20,
};

export const LightColors: ColorPallette = Colors;

export const DarkColors: ColorPallette = {
  ...Palette,
  background: Palette.Navy,
  offBackground: Palette.OffNavy,
  primary: Palette.NavyLight10,
  cardBackground: Palette.Navy,
  cardBorder: Palette.NavyDark60,
};

export default Colors;


