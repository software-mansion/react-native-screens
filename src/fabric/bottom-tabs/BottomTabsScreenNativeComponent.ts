'use client';

import { codegenNativeComponent } from 'react-native';
import type {
  CodegenTypes as CT,
  ColorValue,
  ImageSource,
  ProcessedColorValue,
  ViewProps,
} from 'react-native';

import { UnsafeMixed } from './codegenUtils';

// iOS-specific: SFSymbol, image as a template usage
export type IconType = 'image' | 'template' | 'sfSymbol';

// eslint-disable-next-line @typescript-eslint/ban-types
type GenericEmptyEvent = Readonly<{}>;

type LifecycleStateChangeEvent = Readonly<{
  previousState: CT.Int32;
  newState: CT.Int32;
}>;

export type ItemStateAppearance = {
  tabBarItemTitleFontFamily?: string;
  tabBarItemTitleFontSize?: CT.Float;
  tabBarItemTitleFontWeight?: string;
  tabBarItemTitleFontStyle?: string;
  tabBarItemTitleFontColor?: ProcessedColorValue | null;
  tabBarItemTitlePositionAdjustment?: {
    horizontal?: CT.Float;
    vertical?: CT.Float;
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
  tabBarShadowColor?: ProcessedColorValue | null;
  tabBarBlurEffect?: CT.WithDefault<BlurEffect, 'systemDefault'>;
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

type ScrollEdgeEffect = 'automatic' | 'hard' | 'soft' | 'hidden';

type UserInterfaceStyle = 'unspecified' | 'light' | 'dark';

export interface NativeProps extends ViewProps {
  // Events
  onLifecycleStateChange?: CT.DirectEventHandler<LifecycleStateChangeEvent>;
  onWillAppear?: CT.DirectEventHandler<GenericEmptyEvent>;
  onDidAppear?: CT.DirectEventHandler<GenericEmptyEvent>;
  onWillDisappear?: CT.DirectEventHandler<GenericEmptyEvent>;
  onDidDisappear?: CT.DirectEventHandler<GenericEmptyEvent>;

  // Control
  isFocused?: boolean;
  tabKey: string;

  // General
  title?: string | undefined | null;
  isTitleUndefined?: CT.WithDefault<boolean, true>;
  badgeValue?: string;

  // Currently iOS-only
  orientation?: CT.WithDefault<Orientation, 'inherit'>;

  // Android-specific image handling
  drawableIconResourceName?: string;
  imageIconResource?: ImageSource;
  tabBarItemBadgeTextColor?: ColorValue;
  tabBarItemBadgeBackgroundColor?: ColorValue;

  // iOS-specific
  standardAppearance?: UnsafeMixed<Appearance>;
  scrollEdgeAppearance?: UnsafeMixed<Appearance>;

  iconType?: CT.WithDefault<IconType, 'sfSymbol'>;

  iconImageSource?: ImageSource;
  iconSfSymbolName?: string;

  selectedIconImageSource?: ImageSource;
  selectedIconSfSymbolName?: string;

  systemItem?: CT.WithDefault<SystemItem, 'none'>;

  specialEffects?: {
    repeatedTabSelection?: {
      popToRoot?: CT.WithDefault<boolean, true>;
      scrollToTop?: CT.WithDefault<boolean, true>;
    };
  };

  overrideScrollViewContentInsetAdjustmentBehavior?: CT.WithDefault<
    boolean,
    true
  >;

  bottomScrollEdgeEffect?: CT.WithDefault<ScrollEdgeEffect, 'automatic'>;
  leftScrollEdgeEffect?: CT.WithDefault<ScrollEdgeEffect, 'automatic'>;
  rightScrollEdgeEffect?: CT.WithDefault<ScrollEdgeEffect, 'automatic'>;
  topScrollEdgeEffect?: CT.WithDefault<ScrollEdgeEffect, 'automatic'>;

  // Experimental
  userInterfaceStyle?: CT.WithDefault<UserInterfaceStyle, 'unspecified'>;
}

export default codegenNativeComponent<NativeProps>('RNSBottomTabsScreen', {});
