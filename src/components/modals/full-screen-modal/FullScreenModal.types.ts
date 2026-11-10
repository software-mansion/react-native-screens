import type { StyleProp, ViewProps, ViewStyle } from 'react-native';
import type {
  EmptyEventPayload,
  InterfaceOrientation,
  NativeEventHandler,
} from '../../shared/types';

/**
 * Transition a full-screen modal opens and closes with.
 *
 * @remarks
 * The following values are supported:
 * - `'automatic'` — the content slides up from the bottom of the screen.
 * - `'fade'` — the content cross-dissolves.
 * - `'flip'` — the window flips horizontally to reveal the content. Supported
 *   only by {@link FullScreenModalReplacingContent}; on tvOS it falls back
 *   to `'automatic'`.
 * - `'none'` — the modal opens and closes without an animation.
 *
 * @see {@link https://developer.apple.com/documentation/uikit/uimodaltransitionstyle | UIModalTransitionStyle}
 * @platform ios
 */
export type FullScreenModalTransition = 'automatic' | 'fade' | 'flip' | 'none';

/**
 * Transition a {@link FullScreenModalOverContent} opens and closes with: a
 * {@link FullScreenModalTransition} other than `'flip'`.
 *
 * @platform ios
 */
export type FullScreenModalOverContentTransition = Exclude<
  FullScreenModalTransition,
  'flip'
>;

/**
 * Interface orientations a full-screen modal supports.
 *
 * @remarks
 * Takes the {@link InterfaceOrientation} values, plus `'inherit'` — the
 * orientations the app supports for the window.
 *
 * @platform ios
 */
export type FullScreenModalOrientation = InterfaceOrientation | 'inherit';

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
   * Interface orientations the modal supports while it is open.
   *
   * @remarks
   * When a container nested in the modal, e.g. `Tabs` or `Split`, specifies
   * an orientation other than `'inherit'`, that orientation is used instead.
   * It is applied when the modal is presented and when this prop changes;
   * a change of the nested container's orientation alone may not rotate the
   * screen while the modal is open. On iOS 15, a change while the modal is
   * open takes effect on the next device rotation. After the modal closes, the
   * orientations of the content underneath apply again.
   *
   * @defaultValue `'inherit'`
   * @platform ios
   */
  orientation?: FullScreenModalOrientation | undefined;

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
   * Transition the modal opens and closes with.
   *
   * @remarks
   * Like the presentation itself, the transition is fixed when the modal
   * opens: a change while the modal is open applies from the next opening.
   *
   * @defaultValue `'automatic'`
   * @platform ios
   */
  transition?: FullScreenModalTransition | undefined;

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
   * Transition the modal opens and closes with.
   *
   * @remarks
   * Like the presentation itself, the transition is fixed when the modal
   * opens: a change while the modal is open applies from the next opening.
   *
   * `'flip'` is not supported: it would flip the content visible through the
   * modal.
   *
   * @defaultValue `'automatic'`
   * @platform ios
   */
  transition?: FullScreenModalOverContentTransition | undefined;

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
