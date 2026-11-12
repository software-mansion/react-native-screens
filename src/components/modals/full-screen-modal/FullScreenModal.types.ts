import type { StyleProp, ViewProps, ViewStyle } from 'react-native';
import type { EmptyEventPayload, NativeEventHandler } from '../../shared/types';

/**
 * Style of the native container hosting the content of a full-screen modal.
 *
 * @platform ios
 */
export type FullScreenModalNativeContainerStyleProps = {
  /**
   * Specifies the background color of the native container hosting the modal
   * content.
   *
   * @platform ios
   */
  backgroundColor?: ViewStyle['backgroundColor'] | undefined;
};

/**
 * Props shared by {@link FullScreenModalReplacingContentProps} and
 * {@link FullScreenModalOverContentProps}.
 *
 * @platform ios
 * @experimental
 */
export interface FullScreenModalProps {
  /**
   * Content of the modal.
   *
   * @remarks
   * The children stay mounted while the modal is closed, so their React state
   * survives presentations.
   *
   * @platform ios
   */
  children?: ViewProps['children'] | undefined;

  /**
   * Requests the modal to be presented (`true`) or dismissed (`false`).
   *
   * @remarks
   * `true` expresses intent, not a guarantee of visibility. While another
   * presentation or dismissal is in progress, the modal waits for it to end.
   * While the modal's element is outside the window (e.g. under an open
   * {@link FullScreenModalReplacingContent}), it waits until the element
   * enters the window again. When the presentation is rejected,
   * `onPresentationRejected` fires; when the modal is closed natively,
   * `onNativeDismiss` fires. In both cases `isOpen` stays `true` and nothing
   * presents the modal again until it is set to `false` and back to `true`.
   *
   * On iOS, the user cannot dismiss the modal.
   *
   * @platform ios
   */
  isOpen: boolean;

  /**
   * Called when `isOpen` flipped to `true` but the presentation was dropped,
   * because the view controller presenting the modal's element was being
   * dismissed at that moment (e.g. the modal was opened from inside a closing
   * sheet).
   *
   * @remarks
   * The request is not queued and nothing retries it; the modal stays closed
   * while `isOpen` remains `true`. Reconcile state here, e.g. by setting
   * `isOpen` back to `false`.
   *
   * @platform ios
   */
  onPresentationRejected?: NativeEventHandler<EmptyEventPayload> | undefined;

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

/**
 * Props for {@link FullScreenModalReplacingContent}.
 *
 * @platform ios
 * @experimental
 */
export interface FullScreenModalReplacingContentProps
  extends FullScreenModalProps {
  /**
   * Style of the native container hosting the modal content.
   *
   * @defaultValue The system background color.
   * @platform ios
   */
  nativeContainerStyle?:
    | StyleProp<FullScreenModalNativeContainerStyleProps>
    | undefined;
}

/**
 * Props for {@link FullScreenModalOverContent}.
 *
 * @platform ios
 * @experimental
 */
export interface FullScreenModalOverContentProps extends FullScreenModalProps {
  /**
   * Style of the native container hosting the modal content.
   *
   * @remarks
   * The content underneath shows through the transparent parts of the modal.
   *
   * @defaultValue `'transparent'`
   * @platform ios
   */
  nativeContainerStyle?:
    | StyleProp<FullScreenModalNativeContainerStyleProps>
    | undefined;
}
