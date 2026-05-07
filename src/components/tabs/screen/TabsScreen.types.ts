import type {
  NativeSyntheticEvent,
  StyleProp,
  ViewProps,
  ViewStyle,
} from 'react-native';

import type { TabsScreenPropsIOS } from './TabsScreen.ios.types';
import type { TabsScreenPropsAndroid } from './TabsScreen.android.types';
import type { InterfaceOrientation } from '../../shared/types';

// #region General helpers

export type EmptyObject = Record<string, never>;

export type TabsScreenEventHandler<T> = (
  event: NativeSyntheticEvent<T>,
) => void;

// Currently iOS-only, but we plan to support it on Android
export type TabsScreenOrientation = InterfaceOrientation | 'inherit';

// #endregion General helpers

export interface TabsScreenPropsBase {
  // Control
  /**
   * @summary Identifies screen, e.g. when receiving onNativeFocusChange event.
   *
   * @platform android, ios
   */
  screenKey: string;
  /**
   * @summary When set to `true`, prevents native tab selection for this screen.
   *
   * @default false
   *
   * @platform android, ios
   */
  preventNativeSelection?: boolean | undefined;

  // General
  children?: ViewProps['children'] | undefined;
  style?: StyleProp<Pick<ViewStyle, 'backgroundColor'>> | undefined;
  /**
   * @summary Title of the tab screen, displayed in the tab bar item.
   *
   * @platform android, ios
   */
  title?: string | undefined;
  /**
   * @summary Specifies content of tab bar item badge.
   *
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
   * @summary Specifies which special effects (also known as microinteractions)
   * are enabled for the tab screen.
   *
   * For repeated tab selection (selecting already focused tab bar item),
   * there are 2 supported special effects:
   * - `popToRoot` - when Stack is nested inside tab screen and repeated
   *   selection is detected, the Stack will pop to root screen,
   * - `scrollToTop` - when there is a ScrollView in first descendant
   *   chain from tab screen and repeated selection is detected, ScrollView
   *   will be scrolled to top.
   *
   * `popToRoot` has priority over `scrollToTop`.
   *
   * @default All special effects are enabled by default.
   *
   * @platform android, ios
   */
  specialEffects?:
    | {
        repeatedTabSelection?:
          | {
              /**
               * @default true
               */
              popToRoot?: boolean | undefined;
              /**
               * @default true
               */
              scrollToTop?: boolean | undefined;
            }
          | undefined;
      }
    | undefined;
  /**
   * @summary Specifies supported orientations for the tab screen.
   *
   * Procedure for determining supported orientations:
   * 1. Traversal initiates from the root component and moves to the
   *    deepest child possible.
   * 2. Components are queried for their supported orientations:
   *    - if `orientation` is explicitly set (e.g., `portrait`,
   *      `landscape`), it is immediately used,
   *    - if `orientation` is set to `inherit`, the parent component
   *      is queried.
   *
   * Note that:
   * - some components (like `SplitHost`) may choose not to query
   *   its child components,
   * - Stack v4 implementation **ALWAYS** returns some supported
   *   orientations (`allButUpsideDown` by default), overriding
   *   orientation from tab screen.
   *
   * The following values are currently supported:
   *
   * - `inherit` - tab screen supports the same orientations as parent
   *   component,
   * - `all` - tab screen supports all orientations,
   * - `allButUpsideDown` - tab screen supports all but the upside-down
   *   portrait interface orientation,
   * - `portrait` - tab screen supports both portrait-up and portrait-down
   *   interface orientations,
   * - 'portraitUp' - tab screen supports a portrait-up interface
   *   orientation,
   * - `portraitDown` - tab screen supports a portrait-down interface
   *   orientation,
   * - `landscape` - tab screen supports both landscape-left and
   *   landscape-right interface orientations,
   * - `landscapeLeft` - tab screen supports landscape-left interface
   *   orientaion,
   * - `landscapeRight` - tab screen supports landscape-right interface
   *   orientaion.
   *
   * The supported values (apart from `inherit`, `portrait`, `portraitUp`,
   * `portraitDown`) correspond to the official UIKit documentation:
   *
   * @see {@link https://developer.apple.com/documentation/uikit/uiinterfaceorientationmask|UIInterfaceOrientationMask}
   *
   * @default inherit
   *
   * @platform ios
   */
  orientation?: TabsScreenOrientation | undefined;

  // Accessibility
  /**
   * @summary testID for the TabsScreen
   */
  testID?: string | undefined;
  /**
   * @summary accessibilityLabel for the TabsScreen
   */
  accessibilityLabel?: string | undefined;
  /**
   * @summary testID for the TabBarItem
   */
  tabBarItemTestID?: string | undefined;
  /**
   * @summary accessibilityLabel for the TabBarItem
   *
   * @supported iOS, Android API level >=26
   */
  tabBarItemAccessibilityLabel?: string | undefined;

  // Events
  /**
   * @summary A callback that gets invoked when the tab screen will appear.
   * This is called as soon as the transition begins.
   *
   * @platform android, ios
   */
  onWillAppear?: TabsScreenEventHandler<EmptyObject> | undefined;
  /**
   * @summary A callback that gets invoked when the tab screen did appear.
   * This is called as soon as the transition ends.
   *
   * @platform android, ios
   */
  onDidAppear?: TabsScreenEventHandler<EmptyObject> | undefined;
  /**
   * @summary A callback that gets invoked when the tab screen will disappear.
   * This is called as soon as the transition begins.
   *
   * @platform android, ios
   */
  onWillDisappear?: TabsScreenEventHandler<EmptyObject> | undefined;
  /**
   * @summary A callback that gets invoked when the tab screen did disappear.
   * This is called as soon as the transition ends.
   *
   * @platform android, ios
   */
  onDidDisappear?: TabsScreenEventHandler<EmptyObject> | undefined;
}

export interface TabsScreenProps extends TabsScreenPropsBase {
  ios?: TabsScreenPropsIOS | undefined;
  android?: TabsScreenPropsAndroid | undefined;
}
