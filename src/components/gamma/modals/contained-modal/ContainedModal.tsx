import React from 'react';
import type { ContainedModalProps } from './ContainedModal.types';
import ContainedModalNativeComponent from '../../../../fabric/gamma/modals/contained-modal/ContainedModalNativeComponent';
import { StyleSheet } from 'react-native';

export function ContainedModal(props: ContainedModalProps) {
  const { style, ...rest } = props;

  return (
    <ContainedModalNativeComponent {...rest} style={[style, styles.host]} />
  );
}

const styles = StyleSheet.create({
  host: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: 0,
    height: 0,
  },
});
