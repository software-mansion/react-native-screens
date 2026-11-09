import type { ViewProps } from 'react-native';
import type { EmptyEventPayload, NativeEventHandler } from '../../shared/types';
import type { StackScreenAnimation } from './animation';

/**
 * Payload of the native dismiss event.
 *
 * @note
 * This is an implementation detail and may change. {@link Stack.Screen} turns
 * this event into a call of {@link StackScreenProps.onDismiss | onDismiss} or
 * {@link StackScreenProps.onNativeDismiss | onNativeDismiss}.
 */
export type OnDismissEventPayload = {
  /**
   * Whether the user dismissed the screen natively (`true`) or the screen was
   * popped because its {@link StackScreenProps.activityMode | activityMode}
   * became `'detached'` (`false`).
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
 * Animation a replace plays.
 *
 * @remarks
 * The following values are supported:
 * - `'pop'` — plays the outgoing screen's pop animation: the outgoing screen
 *   leaves on top, as if it had been popped and the incoming screen had been
 *   underneath.
 * - `'push'` — plays the incoming screen's push animation: the incoming screen
 *   covers the outgoing one, as if it had been pushed.
 */
export type StackScreenReplaceAnimation = 'push' | 'pop';

/**
 * Function called when a {@link Stack.Screen} is dismissed.
 *
 * @param screenKey - The {@link StackScreenProps.screenKey | screenKey} of the
 *   dismissed screen.
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
   * Called when the screen was popped because its
   * {@link StackScreenProps.activityMode | activityMode} became `'detached'`.
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
   * instead of changing its
   * {@link StackScreenProps.activityMode | activityMode} to `'detached'`.
   *
   * @platform android, ios
   */
  onNativeDismiss?: StackScreenDismissHandler | undefined;
  /**
   * Called when the user tries to dismiss the screen natively, but
   * {@link StackScreenProps.preventNativeDismiss | preventNativeDismiss} stops
   * it.
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
   * the incoming one, see
   * {@link StackScreenProps.replaceAnimation | replaceAnimation}. Changing it
   * on the top screen takes effect for the next pop.
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
   * @defaultValue `'pop'`
   * @platform android
   */
  replaceAnimation?: StackScreenReplaceAnimation | undefined;
};
