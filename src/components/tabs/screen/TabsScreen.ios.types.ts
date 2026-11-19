import type { ColorValue, TextStyle } from 'react-native';
import type { UserInterfaceStyle, BlurEffect } from '../../shared/types';
import type { TabsScreenIconIOS } from './TabsScreenIcon.types';

/**
 * Blur effect applied to the tab bar.
 *
 * @remarks
 * Accepts any {@link BlurEffect} value and `'systemDefault'`, which uses
 * UIKit's default tab bar blur effect.
 */
export type TabsBlurEffect = BlurEffect | 'systemDefault';

/**
 * Interface style of the tab bar.
 *
 * @remarks
 * Accepts any {@link UserInterfaceStyle} value.
 */
export type TabsUserInterfaceStyle = UserInterfaceStyle;

/**
 * System role of a tab.
 *
 * @remarks
 * The only supported value is `'search'`, the system search tab.
 */
export type TabsScreenRole = 'search';

/**
 * System-provided tab bar item with a predefined icon and title.
 *
 * @remarks
 * The following values are supported:
 * - `'bookmarks'`
 * - `'contacts'`
 * - `'downloads'`
 * - `'favorites'`
 * - `'featured'`
 * - `'history'`
 * - `'more'`
 * - `'mostRecent'`
 * - `'mostViewed'`
 * - `'recents'`
 * - `'search'`
 * - `'topRated'`
 *
 * @see {@link https://developer.apple.com/documentation/uikit/uitabbaritem/systemitem | UITabBarItem.SystemItem}
 */
export type TabsScreenSystemItem =
  | 'bookmarks'
  | 'contacts'
  | 'downloads'
  | 'favorites'
  | 'featured'
  | 'history'
  | 'more'
  | 'mostRecent'
  | 'mostViewed'
  | 'recents'
  | 'search'
  | 'topRated';

/**
 * Appearance of the tab bar and of its items in each layout.
 *
 * @remarks
 * Allows to customize the appearance depending on the tab bar item layout
 * (stacked, inline, compact inline) and state (normal, selected, focused,
 * disabled).
 */
export interface TabsScreenAppearanceIOS {
  /**
   * Specifies the appearance of tab bar items when they are in stacked layout.
   *
   * @remarks
   * Tab bar items in stacked layout have the icon above the title.
   * Stacked layout is used e.g. on the iPhone in portrait orientation.
   *
   * @platform ios
   */
  stacked?: TabsScreenItemAppearanceIOS | undefined;
  /**
   * Specifies the appearance of tab bar items when they are in inline layout.
   *
   * @remarks
   * Tab bar items in inline layout have the icon next to the title.
   * Inline layout is used in regular-width environments, e.g. in landscape
   * orientation on the iPhone 16 Pro Max.
   *
   * Size classes for iOS and iPadOS devices are described in Apple's Human
   * Interface Guidelines.
   *
   * @see {@link https://developer.apple.com/design/human-interface-guidelines/layout#Size-classes | HIG: Size classes}
   * @platform ios
   */
  inline?: TabsScreenItemAppearanceIOS | undefined;
  /**
   * Specifies the appearance of tab bar items when they are in compact inline
   * layout.
   *
   * @remarks
   * Tab bar items in compact inline layout have the icon next to the title.
   * Compact inline layout is used in compact-width environments, e.g. in
   * landscape orientation on the iPhone 16 Pro.
   *
   * Size classes for iOS and iPadOS devices are described in Apple's Human
   * Interface Guidelines.
   *
   * @see {@link https://developer.apple.com/design/human-interface-guidelines/layout#Size-classes | HIG: Size classes}
   * @platform ios
   */
  compactInline?: TabsScreenItemAppearanceIOS | undefined;
  /**
   * Specifies the background color for the entire tab bar when tab screen is
   * selected.
   *
   * @platform ios <= 18
   */
  tabBarBackgroundColor?: ColorValue | undefined;
  /**
   * Specifies the blur effect applied to the tab bar when tab screen is
   * selected.
   *
   * @remarks
   * Works with
   * {@link TabsScreenAppearanceIOS.tabBarBackgroundColor | tabBarBackgroundColor}'s
   * alpha `< 1`.
   *
   * @defaultValue `'systemDefault'`
   * @platform ios <= 18
   */
  tabBarBlurEffect?: TabsBlurEffect | undefined;
  /**
   * Specifies the shadow color for the tab bar when tab screen is selected.
   *
   * @platform ios <= 18
   */
  tabBarShadowColor?: ColorValue | undefined;
}

