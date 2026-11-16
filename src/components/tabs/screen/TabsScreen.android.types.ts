import type { ColorValue, TextStyle } from 'react-native';
import type { TabsScreenIconAndroid } from './TabsScreenIcon.types';

/**
 * Label visibility mode of the tab bar items.
 *
 * @remarks
 * The following values are available:
 * - `'auto'` — the label behaves as in `'labeled'` mode when there are 3
 *   items or less, or as in `'selected'` mode when there are 4 items or more
 * - `'selected'` — the label is only shown on the selected navigation item
 * - `'labeled'` — the label is shown on all navigation items
 * - `'unlabeled'` — the label is hidden for all navigation items
 *
 * The supported values correspond to the official Material Components
 * documentation.
 *
 * @see {@link https://github.com/material-components/material-components-android/blob/master/docs/components/BottomNavigation.md#making-navigation-bar-accessible | Material Components documentation}
 */
export type TabBarItemLabelVisibilityMode =
  | 'auto'
  | 'selected'
  | 'labeled'
  | 'unlabeled';

/**
 * Colors of tab bar items in one state.
 */
export interface TabsScreenItemStateAppearanceAndroid {
  /**
   * Specifies the font color used for the title of each tab bar item.
   */
  tabBarItemTitleFontColor?: TextStyle['color'] | undefined;
  /**
   * Specifies the icon color for each tab bar item.
   */
  tabBarItemIconColor?: ColorValue | undefined;
}

/**
 * Appearance of the tab bar and of its items.
 */
export interface TabsScreenAppearanceAndroid {
  /**
   * Specifies the background color for the entire tab bar.
   */
  tabBarBackgroundColor?: ColorValue | undefined;
  /**
   * Specifies the color of each tab bar item's ripple effect.
   */
  tabBarItemRippleColor?: ColorValue | undefined;
  /**
   * Specifies the label visibility mode.
   *
   * @remarks
   * The label visibility mode defines when the labels of each tab bar item
   * should be displayed.
   *
   * @defaultValue `'auto'`
   */
  tabBarItemLabelVisibilityMode?: TabBarItemLabelVisibilityMode | undefined;
  /**
   * Defines the colors for all tab bar items which are in their enabled,
   * unselected and unfocused state.
   * The color scheme is determined by the configuration of the currently
   * selected tab.
   */
  normal?: TabsScreenItemStateAppearanceAndroid | undefined;
  /**
   * Defines the colors for the tab bar item that is currently active.
   * The color scheme is determined by the configuration of the currently
   * selected tab itself.
   *
   * @note
   * This is an implementation detail and may change. Maps to Android
   * `state_selected=true`.
   */
  selected?: TabsScreenItemStateAppearanceAndroid | undefined;
  /**
   * Defines the colors for a tab bar item when it receives focus (used mostly
   * for keyboard navigation).
   * The color scheme is determined by the configuration of the currently
   * selected tab.
   *
   * @note
   * This is an implementation detail and may change. Maps to Android
   * `state_focused=true`.
   */
  focused?: TabsScreenItemStateAppearanceAndroid | undefined;
  /**
   * Defines the colors for tab bar items when they are disabled.
   * The color scheme is determined by the configuration of the currently
   * selected tab.
   *
   * @note
   * This is an implementation detail and may change. Maps to Android
   * `state_enabled=false`.
   */
  disabled?: TabsScreenItemStateAppearanceAndroid | undefined;
  /**
   * Specifies the icon size of this tab's item in dp.
   *
   * @remarks
   * Applies to this tab only. Unset uses the system default.
   */
  tabBarItemIconSize?: number | undefined;
  /**
   * Specifies the background color of the active indicator.
   */
  tabBarItemActiveIndicatorColor?: ColorValue | undefined;
  /**
   * Specifies if the active indicator should be used.
   *
   * @defaultValue `true`
   */
  tabBarItemActiveIndicatorEnabled?: boolean | undefined;
  /**
   * Specifies the width of this tab's active indicator in dp.
   *
   * @remarks
   * Applies to this tab only. If unset, it is this tab's icon size plus the
   * default Material padding.
   */
  tabBarItemActiveIndicatorWidth?: number | undefined;
  /**
   * Specifies the height of this tab's active indicator in dp.
   *
   * @remarks
   * Applies to this tab only. If unset, it is this tab's icon size plus the
   * default Material padding.
   */
  tabBarItemActiveIndicatorHeight?: number | undefined;
  /**
   * Specifies the font family used for the title of each tab bar item.
   */
  tabBarItemTitleFontFamily?: TextStyle['fontFamily'] | undefined;
  /**
   * Specifies the font size used for the title of unselected tab bar items.
   *
   * @remarks
   * The size is represented in scale-independent pixels (sp).
   */
  tabBarItemTitleSmallLabelFontSize?: TextStyle['fontSize'] | undefined;
  /**
   * Specifies the font size used for the title of selected tab bar item.
   *
   * @remarks
   * The size is represented in scale-independent pixels (sp).
   */
  tabBarItemTitleLargeLabelFontSize?: TextStyle['fontSize'] | undefined;
  /**
   * Specifies the font weight used for the title of each tab bar item.
   */
  tabBarItemTitleFontWeight?: TextStyle['fontWeight'] | undefined;
  /**
   * Specifies the font style used for the title of each tab bar item.
   */
  tabBarItemTitleFontStyle?: TextStyle['fontStyle'] | undefined;
  /**
   * Specifies the background color of the badge.
   */
  tabBarItemBadgeBackgroundColor?: ColorValue | undefined;
  /**
   * Specifies the text color of the badge.
   */
  tabBarItemBadgeTextColor?: ColorValue | undefined;
}

