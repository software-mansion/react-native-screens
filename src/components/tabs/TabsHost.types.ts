import { ReactNode } from 'react';
import type { ColorValue, NativeSyntheticEvent, ViewProps } from 'react-native';
import type { TabsAccessoryEnvironment } from './TabsAccessory.types';

// #region iOS-specific helpers

export type TabAccessoryComponentFactoryIOS = (
  environment: TabsAccessoryEnvironment,
) => ReactNode;

export type TabBarMinimizeBehaviorIOS =
  | 'automatic'
  | 'never'
  | 'onScrollDown'
  | 'onScrollUp';

export type TabBarControllerModeIOS = 'automatic' | 'tabBar' | 'tabSidebar';

// #endregion iOS-specific helpers

// #region General helpers

export type NativeFocusChangeEvent = {
  tabKey: string;
  repeatedSelectionHandledBySpecialEffect: boolean;
};

export type TabsHostNativeContainerStyleProps = {
  /**
   * @summary Specifies the background color of the native container.
   */
  backgroundColor?: ColorValue;
};

// #endregion General helpers

// #region Platform interfaces

export interface TabsHostPropsIOS {
  /**
   * @summary Specifies the color used for selected tab's text and icon color.
   *
   * Starting from iOS 26, it also impacts glow of Liquid Glass tab
   * selection view.
   *
   * `tabBarItemTitleFontColor` and `tabBarItemIconColor` defined on
   * TabsScreen component override this color.
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
   * @supported iOS 26 or higher
   */
  tabBarMinimizeBehavior?: TabBarMinimizeBehaviorIOS;
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
   * @supported iOS 26 or higher
   */
  bottomAccessory?: TabAccessoryComponentFactoryIOS;
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
   * @supported iOS 18 or higher
   */
  tabBarControllerMode?: TabBarControllerModeIOS;
}

// Predefined for the future use-cases.
// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface TabsHostPropsAndroid {}

// #endregion Platform interfaces

export interface TabsHostPropsBase {
  // TabsHostPropsBase - General
  children?: ViewProps['children'];
  /**
   * @summary Hides the tab bar.
   *
   * @default false
   */
  tabBarHidden?: boolean;
  /**
   * @summary Allows for native container view customization.
   *
   * On Android, style is applied to `FrameLayout` that wraps currently focused screen
   * and `BottomNavigationView`. On iOS, style is applied to `UITabBarController`'s
   * view.
   */
  nativeContainerStyle?: TabsHostNativeContainerStyleProps;

  // TabsHostPropsBase - Experimental support
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
   */
  experimentalControlNavigationStateInJS?: boolean;

  // TabsHostPropsBase - Events
  /**
   * A callback that gets invoked when user requests change of focused tab screen.
   */
  onNativeFocusChange?: (
    event: NativeSyntheticEvent<NativeFocusChangeEvent>,
  ) => void;
}

export interface TabsHostProps extends TabsHostPropsBase {
  ios?: TabsHostPropsIOS;
  android?: TabsHostPropsAndroid;
}
