import type { ColorValue, NativeSyntheticEvent, ViewProps } from 'react-native';
import type { TabsHostPropsAndroid } from './TabsHost.android.types';
import type { TabsHostPropsIOS } from './TabsHost.ios.types';
import { ColorScheme, Direction } from '../../shared/types';

// #region General helpers

export type NativeFocusChangeEvent = {
  tabKey: string;
  repeatedSelectionHandledBySpecialEffect: boolean;
};

export type TabsHostColorScheme = ColorScheme | 'inherit';

export type TabsHostDirection = Direction;

export type TabsHostNativeContainerStyleProps = {
  /**
   * @summary Specifies the background color of the native container.
   *
   * @platform android, ios
   */
  backgroundColor?: ColorValue;
};

// #endregion General helpers

export interface TabsHostPropsBase {
  // General
  children?: ViewProps['children'];
  /**
   * @summary Hides the tab bar.
   *
   * @default false
   *
   * @platform android, ios
   */
  tabBarHidden?: boolean;
  /**
   * @summary Allows for native container view customization.
   *
   * On Android, style is applied to `FrameLayout` that wraps currently focused screen
   * and `BottomNavigationView`. On iOS, style is applied to `UITabBarController`'s
   * view.
   *
   * @platform android, ios
   */
  nativeContainerStyle?: TabsHostNativeContainerStyleProps;
  /**
   * @summary Specifies the layout direction of the native container, its views and child containers.
   *
   * The following values are currently supported:
   *
   * - `inherit` - uses parent's layout direction,
   * - `ltr` - forces left-to-right layout direction,
   * - `rtl` - forces right-to-left layout direction.
   *
   * On Android, this property relies on `react-native`'s `style.direction`
   * (which sets native Android `layoutDirection` View property). Property is
   * propagated via the view hierarchy. The value will fallback to direction
   * set on one of the parent views.
   *
   * On iOS, this property sets `layoutDirection` trait override for the
   * native tab bar controller. Property is propagated via the native trait
   * system. The value will fallback to direction of the **native** app
   * (`userInterfaceLayoutDirection`), potentially ignoring `react-native`'s
   * override (e.g. when `forceRTL` is used). To mitigate this, you can pass
   * `ltr`/`rtl` to this property depending on the value of `I18nManager.isRTL`.
   *
   * @default inherit
   *
   * @platform android, ios
   */
  direction?: TabsHostDirection;
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
   * @platform android, ios
   */
  colorScheme?: TabsHostColorScheme;

  // Experimental support
  /**
   * @summary Experimental prop for changing container control.
   *
   * If set to true, tab screen changes need to be handled by JS using
   * onNativeFocusChange callback (controlled/programatically-driven).
   *
   * If set to false, tab screen change will not be prevented by the
   * native side (managed/natively-driven).
   *
   * On Android, only controlled tabs are currently supported and the
   * value of this prop is ignored.
   *
   * @default Defaults to `false`.
   *
   * @platform android, ios
   */
  experimentalControlNavigationStateInJS?: boolean;

  // Events
  /**
   * A callback that gets invoked when user requests change of focused tab screen.
   *
   * @platform android, ios
   */
  onNativeFocusChange?: (
    event: NativeSyntheticEvent<NativeFocusChangeEvent>,
  ) => void;
}

export interface TabsHostProps extends TabsHostPropsBase {
  ios?: TabsHostPropsIOS;
  android?: TabsHostPropsAndroid;
}
