import type { ViewProps } from 'react-native';
import type { EmptyEventPayload, NativeEventHandler } from '../../shared/types';
import type { StackScreenAnimation } from './animation';

/**
 * Payload of the native dismiss event.
 *
 * @note
 * This is an implementation detail and may change. {@link Stack.Screen} turns
 * this event into a call of `onDismiss` or `onNativeDismiss`.
 */
export type OnDismissEventPayload = {
  /**
   * Whether the user dismissed the screen natively (`true`) or the screen was
   * popped because its `activityMode` became `'detached'` (`false`).
   */
  isNativeDismiss: boolean;
};

/**
 * Whether a screen is on the native stack.
 *
 * @remarks
 * The following values are supported:
 * - `'attached'` — the screen is on the native stack.
 * - `'detached'` — the screen stays mounted, but it is not on the native
 *   stack.
 */
export type StackScreenActivityMode = 'detached' | 'attached';

/**
 * Animation a replace plays, see
 * {@link StackScreenProps.replaceAnimation | replaceAnimation}.
 */
export type StackScreenReplaceAnimation = 'push' | 'pop';

/**
 * Function called when a {@link Stack.Screen} is dismissed.
 *
 * @param screenKey - The `screenKey` of the dismissed screen.
 */
export type StackScreenDismissHandler = (screenKey: string) => void;

/**
 * Props for {@link Stack.Screen}.
 */
export type StackScreenProps = {
  /**
   * Content of the screen.
   *
   * @platform android, ios
   */
  children?: ViewProps['children'] | undefined;

  // Control
  /**
   * Whether the screen is on the native stack.
   *
   * @remarks
   * Changing it to `'attached'` pushes the screen and changing it to
   * `'detached'` pops it. Only the topmost attached screen can be popped,
   * and at least one screen must stay attached.
   *
   * @platform android, ios
   */
  activityMode: StackScreenActivityMode;
  /**
   * Key that identifies the screen.
   *
   * @remarks
   * It must be unique within the stack and must not change.
   *
   * @platform android, ios
   */
  screenKey: string;

  // Events
  /**
   * Called when the screen is about to appear.
   *
   * @platform android, ios
   */
  onWillAppear?: NativeEventHandler<EmptyEventPayload> | undefined;
  /**
   * Called when the screen has appeared.
   *
   * @platform android, ios
   */
  onDidAppear?: NativeEventHandler<EmptyEventPayload> | undefined;
  /**
   * Called when the screen is about to disappear.
   *
   * @platform android, ios
   */
  onWillDisappear?: NativeEventHandler<EmptyEventPayload> | undefined;
  /**
   * Called when the screen has disappeared.
   *
   * @platform android, ios
   */
  onDidDisappear?: NativeEventHandler<EmptyEventPayload> | undefined;

  /**
   * Called when the screen was popped because its `activityMode` became
   * `'detached'`.
   *
   * @platform android, ios
   */
  onDismiss?: StackScreenDismissHandler | undefined;
  /**
   * Called when the user dismissed the screen natively, such as with the back
   * button or the back gesture, while it was still `'attached'`.
   *
   * @remarks
   * The screen is no longer on the native stack: remove it from your state
   * instead of changing its `activityMode` to `'detached'`.
   *
   * @platform android, ios
   */
  onNativeDismiss?: StackScreenDismissHandler | undefined;
  /**
   * Called when the user tries to dismiss the screen natively, but
   * `preventNativeDismiss` stops it.
   *
   * @platform android
   */
  onNativeDismissPrevented?: NativeEventHandler<EmptyEventPayload> | undefined;

  // Configuration
  /**
   * Prevents the user from dismissing the screen natively with the header
   * back button or the system back.
   *
   * @defaultValue `false`
   * @platform android
   */
  preventNativeDismiss?: boolean | undefined;

  /**
   * Transition played when this screen is pushed onto the stack and when it is
   * popped.
   *
   * @remarks
   * The value on the incoming screen drives a push; the value on the outgoing
   * screen drives a pop, including the predictive back gesture. A replace
   * plays the pop animation of the outgoing screen or the push animation of
   * the incoming one, see `replaceAnimation`. Changing it on the top screen
   * takes effect for the next pop.
   *
   * A preset is either its name or an object
   * `{ type: 'preset', name, ...options }`:
   *
   * - `duration` (ms) replaces the preset's reference duration, the longer of
   *   its push and pop; both are rescaled by the same factor, so
   *   `fadeFromBottom` with `duration: 500` pushes in 500 ms and pops in about
   *   357 ms.
   * - `easing` replaces the curve of every animated property of the preset: a
   *   curve name or a cubic bezier `[x1, y1, x2, y2]`. A predictive back
   *   gesture always scrubs linearly with the finger.
   * - `distance`, accepted by `fadeFromBottom` and `fadeFromTop` only, replaces
   *   how far the moving screen rises or falls: a number is
   *   density-independent pixels, `'N%'` a fraction of the container. Defaults
   *   to `'8%'`.
   *
   * `default` and `none` take no options.
   *
   * @note
   * This is an implementation detail and may change. A value the native side
   * cannot use (an unknown name, an option a preset does not accept, a bezier
   * with `x` outside `[0, 1]`, a non-positive duration or distance) logs a
   * warning and falls back to `default`.
   *
   * @defaultValue `'default'`
   * @platform android
   */
  animation?: StackScreenAnimation | undefined;
  /**
   * Which animation a replace plays when this screen is the one replacing the
   * top of the stack.
   *
   * @remarks
   * `'pop'` plays the outgoing screen's pop animation: the outgoing screen
   * leaves on top, as if it had been popped and this screen had been
   * underneath. `'push'` plays this screen's push animation: this screen
   * covers the outgoing one, as if it had been pushed.
   *
   * @defaultValue `'pop'`
   * @platform android
   */
  replaceAnimation?: StackScreenReplaceAnimation | undefined;
};
