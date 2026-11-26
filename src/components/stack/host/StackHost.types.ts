import React from 'react';
import type { HostInstance, ViewProps } from 'react-native';
import type {
  ColorScheme,
  Direction,
  NativeEventHandler,
  NavStateActionOrigin,
} from '../../shared/types';

// #region Navigation state

/**
 * Stack state requested from JS, passed to
 * {@link StackHostProps.navStateRequest | navStateRequest}.
 *
 * @remarks
 * The request describes the whole stack JS wants, not an operation. The native
 * side may reject it, see
 * {@link StackHostProps.onNavStateRequestRejected | onNavStateRequestRejected}.
 */
export type StackNavStateRequest = {
  /**
   * Identifies the request.
   *
   * @remarks
   * A new `requestId` is the only thing that makes the native side handle a
   * request. Re-renders that keep the same `requestId` do nothing, so the
   * request can stay in the props for as long as needed.
   *
   * It must be different from the `requestId` of the previous request, and it
   * should grow with every request made to the same {@link Stack.Host}, for
   * example a counter. It must fit in a signed 32-bit integer, so `Date.now()`
   * cannot be used.
   *
   * Changing `stack` or `baseProvenance` while keeping the `requestId` is a
   * programmer error: the native side ignores the change and warns in
   * development builds.
   */
  requestId: number;
  /**
   * Screen keys of the requested stack, from the bottom (the root) to the top.
   *
   * @remarks
   * A valid target stack:
   * - is not empty;
   * - has no duplicate keys;
   * - has only keys of {@link Stack.Screen} components rendered in this
   *   {@link Stack.Host} when the request is applied (a screen rendered in the
   *   same commit as the request counts);
   * - has no keys of screens that were removed from the stack and have not
   *   been released yet (see
   *   {@link StackHostProps.onScreensReleased | onScreensReleased});
   * - keeps the relative order of the screens that stay in the stack.
   *
   * Screens can be inserted and removed at any position.
   */
  stack: readonly string[];
  /**
   * Provenance of the stack state this request is based on.
   *
   * @remarks
   * Pass the `provenance` of the last state received through
   * {@link StackHostProps.onNavStateChanged | onNavStateChanged}, or
   * {@link Provenance.INITIAL} when no state has been received yet, as with
   * the initial request. Provenance values are opaque: pass them back
   * unchanged.
   *
   * A base that is neither {@link Provenance.INITIAL} nor a provenance this
   * {@link Stack.Host} has reported makes the request `'invalid'`.
   */
  baseProvenance: number;
};

/**
 * Origin (actor) of a change of the stack state.
 *
 * @remarks
 * The following values are supported:
 * - `'user'` — a native UI action, such as the back button, the back gesture,
 *   the back-button menu on iOS, or the system back on Android.
 * - `'programmaticJs'` — a change requested from JS through
 *   {@link StackHostProps.navStateRequest | navStateRequest}.
 * - `'programmaticNative'` — a change requested by native code that
 *   integrates directly with the native container, such as a pop to the root
 *   when the tab that hosts the stack is selected again.
 * - `'implicit'` — a platform side effect that no explicit actor asked for.
 */
export type StackActionOrigin = NavStateActionOrigin;

/**
 * Reason why the native side rejected a
 * {@link StackHostProps.navStateRequest | navStateRequest}.
 *
 * @remarks
 * The following values are supported:
 * - `'stale'` — the request was based on a state that has since been changed
 *   by something other than JS requests, such as the user going back, and
 *   {@link StackHostProps.rejectStaleNavStateUpdates | rejectStaleNavStateUpdates}
 *   is enabled.
 * - `'repeated'` — the requested stack equals the current one, so nothing
 *   changes.
 * - `'invalid'` — the requested stack is not a valid target, or its
 *   {@link StackNavStateRequest.baseProvenance | baseProvenance} is unknown to
 *   this {@link Stack.Host}. Development builds log which rule the request
 *   broke.
 */
export type StackNavStateRejectionReason = 'stale' | 'repeated' | 'invalid';

