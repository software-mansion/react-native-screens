import React from 'react';
import type { ContainedModalProps } from './ContainedModal.types';
import ContainedModalHostNativeComponent from '../../../../fabric/gamma/modals/contained-modal/ContainedModalHostNativeComponent';
import { StyleSheet } from 'react-native';

export function ContainedModal(props: ContainedModalProps) {
  const { children, ...rest } = props;

  return (
    <ContainedModalHostNativeComponent {...rest} style={styles.host}>
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
    width: 0,
    height: 0,
  },
});
