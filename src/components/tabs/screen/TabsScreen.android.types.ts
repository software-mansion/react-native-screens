import type { ColorValue, TextStyle } from 'react-native';
import type { TabsScreenIconAndroid } from './TabsScreenIcon.types';

/**
 * Label visibility mode of the tab bar items.
 *
 * @remarks
 * The following values are available:
 * - `'auto'` — the label behaves as in `'labeled'` mode when there are 3
 *   items or less, or as in `'selected'` mode when there are 4 items or more.
 * - `'selected'` — the label is only shown on the selected navigation item.
 * - `'labeled'` — the label is shown on all navigation items.
 * - `'unlabeled'` — the label is hidden for all navigation items.
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
   *
   * @defaultValue Material's default is used.
   * @platform android
   */
  tabBarItemTitleFontColor?: TextStyle['color'] | undefined;
  /**
   * Specifies the icon color for each tab bar item.
   *
   * @defaultValue Material's default is used.
   * @platform android
   */
  tabBarItemIconColor?: ColorValue | undefined;
}

/**
 * Appearance of the tab bar and of its items.
 */
export interface TabsScreenAppearanceAndroid {
  /**
   * Specifies the background color for the entire tab bar.
   *
   * @defaultValue Material's default is used.
   * @platform android
   */
  tabBarBackgroundColor?: ColorValue | undefined;
  /**
   * Specifies the color of each tab bar item's ripple effect.
   *
   * @defaultValue Material's default is used.
   * @platform android
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
   * @platform android
   */
  tabBarItemLabelVisibilityMode?: TabBarItemLabelVisibilityMode | undefined;
  /**
   * Defines the colors for all tab bar items which are in their enabled,
   * unselected and unfocused state.
   *
   * @remarks
   * The color scheme is determined by the configuration of the currently
   * selected tab.
   *
   * @platform android
   */
  normal?: TabsScreenItemStateAppearanceAndroid | undefined;
  /**
   * Defines the colors for the tab bar item that is currently active.
   *
   * @remarks
   * The color scheme is determined by the configuration of the currently
   * selected tab itself.
   *
   * Maps to Android `state_selected=true`.
   *
   * @platform android
   */
  selected?: TabsScreenItemStateAppearanceAndroid | undefined;
  /**
   * Defines the colors for a tab bar item when it receives focus (used mostly
   * for keyboard navigation).
   *
   * @remarks
   * The color scheme is determined by the configuration of the currently
   * selected tab.
   *
   * Maps to Android `state_focused=true`.
   *
   * @platform android
   */
  focused?: TabsScreenItemStateAppearanceAndroid | undefined;
  /**
   * Defines the colors for tab bar items when they are disabled.
   *
   * @remarks
   * The color scheme is determined by the configuration of the currently
   * selected tab.
   *
   * Maps to Android `state_enabled=false`.
   */
  disabled?: TabsScreenItemStateAppearanceAndroid | undefined;
  /**
   * Specifies the icon size of this tab's item in dp.
   *
   * @remarks
   * Applies to this tab only.
   *
   * @defaultValue Material's default icon size is used.
   * @platform android
   */
  tabBarItemIconSize?: number | undefined;
  /**
   * Specifies the background color of the active indicator.
   *
   * @defaultValue Material's default is used.
   * @platform android
   */
  tabBarItemActiveIndicatorColor?: ColorValue | undefined;
  /**
   * Specifies if the active indicator should be used.
   *
   * @defaultValue `true`
   * @platform android
   */
  tabBarItemActiveIndicatorEnabled?: boolean | undefined;
  /**
   * Specifies the width of this tab's active indicator in dp.
   *
   * @remarks
   * Applies to this tab only.
   *
   * @defaultValue It is this tab's icon size plus the default Material padding.
   * @platform android
   */
  tabBarItemActiveIndicatorWidth?: number | undefined;
  /**
   * Specifies the height of this tab's active indicator in dp.
   *
   * @remarks
   * Applies to this tab only.
   *
   * @defaultValue It is this tab's icon size plus the default Material padding.
   * @platform android
   */
  tabBarItemActiveIndicatorHeight?: number | undefined;
  /**
   * Specifies the font family used for the title of each tab bar item.
   *
   * @defaultValue The platform's default font family is used.
   * @platform android
   */
  tabBarItemTitleFontFamily?: TextStyle['fontFamily'] | undefined;
  /**
   * Specifies the font size used for the title of unselected tab bar items.
   *
   * @remarks
   * The size is represented in scale-independent pixels (sp).
   *
   * @defaultValue Material's default is used.
   * @platform android
   */
  tabBarItemTitleSmallLabelFontSize?: TextStyle['fontSize'] | undefined;
  /**
   * Specifies the font size used for the title of selected tab bar item.
   *
   * @remarks
   * The size is represented in scale-independent pixels (sp).
   *
   * @defaultValue Material's default is used.
   * @platform android
   */
  tabBarItemTitleLargeLabelFontSize?: TextStyle['fontSize'] | undefined;
  /**
   * Specifies the font weight used for the title of each tab bar item.
   *
   * @defaultValue `'normal'`
   * @platform android
   */
  tabBarItemTitleFontWeight?: TextStyle['fontWeight'] | undefined;
  /**
   * Specifies the font style used for the title of each tab bar item.
   *
   * @defaultValue `'normal'`
   * @platform android
   */
  tabBarItemTitleFontStyle?: TextStyle['fontStyle'] | undefined;
  /**
   * Specifies the background color of the badge.
   *
   * @defaultValue Material's default is used.
   * @platform android
   */
  tabBarItemBadgeBackgroundColor?: ColorValue | undefined;
  /**
   * Specifies the text color of the badge.
   *
   * @defaultValue Material's default is used.
   * @platform android
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
   * ({@link TabsScreenAppearanceAndroid.normal | normal},
   * {@link TabsScreenAppearanceAndroid.selected | selected},
   * {@link TabsScreenAppearanceAndroid.focused | focused},
   * {@link TabsScreenAppearanceAndroid.disabled | disabled}). The tab bar uses
   * the configuration of the currently selected tab screen, except for the
   * fields that apply to this tab only.
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
   *   Uses an image from the provided resource.
   * - `{ type: 'drawableResource', name, tinting? }`
   *   Uses a drawable resource with the given name.
   *
   * See {@link TabsPlatformIconTintingAndroid} for the meaning of each `tinting`
   * value.
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
   * @warning
   * To use `selectedIcon`, `icon` must also be provided.
   *
   * @defaultValue The {@link TabsScreenPropsAndroid.icon | icon} is used.
   * @example
   * The drawable is shown tinted while unselected and in its own colors while
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
   * @platform android
   */
  selectedIcon?: TabsScreenIconAndroid | undefined;
}
