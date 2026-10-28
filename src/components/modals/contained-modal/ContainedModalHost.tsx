import React from 'react';
import { StyleSheet } from 'react-native';
import ContainedModalHostNativeComponent from '../../../fabric/modals/contained-modal/ContainedModalHostNativeComponent';
import type { ContainedModalProps } from './ContainedModal.types';

/**
 * The presentation style of a contained modal; selects which public component
 * the native host behaves as.
 *
 * @internal
 */
export type ContainedModalPresentationStyle =
  | 'overContent'
  | 'replacingContent';

interface ContainedModalHostProps extends ContainedModalProps {
  presentationStyle: ContainedModalPresentationStyle;
  // Name of the public component, for error messages.
  componentName: string;
}

/**
 * The shared implementation behind `ContainedModalOverContent` and
 * `ContainedModalReplacingContent`. Both render one native host; they differ
 * only in the fixed `presentationStyle` they pass.
 *
 * @internal
 */
export function ContainedModalHost(props: ContainedModalHostProps) {
  const { targetContainerId, componentName, ...rest } = props;

  // Native maps an empty string to nil, and the modal would assert (debug) or
  // silently never present (release). Fail loudly instead.
  if (targetContainerId === '') {
    throw new Error(
      `[RNScreens] ${componentName} requires a non-empty targetContainerId matching the containerId of an ancestor ContainedModalProvider.`,
    );
  }

  return (
    <ContainedModalHostNativeComponent
      style={styles.host}
      targetContainerId={targetContainerId}
      {...rest}
    />
  );
}

const styles = StyleSheet.create({
  // Absolute: the host is an empty anchor and must not take part in sibling
  // layout. Its own origin is irrelevant to the teleported children -
  // measurement stops at this RootNodeKind node and adds the native state's
  // content offset instead - so top/left only pin it predictably.
  host: {
    position: 'absolute',
    top: 0,
    left: 0,
  },
});
