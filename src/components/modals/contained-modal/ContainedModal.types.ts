import type { ViewProps, StyleProp, ViewStyle } from 'react-native';
import type { EmptyEventPayload, NativeEventHandler } from '../../shared/types';

/**
 * Props for {@link ContainedModalOverContent} and
 * {@link ContainedModalReplacingContent}.
 *
 * @experimental
 */
export interface ContainedModalProps {
  /**
   * Content of the modal.
   *
   * @platform ios
   */
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
   */
  isOpen: boolean;

  /**
   * The `containerId` of the {@link ContainedModalProvider} this modal is
   * presented in.
   *
   * @remarks
   * The targeted provider must be an ancestor of the modal in the React tree;
   * the modal presents within that provider's bounds. Rendering a modal with
   * no matching ancestor provider is a programming error. Must not be empty.
   *
   * @note
   * This is an implementation detail and may change. Without a matching
   * provider, the modal asserts in debug builds; in release builds, the
   * presentation is rejected and `onPresentationRejected` fires.
   *
   * @platform ios
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
   */
  onPresentationRejected?: NativeEventHandler<EmptyEventPayload> | undefined;

  /**
   * Called when the modal's view is about to appear.
   *
   * @remarks
   * Fires on the initial presentation, and again on every restore after a
   * suspension - e.g. a stack screen pushed over the provider is popped, or
   * the modal's containing native sheet is re-presented. A restore is not a
   * re-open: the presentation relationship was kept and `isOpen` stayed
   * `true` throughout the suspension.
   *
   * @platform ios
   */
  onWillAppear?: NativeEventHandler<EmptyEventPayload> | undefined;

  /**
   * Called when the modal's view has appeared.
   *
   * @remarks
   * Fires on the initial presentation, and again on every restore after a
   * suspension - e.g. a stack screen pushed over the provider is popped, or
   * the modal's containing native sheet is re-presented. A restore is not a
   * re-open: the presentation relationship was kept and `isOpen` stayed
   * `true` throughout the suspension.
   *
   * @platform ios
   */
  onDidAppear?: NativeEventHandler<EmptyEventPayload> | undefined;

  /**
   * Called when the modal's view is about to disappear.
   *
   * @remarks
   * Fires on a programmatic dismissal (`isOpen` set to `false`), and when a
   * suspension begins - e.g. a stack screen is pushed over the provider, or
   * the modal's containing native sheet is dismissed natively. A suspension
   * is not a dismissal: the presentation relationship is kept, `isOpen`
   * stays `true`, and the appear events fire again on restore. Note that
   * `onDidDisappear` is not guaranteed to follow on the suspension path -
   * see its remarks.
   *
   * @platform ios
   */
  onWillDisappear?: NativeEventHandler<EmptyEventPayload> | undefined;

  /**
   * Called when the modal's view has disappeared.
   *
   * @remarks
   * Fires on a programmatic dismissal (`isOpen` set to `false`). On a
   * suspension it is NOT guaranteed: when a react-native-screens stack pushes
   * over the provider, only `onWillDisappear` fires. Don't rely on a balanced
   * Will/Did disappear pair around suspensions - key suspension logic off
   * `onWillDisappear` and `onDidAppear` (restore) instead.
   *
   * @note
   * This is an implementation detail and may change. The stack push detaches
   * the views before the disappearance transition completes.
   *
   * @platform ios
   */
  onDidDisappear?: NativeEventHandler<EmptyEventPayload> | undefined;
}

/**
 * Props for {@link ContainedModalProvider}.
 *
 * @experimental
 */
export interface ContainedModalProviderProps {
  /**
   * Content the matched contained modals are presented over.
   *
   * @platform ios
   */
  children?: ViewProps['children'] | undefined;

  /**
   * Identifies this provider; a modal targets it through `targetContainerId`.
   *
   * @remarks
   * Must be unique among the providers on a modal's ancestor chain (two
   * providers in unrelated subtrees may share an id). Must not be empty.
   *
   * @platform ios
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
   */
  style?: StyleProp<ViewStyle> | undefined;
}
