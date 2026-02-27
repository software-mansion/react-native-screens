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

type TabBarItemLabelVisibilityMode =
  | 'auto'
  | 'selected'
  | 'labeled'
  | 'unlabeled';

export type Appearance = {
  tabBarBackgroundColor?: ProcessedColorValue | null;
  tabBarItemRippleColor?: ProcessedColorValue | null;
  tabBarItemLabelVisibilityMode?: CT.WithDefault<
    TabBarItemLabelVisibilityMode,
    'auto'
  >;

  tabBarItemStatesColors?: ItemAppearance;
  tabBarActiveIndicatorAppearance?: TabBarActiveIndicatorAppearance;
  tabBarItemTitleTypography?: TabBarItemTitleTypographyAppearance;
  tabBarItemBadgeAppearance?: TabBarItemBadgeAppearance;
};

type ItemAppearance = {
  normal?: ItemStateAppearance;
  selected?: ItemStateAppearance;
  focused?: ItemStateAppearance;
  disabled?: ItemStateAppearance;
};

type ItemStateAppearance = {
  tabBarItemIconColor?: ProcessedColorValue | null;
  tabBarItemTitleColor?: ProcessedColorValue | null;
};

type TabBarActiveIndicatorAppearance = {
  tabBarActiveIndicatorColor?: ProcessedColorValue | null;
  tabBarActiveIndicatorEnabled?: CT.WithDefault<boolean, true>;
};

type TabBarItemTitleTypographyAppearance = {
  tabBarItemTitleFontFamily?: string;
  tabBarItemTitleFontSizeSmall?: CT.Float;
  tabBarItemTitleFontSizeLarge?: CT.Float;
  tabBarItemTitleFontWeight?: string;
  tabBarItemTitleFontStyle?: string;
};

type TabBarItemBadgeAppearance = {
  tabBarItemBadgeTextColor?: ProcessedColorValue | null;
  tabBarItemBadgeBackgroundColor?: ProcessedColorValue | null;
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
  standardAppearance?: UnsafeMixed<Appearance>;

  // #endregion Android-specific Props
}

export default codegenNativeComponent<NativeProps>('RNSTabsScreenAndroid', {
  excludedPlatforms: ['iOS'],
});
