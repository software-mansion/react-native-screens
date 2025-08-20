'use client';

import { codegenNativeComponent } from 'react-native';
import type {
  ColorValue,
  ImageSource,
  ProcessedColorValue,
  ViewProps,
} from 'react-native';
import {
  DirectEventHandler,
  Float,
  Int32,
  WithDefault,
} from 'react-native/Libraries/Types/CodegenTypes';

import { UnsafeMixed } from './codegenUtils';

// iOS-specific: SFSymbol, image as a template usage
export type IconType = 'image' | 'template' | 'sfSymbol';

// eslint-disable-next-line @typescript-eslint/ban-types
type GenericEmptyEvent = Readonly<{}>;

type LifecycleStateChangeEvent = Readonly<{
  previousState: Int32;
  newState: Int32;
}>;

export type ItemStateAppearance = {
  tabBarItemTitleFontFamily?: string;
  tabBarItemTitleFontSize?: Float;
  tabBarItemTitleFontWeight?: string;
  tabBarItemTitleFontStyle?: string;
  tabBarItemTitleFontColor?: ProcessedColorValue | null;
  tabBarItemTitlePositionAdjustment?: {
    horizontal?: Float;
    vertical?: Float;
  };
  tabBarItemIconColor?: ProcessedColorValue | null;
  tabBarItemBadgeBackgroundColor?: ProcessedColorValue | null;
};

export type ItemAppearance = {
  normal?: ItemStateAppearance;
  selected?: ItemStateAppearance;
  focused?: ItemStateAppearance;
  disabled?: ItemStateAppearance;
};

export type Appearance = {
  stacked?: ItemAppearance;
  inline?: ItemAppearance;
  compactInline?: ItemAppearance;

  tabBarBackgroundColor?: ProcessedColorValue | null;
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

type Orientation =
  | 'inherit'
  | 'all'
  | 'allButUpsideDown'
  | 'portrait'
  | 'portraitUp'
  | 'portraitDown'
  | 'landscape'
  | 'landscapeLeft'
  | 'landscapeRight';

type SystemItem =
  | 'none'
  | 'bookmarks'
  | 'contacts'
  | 'downloads'
  | 'favorites'
  | 'featured'
  | 'history'
  | 'more'
  | 'mostRecent'
  | 'mostViewed'
  | 'recents'
  | 'search'
  | 'topRated';

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

  // Currently iOS-only
  orientation?: WithDefault<Orientation, 'inherit'>;

  // Android-specific image handling
  iconResourceName?: string;
  iconResource?: ImageSource;
  tabBarItemBadgeTextColor?: ColorValue;
  tabBarItemBadgeBackgroundColor?: ColorValue;

  // iOS-specific
  standardAppearance?: UnsafeMixed<Appearance>;
  scrollEdgeAppearance?: UnsafeMixed<Appearance>;

  iconType?: WithDefault<IconType, 'sfSymbol'>;

  iconImageSource?: ImageSource;
  iconSfSymbolName?: string;

  selectedIconImageSource?: ImageSource;
  selectedIconSfSymbolName?: string;

  systemItem?: WithDefault<SystemItem, 'none'>;

  specialEffects?: {
    repeatedTabSelection?: {
      popToRoot?: WithDefault<boolean, true>;
      scrollToTop?: WithDefault<boolean, true>;
    };
  };

  overrideScrollViewContentInsetAdjustmentBehavior?: WithDefault<boolean, true>;
}

export default codegenNativeComponent<NativeProps>('RNSBottomTabsScreen', {});
