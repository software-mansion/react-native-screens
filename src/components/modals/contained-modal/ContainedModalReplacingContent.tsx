import React from 'react';
import { ContainedModalHost } from './ContainedModalHost';
import type { ContainedModalProps } from './ContainedModal.types';

/**
 * A modal presented in place of the content of a `ContainedModalProvider`.
 *
 * @remarks
 * The modal is paired with the provider whose `containerId` equals its
 * `targetContainerId`; that provider must be an ancestor of the modal in the
 * React tree. The modal fills the targeted provider's bounds. While it is
 * open, the provider's children are removed from the screen (the native
 * `UIModalPresentationCurrentContext` behavior): they are not drawn and not
 * reachable by touch or accessibility, but they stay mounted, keep their
 * React state and keep receiving updates, and come back exactly as they were
 * once the modal is dismissed. Only the provider's own background (its
 * `style`) remains visible underneath a translucent modal. Touches inside
 * the provider go to the modal; content outside stays interactive. The
 * modal's children stay mounted regardless of `isOpen`, so their React state
 * survives presentations.
 *
 * Native containers inside the provider's content (e.g. a stack) observe
 * this as a disappearance: their screens emit their disappear events when
 * the modal opens and their appear events when it closes, exactly as they
 * would when covered by a native presentation.
 *
 * Modality is scoped to the provider's position in the view hierarchy, not
 * the window: a sibling that overlaps the provider and renders later in the
 * React tree draws above the open modal and receives touches in the overlap,
 * exactly as it would above the provider's regular content.
 *
 * Reach for this when the provider's content must not render while the modal
 * is up - an opaque modal that should not pay for the content underneath, or
 * content that must be hidden from accessibility - and for the same
 * native-modal-context reasons as `ContainedModalOverContent`, which keeps the
 * content in place instead.
 *
 * @platform ios
 * @since 5.0
 * @experimental
 */
export function ContainedModalReplacingContent(props: ContainedModalProps) {
  return (
    <ContainedModalHost
      presentationStyle="replacingContent"
      componentName="ContainedModalReplacingContent"
      {...props}
    />
  );
}
