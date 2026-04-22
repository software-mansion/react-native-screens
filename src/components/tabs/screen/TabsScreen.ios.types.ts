import type { ColorValue, TextStyle } from 'react-native';
import type { UserInterfaceStyle, BlurEffect } from '../../shared/types';
import type { PlatformIconIOS } from '../../../types';

export type TabsScreenBlurEffect = BlurEffect | 'systemDefault';

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

export interface TabsScreenAppearanceIOS {
  /**
   * @summary Specifies the appearance of tab bar items when they are in stacked layout.
   *
   * Tab bar items in stacked layout have the icon above the title.
   * Stacked layout is used e.g. on the iPhone in portrait orientation.
   *
   * @platform ios
   */
  stacked?: TabsScreenItemAppearanceIOS | undefined;
  /**
   * @summary Specifies the appearance of tab bar items when they are in inline layout.
   *
   * Tab bar items in inline layout have the icon next to the title.
   * Inline layout is used in regular-width environments, e.g. in landscape orientation on the iPhone 16 Pro Max.
   *
   * Complete list of size classes for iOS and iPadOS devices is available in Apple's Human Interface Guidelines:
   * @see {@link https://developer.apple.com/design/human-interface-guidelines/layout#iOS-iPadOS-device-size-classes|HIG: Device size classes}
   *
   * @platform ios
   */
  inline?: TabsScreenItemAppearanceIOS | undefined;
  /**
   * @summary Specifies the appearance of tab bar items when they are in compact inline layout.
   *
   * Tab bar items in compact inline layout have the icon next to the title.
   * Compact inline layout is used in compact-width environments, e.g. in landscape orientation on the iPhone 16 Pro.
   *
   * Complete list of size classes for iOS and iPadOS devices is available in Apple's Human Interface Guidelines:
   * @see {@link https://developer.apple.com/design/human-interface-guidelines/layout#iOS-iPadOS-device-size-classes|HIG: Device size classes}
   *
   * @platform ios
   */
  compactInline?: TabsScreenItemAppearanceIOS | undefined;

  /**
   * @summary Specifies the background color for the entire tab bar when tab screen is selected.
   *
   * This property does not affect the tab bar starting from iOS 26.
   *
   * @platform ios
   * @supported iOS 18 or lower
   */
  tabBarBackgroundColor?: ColorValue | undefined;
  /**
   * @summary Specifies the blur effect applied to the tab bar when tab screen is selected.
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
  tabBarBlurEffect?: TabsScreenBlurEffect | undefined;
  /**
   * @summary Specifies the shadow color for the tab bar when tab screen is selected.
   *
   * This property does not affect the tab bar starting from iOS 26.
   *
   * @platform ios
   * @supported iOS 18 or lower
   */
  tabBarShadowColor?: ColorValue | undefined;
}

export interface TabsScreenItemAppearanceIOS {
  /**
   * Defines appearance for all tab bar items which are in their enabled, unselected and unfocused state.
   * The color scheme is determined by the configuration of the currently selected tab.
   *
   * @platform ios
   */
  normal?: TabsScreenItemStateAppearanceIOS | undefined;
  /**
   * Defines appearance for the tab bar item that is currently active.
   * The appearance is determined by the configuration of the currently selected tab itself.
   *
   * @platform ios
   */
  selected?: TabsScreenItemStateAppearanceIOS | undefined;
  /**
   * Defines appearance for a tab bar item when it receives focus.
   * The appearance is determined by the configuration of the currently selected tab.
   *
   * @platform ios
   */
  focused?: TabsScreenItemStateAppearanceIOS | undefined;
  /**
   * Defines appearance for tab bar items when they are disabled.
   * The appearance is determined by the configuration of the currently selected tab.
   *
   * @platform ios
   */
  disabled?: TabsScreenItemStateAppearanceIOS | undefined;
}

export interface TabsScreenItemStateAppearanceIOS {
  /**
   * @summary Specifies the font family used for the title of each tab bar item
   * when tab screen is selected.
   *
   * @platform ios
   */
  tabBarItemTitleFontFamily?: TextStyle['fontFamily'] | undefined;
  /**
   * @summary Specifies the font size used for the title of each tab bar item
   * when tab screen is selected.
   *
   * @platform ios
   */
  tabBarItemTitleFontSize?: TextStyle['fontSize'] | undefined;
  /**
   * @summary Specifies the font weight used for the title of each tab bar item
   * when tab screen is selected.
   *
   * @platform ios
   */
  tabBarItemTitleFontWeight?: TextStyle['fontWeight'] | undefined;
  /**
   * @summary Specifies the font style used for the title of each tab bar item
   * when tab screen is selected.
   *
   * @platform ios
   */
  tabBarItemTitleFontStyle?: TextStyle['fontStyle'] | undefined;
  /**
   * @summary Specifies the font color used for the title of each tab bar item
   * when tab screen is selected.
   *
   * Overrides the color defined in `tabBarTintColor` and `tabBarItemIconColor`.
   *
   * @platform ios
   */
  tabBarItemTitleFontColor?: TextStyle['color'] | undefined;
  /**
   * @summary Specifies the title offset for each tab bar item when tab screen
   * is selected.
   *
   * Depending on the iOS version and the device's interface orientation,
   * this setting may affect the alignment of the text, badge and icon.
   *
   * @platform ios
   */
  tabBarItemTitlePositionAdjustment?:
    | {
        horizontal?: number | undefined;
        vertical?: number | undefined;
      }
    | undefined;
  /**
   * @summary Specifies the icon color for each tab bar item when tab screen
   * is selected.
   *
   * This also impacts the title text color.
   *
   * Starting from iOS 26, it only applies to selected tab bar item. Other items
   * adopt a dark or light appearance depending on the theme of the tab bar.
   *
   * Is overridden by `tabBarItemTitleFontColor` (for title text color).
   * Overrides `tabBarTintColor`.
   *
   * @platform ios
   */
  tabBarItemIconColor?: ColorValue | undefined;
  /**
   * @summary Specifies the background color of badges for each tab bar item
   * when tab screen is selected.
   *
   * @platform ios
   */
  tabBarItemBadgeBackgroundColor?: ColorValue | undefined;
}

