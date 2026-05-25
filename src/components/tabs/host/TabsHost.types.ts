import type { ColorValue, NativeSyntheticEvent, ViewProps } from 'react-native';
import type { TabsHostPropsAndroid } from './TabsHost.android.types';
import type { TabsHostPropsIOS } from './TabsHost.ios.types';
import type { ColorScheme, Direction } from '../../shared/types';

// #region Control

export type TabsHostNavStateRequest = {
  /**
   * @summary Valid screen key.
   *
   * @description
   * It must correspond to one of the keys you assign to the `TabsScreens`.
   */
  selectedScreenKey: string;
  /**
   * @summary Provenance of the navigation state this request is derived from.
   *
   * @description
   * The provenance value establishes a relationship between different navigation state instances
   * held by given state holder. The assumption is that when the navigation state is progressed
   * (modified), the provenance number is incremented. This creates a relationship where we can say:
   *
   * 1. State with provenance = n + 1 has been derived from state with provenance = n.
   * 2. For two given navigation states A and B, we can say that A *is stale* iff
   * A.provenance <= B.provenance.
   *
   * This allows us to mitigate and resolve state conflicts that can happen with
   * asynchronous navigation.
   *
   * Currently, the native implementation of TabsHost is the state holder.
   *
   * Pass here THE PROVENANCE OF THE LAST ACKNOWLEDGED state you received from native side
   * via {@link TabsHostPropsBase#onTabSelected}. In other words this should be the provenance
   * number of last confirmed state you base your update request on.
   *
   * It is named `baseProvenance` (rather than `provenance`) to disambiguate it from the
   * `provenance` field on the {@link TabSelectedEvent} payload, which carries the provenance
   * of the state *resulting* from a transition.
   */
  baseProvenance: number;
};

// #endregion Control

// #region General helpers

/**
 * @summary Payload of the event emitted when a tab selection occurs on the native side.
 *
 * @description
 * This event is emitted both for user-initiated and programmatic tab changes.
 * It carries the resulting navigation state along with metadata about the selection context.
 */
export type TabSelectedEvent = {
  /** Screen key of the newly selected tab. */
  selectedScreenKey: string;
  /** Provenance of the navigation state after the selection. */
  provenance: number;
  /** Whether the same tab that was already selected has been selected again. */
  isRepeated: boolean;
  /** Whether the selection triggered a special effect (e.g. scroll-to-top on repeated selection). */
  hasTriggeredSpecialEffect: boolean;
  /**
   * @summary Origin (actor) that requested this tab transition.
   *
   * @description
   * - `user` — direct native UI interaction (e.g. tab bar tap, iOS tab drag-and-drop).
   * - `programmatic-js` — JS-initiated request delivered via the `navStateRequest` prop.
   * - `programmatic-native` — request initiated from the native side by an actor
   *   integrating directly against the native container.
   * - `implicit` — platform side effect not attributable to an explicit actor
   *   (e.g. UIKit reshuffling the selection during a horizontal size-class transition on iPad).
   *   Currently only emitted on iOS.
   */
  actionOrigin: 'user' | 'programmatic-js' | 'programmatic-native' | 'implicit';
};

/**
 * @summary Reason why a tab selection request was rejected by the native side.
 *
 * - `stale` — the update was based on a stale navigation state,
 *   meaning a newer state has already been applied. Only reported when
 *   {@link TabsHostPropsBase#rejectStaleNavStateUpdates} is enabled.
 * - `repeated` — the requested tab is already selected.
 */
export type TabSelectionRejectionReason = 'stale' | 'repeated';

/**
 * @summary Payload of the event emitted when the native side rejects a tab selection request.
 *
 * @description
 * Contains the currently active navigation state (`selectedScreenKey`, `provenance`)
 * alongside the rejected request details, so that the JS side can reconcile its state.
 *
 * @see {@link TabSelectionRejectionReason} for possible rejection reasons.
 * @see {@link TabsHostPropsBase#rejectStaleNavStateUpdates}
 */
export type TabSelectionRejectedEvent = {
  /** Screen key of the currently selected (active) tab. */
  selectedScreenKey: string;
  /** Provenance of the currently active navigation state. */
  provenance: number;
  /** Screen key of the tab whose selection was rejected. */
  rejectedScreenKey: string;
  /** Base provenance of the rejected navigation state update. */
  rejectedBaseProvenance: number;
  /** Reason the selection was rejected. */
  rejectionReason: TabSelectionRejectionReason;
};

