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
 * window. Native screens underneath get disappear and appear callbacks, and
 * modals whose elements are rendered underneath cannot be presented until this
 * modal closes; render them inside this modal's children instead.
 *
 * The variant is fixed for the lifetime of the element. Switching to
 * {@link FullScreenModalOverContent} remounts the native host, which closes an
 * open modal at once, without an animation and without any events. The new
 * element then presents itself if `isOpen` is `true`.
 *
 * @see {@link FullScreenModalOverContent} for a modal that keeps the content
 * underneath visible.
 * @platform ios
 * @experimental
 */
export function FullScreenModalReplacingContent(
  props: FullScreenModalReplacingContentProps,
) {
  return (
    <FullScreenModalBase {...props} presentationStyle="replacingContent" />
  );
}
