import React from 'react';
import { ContainedModalHost } from './ContainedModalHost';
import type { ContainedModalProps } from './ContainedModal.types';

/**
 * A modal presented over the content of a `ContainedModalProvider`.
 *
 * @remarks
 * The modal is paired with the provider whose `containerId` equals its
 * `targetContainerId`; that provider must be an ancestor of the modal in the
 * React tree. The modal fills the targeted provider's bounds. The provider's children
 * stay in place underneath and keep updating; touches inside the provider are
 * captured by the open modal, content outside stays interactive. The modal's
 * children stay mounted regardless of `isOpen`, so their React state survives
 * presentations.
 *
 * Modality is scoped to the provider's position in the view hierarchy, not
 * the window: a sibling that overlaps the provider and renders later in the
 * React tree draws above the open modal and receives touches in the overlap,
 * exactly as it would above the provider's regular content.
 *
 * Reach for this when the region must behave like a native modal context:
 * pane-scoped dialogs in split-view / multi-column layouts, correct stacking
 * and suspend/restore alongside native presentations and navigation,
 * accessibility modality, a presentation context other native presenters can
 * target. When none of that is needed, a conditionally rendered overlay
 * `View` is also an option. See `ContainedModalReplacingContent` for the
 * variant that takes the provider's content off screen while open.
 *
 * @platform ios
 * @since 5.0
 * @experimental
 */
export function ContainedModalOverContent(props: ContainedModalProps) {
  return (
    <ContainedModalHost
      presentationStyle="overContent"
      componentName="ContainedModalOverContent"
      {...props}
    />
  );
}
