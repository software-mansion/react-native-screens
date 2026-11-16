import type { ReactNode } from 'react';
import type { TabsBottomAccessoryEnvironment } from '../bottom-accessory/TabsBottomAccessory.types';
import type { ColorValue } from 'react-native';
import type { NativeEventHandler } from '../../shared/types';

/**
 * Payload of the event emitted when the user taps the "More" tab bar item.
 *
 * @remarks
 * This event fires when the user taps the system-generated "More" tab bar item.
 * It does NOT fire when a tab is selected from within the More list — that
 * triggers the normal {@link TabsHostPropsBase.onTabSelected | onTabSelected}
 * event instead.
 *
 * The payload carries the navigation state that was active at the moment the
 * "More" tab was tapped.
 */
export type MoreTabSelectedEvent = {
  /** Screen key of the tab that was active when "More" was tapped. */
  selectedScreenKey: string;
  /** Provenance of the navigation state when "More" was tapped. */
  provenance: number;
};

/**
 * Function that renders the content of the bottom accessory.
 *
 * @param environment - Environment the content is rendered for.
 * @returns The element to render as the bottom accessory.
 */
export type TabsBottomAccessoryComponentFactory = (
  environment: TabsBottomAccessoryEnvironment,
) => ReactNode;

/**
 * Minimize behavior of the tab bar.
 *
 * @remarks
 * The following values are currently supported:
 * - `'automatic'` — resolves to the system default minimize behavior
 * - `'never'` — the tab bar does not minimize
 * - `'onScrollDown'` — the tab bar minimizes when scrolling down and expands
 *   when scrolling back up
 * - `'onScrollUp'` — the tab bar minimizes when scrolling up and expands when
 *   scrolling back down
 *
 * The supported values correspond to the official UIKit documentation.
 *
 * @see {@link https://developer.apple.com/documentation/uikit/uitabbarcontroller/minimizebehavior | UITabBarController.MinimizeBehavior}
 */
export type TabBarMinimizeBehavior =
  | 'automatic'
  | 'never'
  | 'onScrollDown'
  | 'onScrollUp';

/**
 * Display mode of the tab bar.
 *
 * @remarks
 * The following values are currently supported:
 * - `'automatic'` — the system sets the display mode based on the tab’s
 *   content
 * - `'tabBar'` — the system displays the content only as a tab bar
 * - `'tabSidebar'` — the tab bar is displayed as a sidebar
 *
 * See the official documentation for more details.
 *
 * @see {@link https://developer.apple.com/documentation/uikit/uitabbarcontroller/mode-swift.enum | UITabBarController.Mode}
 */
export type TabBarControllerMode = 'automatic' | 'tabBar' | 'tabSidebar';

/**
 * Whether the sidebar or the tab bar is preferred when only one of them can be
 * displayed.
 *
 * @remarks
 * The following values are currently supported:
 * - `'automatic'` — the system resolves to the platform default (the tab bar
 *   on iOS)
 * - `'sidebar'` — the sidebar is displayed when it is available
 * - `'tabBar'` — the tab bar is displayed
 *
 * @see {@link https://developer.apple.com/documentation/uikit/uitabbarcontroller/sidebar-swift.class/placement | UITabBarController.Sidebar.Placement}
 */
export type TabBarSidebarPreferredPlacement =
  | 'automatic'
  | 'sidebar'
  | 'tabBar';

/**
 * iOS-specific props for {@link Tabs.Host}.
 */
