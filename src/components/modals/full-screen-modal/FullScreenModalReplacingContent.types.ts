import type { ViewProps } from 'react-native';
import type { EmptyEventPayload, NativeEventHandler } from '../../shared/types';

/**
 * Props for {@link FullScreenModalReplacingContent}.
 */
export interface FullScreenModalReplacingContentProps {
  /**
   * Content of the modal.
   *
   * @remarks
   * Replaces the content underneath, which is removed from the window while
   * the modal is open. The children stay mounted while the modal is closed, so
   * their React state survives presentations.
   *
   * @platform ios
   */
  children?: ViewProps['children'] | undefined;

  /**
   * Requests the modal to be presented (`true`) or dismissed (`false`).
   *
   * @remarks
   * `true` expresses intent, not a guarantee of visibility. While the modal's
   * own dismissal is in progress, it waits for it to end. While the modal's
   * element is outside the window (e.g. under an open
   * {@link FullScreenModalReplacingContent}), it waits until the element
   * enters the window again. When the modal is closed natively,
   * `onNativeDismiss` fires; `isOpen` then stays `true` and nothing presents
   * the modal again until it is set to `false` and back to `true`.
   *
   * @platform ios
   */
  isOpen: boolean;

  /**
   * Called when the modal's view is about to appear.
   *
   * @remarks
   * Fires on presentation, and again when a
   * {@link FullScreenModalReplacingContent} presented over this modal is
   * dismissed.
   *
   * @platform ios
   */
  onWillAppear?: NativeEventHandler<EmptyEventPayload> | undefined;

  /**
   * Called when the modal's view has appeared.
   *
   * @remarks
   * Fires on presentation, and again when a
   * {@link FullScreenModalReplacingContent} presented over this modal is
   * dismissed.
   *
   * @platform ios
   */
  onDidAppear?: NativeEventHandler<EmptyEventPayload> | undefined;

  /**
   * Called when the modal's view is about to disappear.
   *
   * @remarks
   * Fires on dismissal, and also when a
   * {@link FullScreenModalReplacingContent} is presented over this modal.
   *
   * @platform ios
   */
  onWillDisappear?: NativeEventHandler<EmptyEventPayload> | undefined;

  /**
   * Called when the modal's view has disappeared.
   *
   * @remarks
   * Fires on dismissal, and also when a
   * {@link FullScreenModalReplacingContent} is presented over this modal, so
   * it does not mean that the modal was closed. Use `onDismiss` and
   * `onNativeDismiss` for that.
   *
   * @platform ios
   */
  onDidDisappear?: NativeEventHandler<EmptyEventPayload> | undefined;

  /**
   * Called when the modal was dismissed because `isOpen` became `false`.
   *
   * @platform ios
   */
  onDismiss?: NativeEventHandler<EmptyEventPayload> | undefined;

  /**
   * Called when the modal was closed while `isOpen` was still `true`.
   *
   * @remarks
   * This happens when the modal is taken down by someone else, e.g. UIKit
   * dismisses a sheet below it together with every modal presented over the
   * sheet. It is highly recommended to use this callback to synchronize your
   * local React state, e.g. by setting `isOpen` back to `false`.
   *
   * @platform ios
   */
  onNativeDismiss?: NativeEventHandler<EmptyEventPayload> | undefined;
}
