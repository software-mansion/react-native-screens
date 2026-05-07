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

// #endregion General helpers

// #region Android-specific helpers

type TabBarItemLabelVisibilityMode =
  | 'auto'
  | 'selected'
  | 'labeled'
  | 'unlabeled';

export type ItemStateAppearance = {
  tabBarItemTitleFontColor?: ProcessedColorValue | null | undefined;
  tabBarItemIconColor?: ProcessedColorValue | null | undefined;
};

export type Appearance = {
  // TabBar - Appearance
  tabBarBackgroundColor?: ProcessedColorValue | null | undefined;

  // TabBarItem - Ripple
  tabBarItemRippleColor?: ProcessedColorValue | null | undefined;

  // TabBarItem - Label layout
  tabBarItemLabelVisibilityMode?: CT.WithDefault<
    TabBarItemLabelVisibilityMode,
    'auto'
  >;

  // TabBarItem - State-dependent appearance
  normal?: ItemStateAppearance | undefined;
  selected?: ItemStateAppearance | undefined;
  focused?: ItemStateAppearance | undefined;
  disabled?: ItemStateAppearance | undefined;

  // TabBarItem - Active Indicator
  tabBarItemActiveIndicatorColor?: ProcessedColorValue | null | undefined;
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

// #endregion Android-specific helpers

export interface NativeProps extends ViewProps {
  // Events
  onWillAppear?: CT.DirectEventHandler<GenericEmptyEvent> | undefined;
  onDidAppear?: CT.DirectEventHandler<GenericEmptyEvent> | undefined;
  onWillDisappear?: CT.DirectEventHandler<GenericEmptyEvent> | undefined;
  onDidDisappear?: CT.DirectEventHandler<GenericEmptyEvent> | undefined;

  // Control
  screenKey: string;
  preventNativeSelection?: CT.WithDefault<boolean, false>;

  // General
  title?: string | undefined | null;
  badgeValue?: string | undefined;

  // Accessibility
  tabBarItemTestID?: string | undefined;
  tabBarItemAccessibilityLabel?: string | undefined;

  // Effects
  specialEffects?:
    | {
        repeatedTabSelection?:
          | {
              popToRoot?: CT.WithDefault<boolean, true>;
              scrollToTop?: CT.WithDefault<boolean, true>;
            }
          | undefined;
      }
    | undefined;

  // Android-specific props
  // Image handling
  drawableIconResourceName?: string | undefined;
  imageIconResource?: ImageSource | undefined;
  selectedDrawableIconResourceName?: string | undefined;
  selectedImageIconResource?: ImageSource | undefined;

  // Appearance
  standardAppearance?: Appearance | undefined;
}

export default codegenNativeComponent<NativeProps>('RNSTabsScreenAndroid', {
  excludedPlatforms: ['iOS'],
});
