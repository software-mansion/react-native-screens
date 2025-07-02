'use client';

import codegenNativeComponent from 'react-native/Libraries/Utilities/codegenNativeComponent';
import type { ColorValue, ViewProps } from 'react-native';
import {
  DirectEventHandler,
  Float,
  Int32,
  WithDefault,
} from 'react-native/Libraries/Types/CodegenTypes';

// eslint-disable-next-line @typescript-eslint/ban-types
export type GenericEmptyEvent = Readonly<{}>;

export type LifecycleStateChangeEvent = Readonly<{
  previousState: Int32;
  newState: Int32;
}>;

export type BlurEffect = 
  | 'none'
  | 'extraLight'
  | 'light'
  | 'dark'
  | 'regular'
  | 'prominent'
  | 'systemUltraThinMaterial'
  | 'systemThinMaterial'
  | 'systemMaterial'
  | 'systemThickMaterial'
  | 'systemChromeMaterial'
  | 'systemUltraThinMaterialLight'
  | 'systemThinMaterialLight'
  | 'systemMaterialLight'
  | 'systemThickMaterialLight'
  | 'systemChromeMaterialLight'
  | 'systemUltraThinMaterialDark'
  | 'systemThinMaterialDark'
  | 'systemMaterialDark'
  | 'systemThickMaterialDark'
  | 'systemChromeMaterialDark';

export interface NativeProps extends ViewProps {
  // Events
  onLifecycleStateChange?: DirectEventHandler<LifecycleStateChangeEvent>;
  onWillAppear?: DirectEventHandler<GenericEmptyEvent>;
  onDidAppear?: DirectEventHandler<GenericEmptyEvent>;
  onWillDisappear?: DirectEventHandler<GenericEmptyEvent>;
  onDidDisappear?: DirectEventHandler<GenericEmptyEvent>;

  // Control
  isFocused?: boolean;
  tabKey: string;

  // Tab Bar Appearance
  // tabBarAppearance?: TabBarAppearance; // Does not work due to codegen issue.
  tabBarBackgroundColor?: ColorValue;
  tabBarBlurEffect?: WithDefault<BlurEffect, 'none'>;

  tabBarItemTitleFontFamily?: string;
  tabBarItemTitleFontSize?: Float;
  tabBarItemTitleFontWeight?: string;
  tabBarItemTitleFontStyle?: string;
  tabBarItemTitleFontColor?: ColorValue;
  tabBarItemTitlePositionAdjustment?: {
    horizontal?: Float;
    vertical?: Float;
  };

  tabBarItemIconColor?: ColorValue;

  tabBarItemBadgeBackgroundColor?: ColorValue;

  // General
  title?: string | undefined | null;

  iconSFSymbolName?: string;
  selectedIconSFSymbolName?: string;

  badgeValue?: string;
}

export default codegenNativeComponent<NativeProps>('RNSBottomTabsScreen', {});
