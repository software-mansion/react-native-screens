import { NativeSyntheticEvent, ViewProps } from 'react-native';
import type { AdditionalSafeAreaInsets } from '../../shared/types';

export type OnDismissEventPayload = {
  isNativeDismiss: boolean;
};

export type EmptyEventPayload = Record<string, never>;

export type OnDismissEvent = NativeSyntheticEvent<OnDismissEventPayload>;

export type StackScreenActivityMode = 'detached' | 'attached';

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
   * Insets, in points, added to the safe area of the screen's content,
   * on top of the insets coming from the system and its containers.
   * Edges that are not set default to `0`.
   *
   * Use it to keep content clear of UI drawn over the screen, e.g. a custom bar
   * floating over its bottom edge.
   *
   * On iOS, maps to `UIViewController.additionalSafeAreaInsets`.
   * On Android, the screen adds these insets to the window insets it dispatches to its children,
   * which the library's `SafeAreaView` reads.
   */
  additionalSafeAreaInsets?: AdditionalSafeAreaInsets | undefined;
};
