import React from 'react';
import { FullScreenModalBase } from './FullScreenModalBase';
import type { FullScreenModalOverContentProps } from './FullScreenModal.types';

/**
 * A modal covering the whole window, presented over the content underneath.
 *
 * @remarks
 * The modal is presented from the top-most presented view controller of the
 * window when {@link FullScreenModalOverContentProps.isOpen | isOpen} becomes
 * `true`, and dismissed when it becomes `false`. On iOS, the user cannot
 * dismiss it.
 *
 * The content underneath stays in the window and keeps updating. It shows
 * through the transparent parts of the modal, but does not receive touches,
 * and native screens underneath receive no lifecycle events. For an overlay
 * that lets touches pass through, use `FullWindowOverlay`.
 *
 * Full-screen modals stack. A modal rendered inside this modal's children, or
 * anywhere else in the window, presents on top of this one. A
 * {@link FullScreenModalReplacingContent} on top suspends this modal: it
 * receives `onWillDisappear` and `onDidDisappear`, then `onWillAppear` and
 * `onDidAppear` once the upper modal closes; a
 * {@link FullScreenModalOverContent} on top sends this modal no events.
 * Closing this modal while one is open above it takes both down: the upper
 * modal receives `onNativeDismiss`, and when it is a replacing modal, this one
 * receives `onWillAppear` without `onDidAppear` (UIKit logs "Unbalanced calls
 * to begin/end appearance transitions").
 *
 * Removing the element while the modal is open, e.g. by popping the stack
 * screen rendering it, closes the modal at once, without an animation and
 * without any events; the screens underneath receive their usual events. If
 * `isOpen` is kept `true` above the removed element, the modal presents again
 * as soon as the element mounts, e.g. when that screen is pushed again.
 *
 * The variant is fixed for the lifetime of the element. Switching to
 * {@link FullScreenModalReplacingContent} remounts the native host, which
 * closes an open modal at once, without an animation and without any events.
 * The new element then presents itself if `isOpen` is `true`.
 *
 * @see {@link FullScreenModalReplacingContent} for a modal that replaces the
 * content underneath.
 * @platform ios
 */
export function FullScreenModalOverContent(
  props: FullScreenModalOverContentProps,
) {
  return <FullScreenModalBase {...props} presentationStyle="overContent" />;
}