/**
 * Appearance of tab bar items in each state.
 */
export interface TabsScreenItemAppearanceIOS {
  /**
   * Defines appearance for all tab bar items which are in their enabled,
   * unselected and unfocused state.
   *
   * @remarks
   * The appearance is determined by the configuration of the currently
   * selected tab.
   *
   * @platform ios
   */
  normal?: TabsScreenItemStateAppearanceIOS | undefined;
  /**
   * Defines appearance for the tab bar item that is currently active.
   *
   * @remarks
   * The appearance is determined by the configuration of the currently
   * selected tab itself.
   *
   * @platform ios
   */
  selected?: TabsScreenItemStateAppearanceIOS | undefined;
  /**
   * Defines appearance for a tab bar item when it receives focus.
   *
   * @remarks
   * The appearance is determined by the configuration of the currently
   * selected tab.
   *
   * @platform ios
   */
  focused?: TabsScreenItemStateAppearanceIOS | undefined;
  /**
   * Defines appearance for tab bar items when they are disabled.
   *
   * @remarks
   * The appearance is determined by the configuration of the currently
   * selected tab.
   *
   * @info
   * Disabling a tab is not supported in v5, so this appearance is not shown.
   *
   * @platform ios
   */
  disabled?: TabsScreenItemStateAppearanceIOS | undefined;
}

/**
 * Offset of the title of a tab bar item from its default position.
 *
 * @see {@link https://developer.apple.com/documentation/uikit/uitabbaritemstateappearance/titlepositionadjustment | UITabBarItemStateAppearance.titlePositionAdjustment}
 */
export interface TabsScreenItemTitlePositionAdjustmentIOS {
  /**
   * Horizontal offset of the title, in points.
   *
   * @defaultValue `0`
   * @platform ios
   */
  horizontal?: number | undefined;
  /**
   * Vertical offset of the title, in points.
   *
   * @defaultValue `0`
   * @platform ios
   */
  vertical?: number | undefined;
}

/**
 * Appearance of tab bar items in one state.
 */
export interface TabsScreenItemStateAppearanceIOS {
  /**
   * Specifies the font family used for the title of each tab bar item when
   * tab screen is selected.
   *
   * @platform ios
   */
  tabBarItemTitleFontFamily?: TextStyle['fontFamily'] | undefined;
  /**
   * Specifies the font size used for the title of each tab bar item when tab
   * screen is selected.
   *
   * @platform ios
   */
  tabBarItemTitleFontSize?: TextStyle['fontSize'] | undefined;
  /**
   * Specifies the font weight used for the title of each tab bar item when
   * tab screen is selected.
   *
   * @platform ios
   */
  tabBarItemTitleFontWeight?: TextStyle['fontWeight'] | undefined;
  /**
   * Specifies the font style used for the title of each tab bar item when tab
   * screen is selected.
   *
   * @platform ios
   */
  tabBarItemTitleFontStyle?: TextStyle['fontStyle'] | undefined;
  /**
   * Specifies the font color used for the title of each tab bar item when tab
   * screen is selected.
   *
   * @remarks
   * Overrides the color defined in
   * {@link TabsHostPropsIOS.tabBarTintColor | ios.tabBarTintColor} and
   * {@link TabsScreenItemStateAppearanceIOS.tabBarItemIconColor | tabBarItemIconColor}.
   *
   * @platform ios
   */
  tabBarItemTitleFontColor?: TextStyle['color'] | undefined;
  /**
   * Specifies the title offset for each tab bar item when tab screen is
   * selected.
   *
   * @remarks
   * Depending on the iOS version and the device's interface orientation,
   * this setting may affect the alignment of the text, badge and icon.
   *
   * @platform ios
   */
  tabBarItemTitlePositionAdjustment?:
    | TabsScreenItemTitlePositionAdjustmentIOS
    | undefined;
  /**
   * Specifies the icon color for each tab bar item when tab screen is selected.
   *
   * @remarks
   * This also impacts the title text color.
   *
   * Is overridden by
   * {@link TabsScreenItemStateAppearanceIOS.tabBarItemTitleFontColor | tabBarItemTitleFontColor}
   * (for title text color).
   * Overrides {@link TabsHostPropsIOS.tabBarTintColor | ios.tabBarTintColor}.
   *
   * @info
   * Starting from iOS 26, it only applies to selected tab bar item. Other items
   * adopt a dark or light appearance depending on the theme of the tab bar.
   *
   * @platform ios
   */
  tabBarItemIconColor?: ColorValue | undefined;
  /**
   * Specifies the background color of badges for each tab bar item when tab
   * screen is selected.
   *
   * @platform ios
   */
  tabBarItemBadgeBackgroundColor?: ColorValue | undefined;
}

