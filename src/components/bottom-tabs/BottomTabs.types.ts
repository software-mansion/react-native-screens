import { ReactNode } from 'react';
import type {
  ColorValue,
  TextStyle,
  NativeSyntheticEvent,
  ViewProps,
} from 'react-native';
import type { BottomTabsAccessoryEnvironment } from './BottomTabsAccessory.types';

export type BottomAccessoryFn = (
  environment: BottomTabsAccessoryEnvironment,
) => ReactNode;

export type NativeFocusChangeEvent = {
  tabKey: string;
  repeatedSelectionHandledBySpecialEffect: boolean;
};

// Android-specific
export type TabBarItemLabelVisibilityMode =
  | 'auto'
  | 'selected'
  | 'labeled'
  | 'unlabeled';

// iOS-specific
export type TabBarMinimizeBehavior =
  | 'automatic'
  | 'never'
  | 'onScrollDown'
  | 'onScrollUp';

// iOS-specific
export type TabBarControllerMode = 'automatic' | 'tabBar' | 'tabSidebar';

export interface BottomTabsProps extends ViewProps {
  // #region Events
  /**
   * A callback that gets invoked when user requests change of focused tab screen.
   *
   * @platform android, ios
   */
  onNativeFocusChange?: (
    event: NativeSyntheticEvent<NativeFocusChangeEvent>,
  ) => void;
  // #endregion Events

  // #region General
  /**
   * @summary Hides the tab bar.
   *
   * @default false
   *
   * @platform android, ios
   */
  tabBarHidden?: boolean;
  // #endregion General

  // #region Android-only
  /**
   * @summary Specifies the background color for the entire tab bar.
   *
   * @platform android
   */
  tabBarBackgroundColor?: ColorValue;
  /**
   * @summary Specifies the font family used for the title of each tab bar item.
   *
   * @platform android
   */
  tabBarItemTitleFontFamily?: TextStyle['fontFamily'];
  /**
   * @summary Specifies the font size used for the title of each tab bar item.
   *
   * The size is represented in scale-independent pixels (sp).
   *
   * @platform android
   */
  tabBarItemTitleFontSize?: TextStyle['fontSize'];
  /**
   * @summary Specifies the font size used for the title of each tab bar item in active state.
   *
   * The size is represented in scale-independent pixels (sp).
   *
   * @platform android
   */
  tabBarItemTitleFontSizeActive?: TextStyle['fontSize'];
  /**
   * @summary Specifies the font weight used for the title of each tab bar item.
   *
   * @platform android
   */
  tabBarItemTitleFontWeight?: TextStyle['fontWeight'];
  /**
   * @summary Specifies the font style used for the title of each tab bar item.
   *
   * @platform android
   */
  tabBarItemTitleFontStyle?: TextStyle['fontStyle'];
  /**
   * @summary Specifies the font color used for the title of each tab bar item.
   *
   * @platform android
   */
  tabBarItemTitleFontColor?: TextStyle['color'];
  /**
   * @summary Specifies the font color used for the title of each tab bar item in active state.
   *
   * If not provided, `tabBarItemTitleFontColor` is used.
   *
   * @platform android
   */
  tabBarItemTitleFontColorActive?: TextStyle['color'];
  /**
   * @summary Specifies the icon color for each tab bar item.
   *
   * @platform android
   */
  tabBarItemIconColor?: ColorValue;
  /**
   * @summary Specifies the icon color for each tab bar item in active state.
   *
   * If not provided, `tabBarItemIconColor` is used.
   *
   * @platform android
   */
  tabBarItemIconColorActive?: ColorValue;
  /**
   * @summary Specifies the background color of the active indicator.
   *
   * @platform android
   */
  tabBarItemActiveIndicatorColor?: ColorValue;
  /**
   * @summary Specifies if the active indicator should be used.
   *
   * @default true
   *
   * @platform android
   */
  tabBarItemActiveIndicatorEnabled?: boolean;
  /**
   * @summary Specifies the color of each tab bar item's ripple effect.
   *
   * @platform android
   */
  tabBarItemRippleColor?: ColorValue;
  /**
   * @summary Specifies the label visibility mode.
   *
   * The label visibility mode defines when the labels of each item bar should be displayed.
   *
   * The following values are available:
   * - `auto` - the label behaves as in “labeled” mode when there are 3 items or less, or as in “selected” mode when there are 4 items or more
   * - `selected` - the label is only shown on the selected navigation item
   * - `labeled` - the label is shown on all navigation items
   * - `unlabeled` - the label is hidden for all navigation items
   *
   * The supported values correspond to the official Material Components documentation:
   * @see {@link https://github.com/material-components/material-components-android/blob/master/docs/components/BottomNavigation.md#making-navigation-bar-accessible|Material Components documentation}
   *
   * @default auto
   *
   * @platform android
   */
  tabBarItemLabelVisibilityMode?: TabBarItemLabelVisibilityMode;
  // #endregion Android-only

