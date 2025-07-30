import type {
  ColorValue,
  TextStyle,
  NativeSyntheticEvent,
  ViewProps,
} from 'react-native';

export type NativeFocusChangeEvent = {
  tabKey: string;
};

// iOS-specific
export type BottomTabsBlurEffect =
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

  // #region Common appearance
  /**
   * @summary Specifies the background color for the entire tab bar.
   *
   * This property does not affect the tab bar starting from iOS 26.
   *
   * @platform android, ios
   * @supported iOS 18 or lower
   */
  tabBarBackgroundColor?: ColorValue;
  /**
   * @summary Specifies the font family used for the title of each tab bar item.
   *
   * @platform android, ios
   */
  tabBarItemTitleFontFamily?: TextStyle['fontFamily'];
  /**
   * @summary Specifies the font size used for the title of each tab bar item.
   *
   * On Android, the size is represented in scale-independent pixels (sp).
   *
   * @platform android, ios
   */
  tabBarItemTitleFontSize?: TextStyle['fontSize'];
  /**
   * @summary Specifies the font weight used for the title of each tab bar item.
   *
   * @platform android, ios
   */
  tabBarItemTitleFontWeight?: TextStyle['fontWeight'];
  /**
   * @summary Specifies the font style used for the title of each tab bar item.
   *
   * @platform android, ios
   */
  tabBarItemTitleFontStyle?: TextStyle['fontStyle'];
  /**
   * @summary Specifies the font color used for the title of each tab bar item.
   *
   * On iOS, overrides color defined in `tabBarTintColor` and `tabBarItemIconColor`.
   *
   * @platform android, ios
   */
  tabBarItemTitleFontColor?: TextStyle['color'];
  /**
   * @summary Specifies the icon color for each tab bar item.
   *
   * On iOS, this also impacts the title text color.
   *
   * Starting from iOS 26, it only applies to selected tab bar item. Other items
   * adopt a dark or light appearance depending on the theme of the tab bar.
   *
   * On iOS, it is overridden by `tabBarItemTitleFontColor` (for title text color)
   * and it overrides `tabBarTintColor`.
   *
   * @platform android, ios
   */
  tabBarItemIconColor?: ColorValue;
  // #endregion Common appearance

  // #region Android-only appearance
  /**
   * @summary Specifies the font size used for the title of each tab bar item in active state.
   *
   * The size is represented in scale-independent pixels (sp).
   *
   * @platform android
   */
  tabBarItemTitleFontSizeActive?: TextStyle['fontSize'];
  /**
   * @summary Specifies the font color used for the title of each tab bar item in active state.
   *
   * If not provided, `tabBarItemTitleFontColor` is used.
   *
   * @platform android
   */
  tabBarItemTitleFontColorActive?: TextStyle['color'];
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
   * @platform android
   */
  tabBarItemLabelVisibilityMode?: TabBarItemLabelVisibilityMode;
  // #endregion Android-only appearance

  // #region iOS-only appearance
  /**
   * @summary Specifies the blur effect applied to the tab bar.
   *
   * Works with backgroundColor's alpha < 1.
   *
   * This property does not affect the tab bar starting from iOS 26.
   *
   * The following values are currently supported:
   *
   * - `none` - disables blur effect
   * - `systemDefault` - uses UIKit's default tab bar blur effect
   * - one of styles mapped from UIKit's UIBlurEffectStyle, e.g. `systemUltraThinMaterial`
   *
   * Complete list of possible blur effect styles is available in the official UIKit documentation:
   * @see {@link https://developer.apple.com/documentation/uikit/uiblureffect/style|UIBlurEffect.Style}
   *
   * @default systemDefault
   *
   * @platform ios
   * @supported iOS 18 or lower
   */
  tabBarBlurEffect?: BottomTabsBlurEffect;
  /**
   * @summary Specifies the title offset for each tab bar item.
   *
   * Depending on the iOS version and the device's interface orientation,
   * this setting may affect the alignment of the text, badge and icon.
   *
   * @platform ios
   */
  tabBarItemTitlePositionAdjustment?: {
    horizontal?: number;
    vertical?: number;
  };
  /**
   * @summary Specifies the background color of badges for each tab bar item.
   *
   * @platform ios
   */
  tabBarItemBadgeBackgroundColor?: ColorValue;
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
  // #endregion iOS-only appearance

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
   * On iOS, some features are not fully implemented for managed tabs
   * (e.g. overrideScrollViewContentInsetAdjustmentBehavior).
   *
   * On Android, only controlled tabs are currently supported.
   *
   * @default Defaults to `false`.
   *
   * @platform android, ios
   */
  experimentalControlNavigationStateInJS?: boolean;
  // #endregion Experimental support
}
