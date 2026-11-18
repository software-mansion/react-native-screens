import type { StyleProp, ViewProps, ViewStyle } from 'react-native';

import type { TabsScreenPropsIOS } from './TabsScreen.ios.types';
import type { TabsScreenPropsAndroid } from './TabsScreen.android.types';
import type {
  EmptyEventPayload,
  InterfaceOrientation,
  NativeEventHandler,
} from '../../shared/types';

// #region General helpers

// Currently iOS-only, but we plan to support it on Android
/**
 * Interface orientations a tab screen supports.
 *
 * @remarks
 * The following values are currently supported:
 * - `'inherit'` — tab screen supports the same orientations as parent
 *   component,
 * - `'all'` — tab screen supports all orientations,
 * - `'allButUpsideDown'` — tab screen supports all but the upside-down
 *   portrait interface orientation,
 * - `'portrait'` — tab screen supports both portrait-up and portrait-down
 *   interface orientations,
 * - `'portraitUp'` — tab screen supports a portrait-up interface
 *   orientation,
 * - `'portraitDown'` — tab screen supports a portrait-down interface
 *   orientation,
 * - `'landscape'` — tab screen supports both landscape-left and
 *   landscape-right interface orientations,
 * - `'landscapeLeft'` — tab screen supports landscape-left interface
 *   orientation,
 * - `'landscapeRight'` — tab screen supports landscape-right interface
 *   orientation.
 *
 * The supported values (apart from `'inherit'`, `'portrait'`, `'portraitUp'`,
 * `'portraitDown'`) correspond to the official UIKit documentation.
 *
 * @see {@link https://developer.apple.com/documentation/uikit/uiinterfaceorientationmask | UIInterfaceOrientationMask}
 */
export type TabsScreenOrientation = InterfaceOrientation | 'inherit';

/**
 * Style of a {@link Tabs.Screen}.
 */
export type TabsScreenStyleProps = {
  /**
   * Background color of the tab screen.
   *
   * @platform android, ios
   */
  backgroundColor?: ViewStyle['backgroundColor'] | undefined;
};

/**
 * Special effects for repeated tab selection (selecting already focused tab
 * bar item).
 *
 * @remarks
 * {@link TabsScreenRepeatedTabSelectionEffects.popToRoot | popToRoot} has
 * priority over
 * {@link TabsScreenRepeatedTabSelectionEffects.scrollToTop | scrollToTop}.
 */
export interface TabsScreenRepeatedTabSelectionEffects {
  /**
   * When Stack is nested inside tab screen and repeated selection is detected,
   * the Stack will pop to root screen.
   *
   * @defaultValue `true`
   * @platform android, ios
   */
  popToRoot?: boolean | undefined;
  /**
   * When repeated selection is detected, the content scroll view of the tab
   * screen is scrolled to the top.
   *
   * @remarks
   * The content scroll view can be designated with a {@link ScrollViewMarker}.
   *
   * @defaultValue `true`
   * @platform android, ios
   */
  scrollToTop?: boolean | undefined;
}

/**
 * Special effects (also known as microinteractions) of a tab screen.
 */
export interface TabsScreenSpecialEffects {
  /**
   * Special effects for repeated tab selection.
   *
   * @platform android, ios
   */
  repeatedTabSelection?: TabsScreenRepeatedTabSelectionEffects | undefined;
}

// #endregion General helpers

/**
 * Cross-platform props for {@link Tabs.Screen}.
 */
export interface TabsScreenPropsBase {
  // Control
  /**
   * Identifies screen, e.g. when receiving
   * {@link TabsHostPropsBase.onTabSelected | onTabSelected} event.
   *
   * @platform android, ios
   */
  screenKey: string;
  /**
   * When set to `true`, prevents native tab selection for this screen.
   *
   * @defaultValue `false`
   * @platform android, ios
   */
  preventNativeSelection?: boolean | undefined;
  // General
  /**
   * Content of the tab screen.
   *
   * @platform android, ios
   */
  children?: ViewProps['children'] | undefined;
  /**
   * Style of the tab screen.
   *
   * @platform android, ios
   */
  style?: StyleProp<TabsScreenStyleProps> | undefined;
  /**
   * Title of the tab screen, displayed in the tab bar item.
   *
   * @platform android, ios
   */
  title?: string | undefined;
  /**
   * Specifies content of tab bar item badge.
   *
   * @remarks
   * On iOS, badge is displayed as regular string.
   *
   * On Android, the value is interpreted in the following order:
   * - if the string can be parsed to integer, displays the value as a number;
   * - otherwise if the string is empty, displays "small dot" badge;
   * - otherwise, displays the value as a text.
   *
   * @platform android, ios
   */
  badgeValue?: string | undefined;
  /**
   * Specifies which special effects (also known as microinteractions) are
   * enabled for the tab screen.
   *
   * @defaultValue All special effects are enabled by default.
   * @platform android, ios
   */
  specialEffects?: TabsScreenSpecialEffects | undefined;
  /**
   * Specifies supported orientations for the tab screen.
   *
   * @remarks
   * Procedure for determining supported orientations:
   * 1. Traversal initiates from the root component and moves to the
   *    deepest child possible.
   * 2. Components are queried for their supported orientations:
   *    - if `orientation` is explicitly set (e.g., `'portrait'`,
   *      `'landscape'`), it is immediately used,
   *    - if `orientation` is set to `'inherit'`, the parent component
   *      is queried.
   *
   * @info
   * Some components (like {@link Split.Host}) may choose not to query its
   * child components.
   *
   * @defaultValue `'inherit'`
   * @platform ios
   */
  orientation?: TabsScreenOrientation | undefined;
  // Accessibility
  /**
   * testID for the {@link Tabs.Screen}
   *
   * @platform android, ios
   */
  testID?: string | undefined;
  /**
   * accessibilityLabel for the {@link Tabs.Screen}
   *
   * @platform android, ios
   */
  accessibilityLabel?: string | undefined;
  /**
   * testID for the TabBarItem
   *
   * @platform android, ios
   */
  tabBarItemTestID?: string | undefined;
  /**
   * accessibilityLabel for the TabBarItem
   *
   * @platform android >= 26, ios
   */
  tabBarItemAccessibilityLabel?: string | undefined;
  // Events
  /**
   * A callback that gets invoked when the tab screen will appear.
   * This is called as soon as the transition begins.
   *
   * @platform android, ios
   */
  onWillAppear?: NativeEventHandler<EmptyEventPayload> | undefined;
  /**
   * A callback that gets invoked when the tab screen did appear.
   * This is called as soon as the transition ends.
   *
   * @platform android, ios
   */
  onDidAppear?: NativeEventHandler<EmptyEventPayload> | undefined;
  /**
   * A callback that gets invoked when the tab screen will disappear.
   * This is called as soon as the transition begins.
   *
   * @platform android, ios
   */
  onWillDisappear?: NativeEventHandler<EmptyEventPayload> | undefined;
  /**
   * A callback that gets invoked when the tab screen did disappear.
   * This is called as soon as the transition ends.
   *
   * @platform android, ios
   */
  onDidDisappear?: NativeEventHandler<EmptyEventPayload> | undefined;
}

/**
 * Props for {@link Tabs.Screen}.
 */
export interface TabsScreenProps extends TabsScreenPropsBase {
  /**
   * iOS-specific props.
   *
   * @platform ios
   */
  ios?: TabsScreenPropsIOS | undefined;
  /**
   * Android-specific props.
   *
   * @platform android
   */
  android?: TabsScreenPropsAndroid | undefined;
}