  // #region iOS-only
  /**
   * @summary Specifies the color used for selected tab's text and icon color.
   *
   * Starting from iOS 26, it also impacts glow of Liquid Glass tab
   * selection view.
   *
   * `tabBarItemTitleFontColor` and `tabBarItemIconColor` defined on
   * BottomTabsScreen component override this color.
   *
   * @platform ios
   */
  tabBarTintColor?: ColorValue;
  /**
   * @summary Specifies the minimize behavior for the tab bar.
   *
   * Available starting from iOS 26.
   *
   * The following values are currently supported:
   *
   * - `automatic` - resolves to the system default minimize behavior
   * - `never` - the tab bar does not minimize
   * - `onScrollDown` - the tab bar minimizes when scrolling down and
   *   expands when scrolling back up
   * - `onScrollUp` - the tab bar minimizes when scrolling up and expands
   *   when scrolling back down
   *
   * The supported values correspond to the official UIKit documentation:
   * @see {@link https://developer.apple.com/documentation/uikit/uitabbarcontroller/minimizebehavior|UITabBarController.MinimizeBehavior}
   *
   * @default Defaults to `automatic`.
   *
   * @platform ios
   * @supported iOS 26 or higher
   */
  tabBarMinimizeBehavior?: TabBarMinimizeBehavior;
  /**
   * @summary Specifies component used as bottom accessory.
   *
   * This prop is a function that accepts `environment` as a parameter and returns
   * the component that will be rendered in the bottom accessory.
   *
   * `environment` can be one of the following values:
   *
   * - `regular` - the accessory is laid out above the bottom tab bar,
   * - `inline` - the accessory is laid out inline with the collapsed bottom
   *   tab bar.
   *
   * If this prop is `undefined`, the bottom accessory will not be rendered.
   *
   * On legacy architecture (Paper) and on new architecture (Fabric) with RN < 0.82,
   * implementation uses DisplayLink which might result in the size of bottom
   * accessory being updated with a delay.
   *
   * Starting from RN 0.82, this issue is mitigated but in order to allow accessory
   * rendering based on environment, component is rendered 2 times for both `regular`
   * and `inline` environments at the same time. Environment determines which component
   * is visible at given moment. This might require implementing a solution to share
   * state between both rendered components (e.g. usage of context).
   *
   * Available starting from iOS 26.
   *
   * @platform iOS
   * @supported iOS 26 or higher
   */
  bottomAccessory?: BottomAccessoryFn;
  /**
   * @summary Specifies the display mode for the tab bar.
   *
   * Available starting from iOS 18.
   * Not supported on tvOS.
   *
   * The following values are currently supported:
   *
   * - `automatic` - the system sets the display mode based on the tab’s content
   * - `tabBar` - the system displays the content only as a tab bar
   * - `tabSidebar` - the tab bar is displayed as a sidebar
   *
   * See the official documentation for more details:
   * @see {@link https://developer.apple.com/documentation/uikit/uitabbarcontroller/mode|UITabBarController.Mode}
   *
   * @default Defaults to `automatic`.
   *
   * @platform ios
   * @supported iOS 18 or higher
   */
  tabBarControllerMode?: TabBarControllerMode;
  // #endregion iOS-only

  // #region Experimental support
  /**
   * @summary Experimental prop for changing container control.
   *
   * If set to true, tab screen changes need to be handled by JS using
   * onNativeFocusChange callback (controlled/programatically-driven).
   *
   * If set to false, tab screen change will not be prevented by the
   * native side (managed/natively-driven).
   *
   * On Android, only controlled tabs are currently supported and the
   * value of this prop is ignored.
   *
   * @default Defaults to `false`.
   *
   * @platform android, ios
   */
  experimentalControlNavigationStateInJS?: boolean;
  // #endregion Experimental support
}
