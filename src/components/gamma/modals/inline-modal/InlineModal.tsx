import React from 'react';
import type { InlineModalProps } from './InlineModal.types';
import InlineModalNativeComponent from '../../../../fabric/gamma/modals/inline-modal/InlineModalNativeComponent';
import { StyleSheet } from 'react-native';

export function InlineModal(props: InlineModalProps) {
  return (
    <InlineModalNativeComponent {...props} style={StyleSheet.absoluteFill} />
  );
}
