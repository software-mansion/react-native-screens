import { NativeSyntheticEvent, ViewProps } from 'react-native';
import type { StackScreenAnimation } from './animation';

export type OnDismissEventPayload = {
  isNativeDismiss: boolean;
};

export type EmptyEventPayload = Record<string, never>;

export type OnDismissEvent = NativeSyntheticEvent<OnDismissEventPayload>;

export type StackScreenActivityMode = 'detached' | 'attached';

/**
 * Transition a replace plays, see {@link StackScreenProps.replaceAnimation | replaceAnimation}.
 *
 * The following values are supported:
 * - `'push'` - the incoming screen's push transition.
 * - `'pop'` - the outgoing screen's pop transition.
 *
 * @platform android >= 21
 */
export type StackScreenReplaceAnimation = 'push' | 'pop';

export type StackScreenEventHandler = (
  event: NativeSyntheticEvent<EmptyEventPayload>,
) => void;

export type StackScreenProps = {
  children?: ViewProps['children'] | undefined;

  // Control
  activityMode: StackScreenActivityMode;
  screenKey: string;

  // Events
  onWillAppear?: StackScreenEventHandler | undefined;
  onDidAppear?: StackScreenEventHandler | undefined;
  onWillDisappear?: StackScreenEventHandler | undefined;
  onDidDisappear?: StackScreenEventHandler | undefined;

  onDismiss?: ((screenKey: string) => void) | undefined;
  onNativeDismiss?: ((screenKey: string) => void) | undefined;
  onNativeDismissPrevented?: StackScreenEventHandler | undefined;

  // Configuration
  preventNativeDismiss?: boolean | undefined;

  /**
   * Animation of this screen: the transition played when it is pushed onto the
   * stack and the one played when it is popped.
   *
   * @remarks
   * The value on the incoming screen drives a push; the value on the outgoing
   * screen drives a pop, including the predictive back gesture. A replace plays
   * the pop transition of the outgoing screen or the push transition of the
   * incoming one, see {@link StackScreenProps.replaceAnimation | replaceAnimation}.
   * Changing the value on the top screen takes effect for the next pop.
   *
   * A value the native side cannot use (an unknown name, an option a preset
   * does not accept where it is written, a preset written where it is not
   * allowed, a bezier with `x` outside `[0, 1]`, a non-positive duration or
   * distance) logs a warning and falls back to `'default'` for the whole prop.
   *
   * @defaultValue `'default'`
   * @platform android >= 21
   */
  animation?: StackScreenAnimation | undefined;
  /**
   * Which transition a replace plays when this screen is the one replacing the
   * top of the stack.
   *
   * @remarks
   * `'pop'` plays the outgoing screen's pop transition: the outgoing screen
   * leaves on top, as if it had been popped and this screen had been
   * underneath. `'push'` plays this screen's push transition: this screen
   * covers the outgoing one, as if it had been pushed.
   *
   * @defaultValue `'pop'`
   * @platform android >= 21
   */
  replaceAnimation?: StackScreenReplaceAnimation | undefined;
};