/**
 * @summary Payload of the event emitted when the native side prevents a tab selection
 * because the target screen has `preventNativeSelection` enabled.
 */
export type TabSelectionPreventedEvent = {
  /** Screen key of the currently selected (active) tab. */
  selectedScreenKey: string;
  /** Provenance of the currently active navigation state. */
  provenance: number;
  /** Screen key of the tab whose selection was prevented. */
  preventedScreenKey: string;
};

export type TabsHostColorScheme = ColorScheme | 'inherit';

export type TabsHostDirection = Direction | 'inherit';

export type TabsHostNativeContainerStyleProps = {
  /**
   * @summary Specifies the background color of the native container.
   *
   * @platform android, ios
   */
  backgroundColor?: ColorValue | undefined;
};

// #endregion General helpers

export interface TabsHostPropsBase {
  // Control
  /**
   * @summary
   * Allows to pass desired navigation state request to the native side.
   * It also determines initial navigation state after first render.
   *
   * @description
   * This prop can be thought of as a "next navigation state suggestion for the native side".
   * Depending on configuration and the provenance of the update
   * the update might get accepted or rejected.
   *
   * @see {@link TabsHostPropsBase#rejectStaleNavStateUpdates}
   * @see {@link TabsHostNavStateRequest} for description of the type model & accepted values.
   */
  navStateRequest: TabsHostNavStateRequest;
  /**
   * @summary If true, the native side will reject any navigation state updates coming from JS
   * if they are stale.
   *
   * @description A navigation state update is considered stale if it is based of an stale state
   * ({@link TabsHostNavStateRequest#baseProvenance} indicates the base state).
   * A state is stale, when at the time of executing update, there already had been accepted a newer state
   * of different origin.
   *
   * This can happen, when an update from JS is dispatched, but before it reaches the native
   * side, another update happens on UI thread, e.g. user selects another tab. For such
   * situations, where to-be-applied navigation state update had been dispatched w/o
   * full context of actual navigation state you can toggle this prop. Please note,
   * that above definition means, that an JS update won't be rejected if you send a series of
   * udpates with the same provenance, unless some action has been taken by the user "in the meantime".
   *
   * If an update is rejected due to being stale, the `onTabSelectionRejected` event will be
   * emitted with details of the rejected update and the currently active navigation state.
   *
   * @default false
   */
  rejectStaleNavStateUpdates?: boolean | undefined;

  // General
  children: NonNullable<ViewProps['children']>;
  /**
   * @summary Hides the tab bar.
   *
   * @default false
   *
   * @platform android, ios
   */
  tabBarHidden?: boolean | undefined;
  /**
   * @summary Allows for native container view customization.
   *
   * On Android, style is applied to `FrameLayout` that wraps currently focused screen
   * and `BottomNavigationView`. On iOS, style is applied to `UITabBarController`'s
   * view.
   *
   * @platform android, ios
   */
  nativeContainerStyle?: TabsHostNativeContainerStyleProps | undefined;
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
  direction?: TabsHostDirection | undefined;
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
  colorScheme?: TabsHostColorScheme | undefined;

  // Events
  /**
   * @summary A callback that gets invoked when the selected tab changes.
   *
   * @platform android, ios
   */
  onTabSelected?:
    | ((event: NativeSyntheticEvent<TabSelectedEvent>) => void)
    | undefined;

  /**
   * @summary
   * A callback that gets invoked when the native side rejects a tab selection request.
   *
   * @see {@link TabSelectionRejectedEvent}
   */
  onTabSelectionRejected?:
    | ((event: NativeSyntheticEvent<TabSelectionRejectedEvent>) => void)
    | undefined;

  /**
   * @summary
   * A callback that gets invoked when the native side prevents a tab selection
   * because the target screen has `preventNativeSelection` enabled.
   *
   * @see {@link TabSelectionPreventedEvent}
   */
  onTabSelectionPrevented?:
    | ((event: NativeSyntheticEvent<TabSelectionPreventedEvent>) => void)
    | undefined;
}

export interface TabsHostProps extends TabsHostPropsBase {
  ios?: TabsHostPropsIOS | undefined;
  android?: TabsHostPropsAndroid | undefined;
}
