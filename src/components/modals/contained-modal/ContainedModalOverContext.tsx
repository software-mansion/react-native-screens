import React, { useContext } from 'react';
import { StyleSheet } from 'react-native';
import ContainedModalHostNativeComponent from '../../../fabric/modals/contained-modal/ContainedModalHostNativeComponent';
import { ContainedModalContext } from './ContainedModalContext';
import type { ContainedModalProps } from './ContainedModal.types';

/**
 * A modal presented over the content of its `ContainedModalProvider`.
 *
 * @remarks
 * The modal fills the bounds of the targeted provider and is presented over
 * the provider's children, which stay in place underneath - with a transparent
 * modal background they remain visible and keep updating. Touches within the
 * provider's bounds are captured by the modal while it is open; content
 * outside the provider stays interactive. The modal's children stay mounted
 * regardless of `isOpen`, so their React state is preserved across
 * presentations.
 *
 * When to reach for this component: it drives a real UIKit presentation
 * confined to the provider's region, which matters when that region must
 * behave like a native modal context - pane-scoped dialogs in split-view /
 * multi-column and other large-screen layouts (e.g. a dialog over the detail
 * column while the sidebar stays interactive), correct stacking and
 * suspend/restore alongside other native presentations and navigation
 * (push/pop, column hide/show), accessibility modality, and a presentation
 * context future native presenters can target.
 *
 * When NOT to use it: for a simple overlay inside a view - a loading cover,
 * an inline confirmation box, a dimmed panel on a phone-sized layout - a
 * conditionally rendered absolutely-positioned `View` with a touch-blocking
 * backdrop is simpler, behaves the same, and needs none of this machinery.
 * If nothing in your use case involves native presentation semantics, prefer
 * the plain view.
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
  // We use absolute positioning so the Host view doesn't affect the layout of its siblings.
  // Setting `top: 0` and `left: 0` explicitly anchors the view to a predictable origin,
  // preventing it from floating at an arbitrary offset based on its position in the Element tree.
  //
  // IMPORTANT: "Absolute" positioning is still relative to the nearest positioned containing
  // box. This anchors it to that specific container's (0,0), not the global window (0,0).
  host: {
    position: 'absolute',
    top: 0,
    left: 0,
  },
});