/**
 * Android-specific props for {@link Tabs.Screen}.
 */
export interface TabsScreenPropsAndroid {
  /**
   * Specifies the standard tab bar appearance.
   *
   * @remarks
   * Allows to customize the appearance depending on the tab bar item state
   * (normal, selected, focused, disabled). Configuration for the Bottom
   * Navigation View is determined by the currently active tab screen.
   *
   * @platform android
   */
  standardAppearance?: TabsScreenAppearanceAndroid | undefined;
  /**
   * Specifies the icon for the tab bar item.
   *
   * @remarks
   * Supported values:
   * - `{ type: 'imageSource', imageSource, tinting? }`
   *   Uses an image from the provided resource. `tinting` defaults to
   *   `'default'`: the tab bar tints the image with the item icon color.
   *   `'original'` keeps the image's own colors.
   *
   *   `'imageSource'` type doesn't support SVGs on Android. For loading SVGs
   *   use `'drawableResource'` type.
   *
   * - `{ type: 'drawableResource', name, tinting? }`
   *   Uses a drawable resource with the given name. `tinting` defaults to
   *   `'default'`: the tab bar tints the drawable with the item icon color.
   *   `'original'` keeps the drawable's own colors, e.g. of a multicolor
   *   VectorDrawable.
   *
   *   Requires passing a drawable to resources via Android Studio.
   *
   * See {@link TabsPlatformIconTintingAndroid} for the meaning of each value.
   *
   * @platform android
   */
  icon?: TabsScreenIconAndroid | undefined;
  /**
   * Specifies the icon for tab bar item when it is selected.
   *
   * @remarks
   * Supports the same values as {@link TabsScreenPropsAndroid.icon | icon}
   * property for given platform. `tinting` may differ from the one of `icon`.
   *
   * To use `selectedIcon`, `icon` must also be provided.
   *
   * @example
   * The drawable is tinted while unselected and shows its own colors while
   * selected:
   * ```tsx
   * <Tabs.Screen
   *   screenKey="favorites"
   *   android={{
   *     icon: { type: 'drawableResource', name: 'ic_star' },
   *     selectedIcon: {
   *       type: 'drawableResource',
   *       name: 'ic_star',
   *       tinting: 'original',
   *     },
   *   }}>
   *   <FavoritesScreen />
   * </Tabs.Screen>
   * ```
   *
   * @platform android
   */
  selectedIcon?: TabsScreenIconAndroid | undefined;
}
