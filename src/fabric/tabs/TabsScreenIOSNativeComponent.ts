'use client';

import { codegenNativeComponent } from 'react-native';
import type {
  CodegenTypes as CT,
  ImageSource,
  ProcessedColorValue,
  ViewProps,
} from 'react-native';

import { UnsafeMixed } from './codegenUtils';

// #region General helpers

// eslint-disable-next-line @typescript-eslint/ban-types
type GenericEmptyEvent = Readonly<{}>;

type LifecycleStateChangeEvent = Readonly<{
  previousState: CT.Int32;
  newState: CT.Int32;
}>;

// #endregion General helpers

// #region iOS-specific helpers

type UserInterfaceStyle = 'unspecified' | 'light' | 'dark';

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

export type IconType = 'image' | 'template' | 'sfSymbol' | 'xcasset';

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

// #endregion iOS-specific helpers

export interface NativeProps extends ViewProps {
  // #region Common Props

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

  // Accessibility
  tabBarItemTestID?: string;
  tabBarItemAccessibilityLabel?: string;

  // Effects
  specialEffects?: {
    repeatedTabSelection?: {
      popToRoot?: CT.WithDefault<boolean, true>;
      scrollToTop?: CT.WithDefault<boolean, true>;
    };
  };

  // #endregion Common Props

  // #region iOS-specific Props

  // Tab Config
  orientation?: CT.WithDefault<Orientation, 'inherit'>;
  systemItem?: CT.WithDefault<SystemItem, 'none'>;

  // Appearance
  standardAppearance?: UnsafeMixed<Appearance>;
  scrollEdgeAppearance?: UnsafeMixed<Appearance>;

  // Icons
  iconType?: CT.WithDefault<IconType, 'sfSymbol'>;
  iconImageSource?: ImageSource;
  iconResourceName?: string;
  selectedIconImageSource?: ImageSource;
  selectedIconResourceName?: string;

  // ScrollView interactions
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

  // #endregion iOS-specific Props
}

export default codegenNativeComponent<NativeProps>('RNSTabsScreenIOS', {
  excludedPlatforms: ['android'],
});
