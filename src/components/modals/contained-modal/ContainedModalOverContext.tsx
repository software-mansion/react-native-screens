import React, { useContext } from 'react';
import { StyleSheet } from 'react-native';
import ContainedModalHostNativeComponent from '../../../fabric/modals/contained-modal/ContainedModalHostNativeComponent';
import { ContainedModalContext } from './ContainedModalContext';
import type { ContainedModalProps } from './ContainedModal.types';

/**
 * A modal presented over the content of its `ContainedModalProvider`.
 *
 * @remarks
 * The modal fills the targeted provider's bounds. The provider's children
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
 * target. For a simple overlay inside a view, a conditionally rendered
 * absolutely-positioned `View` is simpler and behaves the same.
 *
 * @platform ios
 * @since 5.0
 * @experimental
 */
export function ContainedModalOverContext(props: ContainedModalProps) {
  const { children, isOpen, targetContainerId } = props;

  const context = useContext(ContainedModalContext);
  const resolvedTargetContainerId = targetContainerId ?? context?.containerId;

  if (resolvedTargetContainerId === undefined) {
    throw new Error(
      '[RNScreens] ContainedModalOverContext must be rendered inside a ContainedModalProvider, or be given an explicit targetContainerId.',
    );
  }

  return (
    <ContainedModalHostNativeComponent
      style={styles.host}
      isOpen={isOpen}
      targetContainerId={resolvedTargetContainerId}>
      {children}
    </ContainedModalHostNativeComponent>
  );
}

const styles = StyleSheet.create({
  // Absolute with explicit top/left: the host must not affect sibling layout
  // and needs a predictable origin (relative to its containing box, not the
  // window).
  host: {
    position: 'absolute',
    top: 0,
    left: 0,
  },
});
