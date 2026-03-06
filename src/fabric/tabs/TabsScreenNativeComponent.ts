'use client';

import { codegenNativeComponent } from 'react-native';
import type {
  CodegenTypes as CT,
  ImageSource,
  ProcessedColorValue,
  ViewProps,
} from 'react-native';

import { UnsafeMixed } from './codegenUtils';

// iOS-specific: SFSymbol, image as a template usage
export type IconType = 'image' | 'template' | 'sfSymbol' | 'xcasset';

// eslint-disable-next-line @typescript-eslint/ban-types
type GenericEmptyEvent = Readonly<{}>;

type LifecycleStateChangeEvent = Readonly<{
  previousState: CT.Int32;
  newState: CT.Int32;
}>;

export type ItemStateAppearance = {
  tabBarItemTitleFontFamily?: string | undefined;
  tabBarItemTitleFontSize?: CT.Float | undefined;
  tabBarItemTitleFontWeight?: string | undefined;
  tabBarItemTitleFontStyle?: string | undefined;
  tabBarItemTitleFontColor?: ProcessedColorValue | null | undefined;
  tabBarItemTitlePositionAdjustment?:
    | {
        horizontal?: CT.Float;
        vertical?: CT.Float;
      }
    | undefined;
  tabBarItemIconColor?: ProcessedColorValue | null | undefined;
  tabBarItemBadgeBackgroundColor?: ProcessedColorValue | null | undefined;
};

export type ItemAppearance = {
  normal?: ItemStateAppearance | undefined;
  selected?: ItemStateAppearance | undefined;
  focused?: ItemStateAppearance | undefined;
  disabled?: ItemStateAppearance | undefined;
};

export type Appearance = {
  stacked?: ItemAppearance | undefined;
  inline?: ItemAppearance | undefined;
  compactInline?: ItemAppearance | undefined;

  tabBarBackgroundColor?: ProcessedColorValue | null | undefined;
  tabBarShadowColor?: ProcessedColorValue | null | undefined;
  // Note: WithDefault types are NOT modified — adding | undefined crashes codegen
  tabBarBlurEffect?: CT.WithDefault<BlurEffect, 'systemDefault'>;
};

// Note: temporary, will be renamed on splitting tabs components
type TabBarItemLabelVisibilityMode =
  | 'auto'
  | 'selected'
  | 'labeled'
  | 'unlabeled';

// Note: temporary, will be renamed on splitting tabs components
export type ItemStateAppearanceAndroid = {
  tabBarItemTitleFontColor?: ProcessedColorValue | null | undefined;
  tabBarItemIconColor?: ProcessedColorValue | null | undefined;
};

export type AppearanceAndroid = {
  // TabBar - Appearance
  tabBarBackgroundColor?: ProcessedColorValue | null | undefined;

  // TabBarItem - Ripple
  tabBarItemRippleColor?: ProcessedColorValue | null | undefined;

  // TabBarItem - Label layout
  // Note: WithDefault types are NOT modified — adding | undefined crashes codegen
  tabBarItemLabelVisibilityMode?: CT.WithDefault<
    TabBarItemLabelVisibilityMode,
    'auto'
  >;

  // TabBarItem - State-dependent appearance
  normal?: ItemStateAppearanceAndroid | undefined;
  selected?: ItemStateAppearanceAndroid | undefined;
  focused?: ItemStateAppearanceAndroid | undefined;
  disabled?: ItemStateAppearanceAndroid | undefined;

  // TabBarItem - Active Indicator
  tabBarItemActiveIndicatorColor?: ProcessedColorValue | null | undefined;
  // Note: WithDefault types are NOT modified — adding | undefined crashes codegen
  tabBarItemActiveIndicatorEnabled?: CT.WithDefault<boolean, true>;

  // TabBarItem - Label
  tabBarItemTitleFontFamily?: string | undefined;
  tabBarItemTitleSmallLabelFontSize?: CT.Float | undefined;
  tabBarItemTitleLargeLabelFontSize?: CT.Float | undefined;
  tabBarItemTitleFontWeight?: string | undefined;
  tabBarItemTitleFontStyle?: string | undefined;

  // TabBarItem - Badge
  tabBarItemBadgeBackgroundColor?: ProcessedColorValue | null | undefined;
  tabBarItemBadgeTextColor?: ProcessedColorValue | null | undefined;
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

  // Accessibility
  tabBarItemTestID?: string;
  tabBarItemAccessibilityLabel?: string;

  // Currently iOS-only
  orientation?: CT.WithDefault<Orientation, 'inherit'>;

  // Android-specific image handling
  drawableIconResourceName?: string;
  imageIconResource?: ImageSource;

  selectedDrawableIconResourceName?: string;
  selectedImageIconResource?: ImageSource;

  // Android-specific appearance
  // Note: temporary standardAppearanceAndroid, suffix will be dropped after splitting components
  standardAppearanceAndroid?: AppearanceAndroid;

  // iOS-specific appearance
  standardAppearance?: UnsafeMixed<Appearance>;
  scrollEdgeAppearance?: UnsafeMixed<Appearance>;

  iconType?: CT.WithDefault<IconType, 'sfSymbol'>;

  iconImageSource?: ImageSource;
  iconResourceName?: string;

  selectedIconImageSource?: ImageSource;
  selectedIconResourceName?: string;

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

export default codegenNativeComponent<NativeProps>('RNSTabsScreen', {});
