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

// #region Android-specific helpers

type TabBarItemLabelVisibilityModeAndroid =
  | 'auto'
  | 'selected'
  | 'labeled'
  | 'unlabeled';

export type AppearanceAndroid = {
  tabBarBackgroundColor?: ProcessedColorValue | null;
  tabBarItemRippleColor?: ProcessedColorValue | null;
  tabBarItemLabelVisibilityMode?: CT.WithDefault<
    TabBarItemLabelVisibilityModeAndroid,
    'auto'
  >;

  itemColors?: BottomNavItemColorsAndroid;
  activeIndicator?: ActiveIndicatorAppearanceAndroid;
  typography?: TypographyAppearanceAndroid;
  badge?: BadgeAppearanceAndroid;
};

export type ItemStateColorsAndroid = {
  iconColor?: ProcessedColorValue | null;
  titleColor?: ProcessedColorValue | null;
};

export type BottomNavItemColorsAndroid = {
  normal?: ItemStateColorsAndroid;
  selected?: ItemStateColorsAndroid;
  focused?: ItemStateColorsAndroid;
  disabled?: ItemStateColorsAndroid;
};

export type ActiveIndicatorAppearanceAndroid = {
  color?: ProcessedColorValue | null;
  enabled?: CT.WithDefault<boolean, true>;
};

export type TypographyAppearanceAndroid = {
  fontFamily?: string;
  fontSizeSmall?: CT.Float;
  fontSizeLarge?: CT.Float;
  fontWeight?: string;
  fontStyle?: string;
};

export type BadgeAppearanceAndroid = {
  textColor?: ProcessedColorValue | null;
  backgroundColor?: ProcessedColorValue | null;
};

// #endregion Android-specific helpers

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

  // #region Android-specific Props

  // Image handling
  drawableIconResourceName?: string;
  imageIconResource?: ImageSource;
  selectedDrawableIconResourceName?: string;
  selectedImageIconResource?: ImageSource;

  // Appearance
  standardAppearance?: UnsafeMixed<AppearanceAndroid>;

  // #endregion Android-specific Props
}

export default codegenNativeComponent<NativeProps>('RNSTabsScreenAndroid', {
  excludedPlatforms: ['iOS'],
});
