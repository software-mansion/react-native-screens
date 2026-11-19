import React from 'react';
import { FullScreenModalBase } from './FullScreenModalBase';
import type { FullScreenModalReplacingContentProps } from './FullScreenModal.types';

/**
 * A modal covering the whole window that replaces the content underneath.
 *
 * @remarks
 * The modal is presented from the top-most presented view controller of the
 * window when {@link FullScreenModalReplacingContentProps.isOpen | isOpen}
 * becomes `true`, and dismissed when it becomes `false`. On iOS, the user
 * cannot dismiss it.
 *
 * While the modal is open, UIKit removes the content underneath from the
 * window. The visible screen of every native stack underneath, nested stacks
 * included, receives `onWillDisappear` and `onDidDisappear` when the modal
 * opens and `onWillAppear` and `onDidAppear` when it closes. Modals whose
 * elements are rendered underneath cannot be presented until this modal
 * closes; render them inside this modal's children instead.
 *
 * Full-screen modals stack. A modal presented over this one must be rendered
 * inside this modal's children (its element is off-window otherwise). A
 * {@link FullScreenModalReplacingContent} on top suspends this modal: it
 * receives `onWillDisappear` and `onDidDisappear`, then `onWillAppear` and
 * `onDidAppear` once the upper modal closes. Closing this modal while one is
 * open above it takes both down: the upper modal receives `onNativeDismiss`,
 * and when it is a replacing modal, this one receives `onWillAppear` without
 * `onDidAppear` (UIKit logs "Unbalanced calls to begin/end appearance
 * transitions").
 *
 * Removing the element while the modal is open, e.g. by popping the stack
 * screen rendering it, closes the modal at once, without an animation and
 * without any events; the screens underneath receive their usual events. If
 * `isOpen` is kept `true` above the removed element, the modal presents again
 * as soon as the element mounts, e.g. when that screen is pushed again.
 *
 * The variant is fixed for the lifetime of the element. Switching to
 * {@link FullScreenModalOverContent} remounts the native host, which closes an
 * open modal at once, without an animation and without any events. The new
 * element then presents itself if `isOpen` is `true`.
 *
 * @see {@link FullScreenModalOverContent} for a modal that keeps the content
 * underneath visible.
 * @platform ios
 */
export function FullScreenModalReplacingContent(
  props: FullScreenModalReplacingContentProps,
) {
  return (
    <FullScreenModalBase {...props} presentationStyle="replacingContent" />
  );
}
