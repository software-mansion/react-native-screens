import type { ViewProps } from 'react-native';
import type { EmptyEventPayload, NativeEventHandler } from '../../shared/types';

/**
 * Props for {@link ContainedModalReplacingContent}.
 *
 * @experimental
 */
export interface ContainedModalReplacingContentProps {
  /**
   * Content of the modal.
   *
   * @remarks
   * Rendered in place of the targeted provider's content, which is removed
   * from the screen while the modal is open and comes back on dismissal.
   *
   * @platform ios
   */
  children?: ViewProps['children'] | undefined;

  /**
   * Requests the modal to be presented (`true`) or dismissed (`false`).
   *
   * @remarks
   * `true` expresses intent, not a guarantee of visibility: the presentation is
   * dropped when the targeted provider is already presenting another modal or
   * an ancestor presentation is being dismissed at that moment, and
   * {@link ContainedModalReplacingContentProps.onPresentationRejected | onPresentationRejected}
   * fires instead. While the modal is suspended by navigation above its
   * provider (e.g. a stack screen pushed over it) `isOpen` stays `true`
   * although nothing is on screen; the presentation is restored when the
   * covering content goes away.
   *
   * @platform ios
   */
  isOpen: boolean;

  /**
   * The `containerId` of the {@link ContainedModalProvider} this modal is
   * presented in, or the
   * {@link StackHostProps.modalProviderContainerId | modalProviderContainerId}
   * of a {@link Stack.Host} that takes the role of the provider.
   *
   * @remarks
   * The targeted provider must be an ancestor of the modal in the React tree;
   * the modal presents within that provider's bounds. Rendering a modal with
   * no matching ancestor provider is a programming error. Must not be empty.
   *
   * @note
   * This is an implementation detail and may change. Without a matching
   * provider, the modal asserts in debug builds; in release builds, the
   * presentation is rejected and
   * {@link ContainedModalReplacingContentProps.onPresentationRejected | onPresentationRejected}
   * fires.
   *
   * @platform ios
   */
  targetContainerId: string;

  /**
   * Called when {@link ContainedModalReplacingContentProps.isOpen | isOpen}
   * flipped to `true` but the presentation was dropped: the target provider is
   * already presenting another modal, an ancestor presentation is being
   * dismissed at that moment, or no matching provider was found.
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
   * suspension - e.g. a stack screen pushed over the provider is popped, or the
   * modal's containing native sheet is re-presented. A restore is not a
   * re-open: the presentation relationship was kept and
   * {@link ContainedModalReplacingContentProps.isOpen | isOpen} stayed `true`
   * throughout the suspension.
   *
   * @platform ios
   */
  onWillAppear?: NativeEventHandler<EmptyEventPayload> | undefined;

  /**
   * Called when the modal's view has appeared.
   *
   * @remarks
   * Fires on the initial presentation, and again on every restore after a
   * suspension - e.g. a stack screen pushed over the provider is popped, or the
   * modal's containing native sheet is re-presented. A restore is not a
   * re-open: the presentation relationship was kept and
   * {@link ContainedModalReplacingContentProps.isOpen | isOpen} stayed `true`
   * throughout the suspension.
   *
   * @platform ios
   */
  onDidAppear?: NativeEventHandler<EmptyEventPayload> | undefined;

  /**
   * Called when the modal's view is about to disappear.
   *
   * @remarks
   * Fires on a programmatic dismissal ({@link ContainedModalReplacingContentProps.isOpen | isOpen}
   * set to `false`), and when a suspension begins - e.g. a stack screen is
   * pushed over the provider, or the modal's containing native sheet is
   * dismissed natively. A suspension is not a dismissal: the presentation
   * relationship is kept, `isOpen` stays `true`, and the appear events fire
   * again on restore. Dismissing a suspended modal fires no disappear
   * events: its disappearance was already reported when the suspension began.
   *
   * @platform ios
   */
  onWillDisappear?: NativeEventHandler<EmptyEventPayload> | undefined;

  /**
   * Called when the modal's view has disappeared.
   *
   * @remarks
   * Fires on a programmatic dismissal ({@link ContainedModalReplacingContentProps.isOpen | isOpen}
   * set to `false`), and when a suspension completes, after
   * {@link ContainedModalReplacingContentProps.onWillDisappear | onWillDisappear} - e.g.
   * once a stack screen pushed over the provider has finished its transition.
   * Dismissing a suspended modal does not fire it again; see
   * {@link ContainedModalReplacingContentProps.onWillDisappear | onWillDisappear}.
   *
   * @platform ios
   */
  onDidDisappear?: NativeEventHandler<EmptyEventPayload> | undefined;
}
