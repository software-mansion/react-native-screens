import type {
  ColorValue,
  TextStyle,
  NativeSyntheticEvent,
  ViewProps,
} from 'react-native';

export type NativeFocusChangeEvent = {
  tabKey: string;
};

export type BlurEffect =
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

export type TabBarItemLabelVisibilityMode =
  | 'auto'
  | 'selected'
  | 'labeled'
  | 'unlabeled';

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
  // #endregion

  // #region Common appearance
  /**
   * @summary Specifies background color of the entire tab bar.
   *
   * Since iOS 26, it does not affect the tab bar.
   *
   * @platform android, ios
   * @supported iOS 18 or lower
   */
  tabBarBackgroundColor?: ColorValue;
  /**
   * @summary Specifies title font family of every tab item in the tab bar.
   *
   * @platform android, ios
   */
  tabBarItemTitleFontFamily?: TextStyle['fontFamily'];
  /**
   * @summary Specifies title font size of every tab item in the tab bar.
   *
   * @platform android, ios
   */
  tabBarItemTitleFontSize?: TextStyle['fontSize'];
  /**
   * @summary Specifies title font weight of every tab item in the tab bar.
   *
   * @platform android, ios
   */
  tabBarItemTitleFontWeight?: TextStyle['fontWeight'];
  /**
   * @summary Specifies title font style of every tab item in the tab bar.
   *
   * @platform android, ios
   */
  tabBarItemTitleFontStyle?: TextStyle['fontStyle'];
  /**
   * @summary Specifies title font color of every tab item in the tab bar.
   *
   * On iOS, overrides color defined in `tabBarTintColor` and `tabBarItemIconColor`.
   *
   * @platform android, ios
   */
  tabBarItemTitleFontColor?: TextStyle['color'];
  /**
   * @summary Specifies color of the icons for every tab item in the tab bar.
   *
   * On iOS, impacts also title text color.
   *
   * On iOS 26, it only applies to selected tab bar item. Other items
   * adopt a dark or light appearance depending on the theme of the tab bar.
   *
   * On iOS, it is overriden by `tabBarItemTitleFontColor` (for title text color)
   * and it overrides `tabBarTintColor`.
   *
   * @platform android, ios
   */
  tabBarItemIconColor?: ColorValue;
  // #endregion

  // #region Android-only appearance
  tabBarItemTitleFontSizeActive?: TextStyle['fontSize'];
  tabBarItemTitleFontColorActive?: TextStyle['color'];
  tabBarItemIconColorActive?: ColorValue;
  tabBarItemActiveIndicatorColor?: ColorValue;
  tabBarItemActiveIndicatorEnabled?: boolean;
  tabBarItemRippleColor?: ColorValue;
  tabBarItemLabelVisibilityMode?: TabBarItemLabelVisibilityMode;
  // #endregion

  // #region iOS-only appearance
  /**
   * @summary Specifies blur effect applied to tab bar.
   *
   * Works with backgroundColor's alpha < 1.
   *
   * Since iOS 26, it does not affect the tab bar.
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
  tabBarBlurEffect?: BlurEffect;
  /**
   * @summary Specifies title offset of every tab item in the tab bar.
   *
   * Depending on the iOS version and the device's interface orientation,
   * this setting may affect the appearance of the text, badge and icon.
   *
   * @platform ios
   */
  tabBarItemTitlePositionAdjustment?: {
    horizontal?: number;
    vertical?: number;
  };
  /**
   * @summary Specifies background color of badges for every tab item
   * in the tab bar.
   *
   * @platform ios
   */
  tabBarItemBadgeBackgroundColor?: ColorValue;
  /**
   * The color used for selected tab's text and icon color.
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
   * Specifies minimize behavior for the tab bar. Available since
   * iOS 26.
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
   * The supported values correspond to the official UIKit documentaion:
   * @see {@link https://developer.apple.com/documentation/uikit/uitabbarcontroller/minimizebehavior|UITabBarController.MinimizeBehavior}
   *
   * @default Defaults to `automatic`.
   *
   * @platform ios
   * @supported iOS 26 or higher
   */
  tabBarMinimizeBehavior?: TabBarMinimizeBehavior;
  // #endregion

  // #region Control
  // #endregion

  // #region Experimental support
  /**
   * Experimental prop for changing container control.
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
  // #endregion
}
