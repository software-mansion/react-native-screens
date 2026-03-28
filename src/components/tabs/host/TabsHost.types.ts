import type { ColorValue, NativeSyntheticEvent, ViewProps } from 'react-native';
import type { TabsHostPropsAndroid } from './TabsHost.android.types';
import type { TabsHostPropsIOS } from './TabsHost.ios.types';
import type { ColorScheme, Direction } from '../../shared/types';

// #region Control

export type TabsHostNavState = {
  /**
   * @summary Valid screen key.
   *
   * @description
   * It must correspond to one of the keys you assign to the `TabsScreens`.
   * There is one notable exception of `SCREEN_KEY_MORE_NAV_CTRL`, which can be
   * used on iOS to select the {@link https://developer.apple.com/documentation/uikit/uitabbarcontroller/morenavigationcontroller?language=objc moreNavigationController}.
   *
   * @see `SCREEN_KEY_MORE_NAV_CTRL` in `./constants`.
   */
  selectedScreenKey: string;
  /**
   * @summary A number describing the provenance of the state instance.
   *
   * @description
   * The provenance value establishes a relationship between different navigation state instances
   * held by different state holders. The assumption here is that when the navigation
   * state is progressed (modified), the provenance number is incremented.
   * This creates a relationship where we can say that:
   *
   * 1. State with provenance = n + 1 has been derived from state with provenance = n.
   * 2. For two given navigation states A and B, we can say that A *is stale* iff
   * A.provenance <= B.provenance.
   *
   * This allows us to mitigate and resolve state conflicts that can happen with
   * asynchronous navigation.
   */
  provenance: number;
};

// #endregion Control

// #region General helpers

export type TabSelectedEvent = {
  selectedScreenKey: string;
  provenance: number;
  isRepeated: boolean;
  hasTriggeredSpecialEffect: boolean;
  isNativeAction: boolean;
};

export type TabSelectionRejectedEvent = {
  selectedScreenKey: string;
  provenance: number;
  rejectedScreenKey: string;
  rejectedProvenance: number;
};

export type TabsHostColorScheme = ColorScheme | 'inherit';

export type TabsHostDirection = Direction | 'inherit';

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
  // Control
  /**
   * @summary
   * The navigation state for the tabs host to align to. It also determines
   * initial navigation state after first render.
   *
   * @description
   * This prop can be thought of as a "next navigation state suggestion for the native side".
   * Depending on configuration and the provenance of the update
   * the update might get accepted or rejected.
   *
   * @see {@link TabsHostPropsBase#rejectStaleNavStateUpdates}
   * @see {@link TabsHostNavState} for description of the type model & accepted values.
   */
  navState: TabsHostNavState;
  /**
   * @summary If true, the native side will reject any navigation state updates coming from JS
   * if the provenance of the update is stale.
   *
   * @description A navigation state update is considered stale if its provenance is older
   * than the provenance of the currently active navigation state.
   *
   * This can happen, when an update from JS is dispatched, but before it reaches the native
   * side, another update happens on UI thread, e.g. user selects another tab. For such
   * situations, where to-be-applied navigation state update had been dispatched w/o
   * full context of actual navigation state you can toggle this prop.
   *
   * If an update is rejected due to being stale, the `onTabSelectionRejected` event will be
   * emitted with details of the rejected update and the currently active navigation state.
   *
   * @default false
   */
  rejectStaleNavStateUpdates?: boolean;

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
   * @summary A callback that gets invoked when the selected tab changes.
   *
   * @platform android, ios
   */
  onTabSelected?: (event: NativeSyntheticEvent<TabSelectedEvent>) => void;

  /**
   * @summary
   * A callback that gets invoked when the native side rejects a tab selection request.
   *
   * @see {@link TabSelectionRejectedEvent}
   */
  onTabSelectionRejected?: (
    event: NativeSyntheticEvent<TabSelectionRejectedEvent>,
  ) => void;
}

export interface TabsHostProps extends TabsHostPropsBase {
  ios?: TabsHostPropsIOS;
  android?: TabsHostPropsAndroid;
}
