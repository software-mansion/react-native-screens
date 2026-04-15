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

// #endregion General helpers

// #region iOS-specific helpers

// iOS-specific: SFSymbol, image as a template usage
export type IconType = 'image' | 'template' | 'sfSymbol' | 'xcasset';

export type ItemStateAppearance = {
  tabBarItemTitleFontFamily?: string | undefined;
  tabBarItemTitleFontSize?: CT.Float | undefined;
  tabBarItemTitleFontWeight?: string | undefined;
  tabBarItemTitleFontStyle?: string | undefined;
  tabBarItemTitleFontColor?: ProcessedColorValue | null | undefined;
  tabBarItemTitlePositionAdjustment?:
    | {
        horizontal?: CT.Float | undefined;
        vertical?: CT.Float | undefined;
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
  tabBarBlurEffect?: CT.WithDefault<BlurEffect, 'systemDefault'> | undefined;
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

// #endregion iOS-specific helpers

export interface NativeProps extends ViewProps {
  // Events
  onWillAppear?: CT.DirectEventHandler<GenericEmptyEvent> | undefined;
  onDidAppear?: CT.DirectEventHandler<GenericEmptyEvent> | undefined;
  onWillDisappear?: CT.DirectEventHandler<GenericEmptyEvent> | undefined;
  onDidDisappear?: CT.DirectEventHandler<GenericEmptyEvent> | undefined;

  // Control
  screenKey: string;
  preventNativeSelection?: CT.WithDefault<boolean, false> | undefined;

  // General
  title?: string | undefined | null;
  badgeValue?: string | undefined;
  orientation?: CT.WithDefault<Orientation, 'inherit'> | undefined;

  // Accessibility
  tabBarItemTestID?: string | undefined;
  tabBarItemAccessibilityLabel?: string | undefined;

  // Effects
  specialEffects?:
    | {
        repeatedTabSelection?:
          | {
              popToRoot?: CT.WithDefault<boolean, true> | undefined;
              scrollToTop?: CT.WithDefault<boolean, true> | undefined;
            }
          | undefined;
      }
    | undefined;

  // iOS-specific props
  // Tab config
  isTitleUndefined?: CT.WithDefault<boolean, true> | undefined;
  systemItem?: CT.WithDefault<SystemItem, 'none'> | undefined;

  // Appearance
  standardAppearance?: UnsafeMixed<Appearance> | undefined;
  scrollEdgeAppearance?: UnsafeMixed<Appearance> | undefined;

  // Icons
  iconType?: CT.WithDefault<IconType, 'sfSymbol'> | undefined;
  iconImageSource?: ImageSource | undefined;
  iconResourceName?: string | undefined;
  selectedIconImageSource?: ImageSource | undefined;
  selectedIconResourceName?: string | undefined;

  // ScrollView interactions
  overrideScrollViewContentInsetAdjustmentBehavior?:
    | CT.WithDefault<boolean, true>
    | undefined;
  bottomScrollEdgeEffect?:
    | CT.WithDefault<ScrollEdgeEffect, 'automatic'>
    | undefined;
  leftScrollEdgeEffect?:
    | CT.WithDefault<ScrollEdgeEffect, 'automatic'>
    | undefined;
  rightScrollEdgeEffect?:
    | CT.WithDefault<ScrollEdgeEffect, 'automatic'>
    | undefined;
  topScrollEdgeEffect?:
    | CT.WithDefault<ScrollEdgeEffect, 'automatic'>
    | undefined;

  // Experimental
  userInterfaceStyle?:
    | CT.WithDefault<UserInterfaceStyle, 'unspecified'>
    | undefined;
}

export default codegenNativeComponent<NativeProps>('RNSTabsScreenIOS', {
  excludedPlatforms: ['android'],
});
