'use client';

import codegenNativeComponent from 'react-native/Libraries/Utilities/codegenNativeComponent';
import type { ColorValue, ViewProps } from 'react-native';
import {
  DirectEventHandler,
  Float,
  Int32,
  WithDefault,
} from 'react-native/Libraries/Types/CodegenTypes';

// @ts-ignore: ImageSource type has been recently added: https://github.com/facebook/react-native/pull/51969
import type { ImageSource } from 'react-native/Libraries/Image/ImageSource';
import { UnsafeMixed } from './codegenUtils';

// iOS-specific: SFSymbol, image as a template usage
export type IconType = 'image' | 'template' | 'sfSymbol';

// eslint-disable-next-line @typescript-eslint/ban-types
type GenericEmptyEvent = Readonly<{}>;

type LifecycleStateChangeEvent = Readonly<{
  previousState: Int32;
  newState: Int32;
}>;

type ItemStateAppearance = {
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
};

type ItemAppearance = {
  normal?: ItemStateAppearance;
  selected?: ItemStateAppearance;
  focused?: ItemStateAppearance;
  disabled?: ItemStateAppearance;
};

type Appearance = {
  stacked?: ItemAppearance;
  inline?: ItemAppearance;
  compactInline?: ItemAppearance;

  tabBarBackgroundColor?: ColorValue;
  tabBarBlurEffect?: WithDefault<BlurEffect, 'systemDefault'>;
};

type BlurEffect =
  | 'none'
  | 'systemDefault'
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

  // General
  title?: string | undefined | null;
  badgeValue?: string;

  // Tab Bar Appearance
  // tabBarAppearance?: TabBarAppearance; // Does not work due to codegen issue.

  // Android-specific
  iconResourceName?: string;
  tabBarItemBadgeTextColor?: ColorValue;

  // iOS-specific
  standardAppearance?: UnsafeMixed<Appearance>;
  scrollEdgeAppearance?: UnsafeMixed<Appearance>;

  iconType?: WithDefault<IconType, 'sfSymbol'>;

  iconImageSource?: ImageSource;
  iconSfSymbolName?: string;

  selectedIconImageSource?: ImageSource;
  selectedIconSfSymbolName?: string;

  specialEffects?: {
    repeatedTabSelection?: {
      popToRoot?: WithDefault<boolean, true>;
      scrollToTop?: WithDefault<boolean, true>;
    };
  };

  overrideScrollViewContentInsetAdjustmentBehavior?: WithDefault<boolean, true>;
}

export default codegenNativeComponent<NativeProps>('RNSBottomTabsScreen', {});
