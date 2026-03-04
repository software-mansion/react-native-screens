import type {
  NativeSyntheticEvent,
  StyleProp,
  ViewProps,
  ViewStyle,
} from 'react-native';

import type { TabsScreenPropsIOS } from './TabsScreen.ios.types';
import type { TabsScreenPropsAndroid } from './TabsScreen.android.types';

// #region General helpers

export type EmptyObject = Record<string, never>;

export type TabsScreenEventHandler<T> = (
  event: NativeSyntheticEvent<T>,
) => void;

export type LifecycleStateChangeEvent = Readonly<{
  previousState: number;
  newState: number;
}>;

// #endregion General helpers

export interface TabsScreenPropsBase {
  // Control
  /**
   * @summary Determines selected tab.
   *
   * In controlled container mode, determines if tab screen is currently
   * focused.
   *
   * In managed container mode, it only indicates initially selected tab.
   *
   * There should be exactly one focused screen at any given time.
   *
   * @platform android, ios
   */
  isFocused?: boolean;
  /**
   * @summary Identifies screen, e.g. when receiving onNativeFocusChange event.
   *
   * @platform android, ios
   */
  tabKey: string;

  // General
  children?: ViewProps['children'];
  style?: StyleProp<Pick<ViewStyle, 'backgroundColor'>>;
  /**
   * @summary Title of the tab screen, displayed in the tab bar item.
   *
   * @platform android, ios
   */
  title?: string;
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
  badgeValue?: string;
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
  specialEffects?: {
    repeatedTabSelection?: {
      /**
       * @default true
       */
      popToRoot?: boolean;
      /**
       * @default true
       */
      scrollToTop?: boolean;
    };
  };

  // Accessibility
  /**
   * @summary testID for the TabsScreen
   */
  testID?: string;
  /**
   * @summary accessibilityLabel for the TabsScreen
   */
  accessibilityLabel?: string;
  /**
   * @summary testID for the TabBarItem
   */
  tabBarItemTestID?: string;
  /**
   * @summary accessibilityLabel for the TabBarItem
   *
   * @supported iOS, Android API level >=26
   */
  tabBarItemAccessibilityLabel?: string;

  // Events
  /**
   * @summary A callback that gets invoked when the tab screen will appear.
   * This is called as soon as the transition begins.
   *
   * @platform android, ios
   */
  onWillAppear?: TabsScreenEventHandler<EmptyObject>;
  /**
   * @summary A callback that gets invoked when the tab screen did appear.
   * This is called as soon as the transition ends.
   *
   * @platform android, ios
   */
  onDidAppear?: TabsScreenEventHandler<EmptyObject>;
  /**
   * @summary A callback that gets invoked when the tab screen will disappear.
   * This is called as soon as the transition begins.
   *
   * @platform android, ios
   */
  onWillDisappear?: TabsScreenEventHandler<EmptyObject>;
  /**
   * @summary A callback that gets invoked when the tab screen did disappear.
   * This is called as soon as the transition ends.
   *
   * @platform android, ios
   */
  onDidDisappear?: TabsScreenEventHandler<EmptyObject>;
}

export interface TabsScreenProps extends TabsScreenPropsBase {
  ios?: TabsScreenPropsIOS;
  android?: TabsScreenPropsAndroid;
}
