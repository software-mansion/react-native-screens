import type { ViewProps, StyleProp, ViewStyle } from 'react-native';

/**
 * Props for {@link ContainedModalOverContent}.
 *
 * @platform ios
 * @since 5.0
 * @experimental
 */
export interface ContainedModalProps {
  children?: ViewProps['children'] | undefined;

  /**
   * Requests the modal to be presented (`true`) or dismissed (`false`).
   *
   * @remarks
   * `true` expresses intent, not a guarantee of visibility: the presentation
   * is dropped when the targeted provider is already presenting another modal
   * or an ancestor presentation is being dismissed at that moment, and
   * `onPresentationRejected` fires instead. While
   * the modal is suspended by navigation above its provider (e.g. a stack
   * screen pushed over it) `isOpen` stays `true` although nothing is on
   * screen; the presentation is restored when the covering content goes away.
   *
   * @platform ios
   * @since 5.0
   */
  isOpen: boolean;

  /**
   * The `containerId` of the {@link ContainedModalProvider} this modal is
   * presented in.
   *
   * @remarks
   * The targeted provider must be an ancestor of the modal in the React tree;
   * the modal presents within that provider's bounds. Rendering a modal with
   * no matching ancestor provider is a programming error (asserts in debug;
   * in release the presentation is rejected and `onPresentationRejected`
   * fires). Must not be empty.
   *
   * @platform ios
   * @since 5.0
   */
  targetContainerId: string;

  /**
   * Called when `isOpen` flipped to `true` but the presentation was dropped:
   * the target provider is already presenting another modal, an ancestor
   * presentation is being dismissed at that moment, or no matching provider
   * was found.
   *
   * @remarks
   * The request is not queued and nothing retries it; the modal stays closed
   * while `isOpen` remains `true`. Reconcile state here (e.g. set `isOpen`
   * back to `false`, or re-open after the blocking modal closes).
   *
   * @platform ios
   * @since 5.0
   */
  onPresentationRejected?: (() => void) | undefined;
}

/**
 * Props for {@link ContainedModalProvider}.
 *
 * @platform ios
 * @since 5.0
 * @experimental
 */
export interface ContainedModalProviderProps {
  children?: ViewProps['children'] | undefined;

  /**
   * Identifies this provider; a modal targets it through `targetContainerId`.
   *
   * @remarks
   * Must be unique among the providers on a modal's ancestor chain (two
   * providers in unrelated subtrees may share an id). Must not be empty.
   *
   * @platform ios
   * @since 5.0
   */
  containerId: string;

  /**
   * Style applied to the provider's host view.
   *
   * @remarks
   * The provider is a regular container whose bounds define the area a
   * matched contained modal is presented in.
   *
   * @platform ios
   * @since 5.0
   */
  style?: StyleProp<ViewStyle> | undefined;
}
