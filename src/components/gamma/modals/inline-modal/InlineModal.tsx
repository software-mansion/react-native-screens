import React from 'react';
import type { InlineModalProps } from './InlineModal.types';
import InlineModalNativeComponent from '../../../../fabric/gamma/modals/inline-modal/InlineModalNativeComponent';
import { StyleSheet } from 'react-native';

export function InlineModal(props: InlineModalProps) {
  const { style, ...rest } = props;

  return <InlineModalNativeComponent {...rest} style={[style, styles.host]} />;
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
