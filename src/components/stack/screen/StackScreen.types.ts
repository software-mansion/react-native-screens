import { NativeSyntheticEvent, ViewProps } from 'react-native';
import type { EmptyEventPayload } from '../../shared/types';
import type { StackScreenAnimation } from './animation';

export type OnDismissEventPayload = {
  isNativeDismiss: boolean;
};

export type OnDismissEvent = NativeSyntheticEvent<OnDismissEventPayload>;

export type StackScreenActivityMode = 'detached' | 'attached';

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
   * @summary Transition played when this screen is pushed onto the stack and
   * when it is popped.
   *
   * @description
   * The value on the incoming screen drives a push; the value on the outgoing
   * screen drives a pop, including the predictive back gesture. A replace
   * plays the pop animation of the outgoing screen or the push animation of
   * the incoming one, see `replaceAnimation`. Changing it on the top screen
   * takes effect for the next pop.
   *
   * A preset is either its name or an object `{ type: 'preset', name, ...options }`:
   *
   * - `duration` (ms) replaces the preset's reference duration, the longer of its
   *   push and pop; both are rescaled by the same factor, so `fadeFromBottom`
   *   with `duration: 500` pushes in 500 ms and pops in about 357 ms.
   * - `easing` replaces the curve of every animated property of the preset: a
   *   curve name or a cubic bezier `[x1, y1, x2, y2]`. A predictive back gesture
   *   always scrubs linearly with the finger.
   * - `distance`, accepted by `fadeFromBottom` and `fadeFromTop` only, replaces how
   *   far the moving screen rises or falls: a number is density-independent
   *   pixels, `'N%'` a fraction of the container. Defaults to `'8%'`.
   *
   * `default` and `none` take no options. A value the native side cannot use
   * (an unknown name, an option a preset does not accept, a bezier with `x`
   * outside `[0, 1]`, a non-positive duration or distance) logs a warning and
   * falls back to `default`.
   *
   * Currently supported only on Android.
   *
   * @default 'default'
   *
   * @platform android
   */
  animation?: StackScreenAnimation | undefined;
  /**
   * @summary Which animation a replace plays when this screen is the one
   * replacing the top of the stack.
   *
   * @description
   * `'pop'` plays the outgoing screen's pop animation: the outgoing screen
   * leaves on top, as if it had been popped and this screen had been
   * underneath. `'push'` plays this screen's push animation: this screen
   * covers the outgoing one, as if it had been pushed.
   *
   * Currently supported only on Android.
   *
   * @default 'pop'
   *
   * @platform android
   */
  replaceAnimation?: StackScreenReplaceAnimation | undefined;
};
