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

  tabBarBackgroundColor?: ColorValue;

  tabBarItemTitleFontFamily?: TextStyle['fontFamily'];
  tabBarItemTitleFontSize?: TextStyle['fontSize'];
  tabBarItemTitleFontWeight?: TextStyle['fontWeight'];
  tabBarItemTitleFontStyle?: TextStyle['fontStyle'];
  tabBarItemTitleFontColor?: TextStyle['color'];
  tabBarItemTitlePositionAdjustment?: {
    horizontal?: number;
    vertical?: number;
  };

  tabBarItemIconColor?: ColorValue;

  tabBarItemBadgeBackgroundColor?: ColorValue;

  // Additional for Android
  tabBarItemTitleFontSizeActive?: TextStyle['fontSize'];
  tabBarItemTitleFontColorActive?: TextStyle['color'];
  tabBarItemIconColorActive?: ColorValue;
  tabBarItemActiveIndicatorColor?: ColorValue;
  tabBarItemActiveIndicatorEnabled?: boolean;
  tabBarItemRippleColor?: ColorValue;
  tabBarItemLabelVisibilityMode?: TabBarItemLabelVisibilityMode;

  // iOS-only appearance
  tabBarBlurEffect?: BlurEffect; // defaults to 'none'
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
   * @default Defaults to `automatic`.
   *
   * @platform ios
   * @supported iOS 26 or higher
   */
  tabBarMinimizeBehavior?: TabBarMinimizeBehavior;

  // Control

  // Experimental support

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
}