export interface TabsHostPropsIOS {
  /**
   * Whether changes of {@link TabsHostPropsBase.tabBarHidden | tabBarHidden}
   * are animated.
   *
   * @remarks
   * When `true`, the tab bar is hidden and shown with the system transition
   * (`UITabBarController.setTabBarHidden(_:animated:)`). When `false`, the
   * tab bar disappears and reappears immediately.
   *
   * On versions earlier than iOS 18, the tab bar visibility is never animated,
   * regardless of this prop.
   *
   * @defaultValue `true`
   * @platform ios >= 18
   */
  tabBarHiddenAnimationEnabled?: boolean | undefined;
  /**
   * Specifies the color used for selected tab's text and icon color.
   *
   * @remarks
   * Starting from iOS 26, it also impacts glow of Liquid Glass tab selection
   * view.
   *
   * {@link TabsScreenItemStateAppearanceIOS.tabBarItemTitleFontColor | tabBarItemTitleFontColor}
   * and {@link TabsScreenItemStateAppearanceIOS.tabBarItemIconColor | tabBarItemIconColor}
   * defined on {@link Tabs.Screen} component override this color.
   *
   * @platform ios
   */
  tabBarTintColor?: ColorValue | undefined;
  /**
   * Specifies the minimize behavior for the tab bar.
   *
   * @defaultValue `'automatic'`
   * @platform ios >= 26
   */
  tabBarMinimizeBehavior?: TabBarMinimizeBehavior | undefined;
  /**
   * Specifies component used as bottom accessory.
   *
   * @remarks
   * This prop is a function that accepts `environment` as a parameter and
   * returns the component that will be rendered in the bottom accessory.
   *
   * If this prop is `undefined`, the bottom accessory will not be rendered.
   *
   * In order to allow accessory rendering based on environment, the component
   * is rendered 2 times for both `'regular'` and `'inline'` environments at the
   * same time. Environment determines which component is visible at given
   * moment. This might require implementing a solution to share state between
   * both rendered components (e.g. usage of context).
   *
   * @see {@link https://developer.apple.com/documentation/uikit/uitabbarcontroller/bottomaccessory | UITabBarController.bottomAccessory}
   * @platform ios >= 26
   */
  bottomAccessory?: TabsBottomAccessoryComponentFactory | undefined;
  /**
   * Hides the bottom accessory with animation.
   *
   * @defaultValue `false`
   * @platform ios >= 26
   */
  bottomAccessoryHidden?: boolean | undefined;
  /**
   * Specifies the display mode for the tab bar.
   *
   * @defaultValue `'automatic'`
   * @platform ios >= 18
   */
  tabBarControllerMode?: TabBarControllerMode | undefined;
  /**
   * Specifies whether the sidebar or the tab bar is preferred when only one of
   * them can be displayed.
   *
   * @remarks
   * This prop requires
   * {@link TabsHostPropsIOS.tabBarControllerMode | tabBarControllerMode} to be
   * set to `'tabSidebar'`. Otherwise, the sidebar is not considered a supported
   * mode and the tab bar is always displayed.
   *
   * The button that shows the sidebar is visible only when the screen has a
   * header. After using it, the sidebar is displayed and the content is
   * accessible.
   *
   * The sidebar can also be shown with a swipe from the leading edge. In this
   * case, the sidebar overlaps the content, and the content is not accessible
   * until the sidebar is hidden.
   *
   * The sidebar is enabled only when the interface has a regular horizontal
   * size class. On iPhone, this applies only to larger models (e.g. Pro Max,
   * Plus and Air) in landscape orientation. On other iPhones (e.g. iPhone 18
   * Pro), and on all iPhones in portrait orientation, the tab bar is always
   * displayed.
   *
   * @defaultValue `'automatic'`
   * @platform ios >= 27
   */
  tabBarSidebarPreferredPlacement?: TabBarSidebarPreferredPlacement | undefined;
  /**
   * `screenKey` of the tab screen that should receive the prominent treatment.
   *
   * @remarks
   * Must match the {@link TabsScreenPropsBase.screenKey | screenKey} of one of
   * the child `Tabs.Screen`s. Where supported, that tab receives enhanced
   * visual emphasis in the tab bar - it is detached from the other items onto
   * its own surface and stays visible when the tab bar minimizes on scroll (see
   * {@link TabsHostPropsIOS.tabBarMinimizeBehavior | tabBarMinimizeBehavior}).
   *
   * When omitted, a tab with `role: 'search'` and
   * {@link TabsScreenPropsIOS.automaticallyActivatesSearch | automaticallyActivatesSearch}
   * enabled becomes prominent automatically, otherwise no tab is prominent.
   *
   * @see {@link https://developer.apple.com/documentation/uikit/uitabbarcontroller/prominenttabidentifier | UITabBarController.prominentTabIdentifier}
   * @platform ios >= 27
   */
  prominentScreenKey?: string | undefined;
  /**
   * A callback that gets invoked when the user taps the "More" tab bar item.
   *
   * @remarks
   * This event fires when the user taps the system-generated "More" tab bar
   * item. It does NOT fire when a tab is selected from within the More list —
   * that triggers the normal
   * {@link TabsHostPropsBase.onTabSelected | onTabSelected} event instead.
   *
   * @see {@link MoreTabSelectedEvent}
   * @platform ios
   */
  onMoreTabSelected?: NativeEventHandler<MoreTabSelectedEvent> | undefined;
}