export interface TabsScreenPropsIOS {
  /**
   * @summary Specifies the standard tab bar appearance.
   *
   * Allows to customize the appearance depending on the tab bar item layout (stacked,
   * inline, compact inline) and state (normal, selected, focused, disabled).
   *
   * @platform ios
   */
  standardAppearance?: TabsScreenAppearanceIOS | undefined;
  /**
   * @summary Specifies the tab bar appearace when edge of scrollable content aligns
   * with the edge of the tab bar.
   *
   * Allows to customize the appearance depending on the tab bar item layout (stacked,
   * inline, compact inline) and state (normal, selected, focused, disabled).
   *
   * If this property is `undefined`, UIKit uses `standardAppearance`, modified to
   * have a transparent background.
   *
   * @platform ios
   */
  scrollEdgeAppearance?: TabsScreenAppearanceIOS | undefined;
  /**
   * @summary Specifies the icon for the tab bar item.
   *
   * Supported values:
   * - `{ type: 'imageSource', imageSource }`
   *   Uses an image from the provided resource.
   * - `{ type: 'sfSymbol', name }`
   *   Uses an SF Symbol with the specified name.
   * - `{ type: 'xcasset', name }`
   *   Uses asset from Xcassets.
   * - `{ type: 'templateSource', templateSource }`
   *   Uses the provided image as a template image.
   *   The icon color will depend on the current state
   *   of the tab bar item and icon color-related props.
   *
   * If no `selectedIcon` is provided, this icon will also
   * be used as the selected state icon.
   *
   * @platform ios
   */
  icon?: PlatformIconIOS | undefined;
  /**
   * @summary Specifies the icon for tab bar item when it is selected.
   *
   * Supports the same values as `icon` property.
   *
   * To use `selectedIcon`, `icon` must also be provided.
   *
   * @platform ios
   */
  selectedIcon?: PlatformIconIOS | undefined;
  /**
   * @summary System-provided tab bar item with predefined icon and title
   *
   * Uses Apple's built-in tab bar items (e.g., bookmarks, contacts, downloads) with
   * standard iOS styling and localized titles. Custom `icon` or `selectedIcon`
   * properties will override the system icon, but the system-defined title cannot
   * be customized.
   *
   * @see {@link https://developer.apple.com/documentation/uikit/uitabbaritem/systemitem|UITabBarItem.SystemItem}
   *
   * @platform ios
   */
  systemItem?: TabsScreenSystemItem | undefined;
  /**
   * @summary Specifies if `contentInsetAdjustmentBehavior` of first ScrollView
   * in first descendant chain from tab screen should be overridden back from `never`
   * to `automatic`.
   *
   * By default, `react-native`'s ScrollView has `contentInsetAdjustmentBehavior`
   * set to `never` instead of UIKit-default (which is `automatic`). This
   * prevents ScrollViews from respecting navigation bar insets.
   * When this prop is set to `true`, `automatic` behavior is reverted.
   *
   * Supported only on Fabric.
   *
   * @default true
   *
   * @platform ios
   */
  overrideScrollViewContentInsetAdjustmentBehavior?: boolean | undefined;
  /**
   * @summary Allows to override system appearance for the tab bar.
   *
   * Does not support dynamic changes to the prop value for the currently visible screen.
   *
   * Please note that this prop is marked as **experimental** and might be subject to breaking changes or even removal.
   * Consider using `colorScheme` on `TabsHost` instead.
   *
   * The following values are currently supported:
   * - `unspecified` - an unspecified interface style,
   * - `light` - the light interface style,
   * - `dark` - the dark interface style.
   *
   * The supported values correspond to the official UIKit documentation:
   *
   * @see {@link https://developer.apple.com/documentation/uikit/uiuserinterfacestyle|UIUserInterfaceStyle}
   *
   * @default unspecified
   *
   * @platform ios
   */
  experimental_userInterfaceStyle?: UserInterfaceStyle | undefined;
}
