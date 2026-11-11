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
 * Transition a replace plays, see
 * {@link StackScreenProps.replaceAnimation | replaceAnimation}.
 *
 * @remarks
 * The following values are supported:
 * - `'pop'` — plays the outgoing screen's pop transition: the outgoing screen
 *   leaves on top, as if it had been popped and the incoming screen had been
 *   underneath.
 * - `'push'` — plays the incoming screen's push transition: the incoming
 *   screen covers the outgoing one, as if it had been pushed.
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
   * Hold an animated push at its first frame while the destination lays out.
   * Set on attachment and clear when ready. The push starts after one second
   * if still held. Applies to iOS stack-managed animation presets.
   *
   * @defaultValue false
   * @platform ios
   */
  transitionStartDeferred?: boolean | undefined;
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
   * Animation of this screen: the transition played when it is pushed onto the
   * stack and the one played when it is popped.
   *
   * @remarks
   * The value on the incoming screen drives a push; the value on the outgoing
   * screen drives a pop, including the predictive back gesture. A replace plays
   * the pop transition of the outgoing screen or the push transition of the
   * incoming one, see
   * {@link StackScreenProps.replaceAnimation | replaceAnimation}. Changing the
   * value on the top screen takes effect for the next pop.
   *
   * On iOS, `'default'` plays UIKit's own transition; `'none'`, `'fade'`,
   * `'slideFromRight'`, `'slideFromLeft'`, `'slideFromBottom'` and
   * `'slideFromTop'` play; any other value logs a warning and plays
   * `'default'`. A pop by the back swipe always plays UIKit's transition.
   *
   * @note
   * This is an implementation detail and may change. A value the native side
   * cannot use (an unknown name, an option a preset does not accept where it is
   * written, a preset written where it is not allowed, a bezier with `x`
   * outside `[0, 1]`, a duration under one millisecond, a non-positive
   * distance, a track without a duration) logs a warning and falls back to
   * `'default'` for the whole prop.
   *
   * @defaultValue `'default'`
   * @platform android, ios
   */
  animation?: StackScreenAnimation | undefined;
  /**
   * Which transition a replace plays when this screen is the one replacing the
   * top of the stack.
   *
   * @defaultValue `'pop'`
   * @platform android
   */
  replaceAnimation?: StackScreenReplaceAnimation | undefined;
};
