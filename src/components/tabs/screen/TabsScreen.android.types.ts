import type { ColorValue, TextStyle } from 'react-native';
import type { PlatformIconAndroid } from '../../../types';

export type TabBarItemLabelVisibilityMode =
  | 'auto'
  | 'selected'
  | 'labeled'
  | 'unlabeled';

export interface TabsScreenItemStateAppearanceAndroid {
  /**
   * @summary Specifies the font color used for the title of each tab bar item.
   *
   * @platform android
   */
  tabBarItemTitleFontColor?: TextStyle['color'] | undefined;
  /**
   * @summary Specifies the icon color for each tab bar item.
   *
   * @platform android
   */
  tabBarItemIconColor?: ColorValue | undefined;
}

export interface TabsScreenAppearanceAndroid {
  /**
   * @summary Specifies the background color for the entire tab bar.
   *
   * @platform android
   */
  tabBarBackgroundColor?: ColorValue | undefined;
  /**
   * @summary Specifies the color of each tab bar item's ripple effect.
   *
   * @platform android
   */
  tabBarItemRippleColor?: ColorValue | undefined;
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
   *
   * @platform android
   */
  tabBarItemLabelVisibilityMode?: TabBarItemLabelVisibilityMode | undefined;
  /**
   * Defines the colors for all tab bar items which are in their enabled, unselected and unfocused state.
   * The color scheme is determined by the configuration of the currently selected tab.
   *
   * @platform android
   */
  normal?: TabsScreenItemStateAppearanceAndroid | undefined;
  /**
   * Defines the colors for the tab bar item that is currently active.
   * The color scheme is determined by the configuration of the currently selected tab itself.
   * Maps to Android `state_selected=true`.
   *
   * @platform android
   */
  selected?: TabsScreenItemStateAppearanceAndroid | undefined;
  /**
   * Defines the colors for a tab bar item when it receives focus.
   * The color scheme is determined by the configuration of the currently selected tab.
   * Maps to Android `state_focused=true` (Used mostly for keyboard navigation).
   *
   * @platform android
   */
  focused?: TabsScreenItemStateAppearanceAndroid | undefined;
  /**
   * Defines the colors for tab bar items when they are disabled.
   * The color scheme is determined by the configuration of the currently selected tab.
   * Maps to Android `state_enabled=false`.
   *
   * @platform android
   */
  disabled?: TabsScreenItemStateAppearanceAndroid | undefined;
  /**
   * @summary Specifies the background color of the active indicator.
   *
   * @platform android
   */
  tabBarItemActiveIndicatorColor?: ColorValue | undefined;
  /**
   * @summary Specifies if the active indicator should be used.
   *
   * @default true
   *
   * @platform android
   */
  tabBarItemActiveIndicatorEnabled?: boolean | undefined;
  /**
   * @summary Specifies the font family used for the title of each tab bar item.
   *
   * @platform android
   */
  tabBarItemTitleFontFamily?: TextStyle['fontFamily'] | undefined;
  /**
   * @summary Specifies the font size used for the title of unselected tab bar items.
   *
   * The size is represented in scale-independent pixels (sp).
   *
   * @platform android
   */
  tabBarItemTitleSmallLabelFontSize?: TextStyle['fontSize'] | undefined;
  /**
   * @summary Specifies the font size used for the title of selected tab bar item.
   *
   * The size is represented in scale-independent pixels (sp).
   *
   * @platform android
   */
  tabBarItemTitleLargeLabelFontSize?: TextStyle['fontSize'] | undefined;
  /**
   * @summary Specifies the font weight used for the title of each tab bar item.
   *
   * @platform android
   */
  tabBarItemTitleFontWeight?: TextStyle['fontWeight'] | undefined;
  /**
   * @summary Specifies the font style used for the title of each tab bar item.
   *
   * @platform android
   */
  tabBarItemTitleFontStyle?: TextStyle['fontStyle'] | undefined;
  /**
   * @summary Specifies the background color of the badge.
   *
   * @platform android
   */
  tabBarItemBadgeBackgroundColor?: ColorValue | undefined;
  /**
   * @summary Specifies the text color of the badge.
   *
   * @platform android
   */
  tabBarItemBadgeTextColor?: ColorValue | undefined;
}

export interface TabsScreenPropsAndroid {
  /**
   * @summary Specifies the standard tab bar appearance.
   *
   * Allows to customize the appearance depending on the tab bar item state
   * (normal, selected, focused, disabled). Configuration for the Bottom Navigation View
   * is determined by the currently active tab screen.
   *
   * @platform android
   */
  standardAppearance?: TabsScreenAppearanceAndroid | undefined;
  /**
   * @summary Specifies the icon for the tab bar item.
   *
   * Supported values:
   * - `{ type: 'imageSource', imageSource }`
   *   Uses an image from the provided resource.
   *
   *   Remarks: `imageSource` type doesn't support SVGs on Android.
   *   For loading SVGs use `drawableResource` type.
   *
   * - `{ type: 'drawableResource', name }`
   *   Uses a drawable resource with the given name.
   *
   *   Remarks: Requires passing a drawable to resources via Android Studio.
   *
   * @platform android
   */
  icon?: PlatformIconAndroid | undefined;
  /**
   * @summary Specifies the icon for tab bar item when it is selected.
   *
   * Supports the same values as `icon` property for given platform.
   *
   * To use `selectedIcon`, `icon` must also be provided.
   *
   * @platform android
   */
  selectedIcon?: PlatformIconAndroid | undefined;
}
