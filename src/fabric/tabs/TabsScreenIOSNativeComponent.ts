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

type UserInterfaceStyleIOS = 'unspecified' | 'light' | 'dark';

type BlurEffectIOS =
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

type OrientationIOS =
  | 'inherit'
  | 'all'
  | 'allButUpsideDown'
  | 'portrait'
  | 'portraitUp'
  | 'portraitDown'
  | 'landscape'
  | 'landscapeLeft'
  | 'landscapeRight';

type SystemItemIOS =
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

type ScrollEdgeEffectIOS = 'automatic' | 'hard' | 'soft' | 'hidden';

export type IconTypeIOS = 'image' | 'template' | 'sfSymbol' | 'xcasset';

export type AppearanceIOS = {
  stacked?: ItemAppearanceIOS;
  inline?: ItemAppearanceIOS;
  compactInline?: ItemAppearanceIOS;

  tabBarBackgroundColor?: ProcessedColorValue | null;
  tabBarShadowColor?: ProcessedColorValue | null;
  tabBarBlurEffect?: CT.WithDefault<BlurEffectIOS, 'systemDefault'>;
};

export type ItemAppearanceIOS = {
  normal?: ItemStateAppearanceIOS;
  selected?: ItemStateAppearanceIOS;
  focused?: ItemStateAppearanceIOS;
  disabled?: ItemStateAppearanceIOS;
};

export type ItemStateAppearanceIOS = {
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
  isTitleUndefined?: CT.WithDefault<boolean, true>;
  orientation?: CT.WithDefault<OrientationIOS, 'inherit'>;
  systemItem?: CT.WithDefault<SystemItemIOS, 'none'>;

  // Appearance
  standardAppearance?: UnsafeMixed<AppearanceIOS>;
  scrollEdgeAppearance?: UnsafeMixed<AppearanceIOS>;

  // Icons
  iconType?: CT.WithDefault<IconTypeIOS, 'sfSymbol'>;
  iconImageSource?: ImageSource;
  iconResourceName?: string;
  selectedIconImageSource?: ImageSource;
  selectedIconResourceName?: string;

  // ScrollView interactions
  overrideScrollViewContentInsetAdjustmentBehavior?: CT.WithDefault<
    boolean,
    true
  >;
  bottomScrollEdgeEffect?: CT.WithDefault<ScrollEdgeEffectIOS, 'automatic'>;
  leftScrollEdgeEffect?: CT.WithDefault<ScrollEdgeEffectIOS, 'automatic'>;
  rightScrollEdgeEffect?: CT.WithDefault<ScrollEdgeEffectIOS, 'automatic'>;
  topScrollEdgeEffect?: CT.WithDefault<ScrollEdgeEffectIOS, 'automatic'>;

  // Experimental
  userInterfaceStyle?: CT.WithDefault<UserInterfaceStyleIOS, 'unspecified'>;

  // #endregion iOS-specific Props
}

export default codegenNativeComponent<NativeProps>('RNSTabsScreenIOS', {
  excludedPlatforms: ['android'],
});
