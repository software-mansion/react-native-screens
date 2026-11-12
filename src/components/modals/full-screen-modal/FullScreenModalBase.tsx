import React from 'react';
import { StyleSheet, type StyleProp } from 'react-native';
import FullScreenModalHostNativeComponent from '../../../fabric/modals/full-screen-modal/FullScreenModalHostNativeComponent';
import type {
  FullScreenModalProps,
  FullScreenModalNativeContainerStyleProps,
} from './FullScreenModal.types';

/**
 * UIKit `modalPresentationStyle` the full-screen modal host presents with.
 * Pinned by each public component; never exposed on their props.
 */
export type FullScreenModalPresentationStyle =
  | 'replacingContent'
  | 'overContent';

export interface FullScreenModalBaseProps extends FullScreenModalProps {
  presentationStyle: FullScreenModalPresentationStyle;
  nativeContainerStyle?:
    | StyleProp<FullScreenModalNativeContainerStyleProps>
    | undefined;
}

/**
 * Shared implementation of `FullScreenModalReplacingContent` and
 * `FullScreenModalOverContent`. Mounts the shared native host.
 */
export function FullScreenModalBase(props: FullScreenModalBaseProps) {
  const { nativeContainerStyle, ...rest } = props;

  return (
    <FullScreenModalHostNativeComponent
      style={styles.host}
      nativeContainerBackgroundColor={
        StyleSheet.flatten(nativeContainerStyle)?.backgroundColor
      }
      {...rest}
    />
  );
}

const styles = StyleSheet.create({
  // Absolute: the host is an empty anchor and must not take part in sibling
  // layout. top/left pin it to a predictable origin.
  host: {
    position: 'absolute',
    top: 0,
    left: 0,
  },
});