/**
 * Payload of {@link StackHostProps.onNavStateChanged | onNavStateChanged}.
 */
export type StackNavStateChangedEvent = {
  /**
   * Screen keys of the stack after the change, from the bottom to the top.
   */
  stack: string[];
  /**
   * Provenance of the stack state after the change.
   *
   * @remarks
   * Pass it as {@link StackNavStateRequest.baseProvenance | baseProvenance}
   * of the next request.
   */
  provenance: number;
  /**
   * Origin (actor) of the change.
   */
  actionOrigin: StackActionOrigin;
};

/**
 * Payload of
 * {@link StackHostProps.onNavStateRequestRejected | onNavStateRequestRejected}.
 *
 * @remarks
 * Carries the current stack state together with the rejected request, so that
 * JS can make a new request on top of the current state.
 */
export type StackNavStateRequestRejectedEvent = {
  /**
   * Screen keys of the current (unchanged) stack, from the bottom to the top.
   */
  stack: string[];
  /**
   * Provenance of the current stack state.
   */
  provenance: number;
  /**
   * {@link StackNavStateRequest.stack | stack} of the rejected request.
   */
  rejectedStack: string[];
  /**
   * {@link StackNavStateRequest.baseProvenance | baseProvenance} of the
   * rejected request.
   */
  rejectedBaseProvenance: number;
  /**
   * Reason the request was rejected.
   */
  rejectionReason: StackNavStateRejectionReason;
};

/**
 * Payload of {@link StackHostProps.onScreensReleased | onScreensReleased}.
 */
export type StackScreensReleasedEvent = {
  /**
   * Keys of the screens the native side no longer holds.
   */
  screenKeys: string[];
};

/**
 * Payload of
 * {@link StackHostProps.onNativeDismissPrevented | onNativeDismissPrevented}.
 */
export type StackNativeDismissPreventedEvent = {
  /**
   * Screen keys of the current (unchanged) stack, from the bottom to the top.
   */
  stack: string[];
  /**
   * Provenance of the current stack state.
   */
  provenance: number;
  /**
   * Keys of the screens with
   * {@link StackScreenProps.preventNativeDismiss | preventNativeDismiss}
   * that prevented the dismissal.
   *
   * @remarks
   * A dismissal of several screens at once is prevented as a whole if any of
   * them prevents it.
   */
  preventedScreenKeys: string[];
};

// #endregion Navigation state

/**
 * Color scheme used by a Stack and any child containers.
 *
 * @remarks
 * The following values are currently supported:
 * - `'inherit'` — the interface style from parent,
 * - `'light'` — the light interface style,
 * - `'dark'` — the dark interface style.
 */
export type StackColorScheme = ColorScheme | 'inherit';

/**
 * Layout direction of a Stack, its views and child containers.
 *
 * @remarks
 * The following values are currently supported:
 * - `'inherit'` — uses parent's layout direction,
 * - `'ltr'` — forces left-to-right layout direction,
 * - `'rtl'` — forces right-to-left layout direction.
 */
export type StackDirection = Direction | 'inherit';

/**
 * Props for {@link Stack.Host}.
 */
