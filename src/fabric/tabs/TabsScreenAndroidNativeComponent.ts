'use client';

import { codegenNativeComponent } from 'react-native';
import type {
  CodegenTypes as CT,
  ImageSource,
  ProcessedColorValue,
  ViewProps,
} from 'react-native';

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

export type ItemStateAppearance = {
  tabBarItemTitleFontColor?: ProcessedColorValue | null;
  tabBarItemIconColor?: ProcessedColorValue | null;
};

export type Appearance = {
  // TabBar - Appearance
  tabBarBackgroundColor?: ProcessedColorValue | null;

  // TabBarItem - Ripple
  tabBarItemRippleColor?: ProcessedColorValue | null;

  // TabBarItem - Label layout
  tabBarItemLabelVisibilityMode?: CT.WithDefault<
    TabBarItemLabelVisibilityMode,
    'auto'
  >;

  // TabBarItem - State-dependent appearance
  normal?: ItemStateAppearance;
  selected?: ItemStateAppearance;
  focused?: ItemStateAppearance;
  disabled?: ItemStateAppearance;

  // TabBarItem - Active Indicator
  tabBarItemActiveIndicatorColor?: ProcessedColorValue | null;
  tabBarItemActiveIndicatorEnabled?: CT.WithDefault<boolean, true>;

  // TabBarItem - Label
  tabBarItemTitleFontFamily?: string;
  tabBarItemTitleSmallLabelFontSize?: CT.Float;
  tabBarItemTitleLargeLabelFontSize?: CT.Float;
  tabBarItemTitleFontWeight?: string;
  tabBarItemTitleFontStyle?: string;

  // TabBarItem - Badge
  tabBarItemBadgeBackgroundColor?: ProcessedColorValue | null;
  tabBarItemBadgeTextColor?: ProcessedColorValue | null;
};

// #endregion Android-specific helpers

export interface NativeProps extends ViewProps {
  // Events
  onLifecycleStateChange?: CT.DirectEventHandler<LifecycleStateChangeEvent>;
  onWillAppear?: CT.DirectEventHandler<GenericEmptyEvent>;
  onDidAppear?: CT.DirectEventHandler<GenericEmptyEvent>;
  onWillDisappear?: CT.DirectEventHandler<GenericEmptyEvent>;
  onDidDisappear?: CT.DirectEventHandler<GenericEmptyEvent>;

  // Control
  isFocused?: boolean;
  screenKey: string;

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

  // Android-specific props
  // Image handling
  drawableIconResourceName?: string;
  imageIconResource?: ImageSource;
  selectedDrawableIconResourceName?: string;
  selectedImageIconResource?: ImageSource;

  // Appearance
  standardAppearance?: Appearance;
}

export default codegenNativeComponent<NativeProps>('RNSTabsScreenAndroid', {
  excludedPlatforms: ['iOS'],
});
