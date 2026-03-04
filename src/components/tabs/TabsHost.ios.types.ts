import type { ReactNode } from 'react';
import type { TabsBottomAccessoryEnvironment } from './TabsBottomAccessory.types';
import { ColorValue } from 'react-native';

export type TabsBottomAccessoryComponentFactory = (
  environment: TabsBottomAccessoryEnvironment,
) => ReactNode;

export type TabBarMinimizeBehavior =
  | 'automatic'
  | 'never'
  | 'onScrollDown'
  | 'onScrollUp';

export type TabBarControllerMode = 'automatic' | 'tabBar' | 'tabSidebar';

export type TabsHostColorScheme = 'inherit' | 'light' | 'dark';

export interface TabsHostPropsIOS {
  /**
   * @summary Specifies the color used for selected tab's text and icon color.
   *
   * Starting from iOS 26, it also impacts glow of Liquid Glass tab
   * selection view.
   *
   * `tabBarItemTitleFontColor` and `tabBarItemIconColor` defined on
   * TabsScreen component override this color.
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
  bottomAccessory?: TabsBottomAccessoryComponentFactory;
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
  /**
   * @summary Specifies the color scheme used by the container and any child containers.
   *
   * The following values are currently supported:
   * - `inherit` - the interface style from parent,
   * - `light` - the light interface style,
   * - `dark` - the dark interface style.
   *
   * @default inherit
   *
   * @platform ios
   */
  colorScheme?: TabsHostColorScheme;
}
