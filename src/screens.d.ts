// Project: https://github.com/kmagiera/react-native-screens
// TypeScript Version: 2.8

declare module 'react-native-screens' {
  import { ComponentClass } from 'react';
  import { ViewProps, Animated } from 'react-native';

  export function useScreens(shouldUseScreens?: boolean): void;
  export function enableScreens(shouldEnableScreens?: boolean): void;
  export function screensEnabled(): boolean;

  export interface ScreenProps extends ViewProps {
    active?: 0 | 1 | Animated.AnimatedInterpolation;
    onComponentRef?: (view: any) => void;
  }
  export const Screen: ComponentClass<ScreenProps>;

  export type ScreenContainerProps = ViewProps;
  export const ScreenContainer: ComponentClass<ScreenContainerProps>;

  export interface ScreenStackProps extends ViewProps{
    transitioning?: number
    progress?: number
  }
  
  export interface ScreenStackHeaderConfigProps extends ViewProps {
    title?: string
    titleFontFamily?:string
    titleFontSize?: number
    titleColor?: string
    backTitle?: string
    backTitleFontFamily?: string
    backTitleFontSize?: string
    backgroundColor?: string
    color?: string
    largeTitle?: boolean
    largeTitleFontFamily?: string
    largeTitleFontSize?: number
    hideBackButton?: boolean
    hideShadow?: boolean
    hide?: boolean
    translucent?: boolean
    gestureEnabled?:boolean
  }

  export const NativeScreen: ComponentClass<ScreenProps>;
  export const NativeScreenContainer: ComponentClass<ScreenContainerProps>;
  export const ScreenStack: ComponentClass<ScreenStackProps>;
  export const ScreenStackHeaderConfig: ComponentClass<ScreenStackHeaderConfigProps>;
}