export type StackHostProps = {
  // Control
  /**
   * The stack state requested from the native side. It also defines the
   * initial stack.
   *
   * @remarks
   * The {@link Stack.Host} holds the stack state: the ordered list of screens
   * in the stack. The children of the host are a pool of screens addressed by
   * {@link StackScreenProps.screenKey | screenKey}; a rendered screen whose key
   * is not in the stack is mounted, but it is not shown. The order of the
   * children carries no meaning, although rendering them in stack order,
   * followed by the other screens, is recommended.
   *
   * - To preload a screen, render it without adding its key to the stack.
   * - To push a screen, request a stack with its key, and render the screen no
   *   later than in the same commit.
   * - To pop a screen, request a stack without its key, and keep rendering the
   *   screen until
   *   {@link StackHostProps.onScreensReleased | onScreensReleased} reports it,
   *   so its content stays visible during its exit transition.
   *
   * The first request defines the initial stack. It is applied without
   * animation, and its {@link StackNavStateRequest.baseProvenance | baseProvenance}
   * should be {@link Provenance.INITIAL}.
   *
   * @see {@link StackNavStateRequest} for the request fields and the rules a
   *   request must follow.
   * @platform android, ios
   */
  navStateRequest: StackNavStateRequest;
  /**
   * Whether the native side rejects requests based on an outdated state.
   *
   * @remarks
   * A request is stale when the stack state it is based on
   * ({@link StackNavStateRequest.baseProvenance | baseProvenance}) has since
   * been changed by something other than JS requests, for example the user
   * went back before the request reached the native side. Successive JS
   * requests do not make each other stale.
   *
   * Applying a stale request can bring back a screen the user has just
   * dismissed, so stale requests are rejected by default. A rejected request
   * calls
   * {@link StackHostProps.onNavStateRequestRejected | onNavStateRequestRejected}
   * with the current state, on top of which JS can make a new request.
   *
   * @defaultValue `true`
   * @platform android, ios
   */
  rejectStaleNavStateUpdates?: boolean | undefined;

  // Events
  /**
   * Called on every change of the stack state, whatever its origin, including
   * the initial state.
   *
   * @remarks
   * Treat it as the only source of the confirmed stack state, and do not send
   * the state it reports back as a request.
   *
   * @platform android, ios
   */
  onNavStateChanged?: NativeEventHandler<StackNavStateChangedEvent> | undefined;
  /**
   * Called when the native side rejects a
   * {@link StackHostProps.navStateRequest | navStateRequest}.
   *
   * @see {@link StackNavStateRejectionReason} for the reasons.
   * @platform android, ios
   */
  onNavStateRequestRejected?:
    | NativeEventHandler<StackNavStateRequestRejectedEvent>
    | undefined;
  /**
   * Called when screens removed from the stack are no longer needed by the
   * native side.
   *
   * @remarks
   * A screen is released when its exit transition finishes, or right after
   * the change that removed it if it was removed without a transition, such
   * as from the middle of the stack. Every screen removed from the stack is
   * released exactly once.
   *
   * After this event, the screens can be unmounted without cutting an exit
   * transition short. They can also stay rendered, for example to keep their
   * state for a later push.
   *
   * @platform android, ios
   */
  onScreensReleased?: NativeEventHandler<StackScreensReleasedEvent> | undefined;
  /**
   * Called when the user tries to dismiss screens natively, but a screen with
   * {@link StackScreenProps.preventNativeDismiss | preventNativeDismiss}
   * prevents it.
   *
   * @platform android
   */
  onNativeDismissPrevented?:
    | NativeEventHandler<StackNativeDismissPreventedEvent>
    | undefined;

  // General
  /**
   * Screens of the stack, declared with {@link Stack.Screen}.
   *
   * @platform android, ios
   */
  children: NonNullable<ViewProps['children']>;
  // TODO: Work on these types
  /**
   * Ref to the native view of the stack.
   *
   * @platform android, ios
   */
  ref?: React.Ref<HostInstance> | undefined;
  /**
   * Specifies the layout direction of the native container, its views and
   * child containers.
   *
   * @note
   * This is an implementation detail and may change. On Android, this property
   * relies on `react-native`'s `style.direction` (which sets the native Android
   * `layoutDirection` View property). It is propagated via the view hierarchy,
   * so `inherit` falls back to the direction set on one of the parent views.
   *
   * @defaultValue `'inherit'`
   * @platform android
   */
  direction?: StackDirection | undefined;
  /**
   * Specifies the color scheme used by the container and any child
   * containers.
   *
   * @remarks
   * Toolbar menu state survives a change of the effective color scheme:
   * checkbox/radio selections and changes applied via the
   * `updateToolbarMenuElements` view command are reapplied.
   *
   * @note
   * This is an implementation detail and may change. On Android, changing the
   * effective color scheme rebuilds the header.
   *
   * @defaultValue `'inherit'`
   * @platform android
   */
  colorScheme?: StackColorScheme | undefined;
};