/**
 * iOS-specific props for {@link Tabs.Screen}.
 */
export interface TabsScreenPropsIOS {
  /**
   * Specifies the standard tab bar appearance.
   *
   * @platform ios
   */
  standardAppearance?: TabsScreenAppearanceIOS | undefined;
  /**
   * Specifies the tab bar appearance when edge of scrollable content aligns
   * with the edge of the tab bar.
   *
   * @remarks
   * If this property is `undefined`, UIKit uses
   * {@link TabsScreenPropsIOS.standardAppearance | standardAppearance},
   * modified to have a transparent background.
   *
   * @platform ios
   */
  scrollEdgeAppearance?: TabsScreenAppearanceIOS | undefined;
  /**
   * Specifies the icon for the tab bar item.
   *
   * @remarks
   * Supported values:
   * - `{ type: 'imageSource', imageSource, renderingMode? }`
   *   Uses an image from the provided resource. With `renderingMode` set to
   *   `'template'` the image is tinted with the state-dependent icon color.
   *   With `'original'` it keeps its own colors.
   * - `{ type: 'sfSymbol', name, renderingMode? }`
   *   Uses an SF Symbol with the specified name. If no system symbol
   *   matches, falls back to a custom symbol with that name from the app's
   *   asset catalog. `renderingMode` defaults to `'default'`, the system
   *   behavior: a single color for system symbols, while for custom symbols
   *   the rendering intent set in the asset catalog may change it.
   *   `'original'` shows the symbol's own color layers (Apple's "multicolor"
   *   rendering).
   *
   * See {@link TabsPlatformIconImageRenderingModeIOS} and
   * {@link TabsPlatformIconSymbolRenderingModeIOS} for the meaning of each
   * rendering mode.
   *
   * If no {@link TabsScreenPropsIOS.selectedIcon | selectedIcon} is provided,
   * this icon will also be used as the selected state icon.
   *
   * @platform ios
   */
  icon?: TabsScreenIconIOS | undefined;
  /**
   * Specifies the icon for tab bar item when it is selected.
   *
   * @remarks
   * Supports the same values as {@link TabsScreenPropsIOS.icon | icon}
   * property.
   *
   * @warning
   * It must use the same icon `type` as `icon`; `renderingMode` may differ.
   *
   * To use `selectedIcon`, `icon` must also be provided.
   *
   * @example
   * The symbol is shown tinted while unselected and in its own colors while
   * selected:
   * ```tsx
   * <Tabs.Screen
   *   screenKey="favorites"
   *   title="Favorites"
   *   ios={{
   *     icon: { type: 'sfSymbol', name: 'leaf' },
   *     selectedIcon: {
   *       type: 'sfSymbol',
   *       name: 'leaf',
   *       renderingMode: 'original',
   *     },
   *   }}>
   *   <FavoritesScreen />
   * </Tabs.Screen>
   * ```
   * @platform ios
   */
  selectedIcon?: TabsScreenIconIOS | undefined;
  /**
   * System-provided tab bar item with predefined icon and title.
   *
   * @remarks
   * Uses Apple's built-in tab bar items (e.g., bookmarks, contacts, downloads)
   * with standard iOS styling and localized titles. Custom
   * {@link TabsScreenPropsIOS.icon | icon} or
   * {@link TabsScreenPropsIOS.selectedIcon | selectedIcon} properties will
   * override the system icon, and the system-defined title can be overridden
   * by providing a custom {@link TabsScreenPropsBase.title | title}.
   *
   * @info
   * On iOS 26, `systemItem: 'search'` acts as a detached tab bar item, which
   * does not display any title (system or custom). This no longer applies on
   * iOS 27; to get a similar separation use
   * {@link TabsScreenPropsIOS.role | role} set to `'search'` together with
   * {@link TabsScreenPropsIOS.automaticallyActivatesSearch | automaticallyActivatesSearch}.
   *
   * @platform ios
   */
  systemItem?: TabsScreenSystemItem | undefined;
  /**
   * Gives this tab a system role. Currently the only role is `'search'`,
   * which marks the tab as the system search tab.
   *
   * @remarks
   * This prop relies on the `UITab` API. A tab screen with `role: 'search'` is
   * backed natively by `UISearchTab`, which enables the system search behavior:
   * {@link TabsScreenPropsIOS.automaticallyActivatesSearch | automaticallyActivatesSearch}
   * and the detached trailing placement UIKit gives search tabs. Behavior
   * differs between OS versions: iOS 26.x detaches `UISearchTab`
   * unconditionally, iOS 27.0 only while `automaticallyActivatesSearch` is
   * enabled. On iOS 27+ the detached (prominent) placement can be given to any
   * tab instead through {@link Tabs.Host}
   * {@link TabsHostPropsIOS.prominentScreenKey | ios.prominentScreenKey}.
   *
   * @tip
   * This prop does not affect the tab bar item's icon or title - combine it
   * with {@link TabsScreenPropsIOS.systemItem | systemItem} set to `'search'`
   * for the system magnifier item.
   *
   * @warning
   * The native tab class cannot change during the screen's lifetime -
   * changing `role` on a mounted tab screen is not supported and triggers an
   * assertion in development builds.
   *
   * @see {@link https://developer.apple.com/documentation/uikit/uisearchtab | UISearchTab}
   * @platform ios >= 26.1
   */
  role?: TabsScreenRole | undefined;
  /**
   * Specifies whether selecting this tab automatically activates its search
   * field.
   *
   * @remarks
   * When enabled, selecting the search tab immediately activates the search
   * field. Cancelling the search restores the previously selected tab.
   *
   * @info
   * Effective only for tab screens with {@link TabsScreenPropsIOS.role | role}
   * set to `'search'` and only when a search bar is configured in the header
   * of the screen stack nested in this tab.
   *
   * @defaultValue `false`
   * @see {@link https://developer.apple.com/documentation/uikit/uisearchtab/automaticallyactivatessearch | UISearchTab.automaticallyActivatesSearch}
   * @platform ios >= 26.1
   */
  automaticallyActivatesSearch?: boolean | undefined;
  /**
   * Specifies if `contentInsetAdjustmentBehavior` of first ScrollView in first
   * descendant chain from tab screen should be overridden back from `'never'`
   * to `'automatic'`.
   *
   * @remarks
   * By default, `react-native`'s ScrollView has
   * `contentInsetAdjustmentBehavior` set to `'never'` instead of UIKit-default
   * (which is `'automatic'`). This prevents ScrollViews from respecting
   * navigation bar insets. When this prop is set to `true`, `'automatic'`
   * behavior is reverted.
   *
   * @defaultValue `true`
   * @platform ios
   */
  overrideScrollViewContentInsetAdjustmentBehavior?: boolean | undefined;
  /**
   * Allows to override system appearance for the tab bar.
   *
   * @info
   * Does not support dynamic changes to the prop value for the currently
   * visible screen.
   *
   * @tip
   * Consider using {@link TabsHostPropsBase.colorScheme | colorScheme} on
   * {@link Tabs.Host} instead.
   *
   * @defaultValue `'unspecified'`
   * @platform ios
   * @experimental
   */
  experimental_userInterfaceStyle?: TabsUserInterfaceStyle | undefined;
}
