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
 * through the transparent parts of the modal, but does not receive touches.
 * For an overlay that lets touches pass through, use `FullWindowOverlay`.
 *
 * The variant is fixed for the lifetime of the element. Switching to
 * {@link FullScreenModalReplacingContent} remounts the native host, which
 * closes an open modal at once, without an animation and without any events.
 * The new element then presents itself if `isOpen` is `true`.
 *
 * @see {@link FullScreenModalReplacingContent} for a modal that replaces the
 * content underneath.
 * @platform ios
 * @experimental
 */
export function FullScreenModalOverContent(
  props: FullScreenModalOverContentProps,
) {
  return <FullScreenModalBase {...props} presentationStyle="overContent" />;
}
